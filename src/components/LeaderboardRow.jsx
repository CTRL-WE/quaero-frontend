import { User } from 'lucide-react';

/**
 * LeaderboardRow — a single leaderboard entry.
 *
 * Props:
 *   entry         – { username, position, xp, credibility, completedInvestigations }
 *   isCurrentUser – boolean; highlights the row when true
 *
 * Renders as a responsive row: table-like on desktop, compact card on mobile.
 */

/* ── Position badge colors for top 3 ─────────────────────────────── */
const POSITION_STYLES = {
  1: 'bg-yellow-500/15 text-yellow-400 ring-yellow-500/30',
  2: 'bg-gray-400/15 text-gray-300 ring-gray-400/30',
  3: 'bg-amber-600/15 text-amber-500 ring-amber-600/30',
};

function PositionBadge({ position }) {
  const special = POSITION_STYLES[position];

  if (special) {
    return (
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                    text-xs font-bold ring-1 ${special}`}
      >
        {position}
      </span>
    );
  }

  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                 bg-surface-overlay text-xs font-medium text-text-muted"
    >
      {position}
    </span>
  );
}

function LeaderboardRow({ entry, isCurrentUser = false }) {
  const { username, position, xp, credibility, completedInvestigations } = entry;

  return (
    <div
      className={`
        group flex items-center gap-3 rounded-base px-4 py-3
        transition-colors duration-150
        ${
          isCurrentUser
            ? 'border border-accent/30 bg-accent/8 ring-1 ring-accent/20'
            : 'border border-border-hairline bg-surface-card hover:bg-surface-overlay/60'
        }
      `}
      aria-current={isCurrentUser ? 'true' : undefined}
    >
      {/* Position */}
      <PositionBadge position={position} />

      {/* Username */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <User
          className={`h-4 w-4 shrink-0 ${
            isCurrentUser ? 'text-accent' : 'text-text-muted'
          }`}
          aria-hidden="true"
        />
        <span
          className={`truncate text-sm font-medium ${
            isCurrentUser ? 'text-accent' : 'text-text-primary'
          }`}
        >
          {username}
          {isCurrentUser && (
            <span className="ml-1.5 text-[11px] font-normal text-accent/70">
              (you)
            </span>
          )}
        </span>
      </div>

      {/* Stats — hidden labels on mobile, visible on sm+ */}
      <div className="hidden sm:flex items-center gap-6 text-xs tabular-nums">
        <div className="flex flex-col items-end">
          <span className="font-semibold text-text-primary">
            {credibility != null ? credibility.toFixed(1) : '—'}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            Credibility
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-semibold text-text-primary">
            {xp.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            XP
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-semibold text-text-primary">
            {completedInvestigations}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            Cases
          </span>
        </div>
      </div>

      {/* Mobile compact stats — single line */}
      <div className="flex sm:hidden items-center gap-2 text-[11px] tabular-nums text-text-muted">
        <span title="Credibility">
          {credibility != null ? credibility.toFixed(1) : '—'}
        </span>
        <span className="text-border-hairline">·</span>
        <span title="XP">{xp.toLocaleString()} XP</span>
      </div>
    </div>
  );
}

export default LeaderboardRow;
