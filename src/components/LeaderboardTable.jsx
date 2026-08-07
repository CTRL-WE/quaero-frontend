import { SearchX } from 'lucide-react';
import LeaderboardRow from './LeaderboardRow';
import { ComicPanel } from './comic';

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
      className="flex items-center gap-3 px-4 py-3"
      style={{
        border: '2px solid var(--color-comic-ink)',
        borderRadius: 4,
        background: 'var(--color-comic-paper)',
      }}
      aria-hidden="true"
    >
      {/* Position circle */}
      <div
        className="h-7 w-7 shrink-0 animate-pulse rounded-full"
        style={{ background: 'rgba(22,20,18,0.1)' }}
      />
      {/* Username */}
      <div
        className="h-3.5 w-24 animate-pulse rounded"
        style={{ background: 'rgba(22,20,18,0.1)' }}
      />
      {/* Spacer */}
      <div className="flex-1" />
      {/* Stats (desktop) */}
      <div className="hidden sm:flex items-center gap-6">
        <div className="h-3 w-10 animate-pulse rounded" style={{ background: 'rgba(22,20,18,0.1)' }} />
        <div className="h-3 w-10 animate-pulse rounded" style={{ background: 'rgba(22,20,18,0.1)' }} />
        <div className="h-3 w-8 animate-pulse rounded" style={{ background: 'rgba(22,20,18,0.1)' }} />
      </div>
      {/* Stats (mobile) */}
      <div className="flex sm:hidden items-center gap-2">
        <div className="h-3 w-16 animate-pulse rounded" style={{ background: 'rgba(22,20,18,0.1)' }} />
      </div>
    </div>
  );
}

/* ── Column header (desktop only) ─────────────────────────────────── */

function ColumnHeaders() {
  return (
    <div
      className="hidden sm:flex items-center gap-3 px-4 py-2"
      style={{
        fontSize: '0.625rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--color-comic-ink)',
        opacity: 0.45,
      }}
      aria-hidden="true"
    >
      <span className="w-7 shrink-0 text-center">#</span>
      <span className="min-w-0 flex-1">Investigator</span>
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
      <ComicPanel rotate={0.5}>
        <div className="flex flex-col items-center gap-4 px-5 py-8 text-center">
          <p
            className="text-sm font-bold"
            style={{ color: 'var(--color-comic-red)' }}
          >
            {error}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="comic-press min-h-[44px] rounded-sm px-5 py-2 text-sm font-bold uppercase tracking-wider"
              style={{
                background: 'var(--color-comic-red)',
                color: 'white',
                border: '3px solid var(--color-comic-ink)',
                boxShadow: '4px 4px 0 var(--color-comic-ink)',
              }}
            >
              Retry
            </button>
          )}
        </div>
      </ComicPanel>
    );
  }

  /* ---------- Empty ---------- */
  if (entries.length === 0) {
    return (
      <ComicPanel rotate={-0.5}>
        <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
          <SearchX
            className="h-8 w-8"
            style={{ color: 'var(--color-comic-ink)', opacity: 0.35 }}
            aria-hidden="true"
          />
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--color-comic-ink)', opacity: 0.6 }}
          >
            No investigators yet — be the first to submit an investigation.
          </p>
        </div>
      </ComicPanel>
    );
  }

  /* ---------- Populated ---------- */
  return (
    <ComicPanel rotate={0.2} className="bg-halftone !p-0 overflow-hidden">
      <div className="p-4 sm:p-5 space-y-2" role="list" aria-label="Leaderboard rankings">
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
    </ComicPanel>
  );
}

export default LeaderboardTable;
