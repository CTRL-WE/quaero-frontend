import { useState } from 'react';

/**
 * SubmissionNudgeBanner — persistent, dismissible banner that appears when
 * the backend sets nudgeSubmission = true (typically after 4-6 exchanges).
 *
 * Does NOT block further conversation — the user can dismiss it and keep
 * chatting, or click through to submit their investigation.
 *
 * @param {{
 *   visible:    boolean,
 *   onDismiss:  () => void,
 *   onSubmit:   () => void,
 *   turnCount?: number,
 * }} props
 */
function SubmissionNudgeBanner({ visible, onDismiss, onSubmit, turnCount }) {
  const [dismissed, setDismissed] = useState(false);

  if (!visible || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="shrink-0 border-b border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm px-4 py-3 sm:px-6 animate-in slide-in-from-top">
      <div className="mx-auto flex max-w-3xl items-center gap-3">

        {/* Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-emerald-400"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-300">
            Ready to submit your reasoning?
          </p>
          <p className="mt-0.5 text-xs text-emerald-400/70 truncate">
            {turnCount
              ? `You've explored ${turnCount} turns — you can submit your investigation when ready.`
              : 'You can submit your investigation when ready.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onSubmit}
            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            I'm ready to submit
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors duration-200 hover:border-gray-600 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Dismiss submission nudge"
          >
            Not yet
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmissionNudgeBanner;
