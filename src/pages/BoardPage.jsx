import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, ExternalLink, ShieldCheck } from 'lucide-react';
import { getBoard, toggleHelpful } from '../services/boardService';
import HelpfulButton from '../components/HelpfulButton';
import RankBadge from '../components/RankBadge';
import { getRankTier } from '../utils/rankTiers';

/**
 * BoardPage — displays all board submissions for a case.
 *
 * Route: /cases/:id/board
 *
 * Gating: the real endpoint will reject with 403 if the user hasn't submitted
 * their own reasoning yet. The UI handles that by showing a clear message
 * and linking back to the brief. During mock stage, getBoard always resolves.
 */

/* ── Verdict badge styles ─────────────────────────────────────────── */

const VERDICT_STYLES = {
  TRUE: {
    label: 'True',
    classes: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/25',
  },
  FALSE: {
    label: 'False',
    classes: 'bg-red-500/10 text-red-400 ring-red-500/25',
  },
  MISLEADING: {
    label: 'Misleading',
    classes: 'bg-amber-500/10 text-amber-400 ring-amber-500/25',
  },
  UNVERIFIABLE: {
    label: 'Unverifiable',
    classes: 'bg-gray-500/10 text-gray-400 ring-gray-500/25',
  },
  UNVERIFIED: {
    label: 'Unverified',
    classes: 'bg-gray-500/10 text-gray-400 ring-gray-500/25',
  },
};

const FALLBACK_VERDICT = {
  label: 'Unknown',
  classes: 'bg-gray-500/10 text-gray-400 ring-gray-500/25',
};

/* ── Component ────────────────────────────────────────────────────── */

function BoardPage() {
  const { id: caseId } = useParams();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gated, setGated] = useState(false);
  const [error, setError] = useState('');

  /* Per-entry toggle state: { [submissionId]: { inflight, error } } */
  const [toggleState, setToggleState] = useState({});

  /* ── Fetch board on mount ── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setGated(false);
      setError('');

      try {
        const data = await getBoard(caseId);
        if (!cancelled) setEntries(data);
      } catch (err) {
        if (cancelled) return;

        /* 403 → user hasn't submitted yet (gating) */
        const status = err?.response?.status ?? err?.status;
        if (status === 403) {
          setGated(true);
        } else {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              'Failed to load the investigation board.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [caseId]);

  /* ── Helpful toggle handler (optimistic + rollback) ── */
  const handleToggle = useCallback(
    async (submissionId) => {
      /* Find current entry values BEFORE optimistic flip */
      const entry = entries.find((e) => e.submissionId === submissionId);
      if (!entry) return;

      const prevMarked = entry.hasCurrentUserMarkedHelpful;
      const prevCount = entry.helpfulCount;

      /* Optimistically update the entries array */
      setEntries((prev) =>
        prev.map((e) =>
          e.submissionId === submissionId
            ? {
                ...e,
                hasCurrentUserMarkedHelpful: !prevMarked,
                helpfulCount: prevMarked ? prevCount - 1 : prevCount + 1,
              }
            : e,
        ),
      );

      /* Mark in-flight, clear any prior error */
      setToggleState((prev) => ({
        ...prev,
        [submissionId]: { inflight: true, error: '' },
      }));

      try {
        const result = await toggleHelpful(caseId, submissionId, prevMarked);

        /* Apply server-authoritative values */
        setEntries((prev) =>
          prev.map((e) =>
            e.submissionId === submissionId
              ? {
                  ...e,
                  helpfulCount: result.helpfulCount,
                  hasCurrentUserMarkedHelpful: result.hasCurrentUserMarkedHelpful,
                }
              : e,
          ),
        );

        setToggleState((prev) => ({
          ...prev,
          [submissionId]: { inflight: false, error: '' },
        }));
      } catch (err) {
        /* Rollback to previous values */
        setEntries((prev) =>
          prev.map((e) =>
            e.submissionId === submissionId
              ? {
                  ...e,
                  hasCurrentUserMarkedHelpful: prevMarked,
                  helpfulCount: prevCount,
                }
              : e,
          ),
        );

        setToggleState((prev) => ({
          ...prev,
          [submissionId]: {
            inflight: false,
            error:
              err?.response?.data?.message ||
                err?.message ||
                'Could not update — try again.',
          },
        }));
      }
    },
    [caseId, entries],
  );

  /* ── Loading spinner ── */
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <svg
          className="h-8 w-8 animate-spin text-accent"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="ml-3 text-sm text-text-muted">
          Loading investigation board…
        </span>
      </div>
    );
  }

  /* ── Gated: user hasn't submitted yet ── */
  if (gated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full
                         bg-amber-500/10 text-amber-400">
          <ShieldCheck size={28} strokeWidth={1.5} />
        </span>
        <div className="max-w-sm space-y-1.5">
          <h1 className="text-lg font-medium text-text-primary">
            Board locked
          </h1>
          <p className="text-sm text-text-secondary">
            Submit your reasoning for this case first to unlock the Investigation Board.
          </p>
        </div>
        <Link
          to={`/cases/${caseId}/brief`}
          className="mt-2 rounded-base bg-accent px-5 py-2.5 text-sm font-medium text-white
                     transition-colors hover:bg-accent-hover"
        >
          ← Go to case brief
        </Link>
      </div>
    );
  }

  /* ── Full-page error (non-403) ── */
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <p className="text-sm text-red-400">{error}</p>
        <Link
          to="/"
          className="mt-2 rounded-base bg-accent px-5 py-2 text-sm font-medium text-white
                     transition-colors hover:bg-accent-hover"
        >
          ← Back to Feed
        </Link>
      </div>
    );
  }

  /* ── Main board ── */
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Back link */}
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted
                   transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to Feed
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center
                         rounded-base bg-accent-muted text-accent">
          <Users size={20} strokeWidth={1.8} />
        </span>
        <div>
          <h1 className="text-xl font-medium text-text-primary">
            Investigation board
          </h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            See how other investigators evaluated this case.
          </p>
        </div>
      </div>

      {/* ── Empty state ── */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-base
                        border border-border-hairline bg-surface-card py-16 text-center">
          <Users size={32} strokeWidth={1.2} className="text-text-muted opacity-40" />
          <p className="text-sm text-text-muted">
            No other investigations yet — be the first!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const vs = VERDICT_STYLES[entry.verdict] || FALLBACK_VERDICT;
            const ts = toggleState[entry.submissionId] || {};

            return (
              <div
                key={entry.submissionId}
                className="group relative flex flex-col gap-4 rounded-base
                           border border-border-hairline bg-surface-card p-5
                           transition-all duration-200 ease-out
                           hover:border-white/12 hover:shadow-lg hover:shadow-black/30"
              >
                {/* ── Header: username + verdict badge ── */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {/* Username */}
                  <span className="text-sm font-medium text-text-primary">
                    {entry.submitterUsername}
                  </span>

                  {/* Verdict badge */}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5
                                text-[11px] font-medium leading-none tracking-wide
                                ring-1 ${vs.classes}`}
                  >
                    {vs.label}
                  </span>

                  {/* Rank badge + credibility — pushed right */}
                  <span className="ml-auto flex items-center gap-2">
                    <RankBadge rankTier={getRankTier(entry.submitterCredibility)} />
                    <span className="text-xs text-text-muted" title="Submitter credibility">
                      {entry.submitterCredibility.toFixed(1)}% cred
                    </span>
                  </span>
                </div>

                {/* ── Rationale ── */}
                <p className="text-sm leading-relaxed text-text-secondary">
                  {entry.rationale}
                </p>

                {/* ── Evidence links ── */}
                {entry.evidenceLinks?.length > 0 && (
                  <ul className="min-w-0 space-y-1.5 overflow-hidden">
                    {entry.evidenceLinks.map((link) => (
                      <li key={link} className="min-w-0">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-accent
                                     transition-colors hover:text-accent-hover break-all"
                        >
                          <ExternalLink size={12} strokeWidth={2} className="shrink-0" />
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {/* ── Footer: helpful button + inline error ── */}
                <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border-hairline">
                  <HelpfulButton
                    helpfulCount={entry.helpfulCount}
                    isMarked={entry.hasCurrentUserMarkedHelpful}
                    onToggle={() => handleToggle(entry.submissionId)}
                    disabled={!!ts.inflight}
                  />

                  {/* Per-entry inline error (toggle failure) */}
                  {ts.error && (
                    <span className="text-xs text-red-400 animate-evidence-enter">
                      {ts.error}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

export default BoardPage;
