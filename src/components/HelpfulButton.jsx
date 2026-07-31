import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';

/**
 * HelpfulButton — optimistic-toggle button for marking board submissions as helpful.
 *
 * Props:
 *   helpfulCount – current helpful count from the server
 *   isMarked     – whether the current user has marked this helpful
 *   onToggle     – callback fired on click; parent handles API + rollback
 *   disabled     – disables the button (e.g. while a request is in flight)
 */
function HelpfulButton({ helpfulCount, isMarked, onToggle, disabled = false }) {
  /* ── Optimistic local state — syncs when props change ──────────── */
  const [localMarked, setLocalMarked] = useState(isMarked);
  const [localCount, setLocalCount] = useState(helpfulCount);

  useEffect(() => {
    setLocalMarked(isMarked);
    setLocalCount(helpfulCount);
  }, [isMarked, helpfulCount]);

  const handleClick = () => {
    if (disabled) return;

    /* Flip visual state immediately (optimistic) */
    setLocalMarked((prev) => !prev);
    setLocalCount((prev) => (localMarked ? prev - 1 : prev + 1));

    /* Notify parent — parent owns the API call and rollback */
    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        group/helpful inline-flex items-center gap-1.5
        rounded-full px-3 py-1.5
        text-xs font-medium tracking-wide
        ring-1 transition-all duration-200 ease-out
        select-none cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60
        ${
          localMarked
            ? 'bg-accent-primary/15 text-accent-primary ring-accent-primary/30'
            : 'bg-surface-card text-text-secondary ring-border-hairline hover:text-text-primary hover:ring-white/12'
        }
        ${disabled ? 'pointer-events-none opacity-50' : ''}
      `}
      aria-pressed={localMarked}
      aria-label={`Mark helpful (${localCount})`}
    >
      <ThumbsUp
        size={14}
        strokeWidth={2}
        className={`
          transition-all duration-200 ease-out
          ${localMarked ? 'fill-accent-primary stroke-accent-primary scale-110' : 'fill-none group-hover/helpful:scale-105'}
        `}
      />
      <span>{localCount}</span>
    </button>
  );
}

export default HelpfulButton;
