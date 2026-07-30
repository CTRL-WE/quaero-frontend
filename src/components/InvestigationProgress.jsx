import { FlaskConical, Send } from 'lucide-react';

/**
 * InvestigationProgress — horizontal momentum bar that shows how far
 * the investigator has progressed in building their case.
 *
 * Props:
 *   turnCount       – number of conversational turns completed so far
 *   nudgeSubmission – boolean; when true, the bar shifts to a
 *                     prominent "Ready to submit?" state
 */

/* ── Progress milestones (forward-momentum framing) ───────────────── */
const SOFT_NUDGE_POINT = 5;

const MILESTONES = [
  { at: 0, label: 'Starting investigation…' },
  { at: 1, label: 'Gathering leads…' },
  { at: 2, label: 'Connecting the dots…' },
  { at: 3, label: 'Building your case…' },
  { at: 4, label: 'Strengthening evidence…' },
];

function getProgressLabel(turnCount) {
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (turnCount >= MILESTONES[i].at) return MILESTONES[i].label;
  }
  return MILESTONES[0].label;
}

/* ── Component ────────────────────────────────────────────────────── */

function InvestigationProgress({ turnCount = 0, nudgeSubmission = false }) {
  const progress = Math.min(turnCount / SOFT_NUDGE_POINT, 1);
  const pct = Math.round(progress * 100);

  /* ── "Ready to submit?" state ── */
  if (nudgeSubmission) {
    return (
      <div
        className="flex items-center gap-3 rounded-base border border-accent/30
                   bg-accent/8 px-4 py-2.5 animate-evidence-enter"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center
                         rounded-full bg-accent/15 text-accent">
          <Send size={14} strokeWidth={2} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">
            Ready to submit?
          </p>
          <p className="text-[11px] leading-snug text-text-secondary">
            You've built a strong case — submit your findings when you're confident.
          </p>
        </div>

        {/* Full bar */}
        <div className="hidden sm:flex h-1.5 w-20 shrink-0 overflow-hidden rounded-full
                        bg-accent/15">
          <div className="h-full w-full rounded-full bg-accent" />
        </div>
      </div>
    );
  }

  /* ── Building-case state ── */
  const label = getProgressLabel(turnCount);

  return (
    <div
      className="flex items-center gap-3 rounded-base border border-border-hairline
                 bg-surface-card/80 px-4 py-2.5"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center
                       rounded-full bg-surface-overlay text-text-muted">
        <FlaskConical size={14} strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-secondary">
          {label}
        </p>

        {/* Progress track */}
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full
                        bg-surface-overlay">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background:
                progress < 0.5
                  ? 'linear-gradient(90deg, #60a5fa, #818cf8)'
                  : 'linear-gradient(90deg, #818cf8, #34d399)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default InvestigationProgress;
