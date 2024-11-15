// calculator.js

// Constants for Garen's base stats and growth
const baseAD = 69;
const growthAD = 4.5;
const baseAS = 0.625;
const ASRatio = 0.625;
const growthAS = 3.65;

// Calculate level-based AD
function calculateLevelBasedAD(level) {
  const levelUps = level - 1;
  const growthFactor = 0.7025 + 0.0175 * levelUps;
  return baseAD + growthAD * levelUps * growthFactor;
}

// Calculate level-based AS
function calculateLevelBasedAS(level) {
  const levelUps = level - 1;
  const growthFactor = 0.7025 + 0.0175 * levelUps;
  const bonusASFromLevels = growthAS * levelUps * growthFactor;
  return {
    levelBasedAS: baseAS + (bonusASFromLevels / 100) * ASRatio,
    levelBonusAS: bonusASFromLevels
  };
}

// Calculate total AD by combining level-based and item AD
function calculateTotalAD(levelBasedAD, itemAD) {
  return levelBasedAD + itemAD;
}

// Calculate total AS by combining level-based and item AS
function calculateTotalAS(levelBonusAS, itemASPercent) {
  const totalBonusAS = levelBonusAS + itemASPercent;
  return baseAS + (totalBonusAS / 100) * ASRatio;
}

// Calculate spin count
function calculateSpinCountFromAS(totalBonusAS) {
  return Math.floor(7 + totalBonusAS / 25);
}

// Calculate damage per spin with level, item AD, crit, and armor
function calculateDamagePerSpin(level, eRank, totalAD, critDamage, armor, lethality, pen) {
  const rankDamage = [4, 8, 12, 16, 20];
  const ADScaling = [0.36, 0.37, 0.38, 0.39, 0.4];
  let levelBonusDamage = level <= 9 ? (level - 1) * 0.8 : 8 * 0.8 + (level - 9) * 0.2;

  // Apply Percent Penetration first
  const armorAfterPen = armor * (1 - pen / 100);

  // Subtract Lethality
  const finalArmor = Math.max(0, armorAfterPen - lethality);

  // Damage reduction
  const damageReduction = 100 / (100 + finalArmor);

  // Base damage per spin
  const baseDamagePerSpinRaw = rankDamage[eRank - 1] + levelBonusDamage + ADScaling[eRank - 1] * totalAD;
  const baseDamagePerSpin = baseDamagePerSpinRaw * damageReduction;

  // Critical damage per spin
  const critMultiplier = critDamage / 100;
  const dmgPerCritSpin = baseDamagePerSpinRaw * critMultiplier * damageReduction;

  // Closest target bonus (25%)
  const closestDmgPerSpin = baseDamagePerSpin * 1.25;
  const closestDmgPerCritSpin = dmgPerCritSpin * 1.25;

  return {
    baseDamagePerSpin: baseDamagePerSpin.toFixed(2),
    dmgPerCritSpin: dmgPerCritSpin.toFixed(2),
    closestDmgPerSpin: closestDmgPerSpin.toFixed(2),
    closestDmgPerCritSpin: closestDmgPerCritSpin.toFixed(2)
  };
}

// Function to calculate total E ability damage, factoring in crits and closest target bonus
function calculateTotalEDamage(spins, baseDamagePerSpin, critChance, critDamage) {
  // Calculate the expected number of crit spins based on critChance
  const critSpins = Math.floor(spins * (critChance / 100));
  const regularSpins = spins - critSpins;

  // Calculate damage for regular spins
  const regularDamage = regularSpins * baseDamagePerSpin;

  // Calculate damage for crit spins with crit multiplier
  const critMultiplier = critDamage / 100;
  const critDamageTotal = critSpins * baseDamagePerSpin * critMultiplier;

  // Total damage including regular and crit spins
  const totalDamage = regularDamage + critDamageTotal;

  // Calculate 25% bonus damage for the closest target
  const closestTargetTotalDamage = totalDamage * 1.25;

  return {
      totalDamage: totalDamage.toFixed(2),
      closestTargetTotalDamage: closestTargetTotalDamage.toFixed(2),
      critSpins,
      regularSpins
  };
}
