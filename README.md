# 📡 VYOM — Real-Time 3D Space Debris Tracking & Threat Intelligence Radar

> **Bharatiya Antariksh Hackathon (BAH)**  
> *Autonomous Multi-Sensor Orbital Debris Fusion, Keep-Out Volume Protection & 20-Year Decay Trajectory Engine*

---

## 🌟 Executive Summary

**VYOM** ("Space Debris Tracking & Threat Intelligence System") is a web-based space situational awareness (SSA) radar dashboard designed to track cataloged objects ($>10\text{ cm}$) and micro-debris swarms ($1\text{ mm} - 10\text{ cm}$) across all Near-Earth space regimes (**LEO, MEO, GEO, and Graveyard Corridors**). 

Inspired by **[OrbitalRadar.com](https://orbitalradar.com/)**, VYOM incorporates **NASA Blue Marble 4K Photorealistic Earth WebGL Graphics**, **23.44° Real Axial Tilt**, **Interactive 3D Object Raycasting**, **ISRO Satellite Asset Highlighting**, **Keep-Out Volume Station Protective Shields**, and **20-Year Orbital Decay Prediction Engines**.

---

## 🚀 Key Features

1. **Photorealistic NASA 4K Blue Marble Earth Globe**:
   - Specular ocean reflections, normal bump map terrain relief, independent rotating cloud layers, and Rayleigh atmospheric scattering.
   - Real **23.44° Axial Tilt (Obliquity of Ecliptic)** & diurnal spin around axis.

2. **Near-Earth Multi-Regime Orbital Coverage**:
   - **LEO (< 2,000 km)**: Crowded Low Earth Orbit shells (Space Stations, Earth Observation, Starlink).
   - **MEO (2,000 – 35,000 km)**: Navigation constellations (NavIC, GPS, Galileo).
   - **GEO (35,786 km)**: Geostationary telecommunications belt.
   - **Super-GEO Graveyard Belt (> 36,000 km)**: Passivated upper stages and retired satellites.

3. **Keep-Out Volume Protective Shield around Space Stations**:
   - 3D Cyan wireframe **Keep-Out Spherical Shields** around human space stations (**ISS** and **Tiangong**).
   - Real-time **DEFCON 2 Conjunction Threat Early Warnings**.

4. **20-Year Orbital Decay Trajectory Prediction (2026 ➔ 2046)**:
   - Thermospheric atmospheric drag decay modeling predicting exact re-entry epoch years.

5. **ISRO Saffron Gold Asset Highlighting**:
   - Special highlight badges (`🇮🇳 ISRO`) and Saffron Gold (`#ff9933`) accents for Indian space assets (Cartosat-3, Oceansat-3, RISAT-1A, NavIC IRNSS-1I, PSLV-C37).

6. **Interactive 3D Raycasting & Onscreen Zoom Controls**:
   - Click ANY 3D satellite or debris directly on the globe to open its full intelligence telemetry panel.
   - Onscreen `[ + ]` / `[ − ]` controls allowing zooming out to 100,000 km view.

---

## 🛠️ System Architecture & Technology Stack

- **3D Graphics & Scene Rendering**: Three.js (WebGL), OrbitControls
- **UI Framework & Styling**: Modular Glassmorphic CSS3, JetBrains Mono & Orbitron Typography
- **Physics & Orbital Mechanics**: 3D Keplerian Inclination ($i$) + RAAN ($\Omega$) plane transformations
- **Data Provenance**: CelesTrak, Space-Track, ESA DISCOS, NASA ORDEM 3.2, NOAA SWPC, and ESA TIRA 34m Radar

---

## 💻 Quick Start & Local Running

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vyom-orbital-safety-simulator.git
   cd vyom-orbital-safety-simulator/vyom/ui
   ```

2. Start a local HTTP web server:
   ```bash
   python3 -m http.server 8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

---

## 📜 Scientific References

- **Harsha et al. (2024)** — *Physics-Informed Neural Network (PINN) post-collision momentum-conservation trajectory uncertainty cloud inference*, Nature Scientific Reports / ISRO URSC.
- **NASA ORDEM 3.2 / ESA MASTER-8** — Orbital Debris Engineering Model & Space Debris Mitigation Guidelines.

---

## 🇮🇳 Developed for Bharatiya Antariksh Hackathon (BAH)
