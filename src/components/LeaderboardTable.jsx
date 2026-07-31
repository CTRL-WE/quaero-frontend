import { SearchX } from 'lucide-react';
import LeaderboardRow from './LeaderboardRow';

/**
 * LeaderboardTable — renders the full leaderboard list with loading,
 * error, and empty states.
 *
 * Props:
 *   entries         – array of leaderboard entry objects
 *   isLoading       – boolean
 *   error           – string | null
 *   currentUsername  – string; used to highlight the current user's row
 *   onRetry         – () => void; called when the retry button is clicked
 */

const SKELETON_COUNT = 5;

/* ── Skeleton row ─────────────────────────────────────────────────── */

function SkeletonRow() {
  return (
    <div
      className="flex items-center gap-3 rounded-base border border-border-hairline
                 bg-surface-card px-4 py-3"
      aria-hidden="true"
    >
      {/* Position circle */}
      <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-surface-overlay" />

      {/* Username */}
      <div className="h-3.5 w-24 animate-pulse rounded bg-surface-overlay" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stat blocks (desktop) */}
      <div className="hidden sm:flex items-center gap-6">
        <div className="h-3 w-10 animate-pulse rounded bg-surface-overlay" />
        <div className="h-3 w-10 animate-pulse rounded bg-surface-overlay" />
        <div className="h-3 w-8 animate-pulse rounded bg-surface-overlay" />
      </div>

      {/* Stat blocks (mobile) */}
      <div className="flex sm:hidden items-center gap-2">
        <div className="h-3 w-16 animate-pulse rounded bg-surface-overlay" />
      </div>
    </div>
  );
}

/* ── Column header (desktop only) ─────────────────────────────────── */

function ColumnHeaders() {
  return (
    <div
      className="hidden sm:flex items-center gap-3 px-4 py-2
                 text-[10px] font-medium uppercase tracking-wider text-text-muted"
      aria-hidden="true"
    >
      {/* Position */}
      <span className="w-7 shrink-0 text-center">#</span>

      {/* Username */}
      <span className="min-w-0 flex-1">Investigator</span>

      {/* Stats — right-aligned to match LeaderboardRow */}
      <div className="flex items-center gap-6">
        <span className="w-[52px] text-right">Credibility</span>
        <span className="w-[52px] text-right">XP</span>
        <span className="w-[52px] text-right">Cases</span>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

function LeaderboardTable({
  entries = [],
  isLoading = false,
  error = null,
  currentUsername,
  onRetry,
}) {
  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="Loading leaderboard">
        <ColumnHeaders />
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-base border border-red-500/30
                       bg-red-500/10 px-5 py-8 text-center">
        <p className="text-sm text-red-400">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="min-h-[44px] rounded-lg bg-accent px-5 py-2 text-sm font-medium
                       text-white transition-colors hover:bg-accent-hover"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  /* ---------- Empty ---------- */
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-base border border-dashed
                       border-border-hairline bg-surface-card px-5 py-10 text-center">
        <SearchX className="h-8 w-8 text-text-muted" aria-hidden="true" />
        <p className="text-sm text-text-secondary">
          No investigators yet — be the first to submit an investigation.
        </p>
      </div>
    );
  }

  /* ---------- Populated ---------- */
  return (
    <div className="space-y-2" role="list" aria-label="Leaderboard rankings">
      <ColumnHeaders />
      {entries.map((entry) => (
        <div role="listitem" key={entry.username}>
          <LeaderboardRow
            entry={entry}
            isCurrentUser={entry.username === currentUsername}
          />
        </div>
      ))}
    </div>
  );
}

export default LeaderboardTable;
