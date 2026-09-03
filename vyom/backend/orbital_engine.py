"""
VYOM Orbital Physics & SGP4 Trajectory Engine
Calculates 3D Cartesian coordinates, Keplerian plane rotations, and 20-Year Decay projections.
"""

import math
import time

EARTH_RADIUS_KM = 6371.0
EARTH_MU = 398600.4418  # km^3 / s^2

class OrbitalEngine:
    def __init__(self):
        pass

    @staticmethod
    def get_position_at_time(alt_km, inc_deg, raan_deg, period_min, phase_offset, current_time_sec):
        """
        Calculates 3D Position Vector (x, y, z) incorporating RAAN and Inclination plane rotations.
        """
        r_km = EARTH_RADIUS_KM + alt_km
        inc = math.radians(inc_deg)
        raan = math.radians(raan_deg)

        speed_rad_per_sec = (2 * math.pi) / (period_min * 60)
        current_angle = phase_offset + (current_time_sec * speed_rad_per_sec * 350) % (2 * math.pi)

        # Orbital Plane Coordinates
        x_prime = r_km * math.cos(current_angle)
        z_prime = r_km * math.sin(current_angle)

        # Inclination Rotation around X-axis
        x_inc = x_prime
        y_inc = z_prime * math.sin(inc)
        z_inc = z_prime * math.cos(inc)

        # RAAN Rotation around Y-axis
        x = x_inc * math.cos(raan) + z_inc * math.sin(raan)
        y = y_inc
        z = -x_inc * math.sin(raan) + z_inc * math.cos(raan)

        return {"x": round(x, 2), "y": round(y, 2), "z": round(z, 2), "r_km": round(r_km, 2)}

    @staticmethod
    def calculate_sub_point(x, y, z, earth_rotation_rad):
        """
        Computes Sub-Satellite Sub-Point Latitude and Longitude.
        """
        r = math.sqrt(x*x + y*y + z*z)
        lat_rad = math.asin(y / r) if r > 0 else 0
        lat_deg = math.degrees(lat_rad)

        lon_rad = math.atan2(z, x) - earth_rotation_rad
        lon_deg = math.degrees(lon_rad)
        lon_deg = ((lon_deg + 180) % 360) - 180

        lat_str = f"{abs(lat_deg):.2f}° {'N' if lat_deg >= 0 else 'S'}"
        lon_str = f"{abs(lon_deg):.2f}° {'E' if lon_deg >= 0 else 'W'}"

        return {"lat_deg": round(lat_deg, 4), "lon_deg": round(lon_deg, 4), "lat_str": lat_str, "lon_str": lon_str}

    @staticmethod
    def predict_20_year_decay(alt_km, regime, decay_rate_per_year=1.2, start_year=2026):
        """
        Predicts 20-Year Orbital Decay (2026 to 2046) driven by thermospheric atmospheric drag.
        """
        rate = 0.001 if regime == "GEO" else (0.01 if regime == "MEO" else decay_rate_per_year)
        projections = []
        
        for yr in range(start_year, start_year + 21, 4):
            elapsed = yr - start_year
            proj_alt = max(0, round(alt_km - elapsed * rate))
            projections.append({
                "year": yr,
                "alt_km": proj_alt,
                "status": "RE-ENTERED" if proj_alt < 100 else f"{proj_alt} km"
            })
            
        return {
            "start_alt_km": alt_km,
            "decay_rate_per_year_km": rate,
            "predicted_reentry_year": start_year + math.ceil(alt_km / rate) if rate > 0.05 and alt_km < 2000 else "> 100 Years",
            "projections": projections
        }
