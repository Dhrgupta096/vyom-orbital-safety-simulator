/* ==========================================================================
   VYOM: Multi-Sensor Data Fusion Engine
   Modeled after ESA TIRA Radar, Space Fence, LeoLabs, GESTRA, & NASA DRAGONS/SDS
   ========================================================================== */

export const SENSOR_NETWORK = [
  {
    id: 'ESA_TIRA_RADAR',
    name: 'ESA TIRA Monostatic Radar (34m Dish)',
    operator: 'ESA / FGAN (Germany)',
    sensorType: 'monostatic_radar',
    modeledAfter: 'ESA TIRA L-Band + Ku-Band Monostatic Radar',
    minDetectableSizeCm: 1.5,
    maxAltitudeKm: 2500,
    baseConfidence: 0.96,
    reportsIndividualTrack: true,
    icon: '📡',
    description: '34m parabolic dish with L-band tracking & Ku-band high-res imaging.'
  },
  {
    id: 'SPACE_FENCE',
    name: 'Space Fence (Kwajalein Atoll)',
    operator: 'U.S. Space Force',
    sensorType: 'ground_radar_large',
    modeledAfter: 'Space Fence-class S-Band Phased Array',
    minDetectableSizeCm: 10.0,
    maxAltitudeKm: 2000,
    baseConfidence: 0.95,
    reportsIndividualTrack: true,
    icon: '📡',
    description: 'Surveillance catalog radar tracking objects >10cm in LEO.'
  },
  {
    id: 'LEOLABS_COSTA_RICA',
    name: 'LeoLabs Costa Rica Radar',
    operator: 'LeoLabs Commercial',
    sensorType: 'ground_radar_phased_array',
    modeledAfter: 'LeoLabs-class S-Band Phased Array Network',
    minDetectableSizeCm: 2.0,
    maxAltitudeKm: 1500,
    baseConfidence: 0.88,
    reportsIndividualTrack: true,
    icon: '🛰️',
    description: 'High-revisit commercial S-band radar capable of tracking down to ~2cm.'
  },
  {
    id: 'GESTRA_GERMANY',
    name: 'GESTRA Mobile SSA Radar',
    operator: 'DLR / German SSA Center',
    sensorType: 'ground_radar_phased_array',
    modeledAfter: 'GESTRA-class L-Band Phased Array (1.3 GHz)',
    minDetectableSizeCm: 8.0,
    maxAltitudeKm: 3000,
    baseConfidence: 0.90,
    reportsIndividualTrack: true,
    icon: '⚡',
    description: 'Mobile L-band phased array providing fast orbit parameter estimation.'
  },
  {
    id: 'DRAGONS_SDS_ISS',
    name: 'Space Debris Sensor (SDS / DRAGONS)',
    operator: 'NASA / NRL / ISS Columbus',
    sensorType: 'in_situ_impact',
    modeledAfter: 'NASA DRAGONS In-Situ Impact Detector',
    minDetectableSizeCm: 0.005, // 50 microns to few mm
    maxAltitudeKm: 420, // ISS orbit
    baseConfidence: 0.99,
    reportsIndividualTrack: false, // Statistical flux only
    icon: '💥',
    description: 'Measures sub-mm to mm impact flux, direction, and energy (in-situ flux statistics).'
  }
];

export function calculateSensorDetectionConfidence(sensor, spaceObject) {
  if (spaceObject.altitudeKm > sensor.maxAltitudeKm) return 0.0;
  const objSizeCm = spaceObject.sizeClassCm || 15.0;
  if (objSizeCm < sensor.minDetectableSizeCm) return 0.0;

  const marginRatio = (objSizeCm - sensor.minDetectableSizeCm) / (sensor.minDetectableSizeCm + 5.0);
  const sizeFactor = Math.min(Math.max(0.4 + marginRatio * 0.6, 0.2), 1.0);

  return parseFloat((sensor.baseConfidence * sizeFactor).toFixed(2));
}

export function fuseSensorDetectionProfiles(spaceObject) {
  const profile = [];
  let combinedUncertainty = 1.0;

  SENSOR_NETWORK.forEach(sensor => {
    const confidence = calculateSensorDetectionConfidence(sensor, spaceObject);
    if (confidence > 0) {
      profile.push({
        sensorId: sensor.id,
        sensorName: sensor.name,
        modeledAfter: sensor.modeledAfter,
        confidence,
        reportsIndividualTrack: sensor.reportsIndividualTrack
      });
      combinedUncertainty *= (1 - confidence);
    }
  });

  return {
    spaceObjectId: spaceObject.id,
    spaceObjectName: spaceObject.name,
    fusedConfidence: parseFloat((1 - combinedUncertainty).toFixed(2)),
    contributingSensorsCount: profile.length,
    sensorProfiles: profile
  };
}
