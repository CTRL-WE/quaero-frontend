/**
 * CredibilityIndicator — displays the user's credibility score.
 *
 * Props:
 *   credibility – number | null | undefined
 *     • undefined → skeleton (data still loading)
 *     • null      → valid "not yet rated" state
 *     • number    → rendered score with color-coded ring
 */

/* ── Color band based on score ────────────────────────────────────── */
function getScoreBand(score) {
  if (score >= 90) return { ring: 'ring-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Excellent' };
  if (score >= 70) return { ring: 'ring-cyan-500/40', text: 'text-cyan-400', dot: 'bg-cyan-400', label: 'Good' };
  if (score >= 50) return { ring: 'ring-amber-500/40', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Fair' };
  return { ring: 'ring-red-500/40', text: 'text-red-400', dot: 'bg-red-400', label: 'Low' };
}

/* ── Skeleton ─────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-base border border-border-hairline
                 bg-surface-card/80 px-3 py-1.5"
      aria-busy="true"
      aria-label="Loading credibility score"
    >
      <div className="h-2 w-2 animate-pulse rounded-full bg-surface-overlay" />
      <div className="h-3 w-14 animate-pulse rounded bg-surface-overlay" />
    </div>
  );
}

/* ── Component ────────────────────────────────────────────────────── */

function CredibilityIndicator({ credibility }) {
  /* Still loading */
  if (credibility === undefined) return <Skeleton />;

  /* Not yet rated (null is a valid state, distinct from 0) */
  if (credibility === null) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-base border border-border-hairline
                   bg-surface-card/80 px-3 py-1.5 text-xs text-text-muted italic"
        aria-label="Credibility: Not yet rated"
      >
        <span className="h-2 w-2 rounded-full bg-surface-overlay" aria-hidden="true" />
        Not yet rated
      </span>
    );
  }

  /* Rated score */
  const band = getScoreBand(credibility);
  const displayValue = Number.isInteger(credibility)
    ? credibility.toString()
    : credibility.toFixed(1);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-base border border-border-hairline
                  bg-surface-card/80 px-3 py-1.5 text-xs ring-1 ${band.ring}`}
      aria-label={`Credibility score: ${displayValue} out of 100, ${band.label}`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${band.dot}`} aria-hidden="true" />
      <span className={`font-semibold tabular-nums ${band.text}`}>
        {displayValue}
      </span>
      <span className="text-text-muted">/ 100</span>
      <span className={`font-medium ${band.text}`}>{band.label}</span>
    </span>
  );
}

export default CredibilityIndicator;
