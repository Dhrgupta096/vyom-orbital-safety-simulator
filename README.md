# 📡 VYOM — Real-Time 3D Space Debris Tracking & Threat Intelligence Radar

> **Bharatiya Antariksh Hackathon (BAH)**  
> *Autonomous Multi-Sensor Orbital Debris Fusion, Keep-Out Volume Protection & 20-Year Decay Trajectory Engine*

---

## 🌟 Executive Summary

**VYOM** ("Space Debris Tracking & Threat Intelligence System") is a web-based space situational awareness (SSA) radar dashboard designed to track cataloged objects ($>10\text{ cm}$) and micro-debris swarms ($1\text{ mm} - 10\text{ cm}$) across all Near-Earth space regimes (**LEO, MEO, GEO, and Graveyard Corridors**). 

VYOM incorporates **NASA Blue Marble 4K Photorealistic Earth WebGL Graphics**, **23.44° Real Axial Tilt**, **Interactive 3D Object Raycasting**, **ISRO Satellite Asset Highlighting**, **Keep-Out Volume Station Protective Shields**, **Python 3D Collision Time-Slider**, and **20-Year Orbital Decay Prediction Engines**.

---

## 🎬 Interactive Demo & Usage Guide

Follow this walkthrough to explore VYOM's core capabilities:

### 1. 🚀 Entrance Splash & System Diagnostics
Upon loading, VYOM runs an automated system diagnostic and progress ticker (`0% ➔ 100%`) syncing live orbital catalogs before smoothly revealing the 3D space scene.

### 2. 🌍 3D NASA Earth Globe Navigation
- **Rotate**: Click and drag anywhere on the space background to orbit around Earth.
- **Zoom**: Scroll your mouse wheel or click the onscreen **`[ + ]`** and **`[ − ]`** buttons to zoom out up to 100,000 km in space.
- **Reset**: Click the **`[ 🎯 ]`** button to reset the camera back to default view.

### 3. 🎯 Click Selection & Object Telemetry Inspector
- **Click Any Object in 3D**: Click any satellite, space station (ISS / Tiangong), or debris fragment directly on the globe.
- **Instant Telemetry**: The right panel automatically slides open displaying:
  - NORAD ID, Fleet Category, and Operating Owner Agency (e.g. **ISRO India**, **SpaceX**, **NASA**).
  - Real-time Altitude ($\text{km}$), Velocity ($\text{km/s}$), Mass ($\text{kg}$), and Radar Cross-Section RCS ($\text{m}^2$).
  - Sub-Satellite Ground Track **Latitude ($\phi$)** and **Longitude ($\lambda$)**.

### 4. ⏱️ Python 3D Collision Time-Slider
- Use the bottom timeline scrubber: **`[ -60m  ◄◄ -10m   PLAY   +10m ►►   +60m ]`**.
- Drag the slider to scrub through time from **$-60$ minutes to $+60$ minutes** around Time of Closest Approach (TCA). Watch the 3D satellite encounters unfold while querying the Python 3 backend API in real-time.

### 5. 📉 20-Year Orbital Decay Prediction (2026 ➔ 2046)
Select any object to view its 20-year thermospheric drag decay projection matrix (**Year 2026, 2030, 2034, 2038, 2042, 2046**) and predicted atmospheric re-entry epoch.

### 6. 🛡️ Keep-Out Volume Protective Shield
Observe 3D cyan wireframe protective spheres surrounding the **ISS** and **Tiangong Space Station**. Approaching debris triggers automated **DEFCON 2 Conjunction Threat Warnings**.

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

---

## 🛠️ System Architecture & Technology Stack

- **Frontend 3D Rendering**: Three.js (WebGL), OrbitControls, CSS3 Glassmorphism
- **Backend Server**: Python 3 (FastAPI / Standard Library REST API Server)
- **Physics Engine**: Python 3 SGP4 orbital propagator, 20-Year Decay Thermospheric Engine, and 2D B-Plane encounter calculator
- **Data Provenance**: CelesTrak, Space-Track, ESA DISCOS, NASA ORDEM 3.2, NOAA SWPC, and ESA TIRA 34m Radar

---

## 💻 Quick Start & Local Running

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vyom-orbital-safety-simulator.git
   cd vyom-orbital-safety-simulator
   ```

2. Start the Python 3 Backend Physics Server:
   ```bash
   cd vyom/backend
   python3 server.py 8080
   ```

3. Start the Web Dashboard Server:
   ```bash
   cd ../ui
   python3 -m http.server 8000
   ```

4. Open your browser and navigate to `http://localhost:8000`!

---

## 📜 Scientific References

- **Harsha et al. (2024)** — *Physics-Informed Neural Network (PINN) post-collision momentum-conservation trajectory uncertainty cloud inference*, Nature Scientific Reports / ISRO URSC.
- **NASA ORDEM 3.2 / ESA MASTER-8** — Orbital Debris Engineering Model & Space Debris Mitigation Guidelines.

---

## 🇮🇳 Developed for Bharatiya Antariksh Hackathon (BAH)
