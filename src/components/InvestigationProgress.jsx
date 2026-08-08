import { FlaskConical, Send } from 'lucide-react';
import { StampBadge } from './comic';

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
        className="flex items-center gap-3 rounded-lg border-[3px] border-comic-yellow
                   bg-comic-yellow/15 px-4 py-2.5 animate-evidence-enter"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center
                         rounded-full bg-comic-yellow text-comic-ink">
          <Send size={14} strokeWidth={2} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-comic-ink">
            Ready to submit?
          </p>
          <p className="text-[11px] leading-snug text-comic-ink/60">
            You've built a strong case — submit your findings when you're confident.
          </p>
        </div>

        <StampBadge tone="green">100%</StampBadge>
      </div>
    );
  }

  /* ── Building-case state ── */
  const label = getProgressLabel(turnCount);

  return (
    <div
      className="flex items-center gap-3 rounded-lg border-2 border-comic-ink/15
                 bg-comic-paper/60 px-4 py-2.5"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center
                       rounded-full bg-comic-ink/10 text-comic-ink/60">
        <FlaskConical size={14} strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-comic-ink/70 uppercase tracking-wider">
            {label}
          </p>
          <span className="text-xs font-bold text-comic-ink">{pct}%</span>
        </div>

        {/* Progress track — thick comic bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-sm
                        border-2 border-comic-ink/20 bg-comic-paper">
          <div
            className="h-full rounded-sm transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background:
                progress < 0.5
                  ? 'var(--color-comic-red, #e03e2d)'
                  : 'var(--color-comic-green, #3f9142)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default InvestigationProgress;

