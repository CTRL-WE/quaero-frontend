// ---------------------------------------------------------------------------
// validators.js — client-side validation for the Submission form
//
// Ref: Frontend Engineering Handbook Screen 6, DS v1.0 FR-7
// Assigned to Dev B per the Frontend Handbook.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Verdict options — reasoning-oriented language (DS §2 core principle:
// never label as "Correct Answer", frame as investigative conclusions)
// ---------------------------------------------------------------------------
export const VERDICT_OPTIONS = [
  {
    value: 'SUPPORTED',
    label: 'Supported by evidence',
    description: 'The available evidence supports the claim as stated.',
  },
  {
    value: 'CONTRADICTED',
    label: 'Contradicted by evidence',
    description: 'The available evidence contradicts the core claim.',
  },
  {
    value: 'MISLEADING',
    label: 'Misleading or lacks context',
    description: 'The claim omits critical context that changes its meaning.',
  },
  {
    value: 'INSUFFICIENT',
    label: 'Insufficient evidence',
    description: 'Not enough reliable evidence to reach a conclusion.',
  },
  {
    value: 'PARTIALLY_SUPPORTED',
    label: 'Partially supported',
    description: 'Some elements are supported, but key parts are not.',
  },
];

const VALID_VERDICTS = new Set(VERDICT_OPTIONS.map((o) => o.value));

const RATIONALE_MIN_LENGTH = 50;

// ---------------------------------------------------------------------------
// Individual field validators — each returns null (valid) or an error string
// ---------------------------------------------------------------------------

/**
 * Verdict must be one of the defined enum values.
 * @param {string|null|undefined} verdict
 * @returns {string|null}
 */
export function validateVerdict(verdict) {
  if (!verdict) return 'Select the conclusion your investigation supports.';
  if (!VALID_VERDICTS.has(verdict)) return 'Invalid verdict selection.';
  return null;
}

/**
 * Rationale is required with a sensible minimum length.
 * @param {string|null|undefined} rationale
 * @returns {string|null}
 */
export function validateRationale(rationale) {
  const trimmed = (rationale ?? '').trim();
  if (!trimmed) return 'Explain the reasoning behind your verdict.';
  if (trimmed.length < RATIONALE_MIN_LENGTH) {
    return `Your rationale needs at least ${RATIONALE_MIN_LENGTH} characters (currently ${trimmed.length}).`;
  }
  return null;
}

/**
 * Each non-empty line in the evidence links field must contain at least one
 * well-formed URL.  The field itself is optional — an empty string is fine.
 *
 * Handles both:
 *   - Bare URLs pasted by the user     (https://example.com)
 *   - Serialized EvidenceLocker format  ([Type] Title — https://... (Status))
 *
 * @param {string|null|undefined} text
 * @returns {string|null}
 */
export function validateEvidenceLinks(text) {
  if (!text || !text.trim()) return null; // optional field

  const lines = text.split('\n').filter((l) => l.trim());
  const urlPattern = /https?:\/\/[^\s)]+/i;

  for (let i = 0; i < lines.length; i++) {
    if (!urlPattern.test(lines[i])) {
      return `Line ${i + 1} does not contain a valid URL (must start with http:// or https://).`;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Aggregate validator — returns an errors object keyed by field name.
// A field with no error is set to null.
// ---------------------------------------------------------------------------

/**
 * @param {{ verdict?: string, rationale?: string, evidenceLinks?: string }} fields
 * @returns {{ verdict: string|null, rationale: string|null, evidenceLinks: string|null }}
 */
export function validateSubmission({ verdict, rationale, evidenceLinks }) {
  return {
    verdict: validateVerdict(verdict),
    rationale: validateRationale(rationale),
    evidenceLinks: validateEvidenceLinks(evidenceLinks),
  };
}

/**
 * Returns true when every field in the errors object is null.
 * @param {{ [key: string]: string|null }} errors
 * @returns {boolean}
 */
export function isValid(errors) {
  return Object.values(errors).every((v) => v === null);
}
