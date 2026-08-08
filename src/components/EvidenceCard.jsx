import {
  Globe,
  Search,
  FileText,
  CheckCircle,
  Landmark,
  BookOpen,
  Archive,
} from 'lucide-react';
import { PinnedCard, StampBadge } from './comic';

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

/* ── Status → StampBadge tone mapping ─────────────────────────────── */
const STATUS_TONE = {
  COLLECTED:         'green',
  PENDING_REVIEW:    'amber',
  CONTRADICTS_CLAIM: 'red',
};

const STATUS_LABEL = {
  COLLECTED:         'Collected',
  PENDING_REVIEW:    'Pending',
  CONTRADICTS_CLAIM: 'Contradicts',
};

/* ── Component ────────────────────────────────────────────────────── */

function EvidenceCard({ sourceType, title, summary, status }) {
  const source = SOURCE_META[sourceType] || FALLBACK_SOURCE;
  const Icon = source.icon;

  return (
    <PinnedCard pinPosition="left">
      {/* ── Source-type tag ── */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
          style={{ color: source.color, backgroundColor: `${source.color}20` }}
        >
          <Icon size={13} strokeWidth={2} />
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: source.color }}
        >
          {source.label}
        </span>
      </div>

      {/* ── Title ── */}
      <h3 className="text-sm font-semibold leading-snug text-comic-ink line-clamp-2 mb-1">
        {title}
      </h3>

      {/* ── Summary ── */}
      <p className="text-xs leading-relaxed text-comic-ink/65 line-clamp-3 mb-2">
        {summary}
      </p>

      {/* ── Status badge ── */}
      <StampBadge tone={STATUS_TONE[status] || 'amber'}>
        {STATUS_LABEL[status] || 'Unknown'}
      </StampBadge>
    </PinnedCard>
  );
}

export default EvidenceCard;

