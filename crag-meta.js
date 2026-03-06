/**
 * crag-meta.js
 * BETA — beta.trenigma.dev
 *
 * Single source of truth for all crag metadata.
 * Included via <script src="../crag-meta.js"> in every tools/*.html page.
 *
 * MAINTENANCE:
 *   To update any crag detail → edit this file only. All pages update automatically.
 *   To add a new crag → add an entry here, create tools/your-crag.html from the template,
 *   set CRAG_ID = 'your-crag-id', and add it to CRAG_URLS in index.html.
 *
 * ⚠️  Fields marked [VERIFY] need confirmation from local knowledge before shipping.
 */

const CRAG_META = {

  'index': {
    name: 'Index Town Wall', region: 'Sky Valley / US-2',
    rock_type: 'Granite', aspect: 'South', elevation: '900 ft',
    drying_speed: 'Moderate', season: 'May–Oct',
    description: 'Granite dries fast. Lower Wall sheds water quickly; Upper Wall slower after heavy rain. South-facing aspect means afternoon sun helps dry things out. One of the most reliable crags on the west side when conditions cooperate.',
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/105790635/index' },
      { label: 'NWAC Forecast ↗',       url: 'https://nwac.us' },
      { label: 'NWS Index ↗',           url: 'https://forecast.weather.gov/MapClick.php?CityName=Index&state=WA&site=SEW' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'leavenworth': {
    name: 'Leavenworth', region: 'Wenatchee River Valley / US-2',
    rock_type: 'Granite', aspect: 'Mixed', elevation: '1,100 ft',
    drying_speed: 'Fast', season: 'Apr–Nov',
    description: '[VERIFY] Leavenworth is a granite mecca in the eastern Cascades with dozens of crags across Icicle Canyon. The drier east-side climate means faster drying times than west-side PNW crags. Wall aspects vary by sub-area — some catch morning sun, others bake in the afternoon.',
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/120379546/leavenworth' },
      { label: 'NWAC Forecast ↗',       url: 'https://nwac.us' },
      { label: 'NWS Leavenworth ↗',     url: 'https://forecast.weather.gov/MapClick.php?CityName=Leavenworth&state=WA&site=SEW' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'vantage': {
    name: 'Frenchman Coulee', region: 'Columbia River Gorge / I-90',
    rock_type: 'Basalt', aspect: 'West', elevation: '800 ft',
    drying_speed: 'Fast', season: 'Mar–Jun, Sep–Nov',
    description: '[VERIFY] Frenchman Coulee offers striking basalt columns above the Columbia River, best known for The Feathers. The desert setting means rapid drying and wide temperature swings. Spring and fall are prime; summer heat and winter cold both push the limits. Basalt dries faster than granite — often climbable within a day of rain.',
    links: [
      { label: 'Mountain Project ↗',       url: 'https://www.mountainproject.com/area/105792231/frenchman-coulee-vantage' },
      { label: 'NWAC Forecast ↗',          url: 'https://nwac.us' },
      { label: 'NWS Vantage ↗',            url: 'https://forecast.weather.gov/MapClick.php?CityName=Vantage&state=WA&site=OTX' },
      { label: 'Snoqualmie Pass (I-90) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/snoqualmie' },
    ],
  },

  'little-si': {
    name: 'Little Si', region: 'North Bend / I-90',
    rock_type: 'Granite', aspect: 'Southwest', elevation: '1,200 ft',
    drying_speed: 'Slow', season: 'May–Oct',
    description: '[VERIFY] Little Si offers accessible Pacific Northwest granite climbing close to Seattle. Expect extended drying times typical of the west Cascades — plan for at least 2–3 dry days after significant rain before rock is climbable.',
    links: [
      { label: 'Mountain Project ↗',       url: 'https://www.mountainproject.com/area/105789876/exit-32-little-si' },
      { label: 'NWAC Forecast ↗',          url: 'https://nwac.us' },
      { label: 'NWS North Bend ↗',         url: 'https://forecast.weather.gov/MapClick.php?CityName=North+Bend&state=WA&site=SEW' },
      { label: 'Snoqualmie Pass (I-90) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/snoqualmie' },
    ],
  },

  'mt-erie': {
    name: 'Mt. Erie', region: 'Anacortes / Fidalgo Island',
    rock_type: 'Granite', aspect: 'Mixed', elevation: '1,270 ft',
    drying_speed: 'Moderate', season: 'Apr–Oct',
    description: '[VERIFY] Mt. Erie sits above Anacortes with views across the San Juans. The granite is generally solid and the island setting can bring drying winds off the water, though maritime moisture keeps it wetter than east-side crags. Multiple aspects mean some walls dry faster than others.',
    links: [
      { label: 'Mountain Project ↗', url: 'https://www.mountainproject.com/area/106413714/mount-erie' },
      { label: 'NWAC Forecast ↗',    url: 'https://nwac.us' },
      { label: 'NWS Anacortes ↗',    url: 'https://forecast.weather.gov/MapClick.php?CityName=Anacortes&state=WA&site=SEW' },
      { label: 'SR-20 Road Info ↗',  url: 'https://wsdot.com/travel/real-time/alerts/road/020' },
    ],
  },

  'peshastin': {
    name: 'Peshastin Pinnacles', region: 'Cashmere / US-2',
    rock_type: 'Sandstone', aspect: 'South', elevation: '1,400 ft',
    drying_speed: 'Fast', season: 'Mar–Oct',
    description: "[VERIFY] Peshastin Pinnacles is one of the few sandstone crags in Washington, tucked into a dry orchard valley near Leavenworth. The south-facing exposure and east-side rain shadow mean early season access and fast drying. Important: avoid climbing on wet sandstone — it damages the rock. Wait 24–48h after any rain.",
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/105874324/peshastin-pinnacles-state-park' },
      { label: 'NWAC Forecast ↗',       url: 'https://nwac.us' },
      { label: 'NWS Cashmere ↗',        url: 'https://forecast.weather.gov/MapClick.php?CityName=Cashmere&state=WA&site=SEW' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'exit-38': {
    name: 'Exit 38', region: 'I-90 Corridor / North Bend',
    rock_type: 'Metamorphic', aspect: 'Southeast', elevation: '1,400 ft',
    drying_speed: 'Moderate', season: 'May–Oct',
    description: "[VERIFY] Exit 38 is Seattle's closest sport climbing venue, just off I-90 in the Cascade foothills. The metamorphic rock and steep walls shed water reasonably well, but the heavy west Cascade rainfall means extended drying windows are still common. Often a solid bet on the first clear day after a dry stretch.",
    links: [
      { label: 'Mountain Project ↗',       url: 'https://www.mountainproject.com/area/114278624/exit-38' },
      { label: 'NWAC Forecast ↗',          url: 'https://nwac.us' },
      { label: 'NWS North Bend ↗',         url: 'https://forecast.weather.gov/MapClick.php?CityName=North+Bend&state=WA&site=SEW' },
      { label: 'Snoqualmie Pass (I-90) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/snoqualmie' },
    ],
  },

  'castle-rock': {
    name: 'Castle Rock', region: 'Tumwater Canyon / US-2',
    rock_type: 'Granite', aspect: 'South', elevation: '2,200 ft',
    drying_speed: 'Fast', season: 'Apr–Nov',
    description: '[VERIFY] Castle Rock is a classic Leavenworth granite dome in Tumwater Canyon, known for moderate multi-pitch routes on clean rock. The south-facing aspect means generous sun exposure and fast drying compared to west-side crags. A go-to early and late season destination.',
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/105790784/castle-rock' },
      { label: 'NWAC Forecast ↗',       url: 'https://nwac.us' },
      { label: 'NWS Leavenworth ↗',     url: 'https://forecast.weather.gov/MapClick.php?CityName=Leavenworth&state=WA&site=SEW' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'smith-rock': {
    name: 'Smith Rock', region: 'Central Oregon / US-97',
    rock_type: 'Volcanic Tuff', aspect: 'Mixed', elevation: '3,200 ft',
    drying_speed: 'Fast', season: 'Mar–Jun, Sep–Nov',
    description: 'Smith Rock is the birthplace of American sport climbing, featuring dramatic volcanic tuff above the Crooked River. Wall aspects vary widely — Morning Rock catches early sun while the Dihedrals stay shaded until afternoon. The high desert location means fast drying but extreme heat in summer and cold mornings in winter.',
    links: [
      { label: 'Mountain Project ↗', url: 'https://www.mountainproject.com/area/105788989/smith-rock' },
      { label: 'NWAC Forecast ↗',    url: 'https://nwac.us' },
      { label: 'NWS Terrebonne ↗',   url: 'https://forecast.weather.gov/MapClick.php?CityName=Terrebonne&state=OR&site=PDT' },
      { label: 'TripCheck Oregon ↗', url: 'https://www.tripcheck.com/' },
    ],
  },

  'squamish-chief': {
    name: 'The Chief', region: 'Squamish, BC / Hwy 99',
    rock_type: 'Granite', aspect: 'West', elevation: '2,100 ft',
    drying_speed: 'Slow', season: 'May–Oct',
    description: "[VERIFY] The Stawamus Chief is a massive granite dome above Squamish offering world-class multi-pitch and single-pitch climbing. West-facing walls catch afternoon sun, but Squamish's heavy coastal rainfall means extended drying — typically 2–4 days after significant rain. Factor extra drying time vs. eastern Cascades crags.",
    links: [
      { label: 'Squamish Access Society ↗', url: 'https://www.squamishaccess.ca/' },
      { label: 'NWAC Forecast ↗',           url: 'https://nwac.us' },
      { label: 'DriveBC (Hwy 99) ↗',        url: 'https://www.drivebc.ca/?pan=-123.19392500000001%2C49.48295352928807&zoom=10.450012356646624&start=Vancouver%2C%20BC&end=Squamish%2C%20BC' },
    ],
  },

  'squamish-smoke-bluffs': {
    name: 'Smoke Bluffs', region: 'Squamish, BC / Hwy 99',
    rock_type: 'Granite', aspect: 'Mixed', elevation: '600 ft',
    drying_speed: 'Moderate', season: 'Apr–Oct',
    description: "[VERIFY] The Smoke Bluffs are a network of granite bluffs woven through the town of Squamish, offering accessible single-pitch climbing within walking distance of downtown. Aspects vary wall to wall — some dry quickly in afternoon sun while others stay damp for days after rain. A great option when The Chief is still drying out.",
    links: [
      { label: 'Squamish Access Society ↗', url: 'https://www.squamishaccess.ca/' },
      { label: 'NWAC Forecast ↗',           url: 'https://nwac.us' },
      { label: 'DriveBC (Hwy 99) ↗',        url: 'https://www.drivebc.ca/?pan=-123.19392500000001%2C49.48295352928807&zoom=10.450012356646624&start=Vancouver%2C%20BC&end=Squamish%2C%20BC' },
    ],
  },

};

// CommonJS export for Node/GitHub Actions build context
if (typeof module !== 'undefined') module.exports = { CRAG_META };