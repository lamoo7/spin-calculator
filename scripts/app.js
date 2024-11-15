// app.js

// Enforce limits on input values
function enforceLimits() {
  const levelInput = document.getElementById("championLevel");
  const eRankInput = document.getElementById("eRank");
  levelInput.value = Math.min(Math.max(1, levelInput.value), 18);
  eRankInput.value = Math.min(Math.max(1, eRankInput.value), 5);
}

// Sum item stats from selected items
function getItemBonuses() {
  return selectedItems.reduce(
    (acc, item) => {
      if (item) {
        acc.ad += item.ad || 0;
        acc.as += item.as || 0;
        acc.critChance = Math.min(100, acc.critChance + (item.critChance || 0));
        acc.lethality += item.lethality || 0;
        acc.pen += item.pen || 0;

        // Set critDamage to 215% if Infinity Edge is found in selected items
        if (item.name === "Infinity Edge") {
          acc.critDamage = 215;
        }
      }
      return acc;
    },
    { ad: 0, as: 0, critChance: 0, critDamage: 175, lethality: 0, pen: 0 } // Default critDamage is 175%
  );
}

function updateStats() {
  enforceLimits();

  const level = parseInt(document.getElementById("championLevel").value) || 1;
  const eRank = parseInt(document.getElementById("eRank").value) || 1;
  const armor = parseFloat(document.getElementById("enemyArmor").value) || 0;

  // Calculate level-based stats
  const levelBasedAD = calculateLevelBasedAD(level);
  const ASResults = calculateLevelBasedAS(level);

  // Get item bonuses
  const { ad: itemAD, as: itemASPercent, critChance, critDamage, lethality, pen } = getItemBonuses();

  // Combine stats
  const totalAD = calculateTotalAD(levelBasedAD, itemAD);
  const totalAS = calculateTotalAS(ASResults.levelBonusAS, itemASPercent);

  // Display combined AD and AS
  document.getElementById("adValue").textContent = totalAD.toFixed(2);
  document.getElementById("asValue").textContent = `${totalAS.toFixed(3)} / ${(ASResults.levelBonusAS + itemASPercent).toFixed(2)}%`;

  // Display capped crit chance and adjusted crit damage
  document.getElementById("critValue").textContent = `${critChance}% / ${critDamage}%`;

  // Display Lethality and Percent Armor Penetration
  document.getElementById("penValue").textContent = `${lethality} / ${pen}%`;

  const spins = calculateSpinCountFromAS(ASResults.levelBonusAS + itemASPercent);
  document.getElementById("spinCount").textContent = spins;

  // Calculate E ability damage per spin with mitigation
  const { baseDamagePerSpin, dmgPerCritSpin, closestDmgPerSpin, closestDmgPerCritSpin } = 
      calculateDamagePerSpin(level, eRank, totalAD, critDamage, armor, lethality, pen);

  // Update spin damage with mitigation
  document.getElementById("dmgPerSpin").textContent = baseDamagePerSpin;
  document.getElementById("closestDmgPerSpin").textContent = closestDmgPerSpin;

  // Update critical spin damage with mitigation
  document.getElementById("dmgPerCritSpin").textContent = dmgPerCritSpin;
  document.getElementById("closestDmgPerCritSpin").textContent = closestDmgPerCritSpin;

  // Calculate total E ability damage factoring in crits and closest target bonus
  const { totalDamage, closestTargetTotalDamage } =
      calculateTotalEDamage(spins, baseDamagePerSpin, critChance, critDamage);

  // Update total damage
  document.getElementById("totalEDmg").textContent = totalDamage;
  document.getElementById("closestTotalEDmg").textContent = closestTargetTotalDamage;
}

// Add event listeners for input changes
document.getElementById("championLevel").addEventListener("input", updateStats);
document.getElementById("eRank").addEventListener("input", updateStats);
document.getElementById("enemyArmor").addEventListener("input", updateStats);

// Initialize
document.addEventListener("DOMContentLoaded", updateStats);
