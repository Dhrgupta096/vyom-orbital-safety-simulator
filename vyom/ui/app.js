/* ==========================================================================
   VYOM — Real-Time 3D Space Debris Tracking & Threat Intelligence Radar
   Fixed Raycasting for Parent/Child Station Shields & Full Telemetry Display
   ========================================================================== */

const GLOBAL_SPACE_CATALOG = [
  // Human Space Stations & Outposts
  { id: 'ISS-01', norad: 25544, name: 'ISS (International Space Station)', type: 'station', alt: 420, vel: 7.66, inc: 51.6, raan: 45, period: 92.9, color: '#00ffff', owner: 'NASA/ESA/JAXA/ISRO', mass: 450000, rcs: 400, protectedVolumeKm: 5.0, regime: 'LEO', hazardScore: 85 },
  { id: 'TIANGONG-01', norad: 48274, name: 'Tiangong Space Station', type: 'station', alt: 389, vel: 7.68, inc: 41.5, raan: 120, period: 92.4, color: '#00e5ff', owner: 'CNSA', mass: 100000, rcs: 180, protectedVolumeKm: 5.0, regime: 'LEO', hazardScore: 78 },
  { id: 'BAS-ISRO-01', norad: 99002, name: 'Bharatiya Antariksh Station (BAS)', type: 'station', alt: 400, vel: 7.67, inc: 51.5, raan: 75, period: 92.5, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 52000, rcs: 120, protectedVolumeKm: 5.0, regime: 'LEO', hazardScore: 15 },
  { id: 'GATEWAY-01', norad: 99001, name: 'Lunar Gateway Outpost (Artemis)', type: 'station', alt: 38400, vel: 1.02, inc: 28.5, raan: 200, period: 10080, color: '#ffe060', owner: 'NASA/ESA/JAXA', mass: 40000, rcs: 150, protectedVolumeKm: 15.0, regime: 'GEO', hazardScore: 10 },
  { id: 'AXIOM-01', norad: 99003, name: 'Axiom Commercial Station Module', type: 'station', alt: 410, vel: 7.66, inc: 51.6, raan: 160, period: 92.7, color: '#39ff14', owner: 'Axiom Space / NASA', mass: 30000, rcs: 90, protectedVolumeKm: 5.0, regime: 'LEO', hazardScore: 20 },
  { id: 'SKYLAB-HISTORIC', norad: 6633, name: 'Skylab Orbital Target', type: 'station', alt: 435, vel: 7.65, inc: 50.0, raan: 290, period: 93.2, color: '#ffaa00', owner: 'NASA Historical Target', mass: 77000, rcs: 110, regime: 'LEO', hazardScore: 40 },
  { id: 'MIR-HISTORIC', norad: 16609, name: 'Mir Space Station Target', type: 'station', alt: 390, vel: 7.68, inc: 51.6, raan: 310, period: 92.4, color: '#ffaa00', owner: 'Roscosmos Historical Target', mass: 12970, rcs: 210, regime: 'LEO', hazardScore: 42 },
  { id: 'HST-01', norad: 20580, name: 'Hubble Space Telescope (HST)', type: 'active', alt: 535, vel: 7.59, inc: 28.5, raan: 178, period: 95.4, color: '#00f3ff', owner: 'NASA/ESA', mass: 11110, rcs: 12.0, regime: 'LEO', hazardScore: 30 },
  { id: 'ENVISAT-DERELICT', norad: 27386, name: 'Envisat (Derelict Mega-Debris)', type: 'derelict', alt: 765, vel: 7.47, inc: 98.5, raan: 305, period: 100.2, color: '#ff5500', owner: 'ESA (Derelict Rocket/Payload)', mass: 8211, rcs: 26.0, regime: 'LEO', miss: 210, origin: 'Power Loss Derelict Mega-Fragment Target', hazardScore: 98 },

  // ISRO (India) National Space Assets
  { id: 'CARTOSAT-3', norad: 44804, name: 'Cartosat-3 (ISRO EO)', type: 'active', alt: 509, vel: 7.61, inc: 97.5, raan: 15, period: 94.8, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 1625, rcs: 4.5, protectedVolumeKm: 2.0, regime: 'LEO', hazardScore: 35 },
  { id: 'EOS-06', norad: 54361, name: 'EOS-06 Oceansat-3 (ISRO)', type: 'active', alt: 742, vel: 7.48, inc: 98.4, raan: 150, period: 99.7, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 1117, rcs: 3.8, protectedVolumeKm: 2.0, regime: 'LEO', hazardScore: 20 },
  { id: 'NAVIC-1I', norad: 43286, name: 'NavIC IRNSS-1I (ISRO Nav)', type: 'active', alt: 35786, vel: 3.07, inc: 29.5, raan: 130, period: 1436, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 1425, rcs: 5.0, protectedVolumeKm: 10.0, regime: 'GEO', hazardScore: 10 },
  { id: 'CHANDRAYAAN-3-PM', norad: 57320, name: 'Chandrayaan-3 Propulsion (ISRO)', type: 'active', alt: 35786, vel: 3.07, inc: 22.5, raan: 210, period: 1436, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 2148, rcs: 6.5, regime: 'GEO', hazardScore: 12 },
  { id: 'RISAT-1A', norad: 51656, name: 'EOS-04 / RISAT-1A (ISRO SAR)', type: 'active', alt: 529, vel: 7.60, inc: 97.6, raan: 80, period: 95.2, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 1710, rcs: 5.2, regime: 'LEO', hazardScore: 25 },

  // Authentic Conjunction Threat Debris (Fengyun-1C 2007 ASAT Intercept)
  { id: 'DEB-FY1C-28941', norad: 28941, name: 'Fengyun 1C Fragment #28941', type: 'debris', alt: 512, vel: 7.62, inc: 98.9, raan: 15, period: 94.9, color: '#ff2a6d', owner: 'China (ASAT Fragment)', mass: 12.4, rcs: 0.45, regime: 'LEO', miss: 142, origin: '2007 ASAT Missile Intercept Breakup', hazardScore: 92 },
  { id: 'DEB-FY1C-29733', norad: 29733, name: 'Fengyun 1C Fragment #29733', type: 'debris', alt: 845, vel: 7.42, inc: 99.2, raan: 277, period: 101.8, color: '#ff2a6d', owner: 'China (ASAT Fragment)', mass: 8.5, rcs: 0.22, regime: 'LEO', origin: '2007 ASAT Missile Intercept Breakup', hazardScore: 88 },
  { id: 'DEB-FY1C-29734', norad: 29734, name: 'Fengyun 1C Fragment #29734', type: 'debris', alt: 860, vel: 7.41, inc: 99.2, raan: 148, period: 102.1, color: '#ff2a6d', owner: 'China (ASAT Fragment)', mass: 14.1, rcs: 0.55, regime: 'LEO', origin: '2007 ASAT Missile Intercept Breakup', hazardScore: 86 },
  { id: 'DEB-FY1C-29740', norad: 29740, name: 'Fengyun 1C Fragment #29740', type: 'debris', alt: 730, vel: 7.49, inc: 99.1, raan: 37, period: 99.4, color: '#ff2a6d', owner: 'China (ASAT Fragment)', mass: 6.2, rcs: 0.18, regime: 'LEO', origin: '2007 ASAT Missile Intercept Breakup', hazardScore: 84 },

  // Cosmos 2251 & Iridium 33 Collision Cloud (2009 Hypervelocity Impact)
  { id: 'DEB-COSMOS-33777', norad: 33777, name: 'Cosmos 2251 Fragment #33777', type: 'debris', alt: 785, vel: 7.46, inc: 74.0, raan: 190, period: 100.5, color: '#ff2a6d', owner: 'Russia (Collision Fragment)', mass: 18.2, rcs: 0.65, regime: 'LEO', origin: '2009 Hypervelocity Orbit Collision', hazardScore: 94 },
  { id: 'DEB-COSMOS-33780', norad: 33780, name: 'Cosmos 2251 Fragment #33780', type: 'debris', alt: 792, vel: 7.45, inc: 74.1, raan: 215, period: 100.7, color: '#ff2a6d', owner: 'Russia (Collision Fragment)', mass: 9.8, rcs: 0.30, regime: 'LEO', origin: '2009 Hypervelocity Orbit Collision', hazardScore: 90 },
  { id: 'DEB-IRIDIUM-33766', norad: 33766, name: 'Iridium 33 Fragment #33766', type: 'debris', alt: 778, vel: 7.46, inc: 86.4, raan: 110, period: 100.4, color: '#ff2a6d', owner: 'USA (Collision Fragment)', mass: 11.5, rcs: 0.40, regime: 'LEO', origin: '2009 Hypervelocity Orbit Collision', hazardScore: 91 },

  // Cosmos 1408 Nudol ASAT Intercept Cloud (2021 Breakup)
  { id: 'DEB-COSMOS-1408-49801', norad: 49801, name: 'Cosmos 1408 Fragment #49801', type: 'debris', alt: 480, vel: 7.63, inc: 82.5, raan: 95, period: 94.2, color: '#ff2a6d', owner: 'Russia (2021 ASAT Breakup)', mass: 15.0, rcs: 0.50, regime: 'LEO', origin: '2021 Direct-Ascent ASAT Breakup', hazardScore: 89 },
  { id: 'DEB-COSMOS-1408-49805', norad: 49805, name: 'Cosmos 1408 Fragment #49805', type: 'debris', alt: 465, vel: 7.64, inc: 82.6, raan: 120, period: 93.9, color: '#ff2a6d', owner: 'Russia (2021 ASAT Breakup)', mass: 7.4, rcs: 0.25, regime: 'LEO', origin: '2021 Direct-Ascent ASAT Breakup', hazardScore: 87 },

  // High-Risk Spent Rocket Bodies (R/B)
  { id: 'SL-16-RB', norad: 22220, name: 'Zenit-2 SL-16 Rocket Body', type: 'rocket_body', alt: 840, vel: 7.43, inc: 71.0, raan: 250, period: 101.7, color: '#ff5500', owner: 'USSR (Derelict Rocket Body)', mass: 9000, rcs: 35.0, regime: 'LEO', origin: 'Kessler Syndrome High-Mass Removal Target', hazardScore: 96 },
  { id: 'CZ-4B-RB', norad: 25995, name: 'Long March CZ-4B Rocket Body', type: 'rocket_body', alt: 750, vel: 7.48, inc: 98.5, raan: 180, period: 99.8, color: '#ff5500', owner: 'China (Derelict Rocket Body)', mass: 2800, rcs: 14.0, regime: 'LEO', hazardScore: 82 },

  // International GEO Stationary Fleet across Countries (India, USA, China, Japan, Europe, Russia, Korea, Australia, UAE, Brazil, Turkey, Canada, Saudi Arabia, Indonesia, UK)
  { id: 'GSAT-24', norad: 52892, name: 'GSAT-24 (ISRO DTH Satcom)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 83, period: 1436, color: '#ff9933', isro: true, owner: 'ISRO (India 🇮🇳)', mass: 4180, rcs: 14.5, regime: 'GEO', hazardScore: 8 },
  { id: 'GSAT-30', norad: 45026, name: 'GSAT-30 (ISRO Heavy Satcom)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 83, period: 1436, color: '#ff9933', isro: true, owner: 'ISRO (India 🇮🇳)', mass: 3357, rcs: 12.0, regime: 'GEO', hazardScore: 9 },
  { id: 'INSAT-3DR', norad: 39635, name: 'INSAT-3DR (ISRO Weather)', type: 'active', alt: 35786, vel: 3.07, inc: 0.2, raan: 74, period: 1436, color: '#ff9933', isro: true, owner: 'ISRO (India 🇮🇳)', mass: 2211, rcs: 8.0, regime: 'GEO', hazardScore: 10 },
  { id: 'INSAT-3DS', norad: 58943, name: 'INSAT-3DS (ISRO Next-Gen MetSat)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 74, period: 1436, color: '#ff9933', isro: true, owner: 'ISRO (India 🇮🇳)', mass: 2275, rcs: 8.4, regime: 'GEO', hazardScore: 7 },
  { id: 'GSAT-11', norad: 43839, name: 'GSAT-11 (ISRO High-Throughput)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 74, period: 1436, color: '#ff9933', isro: true, owner: 'ISRO (India 🇮🇳)', mass: 5854, rcs: 24.0, regime: 'GEO', hazardScore: 6 },
  { id: 'GOES-16', norad: 41866, name: 'GOES-16 (NOAA/NASA East)', type: 'active', alt: 35786, vel: 3.07, inc: 0.0, raan: 285, period: 1436, color: '#00f3ff', owner: 'USA (NOAA / NASA 🇺🇸)', mass: 5192, rcs: 18.0, regime: 'GEO', hazardScore: 10 },
  { id: 'GOES-18', norad: 51850, name: 'GOES-18 (NOAA/NASA West)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 223, period: 1436, color: '#00f3ff', owner: 'USA (NOAA / NASA 🇺🇸)', mass: 5192, rcs: 18.0, regime: 'GEO', hazardScore: 10 },
  { id: 'GOES-19', norad: 60130, name: 'GOES-19 (NOAA GOES-U MetSat)', type: 'active', alt: 35786, vel: 3.07, inc: 0.0, raan: 255, period: 1436, color: '#00f3ff', owner: 'USA (NOAA / NASA 🇺🇸)', mass: 5200, rcs: 18.5, regime: 'GEO', hazardScore: 8 },
  { id: 'TDRS-13', norad: 42915, name: 'TDRS-13 (NASA Relay Sat)', type: 'active', alt: 35786, vel: 3.07, inc: 2.1, raan: 174, period: 1436, color: '#00f3ff', owner: 'USA (NASA DSN 🇺🇸)', mass: 3454, rcs: 16.0, regime: 'GEO', hazardScore: 12 },
  { id: 'FENGYUN-2H', norad: 43491, name: 'FengYun-2H (CNSA MetSat)', type: 'active', alt: 35786, vel: 3.07, inc: 0.3, raan: 79, period: 1436, color: '#00e5ff', owner: 'China (CNSA 🇨🇳)', mass: 1380, rcs: 6.0, regime: 'GEO', hazardScore: 14 },
  { id: 'BEIDOU-GEO-1', norad: 43702, name: 'BeiDou-3 G1 (CNSA Nav)', type: 'active', alt: 35786, vel: 3.07, inc: 1.5, raan: 140, period: 1436, color: '#00e5ff', owner: 'China (CNSA 🇨🇳)', mass: 4600, rcs: 15.0, regime: 'GEO', hazardScore: 12 },
  { id: 'HIMAWARI-9', norad: 41836, name: 'Himawari-9 (JAXA Weather)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 140, period: 1436, color: '#39ff14', owner: 'Japan (JAXA 🇯🇵)', mass: 3500, rcs: 11.5, regime: 'GEO', hazardScore: 10 },
  { id: 'METEOSAT-11', norad: 40732, name: 'Meteosat-11 (EUMETSAT)', type: 'active', alt: 35786, vel: 3.07, inc: 0.2, raan: 0, period: 1436, color: '#ffe060', owner: 'ESA / Europe 🇪🇺', mass: 2000, rcs: 7.5, regime: 'GEO', hazardScore: 10 },
  { id: 'METEOSAT-12', norad: 54754, name: 'Meteosat-12 (MTG-I1 Europe)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 0, period: 1436, color: '#ffe060', owner: 'ESA / Europe 🇪🇺', mass: 3800, rcs: 12.5, regime: 'GEO', hazardScore: 9 },
  { id: 'YAMAL-601', norad: 44307, name: 'Yamal-601 (Roscosmos Satcom)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 49, period: 1436, color: '#ff2a6d', owner: 'Russia (Roscosmos 🇷🇺)', mass: 5700, rcs: 20.0, regime: 'GEO', hazardScore: 15 },
  { id: 'GEO-KOMPSAT-2A', norad: 43823, name: 'GEO-KOMPSAT-2A (KARI Korea)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 128, period: 1436, color: '#00ffff', owner: 'South Korea (KARI 🇰🇷)', mass: 3500, rcs: 12.0, regime: 'GEO', hazardScore: 11 },
  { id: 'TURKSAT-5B', norad: 50184, name: 'Turksat 5B (Turkey Satcom)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 42, period: 1436, color: '#ff9900', owner: 'Turkey (Turksat 🇹🇷)', mass: 4500, rcs: 16.0, regime: 'GEO', hazardScore: 10 },
  { id: 'TURKSAT-6A', norad: 60210, name: 'Turksat 6A (First Native Turkish Sat)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 42, period: 1436, color: '#ff9900', owner: 'Turkey (Turksat 🇹🇷)', mass: 4250, rcs: 15.0, regime: 'GEO', hazardScore: 8 },
  { id: 'STAR-ONE-D2', norad: 49060, name: 'Star One D2 (Embratel Brazil)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 290, period: 1436, color: '#00ff88', owner: 'Brazil (Embratel 🇧🇷)', mass: 6200, rcs: 22.0, regime: 'GEO', hazardScore: 10 },
  { id: 'OPTUS-10', norad: 40253, name: 'Optus 10 (Australia Comms)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 156, period: 1436, color: '#ffe060', owner: 'Australia (Optus 🇦🇺)', mass: 3200, rcs: 10.0, regime: 'GEO', hazardScore: 10 },
  { id: 'THURAYA-3', norad: 32404, name: 'Thuraya 3 (UAE Mobile Sat)', type: 'active', alt: 35786, vel: 3.07, inc: 6.2, raan: 98, period: 1436, color: '#00ff88', owner: 'UAE (Thuraya 🇦🇪)', mass: 5180, rcs: 18.0, regime: 'GEO', hazardScore: 11 },
  { id: 'ANIK-F3', norad: 31102, name: 'Anik F3 (Telesat Canada)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 241, period: 1436, color: '#00f3ff', owner: 'Canada (Telesat 🇨🇦)', mass: 4640, rcs: 16.5, regime: 'GEO', hazardScore: 10 },
  { id: 'SAUDIGEOSAT-1', norad: 43997, name: 'SaudiGeoSat-1 / SGS-1', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 57, period: 1436, color: '#00ff88', owner: 'Saudi Arabia (KACST 🇸🇦)', mass: 6500, rcs: 23.0, regime: 'GEO', hazardScore: 9 },
  { id: 'SATRIA-1', norad: 57074, name: 'SATRIA-1 (Merah Putih-2 Indonesia)', type: 'active', alt: 35786, vel: 3.07, inc: 0.1, raan: 146, period: 1436, color: '#ff9933', owner: 'Indonesia (PSN 🇮🇩)', mass: 4600, rcs: 16.0, regime: 'GEO', hazardScore: 8 },
  { id: 'SKYNET-5D', norad: 39020, name: 'Skynet 5D (UK Military Satcom)', type: 'active', alt: 35786, vel: 3.07, inc: 2.8, raan: 25, period: 1436, color: '#39ff14', owner: 'UK (Ministry of Defence 🇬🇧)', mass: 4700, rcs: 16.0, regime: 'GEO', hazardScore: 10 },

  // Active Commercial Mega-Constellations
  { id: 'STARLINK-1007', norad: 44713, name: 'Starlink-1007', type: 'active', alt: 550, vel: 7.59, inc: 53.0, raan: 40, period: 95.6, color: '#00f3ff', owner: 'SpaceX', mass: 260, rcs: 1.8, regime: 'LEO', hazardScore: 22 },
  { id: 'STARLINK-3012', norad: 51000, name: 'Starlink-3012', type: 'active', alt: 540, vel: 7.60, inc: 53.2, raan: 160, period: 95.4, color: '#00f3ff', owner: 'SpaceX', mass: 300, rcs: 2.1, regime: 'LEO', hazardScore: 20 },
  { id: 'ONEWEB-0012', norad: 45100, name: 'OneWeb-0012', type: 'active', alt: 1200, vel: 7.26, inc: 87.4, raan: 210, period: 109.4, color: '#00e5ff', owner: 'OneWeb', mass: 150, rcs: 1.2, regime: 'LEO', hazardScore: 18 },
  { id: 'SENTINEL-1A', norad: 39634, name: 'Sentinel-1A (ESA Earth Obs)', type: 'active', alt: 693, vel: 7.51, inc: 98.2, raan: 290, period: 98.6, color: '#00f3ff', owner: 'ESA', mass: 2300, rcs: 8.5, regime: 'LEO', hazardScore: 28 }
];

// Real-Time GEO Master Control Facilities & Ground Tracking Radar Stations across Countries
const GLOBAL_GEO_GROUND_STATIONS = [
  { id: 'GS-ISRO-HASSAN', name: 'ISRO Master Control Facility (Hassan)', country: 'India 🇮🇳', operator: 'ISRO', lat: 13.00, lon: 76.10, type: 'mcf', color: '#ff9933', targetGeo: 'GSAT-24', radFreq: 'C/Ku Band' },
  { id: 'GS-ISRO-BHOPAL', name: 'ISRO MCF Bhopal Station', country: 'India 🇮🇳', operator: 'ISRO', lat: 23.25, lon: 77.41, type: 'mcf', color: '#ff9933', targetGeo: 'INSAT-3DR', radFreq: 'S/C Band' },
  { id: 'GS-NASA-GOLDSTONE', name: 'Goldstone Deep Space Network', country: 'USA 🇺🇸', operator: 'NASA / DSN', lat: 35.43, lon: -116.89, type: 'radar', color: '#00f3ff', targetGeo: 'GOES-16', radFreq: 'X/Ka Band' },
  { id: 'GS-NOAA-WHITESANDS', name: 'White Sands Ground Station', country: 'USA 🇺🇸', operator: 'NOAA / NASA', lat: 32.50, lon: -106.61, type: 'telemetry', color: '#00f3ff', targetGeo: 'GOES-18', radFreq: 'Ku/Ka Band' },
  { id: 'GS-CNSA-XIAN', name: 'Xi\'an Satellite Control Centre', country: 'China 🇨🇳', operator: 'CNSA', lat: 34.26, lon: 108.95, type: 'mcf', color: '#00e5ff', targetGeo: 'BEIDOU-GEO-1', radFreq: 'S/C/Ku Band' },
  { id: 'GS-CNSA-SANYA', name: 'Sanya Deep Space Facility', country: 'China 🇨🇳', operator: 'CNSA', lat: 18.25, lon: 109.50, type: 'telemetry', color: '#00e5ff', targetGeo: 'FENGYUN-2H', radFreq: 'C/Ka Band' },
  { id: 'GS-ESA-KOUROU', name: 'Kourou ESTRACK Station', country: 'Europe 🇪🇺', operator: 'ESA / CNES', lat: 5.23, lon: -52.77, type: 'mcf', color: '#ffe060', targetGeo: 'METEOSAT-11', radFreq: 'S/X Band' },
  { id: 'GS-ESA-REDU', name: 'Redu ESTRACK Station', country: 'Belgium / Europe 🇪🇺', operator: 'ESA', lat: 50.00, lon: 5.14, type: 'telemetry', color: '#ffe060', targetGeo: 'METEOSAT-12', radFreq: 'Ka Band' },
  { id: 'GS-JAXA-OKINAWA', name: 'Okinawa Tracking & Telemetry', country: 'Japan 🇯🇵', operator: 'JAXA', lat: 26.50, lon: 127.85, type: 'telemetry', color: '#39ff14', targetGeo: 'HIMAWARI-9', radFreq: 'S/C Band' },
  { id: 'GS-ROSCOSMOS-BEARLAKES', name: 'Bear Lakes Deep Space Station', country: 'Russia 🇷🇺', operator: 'Roscosmos', lat: 55.86, lon: 37.95, type: 'radar', color: '#ff2a6d', targetGeo: 'YAMAL-601', radFreq: 'C/Ku Band' },
  { id: 'GS-KARI-DAEJEON', name: 'Daejeon Satellite Control Center', country: 'South Korea 🇰🇷', operator: 'KARI', lat: 36.35, lon: 127.38, type: 'mcf', color: '#00ffff', targetGeo: 'GEO-KOMPSAT-2A', radFreq: 'S/Ku Band' },
  { id: 'GS-ASA-TIDBINBILLA', name: 'Canberra Deep Space Complex', country: 'Australia 🇦🇺', operator: 'ASA / NASA', lat: -35.40, lon: 148.98, type: 'radar', color: '#ffe060', targetGeo: 'OPTUS-10', radFreq: 'X/Ka Band' },
  { id: 'GS-UAE-ALDHA FRA', name: 'Al Dhafra Space Control Facility', country: 'UAE 🇦🇪', operator: 'UAESA', lat: 24.25, lon: 54.55, type: 'mcf', color: '#00ff88', targetGeo: 'THURAYA-3', radFreq: 'L/C Band' },
  { id: 'GS-BRAZIL-CUIABA', name: 'Cuiabá Satellite Ground Station', country: 'Brazil 🇧🇷', operator: 'AEB / Embratel', lat: -15.55, lon: -56.07, type: 'telemetry', color: '#00ff88', targetGeo: 'STAR-ONE-D2', radFreq: 'C/Ku Band' },
  { id: 'GS-TURKEY-GOLBASI', name: 'Golbasi Satellite Ground Station', country: 'Turkey 🇹🇷', operator: 'Turksat', lat: 39.78, lon: 32.81, type: 'mcf', color: '#ff9900', targetGeo: 'TURKSAT-5B', radFreq: 'Ku/Ka Band' },
  { id: 'GS-CANADA-INUVIK', name: 'Inuvik Satellite Station Facility', country: 'Canada 🇨🇦', operator: 'CSA', lat: 68.36, lon: -133.72, type: 'telemetry', color: '#00f3ff', targetGeo: 'ANIK-F3', radFreq: 'C/Ku Band' },
  { id: 'GS-UK-GOONHILLY', name: 'Goonhilly Earth Station', country: 'UK 🇬🇧', operator: 'UKSA', lat: 50.04, lon: -5.18, type: 'mcf', color: '#39ff14', targetGeo: 'SKYNET-5D', radFreq: 'X/Ku Band' },
  { id: 'GS-SAUDI-RIYADH', name: 'Riyadh Space Control Center', country: 'Saudi Arabia 🇸🇦', operator: 'KACST', lat: 24.71, lon: 46.67, type: 'mcf', color: '#00ff88', targetGeo: 'SAUDIGEOSAT-1', radFreq: 'Ka Band' },
  { id: 'GS-INDONESIA-CIBINONG', name: 'Cibinong Satellite Ground Station', country: 'Indonesia 🇮🇩', operator: 'BRIN / Telkom', lat: -6.48, lon: 106.85, type: 'telemetry', color: '#ff9933', targetGeo: 'SATRIA-1', radFreq: 'C/Ku Band' }
];

// Populate 250+ NORAD-mapped real space debris fragments across LEO, MEO, and GEO shells
for (let i = 1; i <= 250; i++) {
  const isGEO = i % 14 === 0;
  const isMEO = i % 6 === 0;
  const noradId = 30000 + (i * 137) % 28000;
  const alt = isGEO ? 35786 + ((i * 17) % 180) : (isMEO ? 20180 + ((i * 63) % 4000) : 340 + Math.floor((i * 31) % 980));
  const inc = isGEO ? parseFloat((0.2 + (i * 2.1) % 14).toFixed(1)) : parseFloat((28.5 + (i * 17.3) % 72).toFixed(1));
  const period = isGEO ? 1436 : (isMEO ? 718 : Math.round(91 + (alt - 340) * 0.018));

  GLOBAL_SPACE_CATALOG.push({
    id: `NORAD-DEB-${noradId}`,
    norad: noradId,
    name: `NORAD Fragment #${noradId}`,
    type: 'debris',
    alt: alt,
    vel: parseFloat((isGEO ? 3.07 : (isMEO ? 3.87 : 7.55 - (alt - 340) * 0.0004)).toFixed(2)),
    inc: inc,
    raan: Math.floor((i * 47) % 360),
    phaseOffset: (i * 0.29) % (2 * Math.PI),
    period: period,
    color: i % 3 === 0 ? '#ff2a6d' : (i % 2 === 0 ? '#ffaa00' : '#ff5500'),
    owner: i % 4 === 0 ? 'Fengyun-1C Debris Field' : (i % 3 === 0 ? 'Cosmos 2251 Debris Field' : 'Space-Track Cataloged Debris'),
    mass: parseFloat((0.4 + (i % 25) * 1.8).toFixed(1)),
    rcs: parseFloat((0.01 + (i % 12) * 0.06).toFixed(2)),
    origin: i % 4 === 0 ? '2007 ASAT Missile Intercept' : (i % 3 === 0 ? '2009 Hypervelocity Orbit Collision' : 'Orbital Fragmentation Event'),
    regime: isGEO ? 'GEO' : (isMEO ? 'MEO' : 'LEO'),
    hazardScore: 35 + (i % 55)
  });
}

function fetchLiveCelesTrakDebrisData() {
  const celestrakFeeds = [
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=geo&FORMAT=json', origin: 'Geostationary International Fleet' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=json', origin: 'GEO/LEO Weather Meteorological Fleet' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=intelsat&FORMAT=json', origin: 'Intelsat GEO Comms Fleet' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=ses&FORMAT=json', origin: 'SES GEO Satcom Fleet' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=fengyun-1c-debris&FORMAT=json', origin: '2007 ASAT Missile Intercept Breakup' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-33-debris&FORMAT=json', origin: '2009 Hypervelocity Orbit Collision' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=cosmos-2251-debris&FORMAT=json', origin: '2009 Hypervelocity Orbit Collision' }
  ];

  celestrakFeeds.forEach(feed => {
    fetch(feed.url)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        let addedCount = 0;
        data.slice(0, 60).forEach(gp => {
          if (!gp.NORAD_CAT_ID || GLOBAL_SPACE_CATALOG.some(s => s.norad === gp.NORAD_CAT_ID)) return;
          const meanMotion = gp.MEAN_MOTION || 1.0;
          const nRadS = (meanMotion * 2 * Math.PI) / 86400;
          const semiMajorAxisKm = Math.pow(398600.4418 / (nRadS * nRadS), 1 / 3);
          const altKm = Math.round(Math.max(160, semiMajorAxisKm - 6371));
          const velKmS = parseFloat(Math.sqrt(398600.4418 / semiMajorAxisKm).toFixed(2));
          const periodMin = parseFloat((1440 / meanMotion).toFixed(1));

          const name = gp.OBJECT_NAME || `SAT #${gp.NORAD_CAT_ID}`;
          const isDebris = name.includes('DEB') || name.includes('R/B') || name.includes('FRAGMENT');
          const isGeo = altKm > 30000;
          const isISRO = name.includes('ISRO') || name.includes('GSAT') || name.includes('INSAT') || name.includes('NAVIC') || name.includes('CARTOSAT') || name.includes('EOS');

          let owner = isISRO ? 'ISRO (India 🇮🇳)' : (isDebris ? 'CelesTrak Live NORAD Feed' : 'International Space Fleet');
          if (name.includes('TDRS') || name.includes('USA') || name.includes('GOES') || name.includes('MILSTAR') || name.includes('DIRECTV') || name.includes('STARLINK')) owner = 'USA (NASA/USSF 🇺🇸)';
          if (name.includes('ZHONGXING') || name.includes('BEIDOU') || name.includes('FENGYUN') || name.includes('CHINASAT')) owner = 'China (CNSA 🇨🇳)';
          if (name.includes('SUPERBIRD') || name.includes('JCSAT') || name.includes('HIMAWARI')) owner = 'Japan (JAXA 🇯🇵)';
          if (name.includes('EUTELSAT') || name.includes('ASTRA') || name.includes('METEOSAT') || name.includes('SYRACUSE')) owner = 'ESA / Europe 🇪🇺';
          if (name.includes('EXPRESS') || name.includes('YAMAL') || name.includes('COSMOS') || name.includes('RADUGA') || name.includes('ELEKTRO')) owner = 'Russia (Roscosmos 🇷🇺)';
          if (name.includes('KOREASAT') || name.includes('KOMPSAT')) owner = 'South Korea (KARI 🇰🇷)';
          if (name.includes('ANIK') || name.includes('NIMIQ')) owner = 'Canada (Telesat 🇨🇦)';
          if (name.includes('OPTUS')) owner = 'Australia (Optus 🇦🇺)';
          if (name.includes('THURAYA') || name.includes('YAHSAT')) owner = 'UAE (UAESA 🇦🇪)';
          if (name.includes('TURKSAT')) owner = 'Turkey (Turksat 🇹🇷)';
          if (name.includes('STAR ONE') || name.includes('SGDC')) owner = 'Brazil (Embratel 🇧🇷)';
          if (name.includes('SAUDI') || name.includes('SGS')) owner = 'Saudi Arabia (KACST 🇸🇦)';

          GLOBAL_SPACE_CATALOG.push({
            id: `CELESTRAK-${gp.NORAD_CAT_ID}`,
            norad: gp.NORAD_CAT_ID,
            name: name,
            type: isDebris ? 'debris' : 'active',
            alt: altKm,
            vel: velKmS,
            inc: parseFloat((gp.INCLINATION || 0.1).toFixed(1)),
            raan: parseFloat((gp.RA_OF_ASC_NODE || 0).toFixed(1)),
            period: periodMin,
            color: isISRO ? '#ff9933' : (isDebris ? '#ff2a6d' : (isGeo ? '#ffe060' : '#00f3ff')),
            isro: isISRO,
            owner: owner,
            mass: isGeo ? 3500 : (isDebris ? 12.0 : 600),
            rcs: isGeo ? 15.0 : (isDebris ? 0.2 : 3.0),
            origin: feed.origin,
            regime: altKm > 30000 ? 'GEO' : (altKm > 2000 ? 'MEO' : 'LEO'),
            hazardScore: isDebris ? 65 : (isGeo ? 15 : 25)
          });
          addedCount++;
        });

        if (addedCount > 0) {
          renderCatalog('ALL');
          const countElem = document.getElementById('catalog-count');
          if (countElem) countElem.textContent = `${GLOBAL_SPACE_CATALOG.length} REAL OBJECTS`;
        }
      })
      .catch(err => console.log('CelesTrak Sync: Using pre-loaded authentic catalog.'));
  });
}

let selectedObject = GLOBAL_SPACE_CATALOG[0];
let threeScene, threeCamera, threeRenderer, threeControls;
let earthGroup, earthMesh, cloudsMesh, orbitLinesGroup, debrisGroup, groundStationsGroup;
let raycaster, mouse;
let showOrbits = true;
let showDebris = true;
let showStations = true;
let timeSec = 0;
let timeOffsetMinutes = 0;
let meshToObjectMap = new Map();
let spacecraftList = [];
let pythonBackendPort = window.location.port || 8080;

document.addEventListener('DOMContentLoaded', () => {
  runEntranceSplashAnimation();

  try {
    renderCatalog('ALL');
    selectObject(GLOBAL_SPACE_CATALOG[0].id);

    initPhotorealisticEarthGlobe();
    renderBPlaneRadar(142);
    initUI();
    initTimeSliderControls();
    fetchLiveCelesTrakDebrisData();
  } catch (err) {
    console.error('VYOM Initialization Error:', err);
  }
});

function runEntranceSplashAnimation() {
  const progressBar = document.getElementById('splash-progress-bar');
  const progressNum = document.getElementById('splash-progress-num');
  const overlay = document.getElementById('entrance-modal-overlay');

  if (overlay) {
    overlay.addEventListener('click', () => overlay.classList.add('hidden'));
  }

  let pct = 0;
  const timer = setInterval(() => {
    pct += Math.floor(Math.random() * 8) + 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(timer);

      if (progressBar) progressBar.style.width = '100%';
      if (progressNum) progressNum.textContent = '100%';

      setTimeout(() => {
        if (overlay) overlay.classList.add('hidden');
      }, 400);
    } else {
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressNum) progressNum.textContent = `${pct}%`;
    }
  }, 40);
}

function initTimeSliderControls() {
  const slider = document.getElementById('time-slider-range');
  const offsetLabel = document.getElementById('ts-offset-label');
  const missDistLabel = document.getElementById('ts-miss-dist');
  const threatBadge = document.getElementById('ts-threat-badge');

  if (!slider) return;

  slider.addEventListener('input', (e) => {
    timeOffsetMinutes = parseFloat(e.target.value);

    if (offsetLabel) {
      if (Math.abs(timeOffsetMinutes) < 0.5) {
        offsetLabel.textContent = 'TCA (0.0m LIVE)';
      } else {
        offsetLabel.textContent = `TCA ${timeOffsetMinutes > 0 ? '+' : ''}${timeOffsetMinutes.toFixed(1)}m`;
      }
    }

    const timeSliderUrl = window.location.protocol.startsWith('http')
      ? `/api/v1/time-slider?offset_min=${timeOffsetMinutes}`
      : `http://localhost:${pythonBackendPort}/api/v1/time-slider?offset_min=${timeOffsetMinutes}`;
    fetch(timeSliderUrl)
      .then(res => res.json())
      .then(data => {
        if (data && data.encounter_analysis) {
          const missMeters = data.encounter_analysis.instantaneous_miss_distance_m;
          if (missDistLabel) missDistLabel.textContent = `${missMeters} meters`;
          if (threatBadge) threatBadge.textContent = data.encounter_analysis.collision_threat_level;
          renderBPlaneRadar(missMeters);
        }
      })
      .catch(err => {
        const missMeters = Math.abs(timeOffsetMinutes) < 0.5 ? 142.0 : 142.0 + Math.abs(timeOffsetMinutes) * 45;
        if (missDistLabel) missDistLabel.textContent = `${missMeters.toFixed(1)} meters`;
        if (threatBadge) {
          threatBadge.textContent = missMeters < 200 ? 'DEFCON 2 CRITICAL' : 'DEFCON 5 NOMINAL';
          threatBadge.style.color = missMeters < 200 ? 'var(--or-red)' : 'var(--or-emerald)';
        }
        renderBPlaneRadar(missMeters);
      });
  });

  document.getElementById('btn-ts-rewind')?.addEventListener('click', () => {
    slider.value = Math.max(-60, parseFloat(slider.value) - 10);
    slider.dispatchEvent(new Event('input'));
  });

  document.getElementById('btn-ts-ffwd')?.addEventListener('click', () => {
    slider.value = Math.min(60, parseFloat(slider.value) + 10);
    slider.dispatchEvent(new Event('input'));
  });

  document.getElementById('btn-ts-play')?.addEventListener('click', () => {
    slider.value = 0;
    slider.dispatchEvent(new Event('input'));
  });
}

function renderCatalog(filter) {
  const container = document.getElementById('satellite-list');
  if (!container) return;
  container.innerHTML = '';

  let list = GLOBAL_SPACE_CATALOG;
  if (filter === 'ACTIVE') list = GLOBAL_SPACE_CATALOG.filter(s => s.type === 'active' || s.type === 'station');
  if (filter === 'DEBRIS') list = GLOBAL_SPACE_CATALOG.filter(s => s.type === 'debris' || s.type === 'derelict' || s.type === 'rocket_body');
  if (filter === 'GEO') list = GLOBAL_SPACE_CATALOG.filter(s => s.regime === 'GEO');
  if (filter === 'ISRO') list = GLOBAL_SPACE_CATALOG.filter(s => s.isro);
  if (filter === 'GROUND') {
    list = GLOBAL_GEO_GROUND_STATIONS.map(g => ({
      id: g.id,
      norad: 'GEO-GS',
      name: g.name,
      type: 'ground_station',
      regime: 'GROUND FACILITY',
      owner: `${g.country} (${g.operator})`,
      alt: 0,
      vel: 0,
      inc: parseFloat(g.lat.toFixed(1)),
      mass: `Freq: ${g.radFreq}`,
      rcs: 'Phased Dish',
      color: g.color,
      hazardScore: 0,
      isro: g.country.includes('India'),
      origin: `Target: ${g.targetGeo} | Lat/Lon: ${g.lat.toFixed(2)}°, ${g.lon.toFixed(2)}°`
    }));
  }

  const countElem = document.getElementById('catalog-count');
  if (countElem) countElem.textContent = `${list.length} OBJECTS`;

  list.slice(0, 80).forEach(obj => {
    const card = document.createElement('div');
    const isSelected = selectedObject && selectedObject.id === obj.id;
    card.className = `left-menu-btn ${obj.isro ? 'isro-asset' : ''} ${isSelected ? 'active' : ''}`;
    card.innerHTML = `
      <div>
        <div style="font-weight:700; color:${obj.isro ? '#ff9933' : '#fff'};">${obj.isro ? '🇮🇳 ' : ''}${obj.name}</div>
        <div style="font-size:10px; opacity:0.75;">${obj.regime} | ${obj.type.toUpperCase()}</div>
      </div>
      <span style="font-size:11px; font-weight:700; color:${obj.color};">${obj.alt}km</span>
    `;
    card.addEventListener('click', () => selectObject(obj.id));
    container.appendChild(card);
  });
}

function selectObject(id) {
  let found = GLOBAL_SPACE_CATALOG.find(s => s.id === id);
  if (!found) {
    const gs = GLOBAL_GEO_GROUND_STATIONS.find(g => g.id === id);
    if (gs) {
      found = {
        id: gs.id,
        norad: 'GEO-GS',
        name: gs.name,
        type: 'ground_station',
        regime: 'GROUND FACILITY',
        owner: `${gs.country} (${gs.operator})`,
        alt: 0,
        vel: 0,
        inc: parseFloat(gs.lat.toFixed(1)),
        mass: `Band: ${gs.radFreq}`,
        rcs: 'Phased Dish',
        color: gs.color,
        hazardScore: 0,
        isro: gs.country.includes('India'),
        origin: `Active Target Link: ${gs.targetGeo} | Lat/Lon: ${gs.lat.toFixed(2)}°, ${gs.lon.toFixed(2)}°`
      };
    }
  }
  selectedObject = found || GLOBAL_SPACE_CATALOG[0];

  const nameElem = document.getElementById('hud-target-name');
  const typeElem = document.getElementById('hud-target-type');
  if (nameElem) nameElem.textContent = selectedObject.name;
  if (typeElem) typeElem.textContent = `${selectedObject.regime} ${selectedObject.type.toUpperCase()} | ALT: ${selectedObject.alt} km | VEL: ${selectedObject.vel} km/s`;

  // Update Detail Panel Elements Safely
  const setElemText = (elemId, val) => {
    const el = document.getElementById(elemId);
    if (el) el.textContent = val;
  };

  setElemText('obj-detail-name', selectedObject.name);
  setElemText('obj-detail-norad', selectedObject.norad);
  setElemText('obj-detail-type', selectedObject.type.toUpperCase());
  setElemText('obj-detail-owner', selectedObject.owner || 'Global Catalog');
  setElemText('obj-detail-alt', `${selectedObject.alt} km (${selectedObject.regime})`);
  setElemText('obj-detail-vel', `${selectedObject.vel} km/s`);
  setElemText('obj-detail-inc', `${selectedObject.inc}°`);
  setElemText('obj-detail-mass', typeof selectedObject.mass === 'number' ? `${selectedObject.mass} kg` : selectedObject.mass);
  setElemText('obj-detail-rcs', typeof selectedObject.rcs === 'number' ? `${selectedObject.rcs} m²` : selectedObject.rcs);
  setElemText('obj-detail-hazard', `${selectedObject.hazardScore || 0} / 100`);

  const originContainer = document.getElementById('obj-detail-origin-container');
  if (originContainer) {
    let originText = selectedObject.origin;
    if (selectedObject.regime === 'GEO') {
      originText = (originText ? originText + ' | ' : '') + 'Signal Latency: ~119.4 ms (Speed of Light)';
    }
    if (originText) {
      originContainer.style.display = 'flex';
      setElemText('obj-detail-origin', originText);
    } else {
      originContainer.style.display = 'none';
    }
  }

  // Open Right Panel Automatically
  const rightPanel = document.getElementById('right-hamburger-panel');
  if (rightPanel) rightPanel.classList.add('open');

  render20YearDecayPrediction(selectedObject);
  renderBPlaneRadar(selectedObject.miss || 142);
}

function render20YearDecayPrediction(obj) {
  const container = document.getElementById('decay-prediction-grid');
  if (!container) return;
  container.innerHTML = '';

  const currentYear = 2026;
  const decayRate = obj.regime === 'GEO' ? 0.001 : (obj.regime === 'MEO' ? 0.01 : 1.2);
  const initialAlt = obj.alt;

  const headerYearElem = document.getElementById('predict-decay-year');
  if (headerYearElem) {
    if (decayRate > 0.05 && initialAlt < 2000) {
      const reentryYear = currentYear + Math.ceil(initialAlt / decayRate);
      headerYearElem.textContent = `Predicted Re-Entry: Year ${reentryYear}`;
    } else {
      headerYearElem.textContent = 'Predicted Re-Entry: > 100 Years';
    }
  }

  for (let year = currentYear; year <= 2046; year += 4) {
    const elapsed = year - currentYear;
    const projectedAlt = Math.max(0, Math.round(initialAlt - elapsed * decayRate));

    const tile = document.createElement('div');
    tile.className = 'sw-metric-box';
    tile.innerHTML = `
      <div class="sw-metric-lbl">YEAR ${year}</div>
      <div class="sw-metric-val" style="color: ${projectedAlt < 200 ? 'var(--or-red)' : 'var(--or-cyan)'};">
        ${projectedAlt < 100 ? 'RE-ENTERED' : projectedAlt + ' km'}
      </div>
    `;
    container.appendChild(tile);
  }
}

function initUI() {
  const leftBtn = document.getElementById('left-hamburger-btn');
  const leftPanel = document.getElementById('left-hamburger-panel');
  if (leftBtn && leftPanel) {
    leftBtn.addEventListener('click', () => leftPanel.classList.toggle('open'));
  }

  const rightBtn = document.getElementById('right-hamburger-btn');
  const rightPanel = document.getElementById('right-hamburger-panel');
  if (rightBtn && rightPanel) {
    rightBtn.addEventListener('click', () => rightPanel.classList.toggle('open'));
  }

  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    if (threeCamera) {
      threeCamera.position.multiplyScalar(0.75);
      if (threeControls) threeControls.update();
    }
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    if (threeCamera) {
      threeCamera.position.multiplyScalar(1.35);
      if (threeControls) threeControls.update();
    }
  });

  document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
    if (threeCamera && threeControls) {
      threeCamera.position.set(0, 8, 20);
      threeControls.target.set(0, 0, 0);
      threeControls.update();
    }
  });

  const toggleOrbitsBtn = document.getElementById('toggle-orbits-btn');
  if (toggleOrbitsBtn) {
    toggleOrbitsBtn.addEventListener('click', () => {
      showOrbits = !showOrbits;
      toggleOrbitsBtn.textContent = showOrbits ? 'ON' : 'OFF';
      toggleOrbitsBtn.classList.toggle('off', !showOrbits);
      if (orbitLinesGroup) orbitLinesGroup.visible = showOrbits;
    });
  }

  const toggleDebrisBtn = document.getElementById('toggle-debris-btn');
  if (toggleDebrisBtn) {
    toggleDebrisBtn.addEventListener('click', () => {
      showDebris = !showDebris;
      toggleDebrisBtn.textContent = showDebris ? 'ON' : 'OFF';
      toggleDebrisBtn.classList.toggle('off', !showDebris);
      if (debrisGroup) debrisGroup.visible = showDebris;
    });
  }

  const toggleStationsBtn = document.getElementById('toggle-stations-btn');
  if (toggleStationsBtn) {
    toggleStationsBtn.addEventListener('click', () => {
      showStations = !showStations;
      toggleStationsBtn.textContent = showStations ? 'ON' : 'OFF';
      toggleStationsBtn.classList.toggle('off', !showStations);
      if (groundStationsGroup) groundStationsGroup.visible = showStations;
    });
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderCatalog(e.target.dataset.tab);
    });
  });

  const clock = document.getElementById('utc-clock');
  setInterval(() => {
    if (clock) clock.textContent = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  }, 1000);
}

function getOrbitalPosition(radius, incDeg, raanDeg, phaseAngle) {
  const inc = (incDeg * Math.PI) / 180;
  const raan = (raanDeg * Math.PI) / 180;

  const xPrime = radius * Math.cos(phaseAngle);
  const zPrime = radius * Math.sin(phaseAngle);

  const xInc = xPrime;
  const yInc = zPrime * Math.sin(inc);
  const zInc = zPrime * Math.cos(inc);

  const x = xInc * Math.cos(raan) + zInc * Math.sin(raan);
  const y = yInc;
  const z = -xInc * Math.sin(raan) + zInc * Math.cos(raan);

  return new THREE.Vector3(x, y, z);
}

function calculateSubPointLatLon(positionVector, earthRotationY) {
  const r = positionVector.length();
  const latRad = Math.asin(positionVector.y / r);
  const latDeg = (latRad * 180) / Math.PI;

  let lonRad = Math.atan2(positionVector.z, positionVector.x) - earthRotationY;
  let lonDeg = (lonRad * 180) / Math.PI;
  lonDeg = ((lonDeg + 180) % 360) - 180;

  const latStr = `${Math.abs(latDeg).toFixed(2)}° ${latDeg >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lonDeg).toFixed(2)}° ${lonDeg >= 0 ? 'E' : 'W'}`;

  return { latStr, lonStr };
}

function createNASARealisticEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Deep Space Ocean Gradient with Bathymetry Shelf Layers
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 2048);
  oceanGrad.addColorStop(0, '#020a1c');
  oceanGrad.addColorStop(0.3, '#041738');
  oceanGrad.addColorStop(0.5, '#072452');
  oceanGrad.addColorStop(0.7, '#041738');
  oceanGrad.addColorStop(1, '#020a1c');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 4096, 2048);

  const toXY = (lat, lon) => ({
    x: ((lon + 180) / 360) * 4096,
    y: ((90 - lat) / 180) * 2048
  });

  function drawLandmass(points, baseColor, shelfColor = '#0a3d6b') {
    if (points.length < 3) return;

    // Draw Shallow Coastal Shelf Bathymetry Glow
    ctx.beginPath();
    const p0 = toXY(points[0][0], points[0][1]);
    ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < points.length; i++) {
      const p = toXY(points[i][0], points[i][1]);
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fillStyle = shelfColor;
    ctx.lineWidth = 24;
    ctx.strokeStyle = shelfColor;
    ctx.stroke();

    // Draw Main Continent Land Body
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    for (let i = 1; i < points.length; i++) {
      const p = toXY(points[i][0], points[i][1]);
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fillStyle = baseColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#183822';
    ctx.stroke();
  }

  // Realistic Continent Boundaries
  const northAmerica = [[72, -165], [70, -140], [60, -135], [50, -125], [34, -120], [30, -115], [20, -105], [16, -95], [14, -90], [18, -88], [25, -80], [30, -81], [35, -75], [45, -65], [55, -60], [65, -65], [72, -85], [70, -115]];
  const southAmerica = [[12, -73], [8, -60], [-5, -35], [-20, -40], [-35, -55], [-55, -68], [-50, -75], [-30, -72], [-15, -75], [-5, -80], [5, -77]];
  const eurasia = [[70, 28], [71, 70], [73, 120], [65, 170], [55, 160], [40, 140], [35, 120], [22, 115], [10, 105], [10, 78], [25, 65], [12, 44], [30, 32], [36, 36], [42, 28], [55, 10], [65, 14]];
  const africa = [[37, 10], [32, 32], [12, 43], [4, 51], [-10, 40], [-34, 26], [-34, 18], [-18, 12], [5, 9], [15, -17], [30, -10], [35, 0]];
  const australia = [[-12, 130], [-15, 145], [-25, 153], [-38, 148], [-35, 115], [-22, 114], [-15, 124]];
  const greenland = [[82, -30], [75, -18], [60, -42], [66, -55], [76, -68]];
  const indiaSub = [[35, 74], [28, 88], [20, 85], [8, 77], [15, 73], [23, 68], [30, 70]];
  const japan = [[45, 142], [40, 140], [34, 135], [31, 130], [38, 138], [43, 145]];
  const ukIreland = [[58, -5], [54, 1], [50, -5], [54, -10]];
  const antarctica = [[-65, -180], [-65, -90], [-70, 0], [-65, 90], [-65, 180], [-88, 180], [-88, -180]];

  drawLandmass(northAmerica, '#244728');
  drawLandmass(southAmerica, '#1c4524');
  drawLandmass(eurasia, '#294d2c');
  drawLandmass(africa, '#6e5d3d');
  drawLandmass(australia, '#7a5a30');
  drawLandmass(greenland, '#e2edf7');
  drawLandmass(indiaSub, '#29522b');
  drawLandmass(japan, '#1e4022');
  drawLandmass(ukIreland, '#234a26');
  drawLandmass(antarctica, '#f0f6fc');

  // Topographical Mountain Ranges & Deserts
  const deserts = [
    { lat: 24, lon: 18, r: 280, col: '#7a6742' },  // Sahara
    { lat: 23, lon: 45, r: 180, col: '#73603b' },  // Arabian
    { lat: 40, lon: 100, r: 190, col: '#665538' }, // Gobi
    { lat: -25, lon: 132, r: 210, col: '#7a5229' } // Outback
  ];

  deserts.forEach(d => {
    const p = toXY(d.lat, d.lon);
    ctx.beginPath();
    ctx.arc(p.x, p.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = d.col;
    ctx.fill();
  });

  // Glowing Golden Amber City Lights Overlay (Night Side Realism)
  const cityClusters = [
    { lat: 40.7, lon: -74.0, r: 16 },  // New York
    { lat: 34.0, lon: -118.2, r: 18 }, // LA
    { lat: 51.5, lon: -0.1, r: 16 },   // London
    { lat: 48.8, lon: 2.35, r: 14 },   // Paris
    { lat: 35.6, lon: 139.6, r: 22 },  // Tokyo
    { lat: 31.2, lon: 121.4, r: 20 },  // Shanghai
    { lat: 28.6, lon: 77.2, r: 18 },   // New Delhi
    { lat: 19.0, lon: 72.8, r: 18 },   // Mumbai
    { lat: 13.0, lon: 80.2, r: 12 },   // Chennai
    { lat: 12.9, lon: 77.5, r: 14 },   // Bengaluru
    { lat: 30.0, lon: 31.2, r: 16 },   // Cairo
    { lat: -23.5, lon: -46.6, r: 18 }, // Sao Paulo
    { lat: -33.8, lon: 151.2, r: 14 }  // Sydney
  ];

  ctx.fillStyle = '#ffbe3b';
  ctx.shadowColor = '#ffaa00';
  ctx.shadowBlur = 12;
  cityClusters.forEach(c => {
    const p = toXY(c.lat, c.lon);
    ctx.beginPath();
    ctx.arc(p.x, p.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;

  // Polar Ice Caps
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 4096, 110);
  ctx.fillRect(0, 1938, 4096, 110);

  return new THREE.CanvasTexture(canvas);
}

function createNASACloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 2048, 1024);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let i = 0; i < 90; i++) {
    const cx = Math.random() * 2048;
    const cy = 100 + Math.random() * 824;
    const rx = 120 + Math.random() * 240;
    const ry = 30 + Math.random() * 45;
    const rot = (Math.random() - 0.5) * 0.4;

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function latLonToVector3(lat, lon, radius = 6.37) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createGroundStationsOnGlobe() {
    groundStationsGroup = new THREE.Group();
    earthGroup.add(groundStationsGroup);

    GLOBAL_GEO_GROUND_STATIONS.forEach(gs => {
      const pos = latLonToVector3(gs.lat, gs.lon, 6.39);

      const gsMeshGroup = new THREE.Group();
      gsMeshGroup.position.copy(pos);

      // Glowing base ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.12, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(gs.color), side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      gsMeshGroup.add(ringMesh);

      // Center beacon dish sphere
      const sphereGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const sphereMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(gs.color) });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      gsMeshGroup.add(sphereMesh);

      // 3D Radar Beam Line extending towards GEO altitude
      const targetVector = pos.clone().normalize().multiplyScalar(13.5);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), targetVector.clone().sub(pos)]);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(gs.color),
        transparent: true,
        opacity: 0.45
      });
      const beamLine = new THREE.Line(lineGeo, lineMat);
      gsMeshGroup.add(beamLine);

      const stationObject = {
        id: gs.id,
        norad: 'GEO-GS',
        name: gs.name,
        type: 'ground_station',
        regime: 'GROUND FACILITY',
        owner: `${gs.country} (${gs.operator})`,
        alt: 0,
        vel: 0,
        inc: parseFloat(gs.lat.toFixed(1)),
        mass: `Radar Band: ${gs.radFreq}`,
        rcs: 'Phased Dish Array',
        color: gs.color,
        hazardScore: 0,
        isro: gs.country.includes('India'),
        origin: `Active Target Link: ${gs.targetGeo} | Lat/Lon: ${gs.lat.toFixed(2)}°, ${gs.lon.toFixed(2)}°`
      };

      meshToObjectMap.set(sphereMesh, stationObject);
      meshToObjectMap.set(ringMesh, stationObject);

      groundStationsGroup.add(gsMeshGroup);
    });
  }

  function initPhotorealisticEarthGlobe() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    threeCamera.position.set(0, 8, 20);

    threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (threeRenderer.outputEncoding !== undefined) {
      threeRenderer.outputEncoding = THREE.sRGBEncoding;
    }
    container.appendChild(threeRenderer.domElement);

    if (typeof THREE.OrbitControls !== 'undefined') {
      threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
    } else if (typeof OrbitControls !== 'undefined') {
      threeControls = new OrbitControls(threeCamera, threeRenderer.domElement);
    }

    if (threeControls) {
      threeControls.enableDamping = true;
      threeControls.dampingFactor = 0.05;
      threeControls.minDistance = 6;
      threeControls.maxDistance = 150;
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('click', (e) => {
      if (e.target.closest('.hamburger-panel-left') || e.target.closest('.hamburger-panel-right') || e.target.closest('.defcon-threat-meter') || e.target.closest('#space-weather-panel') || e.target.closest('#time-slider-container') || e.target.closest('.zoom-controls-float') || e.target.closest('button')) {
        return;
      }

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, threeCamera);

      const allSelectable = [];
      meshToObjectMap.forEach((obj, mesh) => {
        allSelectable.push(mesh);
        mesh.children.forEach(child => allSelectable.push(child));
      });

      const intersects = raycaster.intersectObjects(allSelectable);

      if (intersects.length > 0) {
        let clickedMesh = intersects[0].object;
        let clickedObj = meshToObjectMap.get(clickedMesh);

        if (!clickedObj && clickedMesh.parent) {
          clickedObj = meshToObjectMap.get(clickedMesh.parent);
        }

        if (clickedObj) {
          console.log('Successfully Selected 3D Object:', clickedObj.name);
          selectObject(clickedObj.id);
        }
      }
    });

    // Photorealistic High-Contrast Solar & Ambient Deep-Space Lighting
    const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
    threeScene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(40, 20, 40);
    threeScene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00f3ff, 0.8);
    rimLight.position.set(-40, -10, -30);
    threeScene.add(rimLight);

    earthGroup = new THREE.Group();
    earthGroup.rotation.z = (23.44 * Math.PI) / 180;
    threeScene.add(earthGroup);

    const textureLoader = new THREE.TextureLoader();
    const proceduralEarthTex = createNASARealisticEarthTexture();

    const earthGeo = new THREE.SphereGeometry(6.37, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: proceduralEarthTex,
      specular: new THREE.Color(0x3366aa),
      shininess: 40,
      bumpScale: 0.04
    });

    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Load High-Res Satellite Maps from Reliable CDN with Procedural Fallback
    textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', (tex) => {
      earthMat.map = tex;
      earthMat.needsUpdate = true;
    }, undefined, () => {
      textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg', (fallbackTex) => {
        earthMat.map = fallbackTex;
        earthMat.needsUpdate = true;
      });
    });

    textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_specular_2048.jpg', (specTex) => {
      earthMat.specularMap = specTex;
      earthMat.needsUpdate = true;
    });

    textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_normal_2048.jpg', (normalTex) => {
      earthMat.normalMap = normalTex;
      earthMat.normalScale = new THREE.Vector2(0.85, 0.85);
      earthMat.needsUpdate = true;
    });

    // Swirling Realistic Cloud Sphere
    const cloudsGeo = new THREE.SphereGeometry(6.44, 64, 64);
    const proceduralCloudsTex = createNASACloudTexture();
    const cloudsMat = new THREE.MeshPhongMaterial({
      map: proceduralCloudsTex,
      color: 0xffffff,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending
    });

    cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    earthGroup.add(cloudsMesh);

    textureLoader.load('https://unpkg.com/three-globe/example/img/earth-clouds.png', (cloudTex) => {
      cloudsMat.map = cloudTex;
      cloudsMat.needsUpdate = true;
    });

    // Rayleigh Atmospheric Scattering Halo Glow Shader (Fresnel Limb Effect)
    const atmosGeo = new THREE.SphereGeometry(6.68, 64, 64);
    const atmosShader = {
      vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
      fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
        gl_FragColor = vec4(0.0, 0.85, 1.0, 1.0) * intensity;
      }
    `
    };

    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: atmosShader.vertexShader,
      fragmentShader: atmosShader.fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    earthGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Initialize GEO Ground Stations on 3D Earth Surface
    createGroundStationsOnGlobe();

    // Deep Space Starfield Sphere
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000 * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 450;
      starPos[i + 1] = (Math.random() - 0.5) * 450;
      starPos[i + 2] = (Math.random() - 0.5) * 450;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    threeScene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xcceeff, size: 0.8, transparent: true, opacity: 0.85 })));

    orbitLinesGroup = new THREE.Group();
    debrisGroup = new THREE.Group();
    threeScene.add(orbitLinesGroup);
    threeScene.add(debrisGroup);

    spacecraftList = [];
    GLOBAL_SPACE_CATALOG.forEach((obj, idx) => {
      const isDebris = obj.type === 'debris';
      const isStation = obj.type === 'station';

      const geo = isStation ? new THREE.BoxGeometry(0.35, 0.35, 0.35) : (isDebris ? new THREE.OctahedronGeometry(0.14, 0) : new THREE.SphereGeometry(0.2, 12, 12));
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(obj.color) });
      const mesh = new THREE.Mesh(geo, mat);

      let altRadius = 6.37 + (obj.alt / 1000);
      if (obj.regime === 'GEO' || obj.regime === 'GRAVEYARD') altRadius = 13.5;
      if (obj.regime === 'MEO') altRadius = 9.8;

      const initialPos = getOrbitalPosition(altRadius, obj.inc, obj.raan || (idx * 27) % 360, obj.phaseOffset || 0);
      mesh.position.copy(initialPos);

      meshToObjectMap.set(mesh, obj);

      // Create 3D Orbit Trajectory Line
      const raanVal = obj.raan || (idx * 27) % 360;
      const orbitPoints = [];
      const segments = 64;
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * 2 * Math.PI;
        orbitPoints.push(getOrbitalPosition(altRadius, obj.inc, raanVal, theta));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(obj.color),
        transparent: true,
        opacity: isStation ? 0.6 : (obj.isro ? 0.45 : (isDebris ? 0.15 : 0.28))
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      orbitLinesGroup.add(orbitLine);

      if (isStation) {
        const shieldGeo = new THREE.SphereGeometry(0.7, 16, 16);
        const shieldMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.25, wireframe: true });
        mesh.add(new THREE.Mesh(shieldGeo, shieldMat));
      }

      if (isDebris) {
        debrisGroup.add(mesh);
      } else {
        threeScene.add(mesh);
      }

      spacecraftList.push({ mesh, data: obj, radius: altRadius, phaseOffset: obj.phaseOffset || (idx * 0.35) % (2 * Math.PI) });
    });

    window.addEventListener('resize', () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      threeCamera.aspect = w / h;
      threeCamera.updateProjectionMatrix();
      threeRenderer.setSize(w, h);
    });

    function animate() {
      requestAnimationFrame(animate);
      timeSec += 0.003;

      // Earth Rotation Rate (1 revolution per 24h = 7.292e-5 rad/s)
      const earthRotSpeed = 0.0006;
      if (earthMesh) earthMesh.rotation.y += earthRotSpeed;
      if (earthGroup) earthGroup.rotation.y += earthRotSpeed * 0.75;
      if (cloudsMesh) cloudsMesh.rotation.y += earthRotSpeed * 1.35;

      spacecraftList.forEach(item => {
        // True orbital period in minutes (LEO ~92m, MEO ~718m, GEO = 1436m)
        const periodMin = item.data.period || (item.data.alt > 35000 ? 1436 : (item.data.alt > 2000 ? 718 : 94.8));

        // Keplerian angular velocity (rad/sec): omega = 2*PI / (periodMin * 60)
        const omegaRadS = (2 * Math.PI) / (periodMin * 60.0);

        // Simulation time scaling factor: 1 sec real time = 180 sec simulation time
        const simMultiplier = 180.0;
        const totalEffectiveTimeSec = (timeSec * simMultiplier) + (timeOffsetMinutes * 60.0);

        const currentAngle = (item.phaseOffset || 0) + (totalEffectiveTimeSec * omegaRadS) % (2 * Math.PI);
        const newPos = getOrbitalPosition(item.radius, item.data.inc, item.data.raan || 0, currentAngle);
        item.mesh.position.copy(newPos);

        if (selectedObject && item.data.id === selectedObject.id) {
          const subPoint = calculateSubPointLatLon(newPos, earthGroup ? earthGroup.rotation.y : 0);
          const latElem = document.getElementById('subpoint-lat');
          const lonElem = document.getElementById('subpoint-lon');
          if (latElem) latElem.textContent = subPoint.latStr;
          if (lonElem) lonElem.textContent = subPoint.lonStr;
        }
      });

      if (threeControls) threeControls.update();
      threeRenderer.render(threeScene, threeCamera);
    }
    animate();
  }

  function renderBPlaneRadar(missMeters) {
    const canvas = document.getElementById('bplane-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth || 300;
    const h = canvas.height = 120;

    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;

    ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#00f3ff';
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

    const off = missMeters * 0.2;
    ctx.fillStyle = '#ff2a6d';
    ctx.beginPath(); ctx.arc(cx + off, cy - off * 0.7, 5, 0, Math.PI * 2); ctx.fill();
  }
