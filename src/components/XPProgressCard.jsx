import { getProgressToNextTier } from '../utils/rankTiers';

/**
 * XPProgressCard — shows a linear progress bar toward the next rank tier.
 *
 * Props:
 *   totalXp – the user's total XP (undefined triggers skeleton state)
 */

/* ── Gradient stops per tier for the progress bar fill ────────────── */
const TIER_BAR_GRADIENT = {
  Explorer: 'linear-gradient(90deg, #94a3b8, #64748b)',
  Investigator: 'linear-gradient(90deg, #22d3ee, #06b6d4)',
  Analyst: 'linear-gradient(90deg, #a78bfa, #8b5cf6)',
  Detective: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
  'Truth Guardian': 'linear-gradient(90deg, #fbbf24, #34d399)',
};

/* ── Skeleton (loading) state ─────────────────────────────────────── */
function Skeleton() {
  return (
    <div
      className="rounded-base border border-border-hairline bg-surface-card/80 px-4 py-3"
      aria-busy="true"
      aria-label="Loading rank progress"
    >
      {/* Label skeleton */}
      <div className="mb-2 h-3 w-40 animate-pulse rounded bg-surface-overlay" />

      {/* Bar skeleton */}
      <div className="h-2 w-full animate-pulse rounded-full bg-surface-overlay" />
    </div>
  );
}

/* ── Component ────────────────────────────────────────────────────── */

function XPProgressCard({ totalXp }) {
  if (totalXp === undefined) return <Skeleton />;

  const {
    currentTier,
    nextTier,
    xpIntoTier,
    xpNeededForNextTier,
    percentToNext,
  } = getProgressToNextTier(totalXp);

  const isTopTier = nextTier === null;
  const gradient =
    TIER_BAR_GRADIENT[currentTier.name] ?? TIER_BAR_GRADIENT.Explorer;

  /* ── Aria label ── */
  const ariaLabel = isTopTier
    ? `Rank: ${currentTier.name}, Top Tier`
    : `Rank: ${currentTier.name}, ${xpIntoTier} of ${xpNeededForNextTier} XP to next rank`;

  return (
    <div
      className="rounded-base border border-border-hairline bg-surface-card/80 px-4 py-3"
    >
      {/* Label row */}
      <div className="mb-2 flex items-baseline justify-between text-xs">
        {isTopTier ? (
          <>
            <span className="font-semibold text-yellow-300">
              ✦ Top Tier
            </span>
            <span className="text-text-muted">
              {currentTier.name}
            </span>
          </>
        ) : (
          <>
            <span className="text-text-secondary">
              <span className="font-semibold text-text-primary">
                {xpIntoTier}
              </span>
              {' / '}
              {xpNeededForNextTier} XP to{' '}
              <span className="font-medium text-text-primary">
                {nextTier.name}
              </span>
            </span>
            <span className="tabular-nums text-text-muted">
              {percentToNext}%
            </span>
          </>
        )}
      </div>

      {/* Progress track */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface-overlay"
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={percentToNext}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentToNext}%`,
            background: gradient,
          }}
        />
      </div>
    </div>
  );
}

export default XPProgressCard;
