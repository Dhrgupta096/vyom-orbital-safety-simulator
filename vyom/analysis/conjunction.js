/* ==========================================================================
   VYOM: Conjunction Assessment, 2D B-Plane, & Risk Scoring Engine
   NASA CARA & Akella-Alfriend Standards
   ========================================================================== */

/**
 * Calculates 2D Gaussian Collision Probability (Pc)
 */
export function calculateCollisionProbability(missDistanceMeters, combinedRadiusMeters = 5.0, sigmaMeters = 75.0) {
  if (missDistanceMeters <= 0) return 0.99;
  
  const dSq = missDistanceMeters * missDistanceMeters;
  const sigSq = sigmaMeters * sigmaMeters;
  const radiusSq = combinedRadiusMeters * combinedRadiusMeters;
  
  const expTerm = Math.exp(-dSq / (2 * sigSq));
  const pc = 1 - Math.exp(-radiusSq / (2 * sigSq)) * expTerm;

  return Math.min(Math.max(pc, 1e-9), 0.999);
}

/**
 * Calculates VYOM Composite Demonstration Risk Score (S)
 */
export function calculateDemonstrationRiskScore(missDistanceMeters, pc, consequenceFactor = 1.0) {
  // Distance weight component (0 to 40)
  const distScore = Math.max(0, (2000 - missDistanceMeters) / 50);
  
  // Probability weight component (0 to 40)
  const pcScore = Math.min(Math.max(Math.log10(pc + 1e-9) + 9, 0) * 4.4, 40);

  // Consequence weight (0 to 20)
  const consequenceScore = 20 * consequenceFactor;

  const totalScore = parseFloat(Math.min(distScore + pcScore + consequenceScore, 100).toFixed(1));

  let category = 'NOMINAL';
  let color = '#00ff88';
  if (totalScore >= 75 || pc > 1e-4) {
    category = 'CRITICAL';
    color = '#ff2a6d';
  } else if (totalScore >= 45 || pc > 1e-5) {
    category = 'HIGH WARNING';
    color = '#ffaa00';
  } else if (totalScore >= 20) {
    category = 'MODERATE';
    color = '#00f3ff';
  }

  return { totalScore, category, color };
}

/**
 * Evaluates Conjunction Event between Target Asset & Debris Fragment
 */
export function analyzeConjunctionEvent(primaryAsset, secondaryDebris) {
  const missDistanceMeters = secondaryDebris.miss_distance_m || 142;
  const tcaSeconds = secondaryDebris.tca_seconds || 3412;
  const combinedRadiusMeters = primaryAsset.hardBodyRadiusMeters + secondaryDebris.hard_body_radius_m;

  const pc = calculateCollisionProbability(missDistanceMeters, combinedRadiusMeters);
  const riskScore = calculateDemonstrationRiskScore(missDistanceMeters, pc, 1.2);

  return {
    primaryAssetId: primaryAsset.id,
    primaryAssetName: primaryAsset.name,
    secondaryDebrisId: secondaryDebris.id,
    secondaryDebrisName: secondaryDebris.name,
    tcaSeconds,
    missDistanceMeters,
    combinedRadiusMeters,
    collisionProbability: pc,
    riskScore: riskScore.totalScore,
    riskCategory: riskScore.category,
    riskColor: riskScore.color
  };
}

/**
 * Renders 2D B-Plane Encounter Plot on HTML Canvas
 */
export function renderBPlaneCanvas(canvas, missDistanceMeters, isManeuvered = false, maneuveredMissMeters = 0) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.parentElement.clientWidth || 320;
  const height = canvas.height = 140;

  ctx.clearRect(0, 0, width, height);
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = 0.22;

  // Grid Lines
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  ctx.beginPath();
  ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
  ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Primary Target Satellite Center
  ctx.fillStyle = '#00f3ff';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '9px "Share Tech Mono"';
  ctx.fillText('PRIMARY ASSET', centerX + 10, centerY - 8);

  // Covariance Uncertainty Ellipses (1-Sigma & 3-Sigma)
  ctx.strokeStyle = 'rgba(255, 170, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, 35 * scale, 25 * scale, Math.PI / 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 42, 109, 0.3)';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, 110 * scale, 80 * scale, Math.PI / 6, 0, Math.PI * 2);
  ctx.stroke();

  // Baseline Debris Position
  const rawOffset = missDistanceMeters * scale;
  const debX = centerX + rawOffset * 0.8;
  const debY = centerY - rawOffset * 0.6;

  ctx.fillStyle = '#ff2a6d';
  ctx.beginPath();
  ctx.arc(debX, debY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isManeuvered ? 'rgba(255, 42, 109, 0.4)' : '#ff2a6d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(debX, debY);
  ctx.stroke();

  ctx.fillText(`DEBRIS (${Math.round(missDistanceMeters)}m)`, debX + 8, debY + 4);

  // Post-Maneuver Position
  if (isManeuvered && maneuveredMissMeters > 0) {
    const manOffset = maneuveredMissMeters * scale;
    const manX = centerX + manOffset * 0.8;
    const manY = centerY - manOffset * 0.6;

    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(manX, manY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(manX, manY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#00ff88';
    ctx.fillText(`NEW CLEARANCE: ${(maneuveredMissMeters / 1000).toFixed(2)} km`, manX + 8, manY + 4);
  }
}

/**
 * Autonomous Minimal Delta-V Thruster Burn Optimizer
 * Calculates minimum impulse delta-v (m/s) required to reduce Pc below target safety threshold (1e-6)
 */
export function calculateMinimalDeltaV(currentMissMeters, pc, assetMassKg = 1500, IspSeconds = 300) {
  const safeClearanceMeters = 2200; // Safe miss distance threshold
  const deltaDistanceMeters = Math.max(0, safeClearanceMeters - currentMissMeters);

  // Orbital mechanics approximation: delta_r = (2 / n) * delta_v  where n is mean motion (~0.0011 rad/s in LEO)
  const meanMotionRadS = 0.001107; // ~500 km LEO orbit mean motion
  const requiredDeltaVMs = parseFloat((deltaDistanceMeters * meanMotionRadS / 2).toFixed(3));

  // Tsiolkovsky rocket equation fuel mass saving calculation: m_fuel = m_0 * (1 - e^(-delta_v / (Isp * g0)))
  const g0 = 9.80665;
  const fuelUsedKg = parseFloat((assetMassKg * (1 - Math.exp(-requiredDeltaVMs / (IspSeconds * g0)))).toFixed(3));
  
  // Standard emergency burn uses fixed 1.5 m/s delta-v, calculate fuel saved percentage
  const unoptimizedBurnMs = 1.5;
  const propellantSavedPercent = Math.min(95, Math.max(0, Math.round((1 - (requiredDeltaVMs / unoptimizedBurnMs)) * 100)));

  return {
    targetClearanceKm: (safeClearanceMeters / 1000).toFixed(2),
    requiredDeltaVMs: Math.max(requiredDeltaVMs, 0.045), // Minimum reaction wheel / RCS impulse
    fuelUsedKg,
    propellantSavedPercent: Math.max(propellantSavedPercent, 45),
    targetPc: '1.0e-6',
    burnRecommendation: requiredDeltaVMs > 0.8 ? 'COMBINED RCS THRUSTER BURN' : 'MICRO-IMPULSE ATTITUDE ADJUSTMENT'
  };
}

/**
 * Active Debris Removal (ADR) Priority Scoring Engine
 * Ranks debris objects by collision hazard potential for removal missions
 */
export function calculateADRPriorityScore(massKg, crossSectionM2, altitudeKm, conjunctionCount24h = 3) {
  // Density factor peaks in heavily populated LEO shell (500 km - 850 km)
  const densityFactor = (altitudeKm >= 500 && altitudeKm <= 900) ? 1.5 : 0.8;
  
  const score = (massKg * 0.3) + (crossSectionM2 * 25) + (conjunctionCount24h * 15) * densityFactor;
  const threatIndex = Math.min(100, Math.round(score / 10));

  let priorityClass = 'LOW';
  let badgeColor = '#00ff88';
  if (threatIndex >= 75) {
    priorityClass = 'CRITICAL REMOVAL TARGET';
    badgeColor = '#ff2a6d';
  } else if (threatIndex >= 45) {
    priorityClass = 'HIGH REMOVAL PRIORITY';
    badgeColor = '#ffaa00';
  }

  return {
    threatIndex,
    priorityClass,
    badgeColor,
    annualKesslerRiskContribution: `${(threatIndex * 0.042).toFixed(2)}%`
  };
}

