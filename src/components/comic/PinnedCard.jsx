import { useRef } from 'react';
import ComicPanel from './ComicPanel';

/**
 * PinnedCard — a ComicPanel with a small circular "pushpin" positioned
 * at the top, for evidence/exhibit cards.
 *
 * Props:
 *   children    – card content
 *   pinPosition – 'center' (default) | 'left'
 */
function PinnedCard({ children, pinPosition = 'center' }) {
  const rotation = useRef((Math.random() - 0.5) * 3);

  const pinAlign =
    pinPosition === 'left'
      ? 'left-5'
      : 'left-1/2 -translate-x-1/2';

  return (
    <div className="relative pt-3">
      {/* Pushpin */}
      <div
        className={`absolute -top-1.5 z-10 ${pinAlign}`}
        aria-hidden="true"
      >
        {/* Pin head — radial gradient circle */}
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #e03e2d, #8a1a10)',
            boxShadow:
              '0 3px 5px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.3)',
          }}
        />
        {/* Pin shaft shadow */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '100%',
            transform: 'translateX(-50%)',
            width: 2,
            height: 6,
            background: 'linear-gradient(to bottom, #555, transparent)',
          }}
        />
      </div>

      <ComicPanel rotate={rotation.current}>
        {children}
      </ComicPanel>
    </div>
  );
}

export default PinnedCard;
