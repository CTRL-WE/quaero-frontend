/**
 * DifficultyBadge — compact color-coded pill for verification difficulty.
 *
 * Props:
 *   difficulty – 'EASY' | 'MEDIUM' | 'HARD'
 */

const DIFFICULTY_STYLES = {
  EASY: {
    label: 'Easy',
    classes: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/25',
  },
  MEDIUM: {
    label: 'Medium',
    classes: 'bg-amber-500/10 text-amber-400 ring-amber-500/25',
  },
  HARD: {
    label: 'Hard',
    classes: 'bg-red-500/10 text-red-400 ring-red-500/25',
  },
};

function DifficultyBadge({ difficulty }) {
  const style = DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.MEDIUM;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5
                  text-[11px] font-medium leading-none tracking-wide
                  ring-1 ${style.classes}`}
    >
      {style.label}
    </span>
  );
}

export default DifficultyBadge;
