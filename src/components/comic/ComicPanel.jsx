import { useRef } from 'react';

/**
 * ComicPanel — generic card wrapper in the Detective Comic style.
 *
 * Props:
 *   children  – content to render inside the panel
 *   className – extra classes to merge
 *   rotate    – explicit rotation in degrees (-1.5 to 1.5 recommended);
 *               defaults to a stable random-ish value per instance
 */
function ComicPanel({ children, className = '', rotate }) {
  /* Stable random rotation: computed once on mount, stays constant */
  const defaultRotation = useRef((Math.random() - 0.5) * 3); // −1.5 … +1.5
  const deg = rotate !== undefined ? rotate : defaultRotation.current;

  return (
    <div
      className={`border-comic shadow-comic bg-comic-paper p-5 ${className}`}
      style={{ transform: `rotate(${deg}deg)` }}
    >
      {children}
    </div>
  );
}

export default ComicPanel;
