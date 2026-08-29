/* ==========================================================================
   VYOM: Space Debris & Management System - Object Taxonomy & Data Models
   Grounded in ESA DISCOS, NASA ORDEM 3.2, & Space-Track Taxonomies
   ========================================================================== */

/**
 * Human-Made Space Object Classes
 */
export const OBJECT_CLASSES = {
  ACTIVE_PAYLOAD: { id: 'active_payload', label: 'Active Payload', color: '#00f3ff', trackable: true },
  INACTIVE_PAYLOAD: { id: 'inactive_payload', label: 'Inactive / Derelict Payload', color: '#ffaa00', trackable: true },
  ROCKET_BODY: { id: 'rocket_body', label: 'Spent Rocket Body', color: '#ff5500', trackable: true },
  FRAGMENT: { id: 'fragment', label: 'Fragmentation Debris (>10cm)', color: '#ff2a6d', trackable: true },
  STATISTICAL_SUB10CM: { id: 'statistical_sub10cm', label: 'Sub-10-cm Statistical Debris', color: '#9d00ff', trackable: false }
};

/**
 * Orbital Regimes (ESA Space Debris User Portal Standards)
 */
export const ORBITAL_REGIMES = {
  LEO: { name: 'Low Earth Orbit (LEO)', minAltKm: 160, maxAltKm: 2000 },
  MEO: { name: 'Medium Earth Orbit (MEO)', minAltKm: 2000, maxAltKm: 35786 },
  GEO: { name: 'Geostationary Orbit (GEO)', minAltKm: 35780, maxAltKm: 35800 }
};

/**
 * Debris Size Classes
 */
export const DEBRIS_SIZE_BANDS = [
  { id: 'MICRO', label: '<1 mm', trackingStatus: 'Statistical Flux Only', risk: 'Surface erosion, small craters' },
  { id: 'MILLI', label: '1 mm - 1 cm', trackingStatus: 'Statistical Flux Only', risk: 'Penetration, wiring damage' },
  { id: 'SUB10CM', label: '1 cm - 10 cm', trackingStatus: 'Partially Detectable / Hybrid', risk: 'Serious mission damage' },
  { id: 'CATALOGED', label: '>10 cm', trackingStatus: 'Cataloged & Tracked', risk: 'Catastrophic collision potential' }
];

/**
 * Normalizes Space Object Schema (SI Units internally)
 */
export function normalizeSpaceObject(rawObj) {
  const objClass = OBJECT_CLASSES[rawObj.object_class?.toUpperCase()] || OBJECT_CLASSES.FRAGMENT;
  
  return {
    id: rawObj.id,
    noradId: rawObj.norad_id || 0,
    name: rawObj.name || 'Unidentified Space Object',
    objectClass: objClass,
    missionClass: rawObj.mission_class || 'General Orbit',
    regime: rawObj.regime || 'LEO',
    
    // Orbit State
    altitudeKm: rawObj.altitude_km,
    altitudeMeters: rawObj.altitude_km * 1000, // SI
    velocityKmS: rawObj.velocity_km_s,
    velocityMs: rawObj.velocity_km_s * 1000, // SI
    inclinationDeg: rawObj.inclination_deg,
    eccentricity: rawObj.eccentricity || 0.0001,
    periodMin: rawObj.period_min,
    
    // Physical & Hard-Body Properties
    massKg: rawObj.mass_kg || 100,
    crossSectionM2: rawObj.cross_section_m2 || 1.0,
    hardBodyRadiusMeters: rawObj.hard_body_radius_m || 1.5,
    sizeClassCm: rawObj.size_class_cm || 15.0,
    maneuverable: rawObj.maneuverable || false,
    color: rawObj.color || objClass.color
  };
}
