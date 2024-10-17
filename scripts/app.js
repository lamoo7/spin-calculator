let selectedItems = [null, null, null, null, null, null];

function enforceLimits() {
  const levelInput = document.getElementById("championLevel");
  const eRankInput = document.getElementById("eRank");
  
  levelInput.value = Math.min(Math.max(1, levelInput.value), 18);
  eRankInput.value = Math.min(Math.max(1, eRankInput.value), 5);
}

function updateStats() {
  enforceLimits();

  const level = parseInt(document.getElementById("championLevel").value) || 1;
  const eRank = parseInt(document.getElementById("eRank").value) || 1;
  const { bonusAD, bonusAS } = getBonusStatsFromItems(selectedItems);

  const totalAD = calculateAD(level, bonusAD);
  const ASResults = calculateAS(level, bonusAS);

  document.getElementById("adValue").textContent = totalAD;
  document.getElementById("asValue").textContent = `${ASResults.totalAS} / ${ASResults.totalBonusAS}%`;

  const spins = calculateSpins(ASResults.totalBonusAS);
  document.getElementById("spinCount").textContent = spins;

  const { baseDamagePerSpin, closestEnemyDamagePerSpin } = calculateDamagePerSpin(level, eRank, totalAD);
  
  // Regular damage per spin
  document.getElementById("dmgPerSpin").textContent = baseDamagePerSpin;
  
  // Nearest enemy damage per spin
  document.getElementById("closestDmgPerSpin").textContent = closestEnemyDamagePerSpin;
  
  // Total damage over all spins
  const totalEDmg = (spins * baseDamagePerSpin).toFixed(2);
  document.getElementById("totalEDmg").textContent = totalEDmg;
  
  // Total damage over all spins against nearest enemy
  const closestTotalEDmg = (spins * closestEnemyDamagePerSpin).toFixed(2);
  document.getElementById("closestTotalEDmg").textContent = closestTotalEDmg;
}


// Add event listeners
document.getElementById("championLevel").addEventListener("input", updateStats);
document.getElementById("eRank").addEventListener("input", updateStats);

document.addEventListener("DOMContentLoaded", () => {
  updateStats();
});
