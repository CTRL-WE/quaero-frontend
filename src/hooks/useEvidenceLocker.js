import { useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// useEvidenceLocker — client-side evidence collection, keyed by caseId.
//
// Entries live in a module-level Map so they survive React re-renders and
// in-app navigation (e.g. switching between Brief → Chat → back) without
// any backend persistence.  The store is cleared on full page reload, which
// is intentional — a submitted investigation will already have serialised
// its evidence into the SubmissionRequest payload by that point.
//
// Ref: DS v2.0 §5, Backend Case Architecture Evolution v2 §3
//      "client-side only, no new backend field/table/endpoint for MVP"
// ---------------------------------------------------------------------------

/** @type {Map<string, EvidenceEntry[]>} */
const store = new Map();

let nextId = 1;

// ---------------------------------------------------------------------------
// Evidence types — lightweight local classification
// ---------------------------------------------------------------------------
export const EVIDENCE_TYPES = [
  { value: 'official-website',      label: 'Official website' },
  { value: 'reverse-image-search',  label: 'Reverse image search' },
  { value: 'fact-check',            label: 'Fact-check source' },
  { value: 'government',            label: 'Government source' },
  { value: 'academic',              label: 'Academic paper' },
  { value: 'archive',               label: 'Archive' },
];

export const EVIDENCE_STATUSES = [
  { value: 'collected',          label: 'Collected' },
  { value: 'pending-review',     label: 'Pending review' },
  { value: 'contradicts-claim',  label: 'Contradicts claim' },
];

// ---------------------------------------------------------------------------
// serializeForSubmission()
//
// Flattens the locker's entries into the plain-text format expected by
// SubmissionRequest.evidenceLinks — one item per line.
//
// Format:  [Type] Title — URL (Status)
//
// This keeps the field human-readable while preserving the metadata that a
// reviewer (or future parser) can use.  No new DTO shape is invented.
// ---------------------------------------------------------------------------
/**
 * @param {EvidenceEntry[]} entries
 * @returns {string} Plain-text, one entry per line
 */
export function serializeForSubmission(entries) {
  if (!entries || entries.length === 0) return '';

  const typeLabel = (val) =>
    EVIDENCE_TYPES.find((t) => t.value === val)?.label ?? val;
  const statusLabel = (val) =>
    EVIDENCE_STATUSES.find((s) => s.value === val)?.label ?? val;

  return entries
    .map(
      (e) =>
        `[${typeLabel(e.type)}] ${e.title} — ${e.url} (${statusLabel(e.status)})`,
    )
    .join('\n');
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * @typedef {{
 *   id:        string,
 *   url:       string,
 *   title:     string,
 *   summary:   string,
 *   type:      string,
 *   status:    string,
 *   createdAt: string,
 * }} EvidenceEntry
 */

/**
 * @param {string|number} caseId
 * @returns {{
 *   entries:     EvidenceEntry[],
 *   addEntry:    (draft: Omit<EvidenceEntry, 'id'|'createdAt'>) => void,
 *   removeEntry: (id: string) => void,
 *   updateEntryStatus: (id: string, status: string) => void,
 *   serialize:   () => string,
 * }}
 */
const useEvidenceLocker = (caseId) => {
  const [entries, setEntries] = useState(() => store.get(caseId) ?? []);

  // Sync both React state and the module-level store
  const persist = useCallback(
    (next) => {
      store.set(caseId, next);
      setEntries(next);
    },
    [caseId],
  );

  const addEntry = useCallback(
    (draft) => {
      const entry = {
        ...draft,
        id: `ev-${nextId++}`,
        createdAt: new Date().toISOString(),
      };
      const next = [...(store.get(caseId) ?? []), entry];
      persist(next);
    },
    [caseId, persist],
  );

  const removeEntry = useCallback(
    (id) => {
      const next = (store.get(caseId) ?? []).filter((e) => e.id !== id);
      persist(next);
    },
    [caseId, persist],
  );

  const updateEntryStatus = useCallback(
    (id, status) => {
      const next = (store.get(caseId) ?? []).map((e) =>
        e.id === id ? { ...e, status } : e,
      );
      persist(next);
    },
    [caseId, persist],
  );

  const serialize = useCallback(
    () => serializeForSubmission(entries),
    [entries],
  );

  return { entries, addEntry, removeEntry, updateEntryStatus, serialize };
};

export default useEvidenceLocker;
