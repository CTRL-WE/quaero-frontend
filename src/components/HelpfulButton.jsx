import { useState } from 'react';

// ---------------------------------------------------------------------------
// HelpfulButton — reusable optimistic-toggle vote button.
//
// Updates the UI immediately on click; rolls back + shows a small inline
// error on that entry only if the server request fails.
//
// @param {{
//   isHelpful:  boolean,
//   count:      number,
//   onToggle:   () => Promise<void>,
//   disabled?:  boolean,
// }} props
// ---------------------------------------------------------------------------

function HelpfulButton({ isHelpful, count, onToggle, disabled = false }) {
  const [optimistic, setOptimistic] = useState(null); // null = use prop
  const [error, setError] = useState(null);

  const displayed = optimistic ?? { isHelpful, count };

  const handleClick = async () => {
    if (disabled) return;

    // Optimistic update
    const prev = { isHelpful: displayed.isHelpful, count: displayed.count };
    const next = {
      isHelpful: !prev.isHelpful,
      count: prev.isHelpful ? prev.count - 1 : prev.count + 1,
    };
    setOptimistic(next);
    setError(null);

    try {
      await onToggle();
      // On success, clear optimistic — parent will re-render with fresh props
      setOptimistic(null);
    } catch {
      // Rollback
      setOptimistic(prev);
      setError('Vote failed');
      // Auto-clear error after 3s
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200
          ${
            displayed.isHelpful
              ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/15'
              : 'border-gray-700/60 bg-gray-800/30 text-gray-500 hover:border-gray-600 hover:text-gray-400'
          }
          disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label={displayed.isHelpful ? 'Remove helpful vote' : 'Mark as helpful'}
        aria-pressed={displayed.isHelpful}
      >
        {/* Thumbs-up icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-3.5 w-3.5"
        >
          {displayed.isHelpful ? (
            /* Filled thumb */
            <path d="M10.5 1.75a.75.75 0 0 0-1.37-.42L6.03 5.5H3.25a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h2.048l3.554 2.665a.75.75 0 0 0 1.148-.632V1.75Zm2.75 2.5a.75.75 0 0 0-.75.75v5.5a.75.75 0 0 0 1.5 0V5a.75.75 0 0 0-.75-.75Z" />
          ) : (
            /* Outline thumb */
            <path
              fillRule="evenodd"
              d="M10.5 1.75a.75.75 0 0 0-1.37-.42L6.03 5.5H3.25a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h2.048l3.554 2.665a.75.75 0 0 0 1.148-.632V1.75ZM9 3.464v8.963L6.398 10.3a.75.75 0 0 0-.45-.15H4.5V7h1.448a.75.75 0 0 0 .632-.345L9 3.464ZM13.25 4.25a.75.75 0 0 0-.75.75v5.5a.75.75 0 0 0 1.5 0V5a.75.75 0 0 0-.75-.75Z"
              clipRule="evenodd"
            />
          )}
        </svg>

        <span className="tabular-nums">{displayed.count}</span>
      </button>

      {/* Inline error — only on this entry */}
      {error && (
        <span className="text-[10px] text-red-400 animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
}

export default HelpfulButton;
