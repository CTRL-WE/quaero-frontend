import { Compass, Search, BarChart3, ShieldCheck, Crown } from 'lucide-react';
import { RANK_TIERS } from '../utils/rankTiers';

/** Map icon name strings from rankTiers.js to actual lucide-react components */
const ICON_MAP = {
  Compass,
  Search,
  BarChart3,
  ShieldCheck,
  Crown,
};

/**
 * Per-tier colour palette for the stamp — comic-themed colours.
 */
const TIER_STAMP = {
  Explorer: {
    border: 'var(--color-comic-ink)',
    text: 'var(--color-comic-ink)',
    bg: 'rgba(22, 20, 18, 0.06)',
  },
  Investigator: {
    border: 'var(--color-comic-blue)',
    text: 'var(--color-comic-blue)',
    bg: 'rgba(46, 100, 168, 0.10)',
  },
  Analyst: {
    border: 'var(--color-comic-purple)',
    text: 'var(--color-comic-purple)',
    bg: 'rgba(122, 79, 201, 0.10)',
  },
  Detective: {
    border: 'var(--color-comic-brown)',
    text: 'var(--color-comic-brown)',
    bg: 'rgba(138, 106, 60, 0.10)',
  },
  'Truth Guardian': {
    border: 'var(--color-comic-red)',
    text: 'var(--color-comic-red)',
    bg: 'rgba(224, 62, 45, 0.08)',
  },
};

const DEFAULT_TIER = RANK_TIERS[0]; // Explorer

function RankBadge({ rankTier }) {
  const tier = rankTier ?? DEFAULT_TIER;
  const stamp = TIER_STAMP[tier.name] ?? TIER_STAMP.Explorer;
  const IconComponent = ICON_MAP[tier.icon] ?? Compass;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1"
      style={{
        border: `2px solid ${stamp.border}`,
        borderRadius: 2,
        background: stamp.bg,
        color: stamp.text,
        fontFamily: 'var(--font-display)',
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        transform: 'rotate(-2deg)',
      }}
      aria-label={`Rank: ${tier.name}`}
      role="group"
    >
      <IconComponent
        className="h-3.5 w-3.5"
        style={{ color: stamp.text }}
        aria-hidden="true"
      />
      {tier.name}
    </span>
  );
}

export default RankBadge;
