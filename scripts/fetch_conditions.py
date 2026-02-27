#!/usr/bin/env python3
"""
BETA — Cascade Conditions Intel
fetch_conditions.py

Fetches real weather data from Open-Meteo for each crag in crags.json
and outputs data/conditions.json with go/wait/no-go signals.

Usage:
    python scripts/fetch_conditions.py

No API key required. Open-Meteo is free and open.
"""

import json
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

# ============================================================
# CONFIG
# ============================================================

# Paths relative to repo root
REPO_ROOT   = Path(__file__).parent.parent
CRAGS_FILE  = REPO_ROOT / "data" / "crags.json"
OUTPUT_FILE = REPO_ROOT / "data" / "conditions.json"

# Open-Meteo API — no key needed
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# Scoring thresholds
# Think of these like a climbing grade system:
# Green circle = 5.easy, Yellow = 5.hard, Red = project-not-today
SCORE_THRESHOLDS = {
    "go":   80,   # >= 80 → Go
    "wait": 50,   # >= 50 → Wait, < 50 → No-Go
}


# ============================================================
# WEATHER FETCH
# ============================================================

def fetch_weather(lat: float, lng: float) -> dict:
    """
    Fetch current + 48h weather from Open-Meteo.
    Returns raw API response as dict.
    """
    params = {
        "latitude":            lat,
        "longitude":           lng,
        "hourly":              "precipitation,relativehumidity_2m,temperature_2m,windspeed_10m",
        "daily":               "precipitation_sum,windspeed_10m_max",
        "temperature_unit":    "fahrenheit",
        "windspeed_unit":      "mph",
        "precipitation_unit":  "inch",
        "timezone":            "America/Los_Angeles",
        "past_days":           2,   # gives us 48h of precip history
        "forecast_days":       3,
    }

    url = OPEN_METEO_URL + "?" + urllib.parse.urlencode(params, doseq=True)

    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"  ⚠️  API error: {e}")
        return None


# ============================================================
# DATA EXTRACTION
# ============================================================

def extract_conditions(weather: dict) -> dict:
    """
    Pull the specific numbers we care about from the raw API blob.
    
    Like reading a topo — lots of info on the page, we just need
    the key beta: precip, humidity, temp.
    """
    if not weather:
        return None

    daily      = weather.get("daily", {})
    hourly     = weather.get("hourly", {})

    # Daily precip_sum gives us clean 24h totals
    precip_daily = daily.get("precipitation_sum", [])

    # past_days=2 means index 0=2 days ago, 1=yesterday, 2=today
    precip_24h = precip_daily[1] if len(precip_daily) > 1 else 0
    precip_48h = (precip_daily[0] + precip_daily[1]) if len(precip_daily) > 1 else 0

    # Current conditions — find the closest hour to now
    times      = hourly.get("time", [])
    now_str    = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:00")
    
    # Find current hour index (fallback to most recent available)
    current_idx = 0
    for i, t in enumerate(times):
        if t <= now_str:
            current_idx = i

    humidity    = hourly.get("relativehumidity_2m", [])[current_idx] if hourly.get("relativehumidity_2m") else None
    temp_f      = hourly.get("temperature_2m", [])[current_idx] if hourly.get("temperature_2m") else None
    windspeed   = hourly.get("windspeed_10m", [])[current_idx] if hourly.get("windspeed_10m") else None

    # 48h forecast precip (will it rain on us?)
    precip_forecast_48h = sum(precip_daily[2:4]) if len(precip_daily) >= 4 else 0

    return {
        "precip_24h":          round(precip_24h or 0, 2),
        "precip_48h":          round(precip_48h or 0, 2),
        "precip_forecast_48h": round(precip_forecast_48h or 0, 2),
        "humidity":            humidity,
        "temp_f":              temp_f,
        "windspeed_mph":       windspeed,
    }


# ============================================================
# SCORING — THE GO/WAIT/NO-GO BRAIN
# ============================================================

def score_conditions(conditions: dict, crag: dict) -> dict:
    """
    Synthesize raw weather into a go/wait/no-go signal.
    
    Analogy: like a head chef tasting a dish.
    Each ingredient (precip, humidity, temp) gets assessed,
    then combined into one judgment call.
    
    drying_multiplier adjusts for rock type + microclimate:
    - Sandstone at Peshastin = 1.5x (very sensitive)
    - Granite at Leavenworth = 0.8x (rain shadow, fast-drying)
    """
    if not conditions:
        return {"signal": "unknown", "score": None, "reasons": ["Data unavailable"]}

    score   = 100
    reasons = []
    dm      = crag.get("drying_multiplier", 1.0)

    # --- PRECIPITATION HISTORY ---
    # Recent rain is the biggest factor. Like chalk on wet holds —
    # the more rain, the worse the conditions.

    p24 = conditions["precip_24h"]
    p48 = conditions["precip_48h"]

    if p24 > 0.5:
        penalty = min(60, int(p24 * 40 * dm))
        score  -= penalty
        reasons.append(f"{p24}\" rain in last 24h")
    elif p24 > 0.1:
        penalty = min(30, int(p24 * 20 * dm))
        score  -= penalty
        reasons.append(f"{p24}\" rain in last 24h (light)")
    elif p48 > 0.5:
        penalty = min(25, int((p48 - p24) * 15 * dm))
        score  -= penalty
        reasons.append(f"{p48}\" rain in last 48h")

    # Sandstone hard rule — always no-go when any precip
    rock_type = crag.get("rock_type", "")
    if rock_type == "sandstone" and p48 > 0.05:
        score = 0
        reasons.append("Sandstone — never climb wet, damages rock")

    # --- HUMIDITY ---
    # High humidity = rock stays damp longer, friction drops
    humidity = conditions.get("humidity")
    if humidity is not None:
        if humidity > 85:
            score   -= 25
            reasons.append(f"Very high humidity ({humidity}%) — rock stays damp")
        elif humidity > 70:
            score   -= 12
            reasons.append(f"Elevated humidity ({humidity}%)")
        elif humidity < 40:
            score   += 5   # bonus for dry air
            reasons.append(f"Low humidity ({humidity}%) — good drying conditions")

    # --- TEMPERATURE ---
    # Too cold = icy/slick; too hot = sweaty hands, bad friction
    temp = conditions.get("temp_f")
    if temp is not None:
        if temp < 32:
            score   -= 30
            reasons.append(f"Below freezing ({temp}°F) — ice risk")
        elif temp < 40:
            score   -= 10
            reasons.append(f"Cold ({temp}°F) — slow drying")
        elif 55 <= temp <= 75:
            score   += 5   # friction sweet spot
            reasons.append(f"Ideal temp ({temp}°F)")
        elif temp > 90:
            score   -= 15
            reasons.append(f"Very hot ({temp}°F) — poor friction")

    # --- WIND ---
    # High wind = dangerous for multipitch, poor friction, tired arms
    # Vantage / gorge crags have lower thresholds — Columbia Gorge is notorious
    wind = conditions.get("windspeed_mph")
    wind_threshold = crag.get("wind_threshold_mph", 25)
    if wind is not None:
        if wind >= wind_threshold * 2:
            score   -= 25
            reasons.append(f"High wind ({wind:.0f} mph) — dangerous conditions")
        elif wind >= wind_threshold:
            score   -= 12
            reasons.append(f"Elevated wind ({wind:.0f} mph) — check before going")

    # --- INCOMING WEATHER ---
    # Don't drive to the crag if it's about to rain
    p_forecast = conditions.get("precip_forecast_48h", 0)
    if p_forecast > 0.5:
        score   -= 10
        reasons.append(f"{p_forecast}\" rain forecasted — conditions deteriorating")

    # Clamp score 0-100
    score = max(0, min(100, score))

    # Determine signal
    if score >= SCORE_THRESHOLDS["go"]:
        signal = "go"
    elif score >= SCORE_THRESHOLDS["wait"]:
        signal = "wait"
    else:
        signal = "no-go"

    # If no negative reasons, add a positive one
    if not reasons:
        reasons.append("Dry conditions, good temps")

    return {
        "signal": signal,
        "score":  score,
        "reasons": reasons,
    }


# ============================================================
# MAIN
# ============================================================

def main():
    print("\n🏔️  BETA — Fetching Cascade crag conditions")
    print("=" * 48)

    # Load crag registry
    with open(CRAGS_FILE) as f:
        crags = json.load(f)["crags"]

    results = []
    timestamp = datetime.now(timezone.utc).isoformat()

    for crag in crags:
        print(f"\n📍 {crag['name']}")
        print(f"   Fetching weather for {crag['lat']}, {crag['lng']}...")

        # Fetch
        weather    = fetch_weather(crag["lat"], crag["lng"])
        conditions = extract_conditions(weather)
        scoring    = score_conditions(conditions, crag)

        # Report
        signal_emoji = {"go": "🟢", "wait": "🟡", "no-go": "🔴", "unknown": "⚪"}.get(scoring["signal"], "⚪")
        print(f"   {signal_emoji} {scoring['signal'].upper()} (score: {scoring['score']})")
        if conditions:
            print(f"   💧 Precip 24h: {conditions['precip_24h']}\"  48h: {conditions['precip_48h']}\"")
            print(f"   💦 Humidity: {conditions['humidity']}%  🌡️  Temp: {conditions['temp_f']}°F")
        for reason in scoring["reasons"]:
            print(f"   → {reason}")

        results.append({
            "id":         crag["id"],
            "name":       crag["name"],
            "region":     crag["region"],
            "signal":     scoring["signal"],
            "score":      scoring["score"],
            "reasons":    scoring["reasons"],
            "conditions": conditions,
            "crag_meta":  {
                "rock_type":  crag["rock_type"],
                "aspect":     crag["aspect"],
                "elevation_ft": crag["elevation_ft"],
                "notes":      crag["notes"],
            }
        })

    # Write output
    output = {
        "generated_at": timestamp,
        "generated_at_pacific": datetime.now().strftime("%Y-%m-%d %I:%M %p PST"),
        "crags": results,
    }

    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\n✅ conditions.json written → {OUTPUT_FILE}")
    print(f"   {len(results)} crags processed at {output['generated_at_pacific']}")
    print("\n")


if __name__ == "__main__":
    main()