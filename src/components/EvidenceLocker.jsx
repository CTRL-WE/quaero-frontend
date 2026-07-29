import { useState } from 'react';
import {
  EVIDENCE_TYPES,
  EVIDENCE_STATUSES,
} from '../hooks/useEvidenceLocker';

// ---------------------------------------------------------------------------
// EvidenceLocker — Investigation Workspace panel (Panel 3)
//
// Lets the user collect evidence links with a lightweight local type +
// status classification.  All state is client-side only (see
// useEvidenceLocker).  The panel renders inside the right-sidebar column
// built by ChatPage (Prompt 4).
//
// Design tokens (v1 §1): dark layered surfaces, hairline borders, indigo
// accent, soft radius, sentence case.
//
// Ref: DS v2.0 §5, Backend Case Architecture Evolution v2 §3
// ---------------------------------------------------------------------------

// ---- Per-type icons (Heroicons Mini 20×20) ---------------------------------
const TYPE_ICONS = {
  'official-website': (
    <path
      fillRule="evenodd"
      d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm7.25-.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V6.31l-5.47 5.47a.75.75 0 1 1-1.06-1.06l5.47-5.47H12.25a.75.75 0 0 1-.75-.75Z"
      clipRule="evenodd"
    />
  ),
  'reverse-image-search': (
    <path
      fillRule="evenodd"
      d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909-4.719-4.718a.75.75 0 0 0-1.06 0L2.5 11.06Zm6.03-3.56a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
      clipRule="evenodd"
    />
  ),
  'fact-check': (
    <path
      fillRule="evenodd"
      d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
      clipRule="evenodd"
    />
  ),
  'government': (
    <path
      fillRule="evenodd"
      d="M9.674 2.075a.75.75 0 0 1 .652 0l7.25 3.5A.75.75 0 0 1 17.5 6.5v.125a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V6.5a.75.75 0 0 1-.076-.925l7.25-3.5ZM10 4.112 5.135 6.5h9.73L10 4.112ZM4.5 9.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Zm3.75.75a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5Zm2.5-.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Zm3.75.75a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5Zm2.5-.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75ZM2 15.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 .75.75v.625a1 1 0 0 1-1 1h-14a1 1 0 0 1-1-1v-.625Z"
      clipRule="evenodd"
    />
  ),
  'academic': (
    <path d="M10.75 2.567a1.5 1.5 0 0 0-1.5 0L2.6 6.326a.75.75 0 0 0 0 1.348l6.65 3.76a1.5 1.5 0 0 0 1.5 0l6.65-3.76a.75.75 0 0 0 0-1.348l-6.65-3.76ZM2.5 11.5a.75.75 0 0 1 .75.75v3c0 .414.336.75.75.75h12a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 1 1.5 0v3A2.25 2.25 0 0 1 16 17.5H4a2.25 2.25 0 0 1-2.25-2.25v-3a.75.75 0 0 1 .75-.75Z" />
  ),
  'archive': (
    <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Zm0 4.5h16v8.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8.5Zm5.5 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5Z" />
  ),
};

// ---- Status badge colours --------------------------------------------------
const STATUS_COLOURS = {
  'collected':         { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  'pending-review':    { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20' },
  'contradicts-claim': { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20' },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Small per-type SVG icon */
function TypeIcon({ type, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 ${className}`}
    >
      {TYPE_ICONS[type] ?? TYPE_ICONS['official-website']}
    </svg>
  );
}

/** Status pill */
function StatusBadge({ status }) {
  const colours = STATUS_COLOURS[status] ?? STATUS_COLOURS['collected'];
  const label =
    EVIDENCE_STATUSES.find((s) => s.value === status)?.label ?? status;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none ${colours.bg} ${colours.text} ${colours.border}`}
    >
      {label}
    </span>
  );
}

/** Single evidence card */
function EvidenceCard({ entry, onRemove, onStatusChange }) {
  const typeLabel =
    EVIDENCE_TYPES.find((t) => t.value === entry.type)?.label ?? entry.type;

  return (
    <div className="group rounded-lg border border-gray-800/60 bg-gray-900/50 p-3 transition-colors hover:border-gray-700/80">
      {/* Top row: icon + title + remove */}
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/15">
          <TypeIcon type={entry.type} className="text-indigo-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-200 leading-snug line-clamp-2 break-all">
            {entry.title || entry.url}
          </p>
          <p className="mt-0.5 text-[10px] text-gray-600 truncate">{typeLabel}</p>
        </div>

        <button
          onClick={() => onRemove(entry.id)}
          className="shrink-0 rounded p-0.5 text-gray-700 transition-all
                     hover:bg-gray-800 hover:text-gray-400
                     sm:opacity-0 sm:group-hover:opacity-100"
          aria-label={`Remove ${entry.title || 'evidence'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
        </button>
      </div>

      {/* Summary */}
      {entry.summary && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 line-clamp-2">
          {entry.summary}
        </p>
      )}

      {/* URL + Status row */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 truncate text-[10px] text-indigo-400/70 transition-colors hover:text-indigo-300"
        >
          {entry.url}
        </a>

        {/* Click status badge to cycle */}
        <button
          onClick={() => {
            const idx = EVIDENCE_STATUSES.findIndex((s) => s.value === entry.status);
            const next = EVIDENCE_STATUSES[(idx + 1) % EVIDENCE_STATUSES.length].value;
            onStatusChange(entry.id, next);
          }}
          className="shrink-0 cursor-pointer"
          title="Click to change status"
        >
          <StatusBadge status={entry.status} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add-evidence form
// ---------------------------------------------------------------------------
function AddEvidenceForm({ onAdd, onCancel }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [type, setType] = useState(EVIDENCE_TYPES[0].value);
  const [status, setStatus] = useState(EVIDENCE_STATUSES[0].value);

  const canSubmit = url.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd({
      url: url.trim(),
      title: title.trim() || url.trim(),
      summary: summary.trim(),
      type,
      status,
    });
    // Reset form
    setUrl('');
    setTitle('');
    setSummary('');
    setType(EVIDENCE_TYPES[0].value);
    setStatus(EVIDENCE_STATUSES[0].value);
  };

  const inputCls =
    'w-full rounded-md border border-gray-700/80 bg-gray-800/60 px-2.5 py-1.5 text-xs text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20';
  const selectCls =
    'w-full rounded-md border border-gray-700/80 bg-gray-800/60 px-2 py-1.5 text-xs text-gray-300 outline-none transition-colors focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 appearance-none cursor-pointer';

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 border-b border-gray-800/60 px-3 py-3 bg-gray-900/30">
      {/* URL */}
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        required
        className={inputCls}
        autoFocus
      />

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (auto-fills from URL if empty)"
        className={inputCls}
      />

      {/* Summary */}
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Brief note (optional)"
        rows={2}
        className={`${inputCls} resize-none`}
      />

      {/* Type + Status selects side by side */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-[10px] font-medium text-gray-600">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
            {EVIDENCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-[10px] font-medium text-gray-600">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            {EVIDENCE_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white
                     transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2
                     focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-gray-950
                     disabled:opacity-40 disabled:hover:bg-indigo-600"
        >
          Add evidence
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-700/80 px-3 py-1.5 text-xs font-medium
                     text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// EvidenceLocker (main export)
// ---------------------------------------------------------------------------

/**
 * @param {{
 *   entries:           import('../hooks/useEvidenceLocker').EvidenceEntry[],
 *   onAdd:             (draft: object) => void,
 *   onRemove:          (id: string) => void,
 *   onStatusChange:    (id: string, status: string) => void,
 *   disabled?:         boolean,
 * }} props
 */
function EvidenceLocker({ entries = [], onAdd, onRemove, onStatusChange, disabled = false }) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (draft) => {
    onAdd(draft);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col bg-gray-950/50 flex-1">
      {/* Panel header */}
      <div className="shrink-0 flex items-center justify-between border-b border-gray-800/60 px-3 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Evidence locker
        </h2>

        {!disabled && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 rounded-md border border-gray-700/60 bg-gray-800/40
                       px-2 py-1 text-[10px] font-medium text-gray-400
                       transition-colors hover:border-indigo-500/40 hover:text-indigo-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>
            Add
          </button>
        )}

        {entries.length > 0 && (
          <span className="ml-2 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-indigo-500/15 px-1.5 text-[10px] font-semibold tabular-nums text-indigo-400">
            {entries.length}
          </span>
        )}
      </div>

      {/* Add form (collapsible) */}
      {showForm && (
        <AddEvidenceForm
          onAdd={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Evidence cards */}
      {entries.length > 0 ? (
        <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2">
          {entries.map((entry) => (
            <EvidenceCard
              key={entry.id}
              entry={entry}
              onRemove={onRemove}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        /* Empty state */
        !showForm && (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-800/60 border border-gray-700/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 text-gray-600"
              >
                <path d="M3.196 12.87l-.825.483a.75.75 0 0 0 0 1.294l7.004 4.086a1.5 1.5 0 0 0 1.25 0l7.004-4.086a.75.75 0 0 0 0-1.294l-.825-.484-5.554 3.243a2.5 2.5 0 0 1-2.5 0L3.196 12.87Z" />
                <path d="M3.196 8.87l-.825.483a.75.75 0 0 0 0 1.294l7.004 4.086a1.5 1.5 0 0 0 1.25 0l7.004-4.086a.75.75 0 0 0 0-1.294l-.825-.484-5.554 3.243a2.5 2.5 0 0 1-2.5 0L3.196 8.87Z" />
                <path d="M10.625 2.458a1.5 1.5 0 0 0-1.25 0L2.37 6.544a.75.75 0 0 0 0 1.294l7.004 4.086a1.5 1.5 0 0 0 1.25 0l7.004-4.086a.75.75 0 0 0 0-1.294l-7.004-4.086Z" />
              </svg>
            </div>
            <p className="text-xs font-medium text-gray-500">
              No evidence collected yet
            </p>
            <p className="mt-1 max-w-[180px] text-[11px] leading-relaxed text-gray-600">
              Add links you discover during your investigation to build your evidence base.
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default EvidenceLocker;
