import { Link } from 'react-router-dom';
import { RANK_TIERS } from '../utils/rankTiers';
import { ComicPanel, DetectiveMascot } from './comic';
import RankBadge from './RankBadge';

/**
 * ReputationCard — ID-card dossier layout.
 *
 * Props:
 *   xp                      – number | undefined
 *   credibility             – number | null | undefined
 *   rankTier                – tier object from getRankTier() | undefined
 *   leaderboardPosition     – number | undefined
 *   username                – string | undefined
 *   completedInvestigations – number | undefined
 */

const DEFAULT_TIER = RANK_TIERS[0]; // Explorer

function ReputationCard({
  xp,
  credibility,
  rankTier,
  leaderboardPosition,
  username,
  completedInvestigations,
}) {
  const tier = rankTier ?? DEFAULT_TIER;

  const displayCredibility =
    credibility === null
      ? '—'
      : credibility === undefined
        ? '…'
        : Number.isInteger(credibility)
          ? credibility
          : credibility.toFixed(1);

  return (
    <ComicPanel rotate={0.5} className="bg-halftone">
      <section aria-label="Detective ID Card">
        {/* ── ID card header ── */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-comic-ink)',
            opacity: 0.5,
            marginBottom: 12,
          }}
        >
          Quaero Investigation Bureau — Agent ID
        </div>

        {/* ── Photo + info grid ── */}
        <div className="dossier-id-card">
          {/* Photo frame with DetectiveMascot */}
          <div className="photo-frame">
            <DetectiveMascot size={72} />
          </div>

          {/* Right column: name, rank, handle */}
          <div style={{ minWidth: 0 }}>
            <h2
              className="truncate"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                letterSpacing: '0.03em',
                color: 'var(--color-comic-ink)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {username ?? 'Unknown Agent'}
            </h2>

            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-comic-ink)',
                opacity: 0.5,
                marginTop: 2,
                marginBottom: 8,
              }}
            >
              @{(username ?? 'unknown').toLowerCase()}
            </div>

            <RankBadge rankTier={tier} />
          </div>
        </div>

        {/* ── Stat rows ── */}
        <div style={{ marginTop: 16 }}>
          <div className="dossier-stat-row">
            <span className="stat-label">Total XP</span>
            <span className="stat-value">{xp ?? '…'}</span>
          </div>
          <div className="dossier-stat-row">
            <span className="stat-label">Credibility</span>
            <span className="stat-value">{displayCredibility}</span>
          </div>
          <div className="dossier-stat-row">
            <span className="stat-label">Cases Solved</span>
            <span className="stat-value">{completedInvestigations ?? '…'}</span>
          </div>
          <div className="dossier-stat-row">
            <span className="stat-label">Leaderboard</span>
            <span className="stat-value">
              {leaderboardPosition !== undefined ? (
                <Link
                  to="/leaderboard"
                  style={{
                    color: 'var(--color-comic-blue)',
                    textDecoration: 'none',
                  }}
                >
                  #{leaderboardPosition}
                </Link>
              ) : (
                '…'
              )}
            </span>
          </div>
        </div>
      </section>
    </ComicPanel>
  );
}

export default ReputationCard;
