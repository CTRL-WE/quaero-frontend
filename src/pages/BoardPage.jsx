import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBoard, toggleHelpful } from '../services/boardService';
import { VERDICT_OPTIONS } from '../utils/validators';
import HelpfulButton from '../components/HelpfulButton';

// ---------------------------------------------------------------------------
// BoardPage — Screen 9 (Frontend Handbook)
//
// Shows all submitted investigations for a case once the current user has
// also submitted.  The 403 gating is enforced server-side; the frontend
// shows a clear "submit first" message when a 403 is received.
//
// Ref: DS v1.0 FR-12/13/14, Implementation Blueprint Board DTOs
// ---------------------------------------------------------------------------

// ---- Verdict label + colour -----------------------------------------------
const VERDICT_COLOURS = {
  SUPPORTED:           { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  CONTRADICTED:        { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20' },
  MISLEADING:          { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20' },
  INSUFFICIENT:        { bg: 'bg-gray-500/10',    text: 'text-gray-400',    border: 'border-gray-500/20' },
  PARTIALLY_SUPPORTED: { bg: 'bg-indigo-500/10',  text: 'text-indigo-400',  border: 'border-indigo-500/20' },
};

function verdictLabel(value) {
  return VERDICT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

// ---------------------------------------------------------------------------
// BoardEntry sub-component
// ---------------------------------------------------------------------------

function BoardEntry({ entry, caseId, onHelpfulToggled }) {
  const colours = VERDICT_COLOURS[entry.verdict] ?? VERDICT_COLOURS.INSUFFICIENT;

  const handleToggle = async () => {
    await toggleHelpful(caseId, entry.submissionId, entry.isHelpful);
    onHelpfulToggled();
  };

  return (
    <div
      className={`rounded-xl border bg-gray-900/40 transition-colors ${
        entry.submitter?.isCurrentUser
          ? 'border-indigo-500/20'
          : 'border-gray-800/60'
      }`}
    >
      {/* Header: submitter + credibility */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800/40 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          {/* Avatar placeholder */}
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              entry.submitter?.isCurrentUser
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                : 'bg-gray-800 text-gray-400 border border-gray-700/50'
            }`}
          >
            {(entry.submitter?.username?.[0] ?? '?').toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-medium text-gray-200">
              {entry.submitter?.username ?? 'Anonymous'}
              {entry.submitter?.isCurrentUser && (
                <span className="ml-1.5 text-[10px] font-normal text-indigo-400/70">
                  (you)
                </span>
              )}
            </span>
            {entry.credibility && (
              <p className="text-[10px] text-gray-600">{entry.credibility}</p>
            )}
          </div>
        </div>

        {/* Verdict badge */}
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${colours.bg} ${colours.text} ${colours.border}`}
        >
          {verdictLabel(entry.verdict)}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-3 sm:px-5">
        {/* Rationale */}
        <p className="text-sm leading-relaxed text-gray-300">
          {entry.rationale}
        </p>

        {/* Evidence links (if present) */}
        {entry.evidenceLinks && (
          <div className="rounded-lg border border-gray-800/40 bg-gray-950/30 px-3.5 py-2.5">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
              Evidence
            </p>
            <div className="space-y-1">
              {entry.evidenceLinks.split('\n').filter(Boolean).map((line, i) => (
                <p key={i} className="text-[11px] leading-relaxed text-gray-500 break-all">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: helpful button */}
      <div className="flex items-center justify-end border-t border-gray-800/40 px-4 py-2.5 sm:px-5">
        <HelpfulButton
          isHelpful={entry.isHelpful}
          count={entry.helpfulCount}
          onToggle={handleToggle}
          disabled={entry.submitter?.isCurrentUser}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BoardPage (main export)
// ---------------------------------------------------------------------------

function BoardPage() {
  const { id: caseId } = useParams();

  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [error, setError] = useState(null);

  const fetchBoard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsForbidden(false);

    try {
      const data = await getBoard(caseId);
      setEntries(data.entries ?? []);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setIsForbidden(true);
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load the investigation board.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Re-fetch after a helpful toggle so counts stay in sync
  const handleHelpfulToggled = () => {
    // Silently refresh — the optimistic UI handles the immediate feedback
    fetchBoard();
  };

  // ---- 403: user hasn't submitted -----------------------------------------
  if (isForbidden) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-amber-400">
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-200">
            Submit your reasoning first
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
            You need to complete your own investigation and submit your
            reasoning before viewing how others approached this case.
          </p>
        </div>
        <Link
          to={`/cases/${caseId}/brief`}
          className="mt-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20"
        >
          Go to case
        </Link>
      </div>
    );
  }

  // ---- Loading ------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  // ---- Error --------------------------------------------------------------
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <div className="w-full max-w-md rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center text-sm text-red-400">
          {error}
        </div>
        <button
          type="button"
          onClick={fetchBoard}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Retry
        </button>
      </div>
    );
  }

  // ---- Determine if the user is the only submitter (empty-state check) -----
  const otherEntries = entries.filter((e) => !e.submitter?.isCurrentUser);
  const userEntry = entries.find((e) => e.submitter?.isCurrentUser);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-100 sm:text-2xl">
              Investigation board
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Case {caseId} · {entries.length}{' '}
              {entries.length === 1 ? 'investigation' : 'investigations'}
            </p>
          </div>

          <Link
            to="/"
            className="rounded-lg border border-gray-700/80 px-4 py-2 text-xs font-medium text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-300"
          >
            Back to feed
          </Link>
        </div>

        {/* ---- Entries ---------------------------------------------------- */}
        <div className="mt-6 space-y-4">

          {/* User's own entry first (if exists) */}
          {userEntry && (
            <BoardEntry
              entry={userEntry}
              caseId={caseId}
              onHelpfulToggled={handleHelpfulToggled}
            />
          )}

          {/* Divider if there are other entries */}
          {userEntry && otherEntries.length > 0 && (
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-gray-800/60" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                Other investigations
              </span>
              <div className="h-px flex-1 bg-gray-800/60" />
            </div>
          )}

          {/* Other entries */}
          {otherEntries.map((entry) => (
            <BoardEntry
              key={entry.submissionId}
              entry={entry}
              caseId={caseId}
              onHelpfulToggled={handleHelpfulToggled}
            />
          ))}

          {/* Empty state — user is the only submitter */}
          {otherEntries.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-800/60 px-6 py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5.5 w-5.5 text-gray-600">
                  <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-400">
                No other investigations yet
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-600">
                You're the first to submit for this case. Other investigators'
                reasoning will appear here as they complete their work.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BoardPage;
