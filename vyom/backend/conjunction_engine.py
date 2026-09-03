"""
VYOM Conjunction & 2D B-Plane Encounter Engine
Calculates miss distances, 2D B-Plane covariance matrices, and 2D Gaussian Collision Probability (Pc).
"""

import math

class ConjunctionEngine:
    def __init__(self):
        pass

    @staticmethod
    def calculate_collision_probability(miss_distance_m, combined_radius_m=15.0, sigma_xy_m=50.0):
        """
        Akella-Alfriend 2D Gaussian Collision Probability (Pc) Integral Formulation.
        """
        r_sq = miss_distance_m ** 2
        sig_sq = sigma_xy_m ** 2
        area_ratio = (combined_radius_m ** 2) / (2 * sig_sq)
        p_c = area_ratio * math.exp(-r_sq / (2 * sig_sq))

        threat_level = "DEFCON 1 (EXTREME)" if miss_distance_m < 50 else (
            "DEFCON 2 (CRITICAL)" if miss_distance_m < 200 else (
                "DEFCON 3 (HIGH)" if miss_distance_m < 500 else "DEFCON 5 (NOMINAL)"
            )
        )

        return {
            "miss_distance_meters": miss_distance_m,
            "combined_hard_body_radius_m": combined_radius_m,
            "covariance_sigma_m": sigma_xy_m,
            "collision_probability_pc": f"{p_c:.4e}",
            "threat_level": threat_level
        }
