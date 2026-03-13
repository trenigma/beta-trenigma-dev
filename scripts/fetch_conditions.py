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
import os
import base64
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
HISTORY_DIR = REPO_ROOT / "data" / "history"

# Open-Meteo API — no key needed
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# PurpleAir API — READ key, set via PURPLEAIR_API_KEY env var / repo secret
PURPLEAIR_API_KEY = os.environ.get("PURPLEAIR_API_KEY")
PURPLEAIR_URL     = "https://api.purpleair.com/v1/sensors"
# Smoke is regional — a sensor 30km away is still valid for wildfire events.
# Beyond that, return null rather than mislead.
PURPLEAIR_MAX_KM  = 30

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
# STREAMFLOW FETCH
# ============================================================

USGS_URL = "https://waterservices.usgs.gov/nwis/iv/"

def fetch_streamflow(gauge_id: str) -> dict:
    """
    Fetch real-time discharge (CFS) from a USGS stream gauge.

    Requests the last 2 hours of 15-min interval readings — gives us
    ~8 values. Like reading the last page of a logbook: we only need
    the most recent entry and the one before it to know direction.

    Parameter code 00060 = streamflow discharge in cubic feet per second.
    No API key required. Safe to poll at 6h cadence.
    """
    params = {
        "sites":        gauge_id,
        "parameterCd":  "00060",
        "period":       "PT2H",
        "format":       "json",
    }

    url = USGS_URL + "?" + urllib.parse.urlencode(params)

    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
    except Exception as e:
        print(f"  ⚠️  USGS API error for gauge {gauge_id}: {e}")
        return None

    try:
        values = data["value"]["timeSeries"][0]["values"][0]["value"]
    except (KeyError, IndexError):
        print(f"  ⚠️  Unexpected USGS response shape for gauge {gauge_id}")
        return None

    # Filter out missing/masked readings (-999999 is USGS sentinel value)
    valid = [v for v in values if float(v["value"]) >= 0]

    if len(valid) < 2:
        print(f"  ⚠️  Insufficient valid readings for gauge {gauge_id}")
        return None

    current_cfs  = float(valid[-1]["value"])
    previous_cfs = float(valid[-2]["value"])
    delta        = current_cfs - previous_cfs

    # 5 CFS threshold avoids trend noise on flat/low rivers
    if delta > 5:
        trend = "rising"
    elif delta < -5:
        trend = "falling"
    else:
        trend = "steady"

    return {
        "cfs":        round(current_cfs),
        "trend":      trend,
        "gauge_id":   gauge_id,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }



# ============================================================
# PURPLEAIR AQI FETCH
# ============================================================

def _pm25_to_aqi(pm: float) -> tuple[int, str]:
    """
    Convert PM2.5 (µg/m³) to AQI using EPA breakpoints.

    Like converting a climbing grade between systems — the math is
    just interpolation between known anchor points. EPA defines 7 bands;
    we find which band our PM2.5 falls in and scale linearly within it.

    Returns (aqi_int, category_label).
    """
    # (PM_low, PM_high, AQI_low, AQI_high, label)
    breakpoints = [
        (0.0,   12.0,   0,   50,  "Good"),
        (12.1,  35.4,  51,  100,  "Moderate"),
        (35.5,  55.4, 101,  150,  "Unhealthy for Sensitive Groups"),
        (55.5, 150.4, 151,  200,  "Unhealthy"),
        (150.5, 250.4, 201, 300,  "Very Unhealthy"),
        (250.5, 350.4, 301, 400,  "Hazardous"),
        (350.5, 500.4, 401, 500,  "Hazardous"),
    ]
    for pm_lo, pm_hi, aqi_lo, aqi_hi, label in breakpoints:
        if pm_lo <= pm <= pm_hi:
            aqi = round((aqi_hi - aqi_lo) / (pm_hi - pm_lo) * (pm - pm_lo) + aqi_lo)
            return aqi, label
    # Off the top of the scale
    return 500, "Hazardous"


def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Straight-line distance between two lat/lng points in km.
    Accurate enough for our 30km search radius.
    """
    import math
    R    = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a    = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    return R * 2 * math.asin(math.sqrt(a))


def fetch_aqi(lat: float, lng: float) -> dict:
    """
    Fetch nearest outdoor PurpleAir sensor within PURPLEAIR_MAX_KM.

    Strategy: query a bounding box slightly larger than our radius,
    then pick the closest sensor by Haversine distance. Like casting
    a wide net and keeping only the nearest catch.

    Returns dict with aqi, category, pm25, distance_km, sensor_name — or None.
    Requires PURPLEAIR_API_KEY env var.
    """
    if not PURPLEAIR_API_KEY:
        print(f"  ⚠️  PurpleAir: API key not set")
        return None

    # Bounding box: ~0.27 deg lat ≈ 30km, lng scaled by cos(lat)
    import math
    pad_lat = 0.27
    pad_lng = pad_lat / math.cos(math.radians(lat))

    params = {
        "fields":        "pm2.5_atm,latitude,longitude,last_seen,name",
        "location_type": "0",          # outdoor sensors only
        "max_age":       "3600",        # must have reported in last hour
        "nwlat":         round(lat + pad_lat, 6),
        "nwlng":         round(lng - pad_lng, 6),
        "selat":         round(lat - pad_lat, 6),
        "selng":         round(lng + pad_lng, 6),
    }

    url = PURPLEAIR_URL + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"X-API-Key": PURPLEAIR_API_KEY})

    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f"  ⚠️  PurpleAir API error for {lat},{lng}: {e}")
        return None

    fields  = data.get("fields", [])
    sensors = data.get("data", [])

    if not sensors:
        print(f"  ⚠️  PurpleAir: 0 sensors returned in bounding box for {lat},{lng}")
        return None

    # Map field names to indices for flexible response parsing
    try:
        i_pm   = fields.index("pm2.5_atm")
        i_lat  = fields.index("latitude")
        i_lng  = fields.index("longitude")
        i_name = fields.index("name")
    except ValueError as e:
        print(f"  ⚠️  PurpleAir unexpected field schema: {e}")
        return None

    # Find nearest sensor within radius
    best      = None
    best_dist = float("inf")

    for row in sensors:
        s_lat  = row[i_lat]
        s_lng  = row[i_lng]
        s_pm   = row[i_pm]
        s_name = row[i_name]

        # Skip sensors with null/invalid PM2.5
        if s_pm is None or s_pm < 0:
            continue

        dist = _haversine_km(lat, lng, s_lat, s_lng)
        if dist < best_dist and dist <= PURPLEAIR_MAX_KM:
            best_dist = dist
            best      = (s_pm, s_name, dist)

    if not best:
        print(f"  ⚠️  PurpleAir: {len(sensors)} sensors found but none within {PURPLEAIR_MAX_KM}km of {lat},{lng}")
        return None

    pm25, sensor_name, distance_km = best
    aqi, category = _pm25_to_aqi(pm25)

    return {
        "aqi":          aqi,
        "category":     category,
        "pm25":         round(pm25, 1),
        "sensor_name":  sensor_name,
        "distance_km":  round(distance_km, 1),
        "fetched_at":   datetime.now(timezone.utc).isoformat(),
    }


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
# ARCHIVE
# ============================================================

def archive_conditions(output: dict) -> None:
    """
    Write a timestamped snapshot to data/history/.

    Like a signed waiver at the trailhead — timestamped proof
    of exactly what the system said at this moment. Git history
    makes these commits cryptographically verifiable.
    """
    HISTORY_DIR.mkdir(parents=True, exist_ok=True)

    run_time  = datetime.now(timezone.utc)
    filename  = run_time.strftime("%Y-%m-%d_%H%M_UTC.json")
    archive_path = HISTORY_DIR / filename

    with open(archive_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"   📁 Archived → data/history/{filename}")


# ============================================================
# LOKI PUSH
# ============================================================

def push_to_loki(output: dict) -> None:
    """
    Ship the full conditions payload to Grafana Cloud Loki.

    Loki is like Prometheus but for logs — stores JSON payloads
    with labels, queryable with LogQL in Grafana.
    Safe no-op if env vars aren't set (local runs won't push).
    """
    loki_user    = os.environ.get("LOKI_USER")
    loki_api_key = os.environ.get("LOKI_API_KEY")
    loki_url     = os.environ.get("LOKI_URL")

    if not all([loki_user, loki_api_key, loki_url]):
        print("   ℹ️  Loki env vars not set — skipping push (local run)")
        return

    # Nanosecond timestamp as string — Loki's required format
    ts_ns = str(int(datetime.now(timezone.utc).timestamp() * 1_000_000_000))

    payload = {
        "streams": [
            {
                "stream": {
                    "job":    "beta-conditions",
                    "app":    "beta-trenigma-dev",
                    "source": "github-actions",
                },
                "values": [
                    [ts_ns, json.dumps(output)]
                ]
            }
        ]
    }

    body        = json.dumps(payload).encode("utf-8")
    credentials = base64.b64encode(f"{loki_user}:{loki_api_key}".encode()).decode()

    req = urllib.request.Request(
        f"{loki_url}/loki/api/v1/push",
        data=body,
        headers={
            "Content-Type":  "application/json",
            "Authorization": f"Basic {credentials}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"   📡 Loki push → HTTP {resp.status}")
    except Exception as e:
        # Non-fatal — archive already written, run continues
        print(f"   ⚠️  Loki push failed (non-fatal): {e}")

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

        # Fetch weather
        weather    = fetch_weather(crag["lat"], crag["lng"])
        conditions = extract_conditions(weather)
        scoring    = score_conditions(conditions, crag)

        # Fetch streamflow — only for crags with a gauge_id in crags.json
        streamflow = None
        if crag.get("gauge_id"):
            print(f"   Fetching streamflow from USGS gauge {crag['gauge_id']}...")
            streamflow = fetch_streamflow(crag["gauge_id"])
            if streamflow:
                trend_emoji = {"rising": "📈", "falling": "📉", "steady": "➡️"}.get(streamflow["trend"], "")
                print(f"   💧 Streamflow: {streamflow['cfs']} CFS {trend_emoji} {streamflow['trend']}")

        # Fetch AQI from nearest PurpleAir sensor
        print(f"   Fetching AQI from PurpleAir...")
        aqi_data = fetch_aqi(crag["lat"], crag["lng"])
        if aqi_data:
            aqi_emoji = "🟢" if aqi_data["aqi"] <= 50 else "🟡" if aqi_data["aqi"] <= 100 else "🟠" if aqi_data["aqi"] <= 150 else "🔴"
            print(f"   {aqi_emoji} AQI: {aqi_data['aqi']} ({aqi_data['category']}) · PM2.5: {aqi_data['pm25']} µg/m³ · {aqi_data['distance_km']}km away")
        else:
            print(f"   ℹ️  AQI: No sensor within {PURPLEAIR_MAX_KM}km")

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
            "streamflow": streamflow,
            "aqi":        aqi_data,
            "crag_meta":  {
                "rock_type":  crag["rock_type"],
                "aspect":     crag["aspect"],
                "elevation_ft": crag["elevation_ft"],
                "notes":      crag["notes"],
            }
        })

    # ── LAST GO ──────────────────────────────────────────────
    # Scan history snapshots to find when each crag last had a
    # "go" signal. Like checking the logbook at the trailhead —
    # when was the last time someone signed in saying "conditions great"?
    last_go_map = {}  # crag_id → ISO timestamp string of most recent go

    if HISTORY_DIR.exists():
        # Sort descending — newest first, stop early once all crags found
        history_files = sorted(HISTORY_DIR.glob("*.json"), reverse=True)
        for hfile in history_files:
            if len(last_go_map) == len(results):
                break  # found a last-go for every crag, done
            try:
                with open(hfile) as f:
                    snap = json.load(f)
                for hcrag in snap.get("crags", []):
                    cid = hcrag.get("id")
                    if cid and cid not in last_go_map and hcrag.get("signal") == "go":
                        last_go_map[cid] = snap.get("generated_at")
            except Exception:
                continue  # corrupt/partial file — skip silently

    # Attach last_go to each result
    for r in results:
        r["last_go"] = last_go_map.get(r["id"])

    go_hits = sum(1 for r in results if r["last_go"])
    print(f"\n📅 Last-GO scan: {go_hits}/{len(results)} crags have history")

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

    archive_conditions(output)
    push_to_loki(output)

    print("\n")


if __name__ == "__main__":
    main()