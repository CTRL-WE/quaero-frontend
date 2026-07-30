import { useState, useCallback } from 'react';

// ── Source-type & status enums ───────────────────────────────────────────────
export const SOURCE_TYPES = Object.freeze({
  WEBSITE: 'WEBSITE',
  REVERSE_IMAGE_SEARCH: 'REVERSE_IMAGE_SEARCH',
  METADATA: 'METADATA',
  FACT_CHECK: 'FACT_CHECK',
  GOVERNMENT_SOURCE: 'GOVERNMENT_SOURCE',
  ACADEMIC_PAPER: 'ACADEMIC_PAPER',
  ARCHIVE: 'ARCHIVE',
});

export const EVIDENCE_STATUSES = Object.freeze({
  COLLECTED: 'COLLECTED',
  PENDING_REVIEW: 'PENDING_REVIEW',
  CONTRADICTS_CLAIM: 'CONTRADICTS_CLAIM',
});

// ── Validation helpers ───────────────────────────────────────────────────────
const VALID_SOURCE_TYPES = new Set(Object.values(SOURCE_TYPES));
const VALID_STATUSES = new Set(Object.values(EVIDENCE_STATUSES));

function validateEvidence(item) {
  if (!item || typeof item !== 'object') {
    throw new Error('Evidence item must be a non-null object.');
  }
  const { id, sourceType, title, summary, status } = item;

  if (!id) throw new Error('Evidence item requires a non-empty "id".');
  if (!title) throw new Error('Evidence item requires a non-empty "title".');
  if (!summary) throw new Error('Evidence item requires a non-empty "summary".');

  if (!VALID_SOURCE_TYPES.has(sourceType)) {
    throw new Error(
      `Invalid sourceType "${sourceType}". Expected one of: ${[...VALID_SOURCE_TYPES].join(', ')}`,
    );
  }
  if (!VALID_STATUSES.has(status)) {
    throw new Error(
      `Invalid status "${status}". Expected one of: ${[...VALID_STATUSES].join(', ')}`,
    );
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Manages a local, ephemeral collection of evidence items during an
 * active investigation session.
 *
 * Items are held in React state and are **not** persisted to the backend.
 *
 * @returns {{
 *   evidenceItems: Array<{id: string, sourceType: string, title: string, summary: string, status: string}>,
 *   addEvidence: (item: object) => void,
 *   removeEvidence: (id: string) => void,
 *   serializeForSubmission: () => string,
 * }}
 */
const useEvidenceLocker = () => {
  const [evidenceItems, setEvidenceItems] = useState([]);

  /**
   * Append a new evidence item to the locker.
   * Throws if the item shape is invalid or the id already exists.
   */
  const addEvidence = useCallback((item) => {
    validateEvidence(item);

    setEvidenceItems((prev) => {
      if (prev.some((e) => e.id === item.id)) {
        throw new Error(`Duplicate evidence id "${item.id}".`);
      }
      return [
        ...prev,
        {
          id: item.id,
          sourceType: item.sourceType,
          title: item.title,
          summary: item.summary,
          status: item.status,
        },
      ];
    });
  }, []);

  /**
   * Remove an evidence item by its id.
   * Silently no-ops if the id is not found.
   */
  const removeEvidence = useCallback((id) => {
    setEvidenceItems((prev) => prev.filter((e) => e.id !== id));
  }, []);

  /**
   * Serialise the current evidence array into the newline-separated text
   * format expected by the Submission API's `evidenceLinks` field.
   *
   * Each line: `[SOURCE_TYPE] Title — Summary (STATUS)`
   *
   * @returns {string}
   */
  const serializeForSubmission = useCallback(() => {
    return evidenceItems
      .map(
        (e) => `[${e.sourceType}] ${e.title} — ${e.summary} (${e.status})`,
      )
      .join('\n');
  }, [evidenceItems]);

  return {
    evidenceItems,
    addEvidence,
    removeEvidence,
    serializeForSubmission,
  };
};

export default useEvidenceLocker;
