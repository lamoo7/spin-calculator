// Constants for Garen
const baseAD = 69;
const growthAD = 4.5;
const baseAS = 0.625;
const ASRatio = 0.625;
const growthAS = 3.65;

function calculateAD(level, bonusAD = 0) {
  const levelUps = level - 1;
  const growthFactor = 0.7025 + 0.0175 * levelUps;
  const totalAD = baseAD + bonusAD + growthAD * levelUps * growthFactor;
  return totalAD.toFixed(2);
}

function calculateAS(level, bonusASPercent = 0) {
  const levelUps = level - 1;
  const growthFactor = 0.7025 + 0.0175 * levelUps;
  const bonusASFromLevels = growthAS * levelUps * growthFactor;
  const totalBonusAS = bonusASFromLevels + bonusASPercent;
  const totalAS = baseAS + (totalBonusAS / 100) * ASRatio;
  return {
    totalAS: totalAS.toFixed(3),
    bonusASFromLevels: bonusASFromLevels.toFixed(3),
    totalBonusAS: totalBonusAS.toFixed(3),
  };
}

function calculateSpins(bonusASPercent) {
  return Math.floor(7 + bonusASPercent / 25);
}

function calculateDamagePerSpin(level, eRank, AD) {
  const rankDamage = [4, 8, 12, 16, 20];
  const ADScaling = [0.36, 0.37, 0.38, 0.39, 0.4];
  
  let levelBonusDamage = level <= 9 ? (level - 1) * 0.8 : 8 * 0.8 + (level - 9) * 0.2;
  
  const baseDamagePerSpin = rankDamage[eRank - 1] + levelBonusDamage + ADScaling[eRank - 1] * AD;
  const closestEnemyDamagePerSpin = baseDamagePerSpin * 1.25; // Nearest enemy takes 25% more damage
  
  return {
    baseDamagePerSpin: baseDamagePerSpin.toFixed(2),
    closestEnemyDamagePerSpin: closestEnemyDamagePerSpin.toFixed(2),
  };
}

function getBonusStatsFromItems(selectedItems) {
  let bonusAD = 0;
  let bonusAS = 0;
  selectedItems.forEach((item) => {
    if (item) {
      bonusAD += item.ad;
      bonusAS += item.as;
    }
  });
  return { bonusAD, bonusAS };
}
