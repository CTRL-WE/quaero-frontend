/**
 * StampBadge — a slightly rotated badge with a colored border, used for
 * difficulty labels, status tags, and verdict stamps.
 *
 * Props:
 *   children – badge label text
 *   tone     – 'red' | 'amber' | 'green'
 */
const TONES = {
  red: {
    border: 'border-comic-red',
    text: 'text-comic-red',
    bg: 'bg-comic-red/10',
  },
  amber: {
    border: 'border-comic-yellow',
    text: 'text-comic-ink',
    bg: 'bg-comic-yellow/20',
  },
  green: {
    border: 'border-comic-green',
    text: 'text-comic-green',
    bg: 'bg-comic-green/10',
  },
};

function StampBadge({ children, tone = 'red' }) {
  const s = TONES[tone] || TONES.red;

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1
        border-2 rounded-sm
        font-bold text-xs uppercase tracking-widest
        ${s.border} ${s.text} ${s.bg}
      `}
      style={{ transform: 'rotate(-2deg)' }}
    >
      {children}
    </span>
  );
}

export default StampBadge;
