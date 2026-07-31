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
 * Per-tier colour palette — Tailwind classes for bg, text, and ring.
 * Keyed by tier name for easy lookup.
 */
const TIER_STYLES = {
  Explorer: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    ring: 'ring-slate-500/25',
    iconColor: 'text-slate-400',
  },
  Investigator: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    ring: 'ring-cyan-500/25',
    iconColor: 'text-cyan-400',
  },
  Analyst: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    ring: 'ring-purple-500/25',
    iconColor: 'text-purple-400',
  },
  Detective: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    ring: 'ring-amber-500/25',
    iconColor: 'text-amber-400',
  },
  'Truth Guardian': {
    bg: 'bg-gradient-to-r from-yellow-500/15 to-emerald-500/15',
    text: 'text-yellow-300',
    ring: 'ring-yellow-500/30',
    iconColor: 'text-emerald-400',
  },
};

const DEFAULT_TIER = RANK_TIERS[0]; // Explorer

function RankBadge({ rankTier }) {
  const tier = rankTier ?? DEFAULT_TIER;
  const style = TIER_STYLES[tier.name] ?? TIER_STYLES.Explorer;
  const IconComponent = ICON_MAP[tier.icon] ?? Compass;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1
                 text-xs font-bold tracking-wide ring-1
                 ${style.bg} ${style.text} ${style.ring}`}
      aria-label={`Rank: ${tier.name}`}
      role="img"
    >
      <IconComponent className={`h-3.5 w-3.5 ${style.iconColor}`} aria-hidden="true" />
      {tier.name}
    </span>
  );
}

export default RankBadge;
