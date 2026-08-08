import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, ExternalLink, ShieldCheck } from 'lucide-react';
import { getBoard, toggleHelpful } from '../services/boardService';
import HelpfulButton from '../components/HelpfulButton';
import RankBadge from '../components/RankBadge';
import { getRankTier } from '../utils/rankTiers';
import { ComicPanel, StampBadge } from '../components/comic';

/**
 * BoardPage — displays all board submissions for a case.
 *
 * Route: /cases/:id/board
 *
 * Gating: the real endpoint will reject with 403 if the user hasn't submitted
 * their own reasoning yet. The UI handles that by showing a clear message
 * and linking back to the brief. During mock stage, getBoard always resolves.
 */

/* ── Verdict → StampBadge tone mapping ────────────────────────────── */

const VERDICT_TONE = {
  TRUE: 'green',
  FALSE: 'red',
  MISLEADING: 'amber',
  UNVERIFIABLE: 'red',
  UNVERIFIED: 'red',
};

const VERDICT_LABEL = {
  TRUE: 'True',
  FALSE: 'False',
  MISLEADING: 'Misleading',
  UNVERIFIABLE: 'Unverifiable',
  UNVERIFIED: 'Unverified',
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
          className="h-8 w-8 animate-spin"
          style={{ color: 'var(--color-comic-brown)' }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span className="ml-3 text-sm" style={{ color: 'var(--color-comic-ink)', opacity: 0.6 }}>
          Loading investigation board…
        </span>
      </div>
    );
  }

  /* ── Gated: user hasn't submitted yet ── */
  if (gated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-10 text-center">
        <ComicPanel rotate={-1}>
          <div className="flex flex-col items-center gap-4 p-4">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                background: 'rgba(255, 206, 58, 0.15)',
                border: '3px solid var(--color-comic-ink)',
              }}
            >
              <ShieldCheck size={28} strokeWidth={1.5} style={{ color: 'var(--color-comic-brown)' }} />
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                color: 'var(--color-comic-ink)',
              }}
            >
              Board Locked
            </h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-comic-ink)', opacity: 0.6 }}>
              Submit your reasoning for this case first to unlock the Investigation Board.
            </p>
            <Link
              to={`/cases/${caseId}/brief`}
              className="comic-press mt-2 rounded-sm px-5 py-2.5 text-sm font-bold uppercase tracking-wider"
              style={{
                background: 'var(--color-comic-red)',
                color: 'white',
                border: '3px solid var(--color-comic-ink)',
                boxShadow: '4px 4px 0 var(--color-comic-ink)',
              }}
            >
              ← Go to case brief
            </Link>
          </div>
        </ComicPanel>
      </div>
    );
  }

  /* ── Full-page error (non-403) ── */
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <ComicPanel rotate={0.5}>
          <p className="text-sm font-bold p-4 text-center" style={{ color: 'var(--color-comic-red)' }}>
            ⚠ {error}
          </p>
        </ComicPanel>
        <Link
          to="/"
          className="comic-press rounded-sm px-5 py-2 text-sm font-bold uppercase tracking-wider"
          style={{
            background: 'var(--color-comic-red)',
            color: 'white',
            border: '3px solid var(--color-comic-ink)',
            boxShadow: '4px 4px 0 var(--color-comic-ink)',
          }}
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
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-70"
        style={{ color: 'var(--color-comic-ink)', opacity: 0.6 }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to Feed
      </Link>

      {/* Header */}
      <ComicPanel rotate={-0.3} className="mb-8">
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{
              background: 'rgba(46, 100, 168, 0.12)',
              border: '2px solid var(--color-comic-ink)',
            }}
          >
            <Users size={20} strokeWidth={1.8} style={{ color: 'var(--color-comic-blue)' }} />
          </span>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                letterSpacing: '0.04em',
                color: 'var(--color-comic-ink)',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              Investigation Board
            </h1>
            <p className="mt-0.5 text-sm font-medium" style={{ color: 'var(--color-comic-ink)', opacity: 0.55 }}>
              See how other investigators evaluated this case.
            </p>
          </div>
        </div>
      </ComicPanel>

      {/* ── Empty state ── */}
      {entries.length === 0 ? (
        <ComicPanel rotate={0.5}>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Users size={32} strokeWidth={1.2} style={{ color: 'var(--color-comic-ink)', opacity: 0.3 }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--color-comic-ink)', opacity: 0.5 }}>
              No other investigations yet — be the first!
            </p>
          </div>
        </ComicPanel>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const ts = toggleState[entry.submissionId] || {};

            return (
              <ComicPanel key={entry.submissionId} className="bg-halftone">
                {/* ── Header: username + verdict badge ── */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-bold" style={{ color: 'var(--color-comic-ink)' }}>
                    {entry.submitterUsername}
                  </span>

                  {/* Verdict as StampBadge */}
                  <StampBadge tone={VERDICT_TONE[entry.verdict] ?? 'red'}>
                    {VERDICT_LABEL[entry.verdict] ?? 'Unknown'}
                  </StampBadge>

                  {/* Rank badge + credibility — pushed right */}
                  <span className="ml-auto flex items-center gap-2">
                    <RankBadge rankTier={getRankTier(entry.submitterCredibility)} />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: 'var(--color-comic-ink)', opacity: 0.5 }}
                      title="Submitter credibility"
                    >
                      {entry.submitterCredibility.toFixed(1)}% cred
                    </span>
                  </span>
                </div>

                {/* ── Rationale ── */}
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: 'var(--color-comic-ink)', opacity: 0.75 }}
                >
                  {entry.rationale}
                </p>

                {/* ── Evidence links ── */}
                {entry.evidenceLinks?.length > 0 && (
                  <ul className="mt-3 min-w-0 space-y-1.5 overflow-hidden">
                    {entry.evidenceLinks.map((link) => (
                      <li key={link} className="min-w-0">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold break-all transition-colors hover:opacity-70"
                          style={{ color: 'var(--color-comic-blue)' }}
                        >
                          <ExternalLink size={12} strokeWidth={2} className="shrink-0" />
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                {/* ── Footer: helpful button + inline error ── */}
                <div
                  className="mt-3 flex flex-wrap items-center gap-3 pt-3"
                  style={{ borderTop: '1px dashed rgba(22,20,18,0.15)' }}
                >
                  <HelpfulButton
                    helpfulCount={entry.helpfulCount}
                    isMarked={entry.hasCurrentUserMarkedHelpful}
                    onToggle={() => handleToggle(entry.submissionId)}
                    disabled={!!ts.inflight}
                  />

                  {/* Per-entry inline error (toggle failure) */}
                  {ts.error && (
                    <span
                      className="text-xs font-bold animate-evidence-enter"
                      style={{ color: 'var(--color-comic-red)' }}
                    >
                      {ts.error}
                    </span>
                  )}
                </div>
              </ComicPanel>
            );
          })}
        </div>
      )}
    </article>
  );
}

export default BoardPage;
