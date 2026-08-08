/**
 * ComicButton — pill/rounded-rect button in the Detective Comic style.
 *
 * Thick ink border, hard offset shadow that compresses on :active
 * for a tactile "stamp press" feel.
 *
 * Props:
 *   children  – button label / content
 *   variant   – 'primary' (comic-red bg) | 'ghost' (comic-paper bg)
 *   onClick   – click handler
 *   className – extra classes to merge
 *   ...rest   – forwarded to the underlying <button>
 */
function ComicButton({ children, variant = 'primary', onClick, className = '', ...rest }) {
  const variants = {
    primary:
      'bg-comic-red text-white hover:brightness-110',
    ghost:
      'bg-comic-paper text-comic-ink hover:bg-comic-yellow/30',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        px-5 py-2.5 rounded-lg
        border-[3px] border-comic-ink
        font-bold text-sm uppercase tracking-wider
        shadow-comic-sm comic-press
        cursor-pointer select-none
        ${variants[variant] || variants.primary}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}

export default ComicButton;
