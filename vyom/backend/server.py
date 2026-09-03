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
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

# Import physics engines written in Python 3
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from orbital_engine import OrbitalEngine
from pinn_engine import PINNInferenceEngine
from conjunction_engine import ConjunctionEngine
from time_slider_engine import CollisionTimeSliderEngine

GLOBAL_SPACE_CATALOG = [
  { "id": "ISS-01", "norad": 25544, "name": "ISS (Space Station)", "type": "station", "alt": 420, "vel": 7.66, "inc": 51.6, "raan": 45, "period": 92.9, "color": "#00ffff", "owner": "NASA/ESA/JAXA/ISRO", "mass": 450000, "rcs": 400, "regime": "LEO" },
  { "id": "TIANGONG-01", "norad": 48274, "name": "Tiangong Station", "type": "station", "alt": 389, "vel": 7.68, "inc": 41.5, "raan": 120, "period": 92.4, "color": "#00e5ff", "owner": "CNSA", "mass": 100000, "rcs": 180, "regime": "LEO" },
  { "id": "CARTOSAT-3", "norad": 44804, "name": "Cartosat-3 (ISRO EO)", "type": "active", "alt": 509, "vel": 7.61, "inc": 97.5, "raan": 15, "period": 94.8, "color": "#ff9933", "isro": True, "owner": "ISRO (India)", "mass": 1625, "rcs": 4.5, "regime": "LEO" },
  { "id": "EOS-06", "norad": 54361, "name": "EOS-06 Oceansat-3 (ISRO)", "type": "active", "alt": 742, "vel": 7.48, "inc": 98.4, "raan": 150, "period": 99.7, "color": "#ff9933", "isro": True, "owner": "ISRO (India)", "mass": 1117, "rcs": 3.8, "regime": "LEO" },
  { "id": "NAVIC-1I", "norad": 43286, "name": "NavIC IRNSS-1I (ISRO Nav)", "type": "active", "alt": 35786, "vel": 3.07, "inc": 29.5, "raan": 130, "period": 1436, "color": "#ff9933", "isro": True, "owner": "ISRO (India)", "mass": 1425, "rcs": 5.0, "regime": "GEO" },
  { "id": "DEB-FY1C-28941", "norad": 28941, "name": "Fengyun 1C Fragment #28941", "type": "debris", "alt": 512, "vel": 7.62, "inc": 98.9, "raan": 15, "period": 94.9, "color": "#ff2a6d", "owner": "China (ASAT Fragment)", "mass": 12.4, "rcs": 0.45, "regime": "LEO", "miss": 142, "origin": "2007 ASAT Missile Intercept Breakup" }
]

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
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

    @app.get("/")
    def read_root():
        return {
            "status": "ONLINE",
            "system": "VYOM Python Physics Engine",
            "active_catalog_objects": len(GLOBAL_SPACE_CATALOG),
            "version": "1.1.0"
        }

    @app.get("/api/v1/catalog")
    def get_catalog():
        return {"count": len(GLOBAL_SPACE_CATALOG), "catalog": GLOBAL_SPACE_CATALOG}

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

    def start_fastapi_server(port=8080):
        print(f"🚀 Starting VYOM FastAPI Python Server on http://0.0.0.0:{port}...")
        uvicorn.run(app, host="0.0.0.0", port=port)

except ImportError:
    # Python Standard Library HTTP REST API Fallback
    class VYOMHTTPRequestHandler(BaseHTTPRequestHandler):
        def _set_headers(self, status=200):
            self.send_response(status)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

        def do_GET(self):
            self._set_headers(200)
            parsed_path = urlparse(self.path)
            
            if parsed_path.path == '/api/v1/time-slider':
                params = parse_qs(parsed_path.query)
                offset = float(params.get('offset_min', [0.0])[0])
                data = CollisionTimeSliderEngine.calculate_positions_at_offset(GLOBAL_SPACE_CATALOG, offset)
            elif parsed_path.path == '/api/v1/catalog':
                data = {"count": len(GLOBAL_SPACE_CATALOG), "catalog": GLOBAL_SPACE_CATALOG}
            elif parsed_path.path == '/api/v1/conjunctions':
                data = ConjunctionEngine.calculate_collision_probability(142.0)
            else:
                data = {"status": "ONLINE", "system": "VYOM Python Server (Time-Slider Ready)"}
                
            self.wfile.write(json.dumps(data).encode('utf-8'))

    def start_fastapi_server(port=8080):
        print(f"🚀 Starting VYOM Python HTTP API Server on http://0.0.0.0:{port}...")
        httpd = HTTPServer(('0.0.0.0', port), VYOMHTTPRequestHandler)
        httpd.serve_forever()

if __name__ == '__main__':
    target_port = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", 8080))
    start_fastapi_server(target_port)
