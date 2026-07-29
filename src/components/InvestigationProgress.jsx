/**
 * InvestigationProgress — persistent progress indicator panel that replaces
 * the one-off dismissible SubmissionNudgeBanner from Prompt 3.
 *
 * Always visible in the Investigation Workspace layout. Displays:
 *   • Current turn count as a subtle progress bar / label
 *   • When nudgeSubmission = true (backend decides), promotes the
 *     "I'm ready to submit" CTA — same behavior, just a permanent
 *     home instead of a transient banner
 *   • When the session is submitted, shows a completed state
 *
 * The underlying nudgeSubmission-driven behavior is unchanged — the
 * frontend still reacts to the backend flag, never hardcoding thresholds.
 *
 * @param {{
 *   turnCount:        number,
 *   nudgeSubmission:  boolean,
 *   isSubmitted:      boolean,
 *   onSubmit:         () => void,
 * }} props
 */
function InvestigationProgress({ turnCount, nudgeSubmission, isSubmitted, onSubmit }) {
  // Visual progress — clamped to 100 %. The bar fills as turns accumulate;
  // once the backend says nudgeSubmission=true the bar is at least 80 % full
  // so the "submit" CTA feels naturally positioned.
  const progressPercent = nudgeSubmission
    ? Math.min(100, Math.max(80, turnCount * 12))
    : Math.min(75, turnCount * 15);

  return (
    <div className="flex flex-col border-t border-gray-800/60 bg-gray-950/50">
      {/* Panel header */}
      <div className="shrink-0 border-b border-gray-800/60 px-4 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Progress
        </h2>
      </div>

      <div className="flex flex-1 flex-col justify-between px-4 py-4">
        {/* ---- Turn counter + progress bar ---- */}
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-gray-400">
              {isSubmitted ? 'Investigation complete' : 'Investigation depth'}
            </span>
            <span className="text-[11px] tabular-nums text-gray-500">
              {turnCount} {turnCount === 1 ? 'turn' : 'turns'}
            </span>
          </div>

          {/* Progress track */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-800/80">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isSubmitted
                  ? 'bg-amber-500/70'
                  : nudgeSubmission
                    ? 'bg-indigo-400'
                    : 'bg-indigo-500/40'
              }`}
              style={{ width: `${isSubmitted ? 100 : progressPercent}%` }}
            />
          </div>

          {/* Phase label */}
          <p className="mt-2 text-[11px] leading-relaxed text-gray-600">
            {isSubmitted
              ? 'Your reasoning has been submitted for evaluation.'
              : nudgeSubmission
                ? 'You have explored enough to submit — continue or submit when ready.'
                : 'The AI mentor is guiding your reasoning. Keep exploring.'}
          </p>
        </div>

        {/* ---- Submit CTA (only when nudge is active and not yet submitted) ---- */}
        {nudgeSubmission && !isSubmitted && (
          <button
            onClick={onSubmit}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white
                       transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg
                       hover:shadow-indigo-500/20 focus:outline-none focus:ring-2
                       focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
          >
            I'm ready to submit
          </button>
        )}

        {/* ---- Submitted badge ---- */}
        {isSubmitted && (
          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3.5 w-3.5 text-amber-400"
            >
              <path
                fillRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[11px] font-medium text-amber-400">Submitted</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvestigationProgress;
