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
      className="comic-press inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider select-none cursor-pointer focus-visible:outline-none"
      style={{
        border: `2px solid ${localMarked ? 'var(--color-comic-green)' : 'var(--color-comic-ink)'}`,
        background: localMarked ? 'rgba(63, 145, 66, 0.12)' : 'var(--color-comic-paper)',
        color: localMarked ? 'var(--color-comic-green)' : 'var(--color-comic-ink)',
        boxShadow: `2px 2px 0 ${localMarked ? 'var(--color-comic-green)' : 'var(--color-comic-ink)'}`,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      aria-pressed={localMarked}
      aria-label={`Mark helpful (${localCount})`}
    >
      <ThumbsUp
        size={14}
        strokeWidth={2}
        style={{
          fill: localMarked ? 'var(--color-comic-green)' : 'none',
          transition: 'all 0.2s ease-out',
          transform: localMarked ? 'scale(1.1)' : 'scale(1)',
        }}
      />
      <span>{localCount}</span>
    </button>
  );
}

export default HelpfulButton;
