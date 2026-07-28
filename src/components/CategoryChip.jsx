/**
 * CategoryChip — non-interactive pill displaying a case category.
 *
 * Props:
 *   category – string (e.g. 'Politics', 'Health', 'Technology', …)
 */

const CATEGORY_COLORS = {
  Politics:      { bg: 'bg-blue-500/10',    text: 'text-blue-400',    ring: 'ring-blue-500/20' },
  Sports:        { bg: 'bg-orange-500/10',   text: 'text-orange-400',  ring: 'ring-orange-500/20' },
  Science:       { bg: 'bg-cyan-500/10',     text: 'text-cyan-400',    ring: 'ring-cyan-500/20' },
  Health:        { bg: 'bg-emerald-500/10',  text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  Crime:         { bg: 'bg-red-500/10',      text: 'text-red-400',     ring: 'ring-red-500/20' },
  Technology:    { bg: 'bg-violet-500/10',   text: 'text-violet-400',  ring: 'ring-violet-500/20' },
  Entertainment: { bg: 'bg-pink-500/10',     text: 'text-pink-400',    ring: 'ring-pink-500/20' },
  Environment:   { bg: 'bg-lime-500/10',     text: 'text-lime-400',    ring: 'ring-lime-500/20' },
};

const DEFAULT_COLOR = { bg: 'bg-gray-500/10', text: 'text-gray-400', ring: 'ring-gray-500/20' };

function CategoryChip({ category }) {
  const palette = CATEGORY_COLORS[category] || DEFAULT_COLOR;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5
                  text-[11px] font-medium leading-none tracking-wide
                  ring-1 ${palette.bg} ${palette.text} ${palette.ring}`}
    >
      {category}
    </span>
  );
}

export default CategoryChip;
