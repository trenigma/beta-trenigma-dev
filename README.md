# BETA 🪨

**A tool in your quiver to help you make better, more confident decisions about when it's a great day to go send.**

Live at **[beta.trenigma.dev](https://beta.trenigma.dev)**

---

## What is this?

BETA aggregates real-time weather data across climbing areas in the Pacific Northwest (and beyond) and distills it into a single signal: **Go, Wait, or No.**

No more toggling between five browser tabs trying to mentally combine humidity, precip history, temperature, and wind. BETA does the math and gives you a read — so you can spend less time second-guessing and more time on rock.

> ⚠️ **BETA is a starting point, not a substitute for judgment.** See the [Safety Disclaimer](#safety-disclaimer) below.

---

## Crags

| Crag | Region |
|------|--------|
| Index Town Wall | Sky Valley / US-2 |
| Leavenworth | Wenatchee River Valley |
| Vantage | Columbia River Gorge |
| Little Si | Cascade Foothills |
| Mt. Erie | Fidalgo Island |
| Peshastin Pinnacles | Wenatchee Valley |
| Exit 38 | I-90 Corridor |
| Castle Rock | Tumwater Canyon |
| Smith Rock | Central Oregon |
| The Chief | Squamish, BC |
| Smoke Bluffs | Squamish, BC |

More coming. Got a crag you want to see? [Open an issue](https://github.com/trenigma/beta-trenigma-dev/issues) or [add it yourself](#contributing).

---

## How It Works

BETA is intentionally simple under the hood:

- **Weather data** is pulled from [Open-Meteo](https://open-meteo.com/) — free, no API key required, global coverage
- **A Python scoring pipeline** weighs precip history, humidity, temperature, and wind against per-crag thresholds (rock type, aspect, elevation, and local exposure all factor in)
- **GitHub Actions** runs the pipeline automatically every 6 hours and commits fresh data to the repo
- **GitHub Pages** serves the static site — no backend, no database, no server costs

Want to go deeper? The codebase is open — poke around `scripts/fetch_conditions.py` and `data/crags.json` and challenge yourself. Or just ask.

---

## Safety Disclaimer

> **For informational purposes only. Always verify with official [NWAC](https://nwac.us) forecasts, [NWS](https://weather.gov), and your own judgment before heading to the crag or backcountry. Conditions can change rapidly. We are not responsible for any outcomes resulting from use of this information. Get out there safely. 🏔️**

BETA is one signal among many. It doesn't know about fresh seeps, shaded north-facing walls that hold moisture for days, or that one section that's always wet after rain no matter what the data says. You do. Use both.

---

## Contributing

BETA is open to contributions — whether you're a developer, a climber with local knowledge, or both.

**Ground rules:**
- Always branch off of `main`
- Open a pull request — don't push directly to `main`
- Keep PRs focused; one crag or one fix per PR makes review easier

### Adding a New Crag

Adding a crag is the most common and most appreciated contribution. Here's how:

**1. Branch off main**
```bash
git checkout main
git pull origin main
git checkout -b add-crag-miller-river
```

**2. Add the crag to `data/crags.json`**

```json
{
  "id": "miller-river",
  "name": "Miller River Boulders",
  "region": "Skykomish Valley",
  "lat": 47.7423,
  "lng": -121.4957,
  "elevation_ft": 1200,
  "rock_type": "granite",
  "aspect": "varied",
  "drying_multiplier": 1.3,
  "wind_threshold_mph": 25,
  "notes": "Your local knowledge goes here — seep behavior, shady walls, quirks after rain, etc."
}
```

Key fields:
- `drying_multiplier` — `1.0` is baseline. Higher = slower drying (coastal/forest crags). Lower = faster (desert/exposed).
- `wind_threshold_mph` — score penalty kicks in above this. Wind tunnels like Vantage get a lower threshold (15 mph); sheltered valley crags get 25 mph.
- `notes` — this is where local knowledge lives. Be specific. What's the wall like 24 hours after rain? Any chronic seeps? Aspect quirks?

**3. Add a detail page**

Copy an existing tool page (e.g. `tools/index-town-wall.html`) and update:
- Page title and crag name
- `const CRAG_ID` to match the `id` in `crags.json`
- Region subtitle, rock type, aspect, elevation, drying time
- Links: Mountain Project (or local access org), NWS forecast, road conditions
- The `notes` block with your local knowledge

**4. Wire it into `index.html`**

Add your crag to the `CRAG_URLS` object:
```javascript
'miller-river': 'tools/miller-river.html',
```

**5. Test locally, then open a PR**
```bash
python3 scripts/fetch_conditions.py   # verify your crag gets scored
git add .
git commit -m "Add Miller River Boulders"
git push origin add-crag-miller-river
```

Then open a pull request against `main` on GitHub. Include a note about the crag — why it deserves a spot, any scoring nuances, local access considerations.

---

## Built by a climber, for climbers.

Built by a climber of color in Seattle, WA.

- GitHub: [@trenigma](https://github.com/trenigma)
- Instagram: [@trenigma](https://www.instagram.com/visceral_pnw/)
- Community: [Rising Roots PNW](https://www.instagram.com/risingrootspnw/) — building welcoming spaces for underrepresented climbers

---

## License

Copyright (c) 2026 Tree (trenigma). All rights reserved.

This project is free for personal, educational, and non-commercial use. You're welcome to fork it, learn from it, adapt it for your local climbing community, or build on it — as long as you're not making money from it.

**Commercial use — including but not limited to selling, licensing, or incorporating this project or its derivatives into a paid product or service — requires prior written permission from the author.**

To ask: open an issue or reach out via GitHub ([@trenigma](https://github.com/trenigma)).

This software is provided "as is", without warranty of any kind. See the [Safety Disclaimer](#safety-disclaimer) for data-specific limitations.

---

*This project does not replace experience, local knowledge, or good judgment. Go climb. Be safe. Send it. 🤙🏽*