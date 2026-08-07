import { useState } from 'react';
import { X, Compass, Search, BarChart3, ShieldCheck, Crown } from 'lucide-react';
import { ComicPanel, StampBadge } from './comic';

/**
 * RankUpBanner — celebratory dismissible banner shown when the user
 * advances to a new rank tier, styled as a comic celebration panel.
 *
 * Props:
 *   previousTier – the tier object the user just left
 *   newTier      – the tier object the user just reached
 *
 * Only renders when both props are provided and their names differ.
 * Includes role="status" + aria-live="polite" for screen-reader announcements.
 */

/* ── Icon map (mirrors RankBadge) ─────────────────────────────────── */
const ICON_MAP = { Compass, Search, BarChart3, ShieldCheck, Crown };

function RankUpBanner({ previousTier, newTier }) {
  const [dismissed, setDismissed] = useState(false);

  /* Guard: only render when both tiers are provided and different */
  if (!previousTier || !newTier || previousTier.name === newTier.name || dismissed) {
    return null;
  }

  const IconComponent = ICON_MAP[newTier.icon] ?? Compass;

  return (
    <ComicPanel rotate={0} className="bg-halftone relative overflow-hidden">
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-4 relative z-10"
      >
        {/* Icon with comic ring */}
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
          style={{
            border: '3px solid var(--color-comic-ink)',
            background: 'var(--color-comic-yellow)',
            boxShadow: '2px 2px 0 var(--color-comic-ink)',
          }}
        >
          <IconComponent
            className="h-6 w-6"
            style={{ color: 'var(--color-comic-ink)' }}
            aria-hidden="true"
          />
        </span>

        {/* Message */}
        <div className="min-w-0 flex-1">
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              letterSpacing: '0.04em',
              color: 'var(--color-comic-ink)',
            }}
          >
            Rank Up!
          </p>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-comic-ink)',
              opacity: 0.7,
              marginTop: 2,
            }}
          >
            {newTier.tooltip}
          </p>
        </div>

        {/* Stamp badge — slams in */}
        <div
          style={{
            animation: 'stamp-slam 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
            opacity: 0,
          }}
        >
          <StampBadge tone="green">{newTier.name}</StampBadge>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-70"
          style={{
            color: 'var(--color-comic-ink)',
            border: '2px solid var(--color-comic-ink)',
          }}
          aria-label="Dismiss rank-up notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </ComicPanel>
  );
}

export default RankUpBanner;
