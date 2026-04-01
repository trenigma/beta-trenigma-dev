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
 * ⚠️  Fields marked need confirmation from local knowledge before shipping.
 *
 * SUN SHADING (Phase 1):
 *   lat / lng     Crag coordinates for solar position calculations.
 *   sun_bearing   Compass bearing (0-360) of the wall's outward-facing direction.
 *                 Used with solar math to determine sun/shade status in real time.
 *                 Only present on crags with a single dominant aspect.
 *                 Crags with 'Mixed' aspect get sun position display instead (Phase 1.5 = sectors).
 */

const CRAG_META = {

  'index': {
    name: 'Index Town Wall', region: 'Sky Valley / US-2',
    lat: 47.8248, lng: -121.5595,
    rock_type: 'Granite', aspect: 'South', sun_bearing: 180, elevation: '900 ft',
    gauge_id: '12134500', gauge_name: 'Skykomish River Near Gold Bar',
    drying_speed: 'Moderate', season: 'May–Oct',
    description: 'Granite dries fast. Lower Wall sheds water quickly; Upper Wall slower after heavy rain. South-facing aspect means afternoon sun helps dry things out. One of the most reliable crags on the west side when conditions cooperate.',
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/105790635/index' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@47.8248,-121.5595,400a,800d,75y,200h' },
      { label: '⚠️ Terrain Above — NWAC Forecast ↗', url: 'https://nwac.us/avalanche-forecast/#/stevens-pass/' },
      { label: 'NWS Index ↗',           url: 'https://forecast.weather.gov/MapClick.php?CityName=Index&state=WA&site=SEW' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'leavenworth': {
    name: 'Leavenworth', region: 'Wenatchee River Valley / US-2',
    lat: 47.527, lng: -120.742,
    rock_type: 'Granite', aspect: 'Mixed', elevation: '1,100 ft',
    drying_speed: 'Fast', season: 'Apr–Nov',
    description: 'Leavenworth is a granite mecca in the eastern Cascades with dozens of crags across Icicle Canyon. The drier east-side climate means faster drying times than west-side PNW crags. Wall aspects vary by sub-area — some catch morning sun, others bake in the afternoon.',
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/120379546/leavenworth' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@47.527,-120.742,400a,4000d,65y,270h' },
      { label: '⚠️ Terrain Above — NWAC Forecast ↗', url: 'https://nwac.us/avalanche-forecast/#/east-slopes-central/' },
      { label: 'NWS Leavenworth ↗',     url: 'https://forecast.weather.gov/MapClick.php?CityName=Leavenworth&state=WA&site=SEW' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'vantage': {
    name: 'Frenchman Coulee', region: 'Columbia River Gorge / I-90',
    lat: 46.965, lng: -119.975,
    rock_type: 'Basalt', aspect: 'West', sun_bearing: 270, elevation: '800 ft',
    drying_speed: 'Fast', season: 'Mar–Jun, Sep–Nov',
    description: 'Frenchman Coulee offers striking basalt columns above the Columbia River, best known for The Feathers. The desert setting means rapid drying and wide temperature swings. Spring and fall are prime; summer heat and winter cold both push the limits. Basalt dries faster than granite — often climbable within a day of rain.',
    links: [
      { label: 'Mountain Project ↗',       url: 'https://www.mountainproject.com/area/105792231/frenchman-coulee-vantage' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@46.965,-119.975,300a,2500d,70y,180h' },
      { label: 'NWAC Forecast ↗',          url: 'https://nwac.us/avalanche-forecast/#/all/' },
      { label: 'NWS Vantage ↗',            url: 'https://forecast.weather.gov/MapClick.php?CityName=Vantage&state=WA&site=OTX' },
      { label: 'Snoqualmie Pass (I-90) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/snoqualmie' },
    ],
  },

  'little-si': {
    name: 'Little Si', region: 'North Bend / I-90',
    lat: 47.4927, lng: -121.7235,
    rock_type: 'Granite', aspect: 'Southwest', sun_bearing: 225, elevation: '1,200 ft',
    drying_speed: 'Slow', season: 'May–Oct',
    description: 'Little Si offers accessible Pacific Northwest granite climbing close to Seattle. Expect extended drying times typical of the west Cascades — plan for at least 2–3 dry days after significant rain before rock is climbable.',
    links: [
      { label: 'Mountain Project ↗',       url: 'https://www.mountainproject.com/area/105789876/exit-32-little-si' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@47.4927,-121.7235,500a,4000d,70y,90h' },
      { label: 'NWAC Forecast ↗',          url: 'https://nwac.us/avalanche-forecast/#/all/' },
      { label: 'NWS North Bend ↗',         url: 'https://forecast.weather.gov/MapClick.php?CityName=North+Bend&state=WA&site=SEW' },
      { label: 'Snoqualmie Pass (I-90) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/snoqualmie' },
    ],
  },

  'mt-erie': {
    name: 'Mt. Erie', region: 'Anacortes / Fidalgo Island',
    lat: 48.4592, lng: -122.6168,
    rock_type: 'Granite', aspect: 'Mixed', elevation: '1,270 ft',
    drying_speed: 'Moderate', season: 'Apr–Oct',
    description: 'Mt. Erie sits above Anacortes with views across the San Juans. The granite is generally solid and the island setting can bring drying winds off the water, though maritime moisture keeps it wetter than east-side crags. Multiple aspects mean some walls dry faster than others.',
    links: [
      { label: 'Mountain Project ↗', url: 'https://www.mountainproject.com/area/106413714/mount-erie' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@48.4591998,-122.61677217,170.81843207a,5216.18177899d,65y,180.0075006h' },
      { label: 'NWAC Forecast ↗',    url: 'https://nwac.us/avalanche-forecast/#/all/' },
      { label: 'NWS Anacortes ↗',    url: 'https://forecast.weather.gov/MapClick.php?CityName=Anacortes&state=WA&site=SEW' },
      { label: 'SR-20 Road Info ↗',  url: 'https://wsdot.com/travel/real-time/alerts/road/020' },
    ],
  },

  'peshastin': {
    name: 'Peshastin Pinnacles', region: 'Cashmere / US-2',
    lat: 47.5285, lng: -120.5873,
    rock_type: 'Sandstone', aspect: 'South', sun_bearing: 180, elevation: '1,400 ft',
    drying_speed: 'Fast', season: 'Mar–Oct',
    description: "Peshastin Pinnacles is one of the few sandstone crags in Washington, tucked into a dry orchard valley near Leavenworth. The south-facing exposure and east-side rain shadow mean early season access and fast drying. Important: avoid climbing on wet sandstone — it damages the rock. Wait 24–48h after any rain.",
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/105874324/peshastin-pinnacles-state-park' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@47.5285,-120.5873,427a,1500d,70y,180h' },
      { label: 'NWAC Forecast ↗',       url: 'https://nwac.us/avalanche-forecast/#/all/' },
      { label: 'NWS Cashmere ↗',        url: 'https://forecast.weather.gov/MapClick.php?CityName=Cashmere&state=WA&site=SEW' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'exit-38': {
    name: 'Exit 38', region: 'I-90 Corridor / North Bend',
    lat: 47.4425, lng: -121.7026,
    rock_type: 'Metamorphic', aspect: 'Southeast', sun_bearing: 135, elevation: '1,400 ft',
    drying_speed: 'Moderate', season: 'May–Oct',
    description: "Exit 38 is Seattle's closest sport climbing venue, just off I-90 in the Cascade foothills. The metamorphic rock and steep walls shed water reasonably well, but the heavy west Cascade rainfall means extended drying windows are still common. Often a solid bet on the first clear day after a dry stretch.",
    links: [
      { label: 'Mountain Project ↗',       url: 'https://www.mountainproject.com/area/114278624/exit-38' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@47.44252213,-121.70255169,415.66338333a,4098.19970488d,35y,167.97035001h' },
      { label: 'NWAC Forecast ↗',          url: 'https://nwac.us/avalanche-forecast/#/all/' },
      { label: 'NWS North Bend ↗',         url: 'https://forecast.weather.gov/MapClick.php?CityName=North+Bend&state=WA&site=SEW' },
      { label: 'Snoqualmie Pass (I-90) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/snoqualmie' },
    ],
  },

  'castle-rock': {
    name: 'Castle Rock', region: 'Tumwater Canyon / US-2',
    lat: 47.5978, lng: -120.7401,
    rock_type: 'Granite', aspect: 'South', sun_bearing: 180, elevation: '2,200 ft',
    drying_speed: 'Fast', season: 'Apr–Nov',
    description: 'Castle Rock is a classic Leavenworth granite dome in Tumwater Canyon, known for moderate multi-pitch routes on clean rock. The south-facing aspect means generous sun exposure and fast drying compared to west-side crags. A go-to early and late season destination.',
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/105790784/castle-rock' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@47.5978,-120.7401,600a,2500d,70y,270h' },
      { label: '⚠️ Terrain Above — NWAC Forecast ↗', url: 'https://nwac.us/avalanche-forecast/#/east-slopes-central/' },
      { label: 'NWS Leavenworth ↗',     url: 'https://forecast.weather.gov/MapClick.php?CityName=Leavenworth&state=WA&site=SEW' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

  'smith-rock': {
    name: 'Smith Rock', region: 'Central Oregon / US-97',
    lat: 44.3661, lng: -121.1455,
    rock_type: 'Volcanic Tuff', aspect: 'Mixed', elevation: '3,200 ft',
    drying_speed: 'Fast', season: 'Mar–Jun, Sep–Nov',
    description: 'Smith Rock is the birthplace of American sport climbing, featuring dramatic volcanic tuff above the Crooked River. Wall aspects vary widely — Morning Rock catches early sun while the Dihedrals stay shaded until afternoon. The high desert location means fast drying but extreme heat in summer and cold mornings in winter.',
    links: [
      { label: 'Mountain Project ↗', url: 'https://www.mountainproject.com/area/105788989/smith-rock' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@44.36614706,-121.14549398,812.80833947a,1627.43293944d,35y,-87.25940215h' },
      { label: 'NWAC Forecast ↗',    url: 'https://nwac.us/avalanche-forecast/#/all/' },
      { label: 'NWS Terrebonne ↗',   url: 'https://forecast.weather.gov/MapClick.php?CityName=Terrebonne&state=OR&site=PDT' },
      { label: 'TripCheck Oregon ↗', url: 'https://www.tripcheck.com/' },
    ],
  },

  'squamish-chief': {
    name: 'The Chief', region: 'Squamish, BC / Hwy 99',
    lat: 49.6928, lng: -123.1471,
    rock_type: 'Granite', aspect: 'West', sun_bearing: 270, elevation: '2,100 ft',
    drying_speed: 'Slow', season: 'May–Oct',
    description: "The Stawamus Chief is a massive granite dome above Squamish offering world-class multi-pitch and single-pitch climbing. West-facing walls catch afternoon sun, but Squamish's heavy coastal rainfall means extended drying — typically 2–4 days after significant rain. Factor extra drying time vs. eastern Cascades crags.",
    links: [
      { label: 'Squamish Access Society ↗', url: 'https://www.squamishaccess.ca/' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@49.69282248,-123.14711697,29.81851037a,8320.92059877d,35y,151.12667439h' },
      { label: 'NWAC Forecast ↗',           url: 'https://nwac.us/avalanche-forecast/#/all/' },
      { label: 'DriveBC (Hwy 99) ↗',        url: 'https://www.drivebc.ca/?pan=-123.19392500000001%2C49.48295352928807&zoom=10.450012356646624&start=Vancouver%2C%20BC&end=Squamish%2C%20BC' },
    ],
  },

  'squamish-smoke-bluffs': {
    name: 'Smoke Bluffs', region: 'Squamish, BC / Hwy 99',
    lat: 49.7078, lng: -123.1341,
    rock_type: 'Granite', aspect: 'Mixed', elevation: '600 ft',
    drying_speed: 'Moderate', season: 'Apr–Oct',
    description: "The Smoke Bluffs are a network of granite bluffs woven through the town of Squamish, offering accessible single-pitch climbing within walking distance of downtown. Aspects vary wall to wall — some dry quickly in afternoon sun while others stay damp for days after rain. A great option when The Chief is still drying out.",
    links: [
      { label: 'Squamish Access Society ↗', url: 'https://www.squamishaccess.ca/' },
      { label: 'Google Earth ↗', url: 'https://earth.google.com/web/@49.70783175,-123.13414614,213.58369658a,1469.41631823d,65y,39.58799107h' },
      { label: 'NWAC Forecast ↗',           url: 'https://nwac.us/avalanche-forecast/#/all/' },
      { label: 'DriveBC (Hwy 99) ↗',        url: 'https://www.drivebc.ca/?pan=-123.19392500000001%2C49.48295352928807&zoom=10.450012356646624&start=Vancouver%2C%20BC&end=Squamish%2C%20BC' },
    ],
  },

  'miller-river': {
    name: 'Miller River Boulders', region: 'Skykomish / US-2',
    lat: 47.6677, lng: -121.3911,
    rock_type: 'Granodiorite', aspect: 'Mixed', elevation: '1,266 ft',
    gauge_id: '12134500', gauge_name: 'Skykomish River (proxy)',
    drying_speed: 'Slow', season: 'May–Oct',
    description: "A deep forest bouldering sanctuary tucked into the Skykomish River valley. Six sub-areas — Morpheus, Paradise, Prospect, Hideout, Jungle Gym, and Apex — spread across 205 problems on featured granodiorite. The old-growth setting is stunning but holds moisture; plan for 2–3 dry days minimum after rain.",
    links: [
      { label: 'Mountain Project ↗',    url: 'https://www.mountainproject.com/area/120379690/miller-river-boulders' },
      { label: 'Google Earth ↗',        url: 'https://earth.google.com/web/@47.66767577,-121.39112656,414.31892744a,4993.75470187d,35y,277.80123667h' },
      { label: '⚠️ Terrain Above — NWAC Forecast ↗', url: 'https://nwac.us/avalanche-forecast/#/stevens-pass/' },
      { label: 'Stevens Pass (US-2) ↗', url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens' },
    ],
  },

};

// CommonJS export for Node/GitHub Actions build context
if (typeof module !== 'undefined') module.exports = { CRAG_META };
