import { useState } from 'react';
import { X, Compass, Search, BarChart3, ShieldCheck, Crown } from 'lucide-react';

/**
 * RankUpBanner — celebratory dismissible banner shown when the user
 * advances to a new rank tier.
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

/* ── Per-tier banner palettes ─────────────────────────────────────── */
const TIER_BANNER_STYLES = {
  Explorer: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-300',
    accent: 'text-slate-400',
    glow: 'shadow-slate-500/10',
  },
  Investigator: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-300',
    accent: 'text-cyan-400',
    glow: 'shadow-cyan-500/10',
  },
  Analyst: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-300',
    accent: 'text-purple-400',
    glow: 'shadow-purple-500/10',
  },
  Detective: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    accent: 'text-amber-400',
    glow: 'shadow-amber-500/10',
  },
  'Truth Guardian': {
    bg: 'bg-gradient-to-r from-yellow-500/12 to-emerald-500/12',
    border: 'border-yellow-500/30',
    text: 'text-yellow-200',
    accent: 'text-emerald-400',
    glow: 'shadow-yellow-500/15',
  },
};

function RankUpBanner({ previousTier, newTier }) {
  const [dismissed, setDismissed] = useState(false);

  /* Guard: only render when both tiers are provided and different */
  if (!previousTier || !newTier || previousTier.name === newTier.name || dismissed) {
    return null;
  }

  const style = TIER_BANNER_STYLES[newTier.name] ?? TIER_BANNER_STYLES.Explorer;
  const IconComponent = ICON_MAP[newTier.icon] ?? Compass;

  return (
    <div
      className={`
        relative flex items-center gap-3 rounded-base border px-4 py-3
        shadow-lg animate-[rank-up-pulse_2s_ease-in-out_1]
        ${style.bg} ${style.border} ${style.glow}
      `}
      role="status"
      aria-live="polite"
    >
      {/* Icon with subtle ring */}
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                    bg-white/5 ring-1 ring-white/10 ${style.accent}`}
      >
        <IconComponent className="h-5 w-5" aria-hidden="true" />
      </span>

      {/* Message */}
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${style.text}`}>
          🎉 You&apos;ve reached{' '}
          <span className={`font-bold ${style.accent}`}>{newTier.name}</span>
          {' '}rank!
        </p>
        <p className="mt-0.5 text-xs text-text-muted">
          {newTier.tooltip}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                   text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
        aria-label="Dismiss rank-up notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default RankUpBanner;
