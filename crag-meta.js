// COMMUNITY INPUT NEEDED 

/**
 * crag-meta.js
 * BETA — beta.trenigma.dev
 *
 * Single source of truth for crag metadata.
 * Import/include this file in each tools/*.html page and index.html.
 *
 * MAINTENANCE:
 *   - To update a description, aspect, or rock type → edit this file only.
 *   - To add a new crag → add an entry here, then reference CRAG_META[id] in the page.
 *
 * FIELDS:
 *   name         Display name
 *   region       Region label shown on card
 *   rock_type    Rock type(s), used in drying logic copy and crag detail pages
 *   aspect       Primary wall aspect(s) — affects sun exposure & drying time framing
 *   season       Best climbing months
 *   description  Short crag description for the detail page header (2–4 sentences)
 *   notes        Optional: access notes, special conditions, etc.
 *
 * ASPECT KEY:
 *   N / S / E / W / NE / NW / SE / SW
 *   "Mixed" = multiple walls with varying aspects (e.g. Leavenworth)
 *
 * ⚠️  VERIFY: Fields marked [VERIFY] are best-guess — please confirm before shipping.
 */

const CRAG_META = {

  'index': {
    name:        'Index Town Wall',
    region:      'Index, WA',
    rock_type:   'Granite',
    aspect:      'W',             // Town Wall faces west — afternoon sun
    season:      'May–Oct',
    description: 'Index Town Wall is a towering west-facing granite wall above the Skykomish River. It\'s one of Washington\'s premier trad and sport venues, known for its quality crack climbing and steep faces. The west aspect means morning shade and afternoon sun — walls dry relatively quickly after rain given good sun exposure from midday on.',
    notes:       'Lower Wall dries faster than Upper Wall. River Road access — check seasonal closures.',
  },

  'leavenworth': {
    name:        'Leavenworth',
    region:      'Leavenworth, WA',
    rock_type:   'Granite',
    aspect:      'Mixed',         // [VERIFY] — Icicle Canyon has many walls; varies by area
    season:      'Apr–Nov',
    description: 'Leavenworth is a granite mecca in the eastern Cascades with dozens of crags across Icicle Canyon and beyond. Wall aspects vary significantly — some crags catch morning sun while others bake in the afternoon. The drier east-side climate means faster drying times than west-side PNW crags.',
    notes:       '[VERIFY] Refine aspect per sub-area (Castle Rock, Peshastin, Barney\'s Rubble, etc.) if splitting out in the future.',
  },

  'vantage': {
    name:        'Frenchman Coulee',
    region:      'Vantage, WA',
    rock_type:   'Basalt',
    aspect:      'W',             // [VERIFY] — Feathers and main columns face roughly west
    season:      'Mar–Jun, Sep–Nov',
    description: 'Frenchman Coulee offers striking basalt columns above the Columbia River, best known for The Feathers — a collection of freestanding crack towers. The desert setting means rapid drying and wide temperature swings. Spring and fall are prime; summer heat and winter cold both push the limits.',
    notes:       'Basalt dries faster than granite. Wind is a significant factor at Vantage.',
  },

  'little-si': {
    name:        'Little Si',
    region:      'North Bend, WA',
    rock_type:   'Andesite',      // [VERIFY] — confirm rock type; may be granodiorite or mixed
    aspect:      'SW',            // [VERIFY]
    season:      'May–Oct',
    description: 'Little Si offers accessible Pacific Northwest climbing close to Seattle. Expect mossy rock and extended drying times typical of the west Cascades — plan for at least 2–3 dry days after significant rain before rock is climbable.',
    notes:       '[VERIFY] Rock type and aspect — less documentation available for this crag.',
  },

  'mt-erie': {
    name:        'Mt. Erie',
    region:      'Anacortes, WA',
    rock_type:   'Granite',
    aspect:      'Mixed',         // [VERIFY] — multiple faces around the summit
    season:      'Apr–Oct',
    description: 'Mt. Erie sits above Anacortes with views across the San Juans. The granite here is generally solid and the island setting means it can catch drying winds off the water, though maritime moisture keeps it wetter than east-side crags. Multiple aspects mean some walls dry faster than others.',
    notes:       '[VERIFY] Confirm primary climbing walls and their aspects.',
  },

  'peshastin': {
    name:        'Peshastin Pinnacles',
    region:      'Peshastin, WA',
    rock_type:   'Sandstone',
    aspect:      'S',             // [VERIFY] — south-facing slopes in the orchard valley
    season:      'Mar–Oct',
    description: 'Peshastin Pinnacles is one of the few sandstone crags in Washington, tucked into a dry orchard valley near Leavenworth. The south-facing exposure and east-side rain shadow mean early season access and fast drying — one of the first crags in the region to come into shape each spring.',
    notes:       'Sandstone is especially sensitive to rain — avoid climbing on wet sandstone, which damages the rock. Wait 24–48h after any rain.',
  },

  'exit-38': {
    name:        'Exit 38',
    region:      'North Bend, WA',
    rock_type:   'Basalt',
    aspect:      'SE',            // [VERIFY] — walls generally face SE toward the valley
    season:      'May–Oct',
    description: 'Exit 38 is Seattle\'s closest basalt sport climbing venue, just off I-90 in the Cascade foothills. The basalt columns dry faster than the granite and andesite crags further west, but the heavy west Cascade rainfall means extended drying windows are still common. A good bet on the first clear day after a dry stretch.',
    notes:       'Popular — can be crowded on weekends. Basalt dries faster than granite.',
  },

  'castle-rock': {
    name:        'Castle Rock',
    region:      'Leavenworth, WA',
    rock_type:   'Granite',
    aspect:      'S',             // [VERIFY] — main face is broadly south-facing
    season:      'Apr–Nov',
    description: 'Castle Rock is a classic Leavenworth granite dome in lower Icicle Canyon, known for moderate multi-pitch routes on clean rock. The south-facing aspect means generous sun exposure and relatively fast drying compared to west-side crags. A go-to early and late season destination.',
    notes:       'One of the most popular crags in Leavenworth — arrive early on weekends.',
  },

  'smith-rock': {
    name:        'Smith Rock',
    region:      'Terrebonne, OR',
    rock_type:   'Volcanic tuff',
    aspect:      'Mixed',         // Mixed — Morning Rock faces E, Christian Brothers face W, etc.
    season:      'Mar–Jun, Sep–Nov',
    description: 'Smith Rock State Park is the birthplace of American sport climbing, featuring dramatic volcanic tuff and basalt above the Crooked River. Wall aspects vary widely across the park — Morning Rock catches early sun while the Dihedrals stay shaded until afternoon. The high desert location means fast drying but extreme heat in summer and cold mornings in winter.',
    notes:       'Summer midday heat can be extreme — plan for early morning or evening climbing Jun–Aug.',
  },

  'squamish-chief': {
    name:        'The Chief',
    region:      'Squamish, BC',
    rock_type:   'Granite',
    aspect:      'W',             // [VERIFY] — main faces are broadly west-facing
    season:      'May–Oct',
    description: 'The Stawamus Chief is a massive granite dome above Squamish offering world-class multi-pitch and single-pitch climbing. The west-facing walls catch afternoon sun but Squamish\'s heavy coastal rainfall means extended drying windows — typically 2–4 days after significant rain before the main faces are climbable.',
    notes:       'First international BETA crag. Squamish dries slower than eastern Cascades — factor extra drying time.',
  },

  'squamish-smoke-bluffs': {
    name:        'Smoke Bluffs',
    region:      'Squamish, BC',
    rock_type:   'Granite',
    aspect:      'Mixed',         // Mixed — multiple walls face various directions through the bluffs
    season:      'Apr–Oct',
    description: 'The Smoke Bluffs are a network of granite bluffs woven through the town of Squamish, offering accessible single-pitch climbing within walking distance of downtown. The varied aspects and tree cover mean some walls dry quickly while others stay damp — local knowledge matters here.',
    notes:       'Some walls get afternoon sun and dry faster. Others face north and stay wet for days. Great option when The Chief is still drying.',
  },

};

// Export for use in Node/GitHub Actions build context
if (typeof module !== 'undefined') module.exports = { CRAG_META };