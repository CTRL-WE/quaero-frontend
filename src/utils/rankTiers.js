/**
 * Rank tier definitions and utility functions for the QUAERO reputation system.
 */

/** @type {ReadonlyArray<{name: string, minXp: number, maxXp: number|null, icon: string, tooltip: string}>} */
export const RANK_TIERS = Object.freeze([
  {
    name: 'Explorer',
    minXp: 0,
    maxXp: 99,
    icon: 'Compass',
    tooltip: 'Just starting your investigation journey.',
  },
  {
    name: 'Investigator',
    minXp: 100,
    maxXp: 299,
    icon: 'Search',
    tooltip: 'Building real investigative skills.',
  },
  {
    name: 'Analyst',
    minXp: 300,
    maxXp: 699,
    icon: 'BarChart3',
    tooltip: 'Sharp, evidence-driven reasoning.',
  },
  {
    name: 'Detective',
    minXp: 700,
    maxXp: 1499,
    icon: 'ShieldCheck',
    tooltip: 'A trusted voice in the investigation community.',
  },
  {
    name: 'Truth Guardian',
    minXp: 1500,
    maxXp: null,
    icon: 'Crown',
    tooltip: "Among QUAERO's most rigorous investigators.",
  },
]);

/**
 * Returns the rank tier object that matches the given total XP.
 * @param {number} totalXp
 * @returns {{name: string, minXp: number, maxXp: number|null, icon: string, tooltip: string}}
 */
export function getRankTier(totalXp) {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (totalXp >= RANK_TIERS[i].minXp) {
      return RANK_TIERS[i];
    }
  }
  return RANK_TIERS[0];
}

/**
 * Returns progress information toward the next rank tier.
 * @param {number} totalXp
 * @returns {{
 *   currentTier: object,
 *   nextTier: object|null,
 *   xpIntoTier: number,
 *   xpNeededForNextTier: number,
 *   percentToNext: number
 * }}
 */
export function getProgressToNextTier(totalXp) {
  const currentTier = getRankTier(totalXp);
  const currentIndex = RANK_TIERS.indexOf(currentTier);
  const nextTier =
    currentIndex < RANK_TIERS.length - 1 ? RANK_TIERS[currentIndex + 1] : null;

  // Truth Guardian — already at the top tier
  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      xpIntoTier: totalXp - currentTier.minXp,
      xpNeededForNextTier: 0,
      percentToNext: 100,
    };
  }

  const xpIntoTier = totalXp - currentTier.minXp;
  const xpNeededForNextTier = nextTier.minXp - currentTier.minXp;
  const percentToNext = Math.min(
    100,
    Math.floor((xpIntoTier / xpNeededForNextTier) * 100),
  );

  return {
    currentTier,
    nextTier,
    xpIntoTier,
    xpNeededForNextTier,
    percentToNext,
  };
}
