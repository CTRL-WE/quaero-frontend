import {
  Globe,
  Search,
  FileText,
  CheckCircle,
  Landmark,
  BookOpen,
  Archive,
} from 'lucide-react';

/**
 * EvidenceCard — collectible-feeling card for a single evidence item.
 *
 * Props:
 *   sourceType – WEBSITE | REVERSE_IMAGE_SEARCH | METADATA | FACT_CHECK
 *                | GOVERNMENT_SOURCE | ACADEMIC_PAPER | ARCHIVE
 *   title      – heading string
 *   summary    – short body text
 *   status     – COLLECTED | PENDING_REVIEW | CONTRADICTS_CLAIM
 */

/* ── Source-type metadata ─────────────────────────────────────────── */
const SOURCE_META = {
  WEBSITE:              { icon: Globe,       label: 'Website',              color: '#60a5fa' },
  REVERSE_IMAGE_SEARCH: { icon: Search,      label: 'Reverse Image Search', color: '#c084fc' },
  METADATA:             { icon: FileText,    label: 'Metadata',             color: '#94a3b8' },
  FACT_CHECK:           { icon: CheckCircle, label: 'Fact Check',           color: '#34d399' },
  GOVERNMENT_SOURCE:    { icon: Landmark,    label: 'Government Source',    color: '#fbbf24' },
  ACADEMIC_PAPER:       { icon: BookOpen,    label: 'Academic Paper',       color: '#818cf8' },
  ARCHIVE:              { icon: Archive,     label: 'Archive',              color: '#f97316' },
};

const FALLBACK_SOURCE = { icon: Globe, label: 'Source', color: '#6b7280' };

/* ── Status badge styles ──────────────────────────────────────────── */
const STATUS_STYLES = {
  COLLECTED: {
    label: 'Collected',
    classes: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/25',
  },
  PENDING_REVIEW: {
    label: 'Pending Review',
    classes: 'bg-amber-500/10 text-amber-400 ring-amber-500/25',
  },
  CONTRADICTS_CLAIM: {
    label: 'Contradicts',
    classes: 'bg-red-500/10 text-red-400 ring-red-500/25',
  },
};

const FALLBACK_STATUS = {
  label: 'Unknown',
  classes: 'bg-gray-500/10 text-gray-400 ring-gray-500/25',
};

/* ── Component ────────────────────────────────────────────────────── */

function EvidenceCard({ sourceType, title, summary, status }) {
  const source = SOURCE_META[sourceType] || FALLBACK_SOURCE;
  const statusStyle = STATUS_STYLES[status] || FALLBACK_STATUS;
  const Icon = source.icon;

  return (
    <div
      className="group relative flex flex-col gap-3 rounded-base
                 border border-border-hairline bg-surface-card p-4
                 transition-all duration-200 ease-out
                 hover:border-white/12 hover:shadow-lg hover:shadow-black/30
                 animate-evidence-enter"
    >
      {/* Subtle accent glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-base opacity-0
                   transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, ${source.color}08 0%, transparent 70%)`,
        }}
      />

      {/* ── Header: icon + source label ── */}
      <div className="relative flex items-center gap-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center
                     rounded-md"
          style={{
            color: source.color,
            backgroundColor: `${source.color}14`,
          }}
        >
          <Icon size={15} strokeWidth={2} />
        </span>

        <span
          className="text-[11px] font-medium uppercase tracking-wider"
          style={{ color: source.color }}
        >
          {source.label}
        </span>
      </div>

      {/* ── Title ── */}
      <h3 className="relative text-sm font-medium leading-snug text-text-primary line-clamp-2">
        {title}
      </h3>

      {/* ── Summary ── */}
      <p className="relative text-xs leading-relaxed text-text-secondary line-clamp-3">
        {summary}
      </p>

      {/* ── Status badge ── */}
      <div className="relative mt-auto pt-1">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5
                      text-[11px] font-medium leading-none tracking-wide
                      ring-1 ${statusStyle.classes}`}
        >
          {statusStyle.label}
        </span>
      </div>
    </div>
  );
}

export default EvidenceCard;
