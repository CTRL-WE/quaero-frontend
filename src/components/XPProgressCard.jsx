import { Compass, Search, BarChart3, ShieldCheck, Crown } from 'lucide-react';
import { RANK_TIERS, getProgressToNextTier } from '../utils/rankTiers';

/**
 * XPProgressCard — rank-tier tally: one row per tier with a fill bar.
 *
 * Props:
 *   totalXp – the user's total XP (undefined triggers skeleton state)
 */

/* ── Icon map (matches rankTiers icon strings) ────────────────────── */
const ICON_MAP = {
  Compass,
  Search,
  BarChart3,
  ShieldCheck,
  Crown,
};

/* ── Per-tier fill colours ────────────────────────────────────────── */
const TIER_FILL = {
  Explorer:       '#8a8a92',
  Investigator:   '#2e64a8',
  Analyst:        '#7a4fc9',
  Detective:      '#8a6a3c',
  'Truth Guardian': '#e03e2d',
};

/* ── Skeleton (loading) state ─────────────────────────────────────── */
function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Loading rank progress">
      {RANK_TIERS.map((tier) => (
        <div key={tier.name} className="tier-tally-row" style={{ opacity: 0.3 }}>
          <div className="tier-icon">
            <div
              className="animate-pulse"
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                background: 'rgba(22, 20, 18, 0.12)',
              }}
            />
          </div>
          <div
            className="tier-name animate-pulse"
            style={{ background: 'rgba(22,20,18,0.08)', height: 10, borderRadius: 3 }}
          />
          <div className="tier-bar-track">
            <div className="tier-bar-fill" style={{ width: 0 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Component ────────────────────────────────────────────────────── */

function XPProgressCard({ totalXp }) {
  if (totalXp === undefined) return <Skeleton />;

  const {
    currentTier,
    percentToNext,
  } = getProgressToNextTier(totalXp);

  const currentIndex = RANK_TIERS.indexOf(currentTier);

  return (
    <div aria-label={`Rank progress: ${currentTier.name}`}>
      {RANK_TIERS.map((tier, idx) => {
        const IconComponent = ICON_MAP[tier.icon] ?? Compass;
        const isCurrent = idx === currentIndex;
        const fillColor = TIER_FILL[tier.name] ?? TIER_FILL.Explorer;

        // Fill logic
        let fillPercent = 0;
        if (idx < currentIndex) {
          fillPercent = 100;
        } else if (isCurrent) {
          fillPercent = percentToNext;
        }

        return (
          <div
            key={tier.name}
            className={`tier-tally-row ${isCurrent ? 'is-current' : ''}`}
          >
            <div className="tier-icon">
              <IconComponent
                className="h-4 w-4"
                style={{
                  color: isCurrent || idx < currentIndex
                    ? fillColor
                    : 'rgba(22,20,18,0.25)',
                }}
                aria-hidden="true"
              />
            </div>
            <span
              className="tier-name"
              style={{
                opacity: isCurrent || idx < currentIndex ? 1 : 0.35,
              }}
            >
              {tier.name}
            </span>
            <div className="tier-bar-track">
              <div
                className="tier-bar-fill"
                style={{
                  width: `${fillPercent}%`,
                  background: fillColor,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default XPProgressCard;
