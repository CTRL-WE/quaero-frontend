import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { RANK_TIERS } from '../utils/rankTiers';
import RankBadge from './RankBadge';
import XPProgressCard from './XPProgressCard';
import CredibilityIndicator from './CredibilityIndicator';

/**
 * ReputationCard — compact card combining rank badge, XP progress,
 * credibility score, and leaderboard link.
 *
 * Props:
 *   xp                  – number | undefined (undefined → loading)
 *   credibility         – number | null | undefined
 *   rankTier            – tier object from getRankTier() | undefined
 *   leaderboardPosition – number | undefined
 *
 * Brand-new user (0 XP, null credibility, Explorer) renders a
 * complete, non-broken card.
 */

const DEFAULT_TIER = RANK_TIERS[0]; // Explorer

function ReputationCard({ xp, credibility, rankTier, leaderboardPosition }) {
  const tier = rankTier ?? DEFAULT_TIER;

  return (
    <section
      className="rounded-base border border-border-hairline bg-surface-card p-4
                 space-y-3"
      aria-label="Your reputation"
    >
      {/* ── Header row: badge + credibility ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <RankBadge rankTier={tier} />
        <CredibilityIndicator credibility={credibility} />
      </div>

      {/* ── XP progress bar ── */}
      <XPProgressCard totalXp={xp} />

      {/* ── Leaderboard link ── */}
      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        <Trophy className="h-3 w-3 shrink-0" aria-hidden="true" />
        {leaderboardPosition !== undefined ? (
          <Link
            to="/leaderboard"
            className="hover:text-text-secondary transition-colors duration-150"
          >
            <span className="font-semibold text-text-secondary tabular-nums">
              #{leaderboardPosition}
            </span>
            {' '}on the leaderboard
          </Link>
        ) : (
          <span className="h-3 w-28 animate-pulse rounded bg-surface-overlay" />
        )}
      </div>
    </section>
  );
}

export default ReputationCard;
