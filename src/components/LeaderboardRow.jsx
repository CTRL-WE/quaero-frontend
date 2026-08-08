import { User } from 'lucide-react';

/**
 * LeaderboardRow — a single leaderboard entry, comic-styled.
 *
 * Props:
 *   entry         – { username, position, xp, credibility, completedInvestigations }
 *   isCurrentUser – boolean; highlights the row when true
 */

/* ── Position badge — top 3 get special colours ──────────────────── */
const POSITION_COLORS = {
  1: { bg: 'var(--color-comic-yellow)', text: 'var(--color-comic-ink)' },
  2: '#a0a0a0',
  3: 'var(--color-comic-brown)',
};

function PositionBadge({ position }) {
  const special = POSITION_COLORS[position];

  if (special && typeof special === 'object') {
    return (
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{
          background: special.bg,
          color: special.text,
          border: '2px solid var(--color-comic-ink)',
        }}
      >
        {position}
      </span>
    );
  }

  if (special) {
    return (
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{
          background: `${special}22`,
          color: special,
          border: `2px solid ${special}`,
        }}
      >
        {position}
      </span>
    );
  }

  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
      style={{
        background: 'rgba(22,20,18,0.06)',
        color: 'var(--color-comic-ink)',
        opacity: 0.5,
        border: '1.5px solid rgba(22,20,18,0.2)',
      }}
    >
      {position}
    </span>
  );
}

function LeaderboardRow({ entry, isCurrentUser = false }) {
  const { username, position, xp, credibility, completedInvestigations } = entry;

  return (
    <div
      className={`group flex items-center gap-3 rounded-sm px-4 py-3 transition-colors duration-150`}
      style={{
        border: isCurrentUser
          ? '2px solid var(--color-comic-blue)'
          : '2px solid var(--color-comic-ink)',
        background: isCurrentUser
          ? 'rgba(46, 100, 168, 0.08)'
          : 'var(--color-comic-paper)',
        boxShadow: isCurrentUser
          ? '3px 3px 0 var(--color-comic-blue)'
          : '2px 2px 0 var(--color-comic-ink)',
      }}
      aria-current={isCurrentUser ? 'true' : undefined}
    >
      {/* Position */}
      <PositionBadge position={position} />

      {/* Username */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <User
          className="h-4 w-4 shrink-0"
          style={{
            color: isCurrentUser
              ? 'var(--color-comic-blue)'
              : 'var(--color-comic-ink)',
            opacity: isCurrentUser ? 1 : 0.4,
          }}
          aria-hidden="true"
        />
        <span
          className="truncate text-sm font-semibold"
          style={{
            color: isCurrentUser
              ? 'var(--color-comic-blue)'
              : 'var(--color-comic-ink)',
          }}
        >
          {username}
          {isCurrentUser && (
            <span
              className="ml-1.5 text-[11px] font-normal"
              style={{ color: 'var(--color-comic-blue)', opacity: 0.7 }}
            >
              (you)
            </span>
          )}
        </span>
      </div>

      {/* Stats — desktop */}
      <div className="hidden sm:flex items-center gap-6 text-xs tabular-nums">
        <div className="flex flex-col items-end">
          <span className="font-bold" style={{ color: 'var(--color-comic-ink)' }}>
            {credibility != null ? credibility.toFixed(1) : '—'}
          </span>
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--color-comic-ink)', opacity: 0.4 }}
          >
            Credibility
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-bold" style={{ color: 'var(--color-comic-ink)' }}>
            {xp.toLocaleString()}
          </span>
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--color-comic-ink)', opacity: 0.4 }}
          >
            XP
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-bold" style={{ color: 'var(--color-comic-ink)' }}>
            {completedInvestigations}
          </span>
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: 'var(--color-comic-ink)', opacity: 0.4 }}
          >
            Cases
          </span>
        </div>
      </div>

      {/* Mobile compact stats */}
      <div
        className="flex sm:hidden items-center gap-2 text-[11px] tabular-nums"
        style={{ color: 'var(--color-comic-ink)', opacity: 0.55 }}
      >
        <span title="Credibility">
          {credibility != null ? credibility.toFixed(1) : '—'}
        </span>
        <span>·</span>
        <span title="XP">{xp.toLocaleString()} XP</span>
      </div>
    </div>
  );
}

export default LeaderboardRow;
