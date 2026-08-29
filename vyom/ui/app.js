/* ==========================================================================
   VYOM — Hyper-Realistic NASA Blue Marble 3D Earth Globe Engine
   Atmospheric Rayleigh Scattering, Specular Oceans, Night Lights & Cloud Layers
   ========================================================================== */

const GLOBAL_SPACE_CATALOG = [
  // Human Space Stations & Docking Modules (Protected Keep-Out Zone)
  { id: 'ISS-01', norad: 25544, name: 'ISS (Space Station)', type: 'station', alt: 420, vel: 7.66, inc: 51.6, raan: 45, period: 92.9, color: '#00ffff', owner: 'NASA/ESA/JAXA/ISRO', mass: 450000, rcs: 400, protectedVolumeKm: 5.0, regime: 'LEO', dangerStatus: 'SAFE_BUFFER' },
  { id: 'TIANGONG-01', norad: 48274, name: 'Tiangong Station', type: 'station', alt: 389, vel: 7.68, inc: 41.5, raan: 120, period: 92.4, color: '#00e5ff', owner: 'CNSA', mass: 100000, rcs: 180, protectedVolumeKm: 5.0, regime: 'LEO', dangerStatus: 'SAFE_BUFFER' },

  // ISRO Indian Space Research Organisation Active Assets (Saffron Gold #ff9933)
  { id: 'CARTOSAT-3', norad: 44804, name: 'Cartosat-3 (ISRO EO)', type: 'active', alt: 509, vel: 7.61, inc: 97.5, raan: 15, period: 94.8, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 1625, rcs: 4.5, protectedVolumeKm: 2.0, regime: 'LEO', dangerStatus: 'CRITICAL_CONJUNCTION' },
  { id: 'EOS-06', norad: 54361, name: 'EOS-06 Oceansat-3 (ISRO)', type: 'active', alt: 742, vel: 7.48, inc: 98.4, raan: 150, period: 99.7, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 1117, rcs: 3.8, protectedVolumeKm: 2.0, regime: 'LEO', dangerStatus: 'SAFE_BUFFER' },
  { id: 'EOS-04', norad: 51656, name: 'EOS-04 RISAT-1A SAR', type: 'active', alt: 529, vel: 7.60, inc: 97.5, raan: 280, period: 95.2, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 1710, rcs: 6.2, protectedVolumeKm: 2.0, regime: 'LEO', dangerStatus: 'SAFE_BUFFER' },
  { id: 'NAVIC-1I', norad: 43286, name: 'NavIC IRNSS-1I (ISRO Nav)', type: 'active', alt: 35786, vel: 3.07, inc: 29.5, raan: 130, period: 1436, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 1425, rcs: 5.0, protectedVolumeKm: 10.0, regime: 'GEO', dangerStatus: 'SAFE_BUFFER' },

  // Commercial & Earth Observation Fleets (LEO)
  { id: 'LANDSAT-9', norad: 49260, name: 'Landsat 9 (NASA/USGS)', type: 'active', alt: 705, vel: 7.50, inc: 98.2, raan: 330, period: 98.8, color: '#60eafe', owner: 'NASA/USGS', mass: 2711, rcs: 5.5, regime: 'LEO', dangerStatus: 'SAFE_BUFFER' },
  { id: 'SENTINEL-2A', norad: 40697, name: 'Sentinel-2A (ESA)', type: 'active', alt: 786, vel: 7.46, inc: 98.6, raan: 90, period: 100.6, color: '#0088ff', owner: 'ESA (Europe)', mass: 1140, rcs: 4.2, regime: 'LEO', dangerStatus: 'SAFE_BUFFER' },
  { id: 'STARLINK-3001', norad: 51001, name: 'Starlink-3001 (SpaceX)', type: 'active', alt: 550, vel: 7.59, inc: 53.0, raan: 0, period: 95.6, color: '#0088ff', owner: 'SpaceX', mass: 260, rcs: 3.0, regime: 'LEO', dangerStatus: 'SAFE_BUFFER' },
  { id: 'ONEWEB-0120', norad: 45205, name: 'OneWeb-0120 (Eutelsat)', type: 'active', alt: 1200, vel: 7.24, inc: 87.4, raan: 60, period: 109.4, color: '#00bbff', owner: 'Eutelsat OneWeb', mass: 150, rcs: 2.2, regime: 'LEO', dangerStatus: 'SAFE_BUFFER' },

  // Navigation Constellations (MEO)
  { id: 'GPS-BIIR-11', norad: 28474, name: 'GPS BIIR-11 (USAF Nav)', type: 'active', alt: 20180, vel: 3.87, inc: 55.0, raan: 310, period: 718, color: '#ffe060', owner: 'US Space Force', mass: 2032, rcs: 6.0, regime: 'MEO', dangerStatus: 'SAFE_BUFFER' },
  { id: 'GALILEO-26', norad: 43564, name: 'Galileo FOC-26 (EU Nav)', type: 'active', alt: 23222, vel: 3.67, inc: 56.0, raan: 210, period: 844, color: '#ffe060', owner: 'ESA / EU', mass: 715, rcs: 3.5, regime: 'MEO', dangerStatus: 'SAFE_BUFFER' },

  // Geostationary Belt & Graveyard Corridor
  { id: 'GSAT-24', norad: 52902, name: 'GSAT-24 (ISRO Comms GEO)', type: 'active', alt: 35786, vel: 3.07, inc: 0.05, raan: 50, period: 1436, color: '#ff9933', isro: true, owner: 'ISRO (India)', mass: 4180, rcs: 14.5, regime: 'GEO', dangerStatus: 'SAFE_BUFFER' },
  { id: 'GRAVEYARD-GEO-01', norad: 19800, name: 'Super-GEO Graveyard Derelict', type: 'derelict', alt: 36100, vel: 3.05, inc: 12.5, raan: 180, period: 1460, color: '#ffaa00', owner: 'Retired GEO Satellite', mass: 3200, rcs: 18.0, regime: 'GRAVEYARD', dangerStatus: 'PASSIVATED_DERELICT' },

  // Tracked Debris Swarms
  { id: 'DEB-FY1C-28941', norad: 28941, name: 'Fengyun 1C Fragment #28941', type: 'debris', alt: 512, vel: 7.62, inc: 98.9, raan: 15, period: 94.9, color: '#ff2a6d', owner: 'China (ASAT Fragment)', mass: 12.4, rcs: 0.45, regime: 'LEO', dangerStatus: 'CRITICAL_THREAT', miss: 142, tca: 3412, pc: '3.84 × 10^-4', origin: '2007 ASAT Missile Intercept Breakup' },
  { id: 'DEB-C2251-33758', norad: 33758, name: 'Cosmos 2251 Fragment #33758', type: 'debris', alt: 745, vel: 7.47, inc: 74.0, raan: 250, period: 99.8, color: '#ff2a6d', owner: 'Russia (Collision Fragment)', mass: 28.5, rcs: 1.1, regime: 'LEO', dangerStatus: 'HIGH_WARNING', origin: '2009 Cosmos-Iridium Collision' }
];

// Add 200+ Multi-Regime Debris Objects
for (let i = 1; i <= 200; i++) {
  const isGEO = i % 15 === 0;
  const isMEO = i % 7 === 0;
  const alt = isGEO ? 35786 + (i * 12) : (isMEO ? 20180 + (i * 45) : 350 + Math.floor((i * 27) % 950));
  
  GLOBAL_SPACE_CATALOG.push({
    id: `SWARM-DEBRIS-${i}`,
    norad: 90000 + i,
    name: `Debris Fragment #${90000 + i}`,
    type: 'debris',
    alt: alt,
    vel: parseFloat((isGEO ? 3.07 : (isMEO ? 3.87 : 7.5)).toFixed(2)),
    inc: parseFloat((5 + (i * 13) % 90).toFixed(1)),
    raan: Math.floor((i * 43) % 360),
    phaseOffset: (i * 0.31) % (2 * Math.PI),
    period: isGEO ? 1436 : (isMEO ? 718 : 94),
    color: i % 3 === 0 ? '#ff2a6d' : (i % 2 === 0 ? '#ffaa00' : '#ff5500'),
    owner: 'Unknown Debris Cloud',
    mass: parseFloat((0.5 + (i % 15) * 1.2).toFixed(1)),
    rcs: parseFloat((0.02 + (i % 8) * 0.05).toFixed(2)),
    regime: isGEO ? 'GEO' : (isMEO ? 'MEO' : 'LEO'),
    dangerStatus: 'TRACKED_FRAGMENT'
  });
}

let selectedObject = GLOBAL_SPACE_CATALOG[0];
let threeScene, threeCamera, threeRenderer, threeControls;
let earthGroup, cloudsMesh, orbitLinesGroup, debrisGroup;
let raycaster, mouse;
let showOrbits = true;
let showDebris = true;
let timeSec = 0;
let meshToObjectMap = new Map();

document.addEventListener('DOMContentLoaded', () => {
  runEntranceSplashAnimation(() => {
    renderCatalog('ALL');
    selectObject(GLOBAL_SPACE_CATALOG[0].id);

    initPhotorealisticEarthGlobe();
    renderBPlaneRadar(142);
    initUI();
  });
});

function runEntranceSplashAnimation(onComplete) {
  const progressBar = document.getElementById('splash-progress-bar');
  const progressNum = document.getElementById('splash-progress-num');
  const overlay = document.getElementById('entrance-modal-overlay');

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
        if (onComplete) onComplete();
      }, 500);
    } else {
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressNum) progressNum.textContent = `${pct}%`;
    }
  }, 40);
}

function renderCatalog(filter) {
  const container = document.getElementById('satellite-list');
  if (!container) return;
  container.innerHTML = '';

  let list = GLOBAL_SPACE_CATALOG;
  if (filter === 'ACTIVE') list = GLOBAL_SPACE_CATALOG.filter(s => s.type === 'active' || s.type === 'station');
  if (filter === 'DEBRIS') list = GLOBAL_SPACE_CATALOG.filter(s => s.type === 'debris' || s.type === 'derelict' || s.type === 'rocket_body');

  const countElem = document.getElementById('catalog-count');
  if (countElem) countElem.textContent = `${list.length} OBJECTS`;

  list.slice(0, 70).forEach(obj => {
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
  selectedObject = GLOBAL_SPACE_CATALOG.find(s => s.id === id) || GLOBAL_SPACE_CATALOG[0];

  const nameElem = document.getElementById('hud-target-name');
  const typeElem = document.getElementById('hud-target-type');
  if (nameElem) nameElem.textContent = selectedObject.name;
  if (typeElem) typeElem.textContent = `${selectedObject.regime} ${selectedObject.type.toUpperCase()} | ALT: ${selectedObject.alt} km | VEL: ${selectedObject.vel} km/s`;

  document.getElementById('obj-detail-name').textContent = selectedObject.name;
  document.getElementById('obj-detail-norad').textContent = selectedObject.norad;
  document.getElementById('obj-detail-type').textContent = selectedObject.type.toUpperCase();
  document.getElementById('obj-detail-owner').textContent = selectedObject.owner || 'Global Catalog';
  document.getElementById('obj-detail-alt').textContent = `${selectedObject.alt} km (${selectedObject.regime})`;
  document.getElementById('obj-detail-vel').textContent = `${selectedObject.vel} km/s`;
  document.getElementById('obj-detail-inc').textContent = `${selectedObject.inc}°`;
  document.getElementById('obj-detail-mass').textContent = `${selectedObject.mass || 150} kg`;
  document.getElementById('obj-detail-rcs').textContent = `${selectedObject.rcs || 1.2} m²`;

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

/**
 * Creates High-Resolution Realistic NASA Blue Marble Canvas Procedural Fallback
 */
function createNASARealisticEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Ocean Base Color: Deep Space Ocean Indigo/Navy
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 2048);
  oceanGrad.addColorStop(0, '#020b18');
  oceanGrad.addColorStop(0.5, '#051b3b');
  oceanGrad.addColorStop(1, '#020b18');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 4096, 2048);

  // Continent Topography Masks
  const continents = [
    // Asia & India Subcontinent
    { x: 2800, y: 800, r: 420, color: '#1d3e28' },
    { x: 3000, y: 1100, r: 240, color: '#2d4b2e' }, // India Peninsula
    { x: 2600, y: 650, r: 350, color: '#4a422d' }, // Gobi Desert / Eurasia
    // Europe & Africa
    { x: 2200, y: 600, r: 280, color: '#254427' },
    { x: 2250, y: 1100, r: 380, color: '#7a6538' }, // Sahara / Africa
    // Americas
    { x: 1000, y: 700, r: 400, color: '#1b3b22' }, // North America
    { x: 1300, y: 1350, r: 360, color: '#15401d' }, // Amazon / South America
    // Australia & Antarctica
    { x: 3400, y: 1450, r: 250, color: '#7a5428' }, // Outback
    { x: 2000, y: 1950, r: 450, color: '#eaf4ff' }  // Antarctica
  ];

  continents.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();

    // Terrain Variation Overlay
    ctx.beginPath();
    ctx.arc(c.x + c.r * 0.2, c.y - c.r * 0.15, c.r * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120, 100, 50, 0.35)';
    ctx.fill();
  });

  // Realistic Cloud Swirls
  ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
  for (let i = 0; i < 60; i++) {
    const cx = Math.random() * 4096;
    const cy = 200 + Math.random() * 1648;
    const rx = 180 + Math.random() * 220;
    const ry = 40 + Math.random() * 45;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.PI / 12, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar Ice Caps
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 4096, 120);
  ctx.fillRect(0, 1928, 4096, 120);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Photorealistic NASA 3D Earth Globe Engine with Clouds & Specular Ocean Reflection
 */
function initPhotorealisticEarthGlobe() {
  const container = document.getElementById('canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  threeScene = new THREE.Scene();
  threeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  threeCamera.position.set(0, 8, 20);

  threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  threeRenderer.setSize(width, height);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    if (e.target.closest('.hamburger-panel-left') || e.target.closest('.hamburger-panel-right') || e.target.closest('.defcon-threat-meter') || e.target.closest('#space-weather-panel') || e.target.closest('.zoom-controls-float') || e.target.closest('button')) {
      return;
    }

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, threeCamera);
    const intersects = raycaster.intersectObjects(Array.from(meshToObjectMap.keys()));

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const clickedObj = meshToObjectMap.get(clickedMesh);
      if (clickedObj) {
        selectObject(clickedObj.id);
        const rightPanel = document.getElementById('right-hamburger-panel');
        if (rightPanel) rightPanel.classList.add('open');
      }
    }
  });

  // Dark Space Sunlight Calibration
  const ambientLight = new THREE.AmbientLight(0x334466, 1.2);
  threeScene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
  sunLight.position.set(35, 18, 35);
  threeScene.add(sunLight);

  // Earth Group with 23.44° Obliquity of Ecliptic
  earthGroup = new THREE.Group();
  earthGroup.rotation.z = (23.44 * Math.PI) / 180;
  threeScene.add(earthGroup);

  // High-Resolution NASA 4K Texture Maps
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = createNASARealisticEarthTexture();

  const earthGeo = new THREE.SphereGeometry(6.37, 64, 64);
  const earthMat = new THREE.MeshPhongMaterial({
    map: earthTexture,
    specular: new THREE.Color(0x1a3366),
    shininess: 25,
    bumpScale: 0.05
  });

  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthGroup.add(earthMesh);

  // Try Loading NASA High-Res Blue Marble Maps from Raw GitHub
  textureLoader.load(
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    (tex) => {
      earthMat.map = tex;
      earthMat.needsUpdate = true;
    }
  );

  textureLoader.load(
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    (specTex) => {
      earthMat.specularMap = specTex;
      earthMat.needsUpdate = true;
    }
  );

  textureLoader.load(
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    (normTex) => {
      earthMat.normalMap = normTex;
      earthMat.normalScale = new THREE.Vector2(0.85, 0.85);
      earthMat.needsUpdate = true;
    }
  );

  // Independent NASA Clouds Layer Mesh
  const cloudsGeo = new THREE.SphereGeometry(6.46, 64, 64);
  const cloudsMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending
  });
  cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
  earthGroup.add(cloudsMesh);

  textureLoader.load(
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_2048.png',
    (cloudTex) => {
      cloudsMat.map = cloudTex;
      cloudsMat.needsUpdate = true;
    }
  );

  // Atmosphere Rayleigh Scattering Rim Glow Shell
  const atmosGeo = new THREE.SphereGeometry(6.65, 64, 64);
  const atmosMat = new THREE.MeshBasicMaterial({
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.22,
    side: THREE.BackSide
  });
  earthGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

  // Deep Space Starfield
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(2000 * 3);
  for (let i = 0; i < 2000 * 3; i += 3) {
    starPos[i] = (Math.random() - 0.5) * 350;
    starPos[i + 1] = (Math.random() - 0.5) * 350;
    starPos[i + 2] = (Math.random() - 0.5) * 350;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  threeScene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.7, transparent: true, opacity: 0.9 })));

  orbitLinesGroup = new THREE.Group();
  debrisGroup = new THREE.Group();
  threeScene.add(orbitLinesGroup);
  threeScene.add(debrisGroup);

  const spacecraftList = [];
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

    // Orbit Splines
    if (obj.norad === 25544 || obj.norad === 44804 || obj.norad === 28941 || obj.norad === 43286 || obj.norad === 51001) {
      const pts = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * 2 * Math.PI;
        pts.push(getOrbitalPosition(altRadius, obj.inc, obj.raan || 0, a));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(obj.color), transparent: true, opacity: 0.45 });
      const line = new THREE.LineLoop(lineGeo, lineMat);
      orbitLinesGroup.add(line);
    }
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
    timeSec += 0.004;

    earthMesh.rotation.y += 0.0008;
    if (cloudsMesh) cloudsMesh.rotation.y += 0.0011; // Clouds rotate slightly faster for realism!

    spacecraftList.forEach(item => {
      const periodMin = item.data.period || 94.8;
      const speed = (2 * Math.PI) / (periodMin * 60);
      const currentAngle = item.phaseOffset + (timeSec * speed * 350) % (2 * Math.PI);
      const newPos = getOrbitalPosition(item.radius, item.data.inc, item.data.raan || 0, currentAngle);
      item.mesh.position.copy(newPos);

      if (selectedObject && item.data.id === selectedObject.id) {
        const subPoint = calculateSubPointLatLon(newPos, earthGroup.rotation.y);
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
