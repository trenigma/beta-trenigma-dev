/**
 * crag-meta.js
 * BETA — beta.trenigma.dev
 *
 * Single source of truth for all crag metadata.
 * Included via <script src="../crag-meta.js"> in every tools/*.html page.
 *
 * MAINTENANCE:
 *   To update any crag detail → edit this file only. All pages update automatically.
 *   To add a new crag → add an entry here, create tools/your-crag.html using the template,
 *   set CRAG_ID = 'your-crag-id', and add it to CRAG_URLS in index.html.
 *
 * FIELDS:
 *   name          Display name (used in <title> and hero h1)
 *   region        Region label + road corridor (e.g. "Sky Valley / US-2")
 *   rock_type     Rock type — shown in info grid and hero subtitle
 *   aspect        Primary wall aspect(s) — affects drying time framing
 *   elevation     Elevation string (e.g. "~900 ft")
 *   drying_speed  One of: Fast / Moderate / Slow / Very Slow
 *   season        Best climbing months
 *   description   Crag notes shown in the info card (2–4 sentences)
 *   links         Array of {label, url} for the "Plan your visit" resources section
 *
 * ASPECT KEY:
 *   N / S / E / W / NE / NW / SE / SW / Mixed
 *
 * ⚠️  Fields marked [VERIFY] need confirmation from local knowledge before shipping.
 */

const CRAG_META = {

  'index': {
    name:         'Index Town Wall',
    region:       'Sky Valley / US-2',
    rock_type:    'Granite',
    aspect:       'South',
    elevation:    '~900 ft',
    drying_speed: 'Moderate',
    season:       'May–Oct',
    description:  'Granite dries fast. Lower Wall sheds water quickly; Upper Wall slower after heavy rain. South-facing aspect means afternoon sun helps dry things out. One of the most reliable crags on the west side when conditions cooperate.',
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/105790635/index' },
      { label: 'NWAC Forecast ↗',       url: 'https://nwac.us' },
      { label: 'NWS Index ↗',           url: 'https://forecast.weather.gov/MapClick.php?CityName=Index&state=WA&site=SEW' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'leavenworth': {
    name:         'Leavenworth',
    region:       'Icicle Canyon / US-2',
    rock_type:    'Granite',
    aspect:       'Mixed',        // [VERIFY] varies by sub-area
    elevation:    '~1,200 ft',    // [VERIFY]
    drying_speed: 'Fast',
    season:       'Apr–Nov',
    description:  '[VERIFY] Leavenworth is a granite mecca in the eastern Cascades with dozens of crags across Icicle Canyon. The drier east-side climate means faster drying times than west-side PNW crags. Wall aspects vary by sub-area — some catch morning sun, others bake in the afternoon.',
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/105798167/leavenworth' },
      { label: 'NWS Leavenworth ↗',     url: 'https://forecast.weather.gov/MapClick.php?CityName=Leavenworth&state=WA&site=OTX' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'vantage': {
    name:         'Frenchman Coulee',
    region:       'Vantage / I-90',
    rock_type:    'Basalt',
    aspect:       'West',         // [VERIFY] — Feathers and main columns face roughly west
    elevation:    '~1,600 ft',    // [VERIFY]
    drying_speed: 'Fast',
    season:       'Mar–Jun, Sep–Nov',
    description:  '[VERIFY] Frenchman Coulee offers striking basalt columns above the Columbia River, best known for The Feathers. The desert setting means rapid drying and wide temperature swings. Spring and fall are prime; summer heat and winter cold both push the limits. Basalt dries faster than granite — often climbable within a day of rain.',
    links: [
      { label: 'Mountain Project ↗', url: 'https://www.mountainproject.com/area/105798165/vantage' },
      { label: 'NWS Vantage ↗',      url: 'https://forecast.weather.gov/MapClick.php?CityName=Vantage&state=WA&site=OTX' },
      { label: 'I-90 Conditions ↗',  url: 'https://wsdot.com/travel/real-time/mountainpasses/snoqualmie' },
    ],
  },

  'little-si': {
    name:         'Little Si',
    region:       'North Bend / I-90',
    rock_type:    'Andesite',     // [VERIFY]
    aspect:       'Southwest',    // [VERIFY]
    elevation:    '~1,200 ft',    // [VERIFY]
    drying_speed: 'Slow',
    season:       'May–Oct',
    description:  '[VERIFY] Little Si offers accessible Pacific Northwest climbing close to Seattle. Expect extended drying times typical of the west Cascades — plan for at least 2–3 dry days after significant rain before rock is climbable.',
    links: [
      { label: 'Mountain Project ↗',      url: 'https://www.mountainproject.com/area/105791804/little-si' },
      { label: 'NWS North Bend ↗',        url: 'https://forecast.weather.gov/MapClick.php?CityName=North+Bend&state=WA&site=SEW' },
      { label: 'Snoqualmie Pass (I-90) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/snoqualmie' },
    ],
  },

  'mt-erie': {
    name:         'Mt. Erie',
    region:       'Anacortes / SR-20',
    rock_type:    'Granite',
    aspect:       'Mixed',        // [VERIFY]
    elevation:    '~1,270 ft',
    drying_speed: 'Moderate',
    season:       'Apr–Oct',
    description:  '[VERIFY] Mt. Erie sits above Anacortes with views across the San Juans. The granite is generally solid and the island setting can bring drying winds off the water, though maritime moisture keeps it wetter than east-side crags. Multiple aspects mean some walls dry faster than others.',
    links: [
      { label: 'Mountain Project ↗', url: 'https://www.mountainproject.com/area/105791858/mount-erie' },
      { label: 'NWS Anacortes ↗',    url: 'https://forecast.weather.gov/MapClick.php?CityName=Anacortes&state=WA&site=SEW' },
    ],
  },

  'peshastin': {
    name:         'Peshastin Pinnacles',
    region:       'Peshastin / US-2',
    rock_type:    'Sandstone',
    aspect:       'South',        // [VERIFY]
    elevation:    '~1,200 ft',    // [VERIFY]
    drying_speed: 'Fast',
    season:       'Mar–Oct',
    description:  '[VERIFY] Peshastin Pinnacles is one of the few sandstone crags in Washington, tucked into a dry orchard valley near Leavenworth. The south-facing exposure and east-side rain shadow mean early season access and fast drying. Important: avoid climbing on wet sandstone — it damages the rock. Wait 24–48h after any rain.',
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/105798170/peshastin-pinnacles' },
      { label: 'NWS Leavenworth ↗',     url: 'https://forecast.weather.gov/MapClick.php?CityName=Leavenworth&state=WA&site=OTX' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'exit-38': {
    name:         'Exit 38',
    region:       'North Bend / I-90',
    rock_type:    'Basalt',
    aspect:       'Southeast',    // [VERIFY]
    elevation:    '~600 ft',      // [VERIFY]
    drying_speed: 'Moderate',
    season:       'May–Oct',
    description:  '[VERIFY] Exit 38 is Seattle\'s closest basalt sport climbing venue, just off I-90 in the Cascade foothills. Basalt dries faster than granite, but the heavy west Cascade rainfall means extended drying windows are still common. Often a good bet on the first clear day after a dry stretch.',
    links: [
      { label: 'Mountain Project ↗',       url: 'https://www.mountainproject.com/area/105791596/exit-38' },
      { label: 'NWS North Bend ↗',         url: 'https://forecast.weather.gov/MapClick.php?CityName=North+Bend&state=WA&site=SEW' },
      { label: 'Snoqualmie Pass (I-90) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/snoqualmie' },
    ],
  },

  'castle-rock': {
    name:         'Castle Rock',
    region:       'Leavenworth / US-2',
    rock_type:    'Granite',
    aspect:       'South',        // [VERIFY]
    elevation:    '~1,100 ft',    // [VERIFY]
    drying_speed: 'Fast',
    season:       'Apr–Nov',
    description:  '[VERIFY] Castle Rock is a classic Leavenworth granite dome in lower Icicle Canyon, known for moderate multi-pitch routes on clean rock. The south-facing aspect means generous sun exposure and fast drying compared to west-side crags. A go-to early and late season destination.',
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/105798167/leavenworth' },
      { label: 'NWS Leavenworth ↗',     url: 'https://forecast.weather.gov/MapClick.php?CityName=Leavenworth&state=WA&site=OTX' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'smith-rock': {
    name:         'Smith Rock',
    region:       'Terrebonne / US-97',
    rock_type:    'Volcanic Tuff',
    aspect:       'Mixed',
    elevation:    '~3,200 ft',
    drying_speed: 'Fast',
    season:       'Mar–Jun, Sep–Nov',
    description:  'Smith Rock is the birthplace of American sport climbing, featuring dramatic volcanic tuff above the Crooked River. Wall aspects vary widely — Morning Rock catches early sun while the Dihedrals stay shaded until afternoon. The high desert location means fast drying but extreme heat in summer and cold mornings in winter.',
    links: [
      { label: 'Mountain Project ↗', url: 'https://www.mountainproject.com/area/105788989/smith-rock' },
      { label: 'NWS Redmond OR ↗',   url: 'https://forecast.weather.gov/MapClick.php?CityName=Redmond&state=OR&site=PDT' },
      { label: 'Oregon Road Info ↗',  url: 'https://www.tripcheck.com' },
    ],
  },

  'squamish-chief': {
    name:         'The Chief',
    region:       'Squamish, BC / Hwy 99',
    rock_type:    'Granite',
    aspect:       'West',         // [VERIFY]
    elevation:    '~2,100 ft',
    drying_speed: 'Slow',
    season:       'May–Oct',
    description:  '[VERIFY] The Stawamus Chief is a massive granite dome above Squamish offering world-class multi-pitch and single-pitch climbing. West-facing walls catch afternoon sun, but Squamish\'s heavy coastal rainfall means extended drying — typically 2–4 days after significant rain. Factor extra drying time vs. eastern Cascades crags.',
    links: [
      { label: 'Mountain Project ↗',  url: 'https://www.mountainproject.com/area/105869315/squamish' },
      { label: 'Environment Canada ↗', url: 'https://weather.gc.ca/city/pages/bc-74_metric_e.html' },
      { label: 'DriveBC (Hwy 99) ↗',  url: 'https://www.drivebc.ca' },
    ],
  },

  'squamish-smoke-bluffs': {
    name:         'Smoke Bluffs',
    region:       'Squamish, BC / Hwy 99',
    rock_type:    'Granite',
    aspect:       'Mixed',        // [VERIFY] — multiple walls with varying aspects
    elevation:    '~300 ft',      // [VERIFY]
    drying_speed: 'Moderate',
    season:       'Apr–Oct',
    description:  '[VERIFY] The Smoke Bluffs are a network of granite bluffs woven through the town of Squamish, offering accessible single-pitch climbing within walking distance of downtown. Aspects vary wall to wall — some dry quickly in afternoon sun while others stay damp for days after rain. Local knowledge matters here.',
    links: [
      { label: 'Mountain Project ↗',  url: 'https://www.mountainproject.com/area/105869315/squamish' },
      { label: 'Environment Canada ↗', url: 'https://weather.gc.ca/city/pages/bc-74_metric_e.html' },
      { label: 'DriveBC (Hwy 99) ↗',  url: 'https://www.drivebc.ca' },
    ],
  },

};

// CommonJS export for Node/GitHub Actions build context
if (typeof module !== 'undefined') module.exports = { CRAG_META };