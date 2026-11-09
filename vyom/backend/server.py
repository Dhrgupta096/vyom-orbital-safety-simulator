"""
=============================================================================
VYOM Python Backend Server — FastAPI & REST API Suite
=============================================================================
Provides Real-Time Orbital Telemetry, 20-Year Decay Projections, PINN Inference,
Conjunction Threat Alerts, and 3D Collision Time-Slider Simulations in Python.
"""

import time
import json
import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

UI_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ui"))
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Import physics engines written in Python 3
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from orbital_engine import OrbitalEngine
from pinn_engine import PINNInferenceEngine
from conjunction_engine import ConjunctionEngine
from time_slider_engine import CollisionTimeSliderEngine

GLOBAL_SPACE_CATALOG = [
  { "id": "ISS-01", "norad": 25544, "name": "ISS (International Space Station)", "type": "station", "alt": 420, "vel": 7.66, "inc": 51.6, "raan": 45, "period": 92.9, "color": "#00ffff", "owner": "NASA/ESA/JAXA/ISRO", "mass": 450000, "rcs": 400, "regime": "LEO" },
  { "id": "TIANGONG-01", "norad": 48274, "name": "Tiangong Space Station", "type": "station", "alt": 389, "vel": 7.68, "inc": 41.5, "raan": 120, "period": 92.4, "color": "#00e5ff", "owner": "CNSA", "mass": 100000, "rcs": 180, "regime": "LEO" },
  { "id": "BAS-ISRO-01", "norad": 99002, "name": "Bharatiya Antariksh Station (BAS)", "type": "station", "alt": 400, "vel": 7.67, "inc": 51.5, "raan": 75, "period": 92.5, "color": "#ff9933", "isro": True, "owner": "ISRO (India)", "mass": 52000, "rcs": 120, "regime": "LEO" },
  { "id": "GATEWAY-01", "norad": 99001, "name": "Lunar Gateway Outpost (Artemis)", "type": "station", "alt": 38400, "vel": 1.02, "inc": 28.5, "raan": 200, "period": 10080, "color": "#ffe060", "owner": "NASA/ESA/JAXA", "mass": 40000, "rcs": 150, "regime": "GEO" },
  { "id": "AXIOM-01", "norad": 99003, "name": "Axiom Commercial Station Module", "type": "station", "alt": 410, "vel": 7.66, "inc": 51.6, "raan": 160, "period": 92.7, "color": "#39ff14", "owner": "Axiom Space / NASA", "mass": 30000, "rcs": 90, "regime": "LEO" },
  { "id": "SKYLAB-HISTORIC", "norad": 6633, "name": "Skylab Orbital Target", "type": "station", "alt": 435, "vel": 7.65, "inc": 50.0, "raan": 290, "period": 93.2, "color": "#ffaa00", "owner": "NASA Historical Target", "mass": 77000, "rcs": 110, "regime": "LEO" },
  { "id": "MIR-HISTORIC", "norad": 16609, "name": "Mir Space Station Target", "type": "station", "alt": 390, "vel": 7.68, "inc": 51.6, "raan": 310, "period": 92.4, "color": "#ffaa00", "owner": "Roscosmos Historical Target", "mass": 12970, "rcs": 210, "regime": "LEO" },
  { "id": "HST-01", "norad": 20580, "name": "Hubble Space Telescope (HST)", "type": "active", "alt": 535, "vel": 7.59, "inc": 28.5, "raan": 178, "period": 95.4, "color": "#00f3ff", "owner": "NASA/ESA", "mass": 11110, "rcs": 12.0, "regime": "LEO" },
  { "id": "ENVISAT-DERELICT", "norad": 27386, "name": "Envisat (Derelict Mega-Debris)", "type": "derelict", "alt": 765, "vel": 7.47, "inc": 98.5, "raan": 305, "period": 100.2, "color": "#ff5500", "owner": "ESA (Derelict Rocket/Payload)", "mass": 8211, "rcs": 26.0, "regime": "LEO", "miss": 210, "origin": "Power Loss Derelict Mega-Fragment Target" },
  { "id": "CARTOSAT-3", "norad": 44804, "name": "Cartosat-3 (ISRO EO)", "type": "active", "alt": 509, "vel": 7.61, "inc": 97.5, "raan": 15, "period": 94.8, "color": "#ff9933", "isro": True, "owner": "ISRO (India)", "mass": 1625, "rcs": 4.5, "regime": "LEO" },
  { "id": "EOS-06", "norad": 54361, "name": "EOS-06 Oceansat-3 (ISRO)", "type": "active", "alt": 742, "vel": 7.48, "inc": 98.4, "raan": 150, "period": 99.7, "color": "#ff9933", "isro": True, "owner": "ISRO (India)", "mass": 1117, "rcs": 3.8, "regime": "LEO" },
  { "id": "GSAT-24", "norad": 52892, "name": "GSAT-24 (ISRO DTH Satcom)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.1, "raan": 83, "period": 1436, "color": "#ff9933", "isro": True, "owner": "ISRO (India 🇮🇳)", "mass": 4180, "rcs": 14.5, "regime": "GEO" },
  { "id": "GSAT-30", "norad": 45026, "name": "GSAT-30 (ISRO Heavy Satcom)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.1, "raan": 83, "period": 1436, "color": "#ff9933", "isro": True, "owner": "ISRO (India 🇮🇳)", "mass": 3357, "rcs": 12.0, "regime": "GEO" },
  { "id": "INSAT-3DR", "norad": 39635, "name": "INSAT-3DR (ISRO Weather)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.2, "raan": 74, "period": 1436, "color": "#ff9933", "isro": True, "owner": "ISRO (India 🇮🇳)", "mass": 2211, "rcs": 8.0, "regime": "GEO" },
  { "id": "INSAT-3DS", "norad": 58943, "name": "INSAT-3DS (ISRO Next-Gen MetSat)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.1, "raan": 74, "period": 1436, "color": "#ff9933", "isro": True, "owner": "ISRO (India 🇮🇳)", "mass": 2275, "rcs": 8.4, "regime": "GEO" },
  { "id": "GSAT-11", "norad": 43839, "name": "GSAT-11 (ISRO High-Throughput)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.1, "raan": 74, "period": 1436, "color": "#ff9933", "isro": True, "owner": "ISRO (India 🇮🇳)", "mass": 5854, "rcs": 24.0, "regime": "GEO" },
  { "id": "GOES-16", "norad": 41866, "name": "GOES-16 (NOAA/NASA East)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.0, "raan": 285, "period": 1436, "color": "#00f3ff", "owner": "USA (NOAA / NASA 🇺🇸)", "mass": 5192, "rcs": 18.0, "regime": "GEO" },
  { "id": "GOES-18", "norad": 51850, "name": "GOES-18 (NOAA/NASA West)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.1, "raan": 223, "period": 1436, "color": "#00f3ff", "owner": "USA (NOAA / NASA 🇺🇸)", "mass": 5192, "rcs": 18.0, "regime": "GEO" },
  { "id": "GOES-19", "norad": 60130, "name": "GOES-19 (NOAA GOES-U MetSat)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.0, "raan": 255, "period": 1436, "color": "#00f3ff", "owner": "USA (NOAA / NASA 🇺🇸)", "mass": 5200, "rcs": 18.5, "regime": "GEO" },
  { "id": "BEIDOU-GEO-1", "norad": 43702, "name": "BeiDou-3 G1 (CNSA Nav)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 1.5, "raan": 140, "period": 1436, "color": "#00e5ff", "owner": "China (CNSA 🇨🇳)", "mass": 4600, "rcs": 15.0, "regime": "GEO" },
  { "id": "HIMAWARI-9", "norad": 41836, "name": "Himawari-9 (JAXA Weather)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.1, "raan": 140, "period": 1436, "color": "#39ff14", "owner": "Japan (JAXA 🇯🇵)", "mass": 3500, "rcs": 11.5, "regime": "GEO" },
  { "id": "METEOSAT-11", "norad": 40732, "name": "Meteosat-11 (EUMETSAT)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.2, "raan": 0, "period": 1436, "color": "#ffe060", "owner": "ESA / Europe 🇪🇺", "mass": 2000, "rcs": 7.5, "regime": "GEO" },
  { "id": "YAMAL-601", "norad": 44307, "name": "Yamal-601 (Roscosmos Satcom)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.1, "raan": 49, "period": 1436, "color": "#ff2a6d", "owner": "Russia (Roscosmos 🇷🇺)", "mass": 5700, "rcs": 20.0, "regime": "GEO" },
  { "id": "GEO-KOMPSAT-2A", "norad": 43823, "name": "GEO-KOMPSAT-2A (KARI Korea)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.1, "raan": 128, "period": 1436, "color": "#00ffff", "owner": "South Korea (KARI 🇰🇷)", "mass": 3500, "rcs": 12.0, "regime": "GEO" },
  { "id": "TURKSAT-5B", "norad": 50184, "name": "Turksat 5B (Turkey Satcom)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.1, "raan": 42, "period": 1436, "color": "#ff9900", "owner": "Turkey (Turksat 🇹🇷)", "mass": 4500, "rcs": 16.0, "regime": "GEO" },
  { "id": "STAR-ONE-D2", "norad": 49060, "name": "Star One D2 (Embratel Brazil)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 0.1, "raan": 290, "period": 1436, "color": "#00ff88", "owner": "Brazil (Embratel 🇧🇷)", "mass": 6200, "rcs": 22.0, "regime": "GEO" },
  { "id": "STARLINK-1007", "norad": 44713, "name": "Starlink-1007", "type": "active", "alt": 550, "vel": 7.59, "inc": 53.0, "raan": 40, "period": 95.6, "color": "#00f3ff", "owner": "SpaceX", "mass": 260, "rcs": 1.8, "regime": "LEO" }
]

GLOBAL_GEO_GROUND_STATIONS = [
  { "id": "GS-ISRO-HASSAN", "name": "ISRO Master Control Facility (Hassan)", "country": "India 🇮🇳", "operator": "ISRO", "lat": 13.00, "lon": 76.10, "type": "mcf", "color": "#ff9933", "targetGeo": "GSAT-24" },
  { "id": "GS-NASA-GOLDSTONE", "name": "Goldstone Deep Space Network", "country": "USA 🇺🇸", "operator": "NASA / DSN", "lat": 35.43, "lon": -116.89, "type": "radar", "color": "#00f3ff", "targetGeo": "GOES-16" },
  { "id": "GS-CNSA-XIAN", "name": "Xi'an Satellite Control Centre", "country": "China 🇨🇳", "operator": "CNSA", "lat": 34.26, "lon": 108.95, "type": "mcf", "color": "#00e5ff", "targetGeo": "BEIDOU-GEO-1" },
  { "id": "GS-ESA-KOUROU", "name": "Kourou ESTRACK Station", "country": "Europe 🇪🇺", "operator": "ESA / CNES", "lat": 5.23, "lon": -52.77, "type": "mcf", "color": "#ffe060", "targetGeo": "METEOSAT-11" },
  { "id": "GS-JAXA-OKINAWA", "name": "Okinawa Tracking & Telemetry", "country": "Japan 🇯🇵", "operator": "JAXA", "lat": 26.50, "lon": 127.85, "type": "telemetry", "color": "#39ff14", "targetGeo": "HIMAWARI-9" },
  { "id": "GS-ROSCOSMOS-BEARLAKES", "name": "Bear Lakes Deep Space Station", "country": "Russia 🇷🇺", "operator": "Roscosmos", "lat": 55.86, "lon": 37.95, "type": "radar", "color": "#ff2a6d", "targetGeo": "YAMAL-601" }
]

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse
    import uvicorn

    app = FastAPI(
        title="VYOM Python Orbital Physics API Server",
        description="Python FastAPI Backend for 3D Collision Time-Slider & Orbital Telemetry",
        version="1.1.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/v1/status")
    def read_status():
        return {
            "status": "ONLINE",
            "system": "VYOM Python Physics Engine",
            "active_catalog_objects": len(GLOBAL_SPACE_CATALOG),
            "version": "1.1.0"
        }

    @app.get("/api/v1/catalog")
    def get_catalog():
        return {"count": len(GLOBAL_SPACE_CATALOG), "catalog": GLOBAL_SPACE_CATALOG}

    @app.get("/api/v1/ground-stations")
    def get_ground_stations():
        return {"count": len(GLOBAL_GEO_GROUND_STATIONS), "ground_stations": GLOBAL_GEO_GROUND_STATIONS}

    @app.get("/api/v1/time-slider")
    def get_time_slider_positions(offset_min: float = 0.0):
        """
        Python Endpoint for 3D Collision Time-Slider.
        Scrubs time offsets (-60m to +60m around TCA) and calculates 3D coordinates.
        """
        return CollisionTimeSliderEngine.calculate_positions_at_offset(GLOBAL_SPACE_CATALOG, offset_min)

    @app.get("/api/v1/object/{norad_id}")
    def get_object_details(norad_id: int):
        obj = next((s for s in GLOBAL_SPACE_CATALOG if s["norad"] == norad_id), GLOBAL_SPACE_CATALOG[0])
        decay_info = OrbitalEngine.predict_20_year_decay(obj["alt"], obj["regime"])
        pos_info = OrbitalEngine.get_position_at_time(obj["alt"], obj["inc"], obj["raan"], obj["period"], 0, time.time())
        subpoint = OrbitalEngine.calculate_sub_point(pos_info["x"], pos_info["y"], pos_info["z"], 0)

        return {
            "object": obj,
            "telemetry_3d": pos_info,
            "subpoint_ground_track": subpoint,
            "twenty_year_decay_prediction": decay_info
        }

    @app.get("/api/v1/conjunctions")
    def get_conjunctions():
        prob = ConjunctionEngine.calculate_collision_probability(miss_distance_m=142.0)
        return {
            "critical_conjunction_pair": {
                "primary": "Cartosat-3 (NORAD 44804)",
                "secondary": "Fengyun 1C Fragment #28941 (NORAD 28941)",
            },
            "threat_analysis": prob
        }

    @app.post("/api/v1/pinn/infer")
    def run_pinn_inference(parent_mass_kg: float = 1200.0, rel_velocity_km_s: float = 14.2):
        return PINNInferenceEngine.run_fragmentation_inference(parent_mass_kg, rel_velocity_km_s)

    @app.get("/demo.html")
    def serve_demo():
        return FileResponse(os.path.join(PROJECT_ROOT, "demo.html"))

    app.mount("/vyom/ui", StaticFiles(directory=UI_DIR, html=True), name="vyom_ui")
    app.mount("/", StaticFiles(directory=UI_DIR, html=True), name="root_ui")

    def start_fastapi_server(port=8080):
        print(f"🚀 Starting VYOM FastAPI Python Server on http://0.0.0.0:{port}...")
        uvicorn.run(app, host="0.0.0.0", port=port)

except ImportError:
    # Python Standard Library HTTP REST API Fallback
    class VYOMHTTPRequestHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=UI_DIR, **kwargs)

        def end_headers(self):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            super().end_headers()

        def _set_headers(self, status=200):
            self.send_response(status)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', '*')
            self.end_headers()

        def do_OPTIONS(self):
            self._set_headers(200)

        def do_GET(self):
            # Strip conditional caching headers so browser never reuses another project's cached localhost:8080 page
            if 'If-Modified-Since' in self.headers:
                del self.headers['If-Modified-Since']
            if 'If-None-Match' in self.headers:
                del self.headers['If-None-Match']

            parsed_path = urlparse(self.path)
            
            if parsed_path.path == '/api/v1/time-slider':
                self._set_headers(200)
                params = parse_qs(parsed_path.query)
                offset = float(params.get('offset_min', [0.0])[0])
                data = CollisionTimeSliderEngine.calculate_positions_at_offset(GLOBAL_SPACE_CATALOG, offset)
                self.wfile.write(json.dumps(data).encode('utf-8'))
            elif parsed_path.path == '/api/v1/catalog':
                self._set_headers(200)
                data = {"count": len(GLOBAL_SPACE_CATALOG), "catalog": GLOBAL_SPACE_CATALOG}
                self.wfile.write(json.dumps(data).encode('utf-8'))
            elif parsed_path.path == '/api/v1/ground-stations':
                self._set_headers(200)
                data = {"count": len(GLOBAL_GEO_GROUND_STATIONS), "ground_stations": GLOBAL_GEO_GROUND_STATIONS}
                self.wfile.write(json.dumps(data).encode('utf-8'))
            elif parsed_path.path.startswith('/api/v1/object/'):
                self._set_headers(200)
                try:
                    norad_id = int(parsed_path.path.rstrip('/').split('/')[-1])
                    obj = next((s for s in GLOBAL_SPACE_CATALOG if s["norad"] == norad_id), GLOBAL_SPACE_CATALOG[0])
                except (ValueError, IndexError):
                    obj = GLOBAL_SPACE_CATALOG[0]
                decay_info = OrbitalEngine.predict_20_year_decay(obj["alt"], obj["regime"])
                pos_info = OrbitalEngine.get_position_at_time(obj["alt"], obj["inc"], obj["raan"], obj["period"], 0, time.time())
                subpoint = OrbitalEngine.calculate_sub_point(pos_info["x"], pos_info["y"], pos_info["z"], 0)
                data = {
                    "object": obj,
                    "telemetry_3d": pos_info,
                    "subpoint_ground_track": subpoint,
                    "twenty_year_decay_prediction": decay_info
                }
                self.wfile.write(json.dumps(data).encode('utf-8'))
            elif parsed_path.path == '/api/v1/conjunctions':
                self._set_headers(200)
                data = ConjunctionEngine.calculate_collision_probability(142.0)
                self.wfile.write(json.dumps(data).encode('utf-8'))
            elif parsed_path.path.startswith('/api/'):
                self._set_headers(200)
                data = {"status": "ONLINE", "system": "VYOM Python Server (Time-Slider Ready)"}
                self.wfile.write(json.dumps(data).encode('utf-8'))
            elif parsed_path.path in ('/demo.html', '/index.html') and not os.path.exists(os.path.join(UI_DIR, parsed_path.path.lstrip('/'))):
                demo_file = os.path.join(PROJECT_ROOT, parsed_path.path.lstrip('/'))
                if os.path.exists(demo_file):
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    with open(demo_file, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    super().do_GET()
            elif parsed_path.path == '/demo.html':
                demo_file = os.path.join(PROJECT_ROOT, "demo.html")
                if os.path.exists(demo_file):
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    with open(demo_file, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    super().do_GET()
            elif parsed_path.path.startswith('/vyom/ui/'):
                self.path = parsed_path.path[len('/vyom/ui'):]
                super().do_GET()
            else:
                super().do_GET()

    class ReusableHTTPServer(HTTPServer):
        allow_reuse_address = True

    def start_fastapi_server(port=8080):
        for p in range(port, port + 10):
            try:
                httpd = ReusableHTTPServer(('127.0.0.1', p), VYOMHTTPRequestHandler)
                print(f"🚀 Starting VYOM Python HTTP API Server on http://localhost:{p}...", flush=True)
                httpd.serve_forever()
                break
            except OSError as e:
                if e.errno == 48 and p < port + 9:
                    continue
                raise

if __name__ == '__main__':
    target_port = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", 8080))
    start_fastapi_server(target_port)
