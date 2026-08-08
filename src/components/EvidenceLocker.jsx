import { useState } from 'react';
import { ShieldCheck, Plus, X } from 'lucide-react';
import EvidenceCard from './EvidenceCard';
import { SOURCE_TYPES, EVIDENCE_STATUSES } from '../hooks/useEvidenceLocker';
import { ComicButton } from './comic';

/**
 * EvidenceLocker — panel component that displays collected evidence
 * and provides a form to add new items during an investigation.
 *
 * Props:
 *   evidenceItems – array from useEvidenceLocker
 *   onAdd         – addEvidence callback
 *   onRemove      – removeEvidence callback
 */

/* ── Human-readable labels for the sourceType dropdown ────────────── */
const SOURCE_LABELS = {
  [SOURCE_TYPES.WEBSITE]:              'Website',
  [SOURCE_TYPES.REVERSE_IMAGE_SEARCH]: 'Reverse Image Search',
  [SOURCE_TYPES.METADATA]:             'Metadata',
  [SOURCE_TYPES.FACT_CHECK]:           'Fact Check',
  [SOURCE_TYPES.GOVERNMENT_SOURCE]:    'Government Source',
  [SOURCE_TYPES.ACADEMIC_PAPER]:       'Academic Paper',
  [SOURCE_TYPES.ARCHIVE]:              'Archive',
};

const INITIAL_FORM = {
  title: '',
  summary: '',
  sourceType: SOURCE_TYPES.WEBSITE,
};

/* ── Component ────────────────────────────────────────────────────── */

function EvidenceLocker({ evidenceItems = [], onAdd, onRemove }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = form.title.trim();
    const trimmedSummary = form.summary.trim();

    if (!trimmedTitle) {
      setError('Title is required.');
      return;
    }
    if (!trimmedSummary) {
      setError('Summary is required.');
      return;
    }

    try {
      onAdd({
        id: crypto.randomUUID(),
        sourceType: form.sourceType,
        title: trimmedTitle,
        summary: trimmedSummary,
        status: EVIDENCE_STATUSES.PENDING_REVIEW,
      });
      setForm(INITIAL_FORM);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const count = evidenceItems.length;

  return (
    <section
      className="flex flex-col rounded-lg border-[3px] border-comic-ink
                 bg-comic-paper overflow-hidden"
    >
      {/* ── Header ── */}
      <header
        className="flex items-center gap-2.5 border-b-[3px] border-comic-ink
                   bg-comic-ink px-4 py-3"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md
                         bg-comic-yellow text-comic-ink">
          <ShieldCheck size={16} strokeWidth={2} />
        </span>

        <h2 className="text-sm font-bold text-white tracking-wide uppercase">
          Evidence Locker
        </h2>

        {count > 0 && (
          <span
            className="ml-auto inline-flex h-5 min-w-5 items-center justify-center
                       rounded-full bg-comic-red px-1.5
                       text-[11px] font-bold text-white"
          >
            {count}
          </span>
        )}
      </header>

      {/* ── Scrollable card list ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[420px]
                      scrollbar-thin scrollbar-thumb-comic-ink/15 scrollbar-track-transparent">
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2
                          text-comic-ink/40 select-none">
            <ShieldCheck size={28} strokeWidth={1.2} className="opacity-40" />
            <p className="text-xs font-bold">No evidence collected yet.</p>
          </div>
        ) : (
          evidenceItems.map((item) => (
            <div key={item.id} className="group/card relative">
              <EvidenceCard
                sourceType={item.sourceType}
                title={item.title}
                summary={item.summary}
                status={item.status}
              />
              {/* Remove button — visible on card hover */}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="absolute top-5 right-2 z-10 flex h-5 w-5 items-center
                           justify-center rounded-full
                           bg-comic-paper border border-comic-ink text-comic-ink
                           opacity-0 transition-opacity duration-150
                           hover:bg-comic-red hover:text-white hover:border-comic-red
                           group-hover/card:opacity-100"
                title="Remove evidence"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* ── Add-evidence form ── */}
      <form
        onSubmit={handleSubmit}
        className="border-t-[3px] border-comic-ink bg-comic-paper/80 p-3
                   space-y-2.5"
      >
        {/* Title input */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Evidence title or URL…"
          className="w-full rounded-md border-2 border-comic-ink/25 bg-white
                     px-3 py-2 text-sm text-comic-ink placeholder:text-comic-ink/35
                     outline-none transition-colors
                     focus:border-comic-blue focus:ring-1 focus:ring-comic-blue/25"
        />

        {/* Summary textarea */}
        <textarea
          name="summary"
          value={form.summary}
          onChange={handleChange}
          placeholder="Brief description of what this evidence shows…"
          rows={2}
          className="w-full resize-none rounded-md border-2 border-comic-ink/25 bg-white
                     px-3 py-2 text-sm text-comic-ink
                     placeholder:text-comic-ink/35 outline-none transition-colors
                     focus:border-comic-blue focus:ring-1 focus:ring-comic-blue/25"
        />

        {/* Source type + submit row */}
        <div className="flex items-center gap-2">
          <select
            name="sourceType"
            value={form.sourceType}
            onChange={handleChange}
            className="flex-1 appearance-none rounded-md border-2 border-comic-ink/25
                       bg-white px-3 py-2 text-sm text-comic-ink
                       outline-none transition-colors cursor-pointer
                       focus:border-comic-blue focus:ring-1 focus:ring-comic-blue/25"
          >
            {Object.entries(SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <ComicButton variant="primary" onClick={() => {}}>
            <Plus size={14} strokeWidth={2.5} />
            Add
          </ComicButton>
        </div>

        {/* Inline validation error */}
        {error && (
          <p className="text-xs font-bold text-comic-red animate-evidence-enter">{error}</p>
        )}
      </form>
    </section>
  );
}

export default EvidenceLocker;

