import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useCaseBrief from '../hooks/useCaseBrief';
import useEvidenceLocker from '../hooks/useEvidenceLocker';
import { submitInvestigation } from '../services/submissionService';
import {
  VERDICT_OPTIONS,
  validateSubmission,
  isValid,
} from '../utils/validators';

// ---------------------------------------------------------------------------
// SubmissionPage — Screen 6 (Frontend Handbook)
//
// Lets the investigator submit their verdict, rationale, and collected
// evidence links for AI-assisted grading.
//
// Key behaviours:
//   • Evidence links pre-populated from EvidenceLocker.serialize(), editable
//   • Verdict framing is reasoning-oriented (DS §2) — no "Correct Answer"
//   • "Evaluating your reasoning…" while the Gemini grading call is in flight
//   • 409 → redirect to the Investigation Workspace (submitted state)
//   • Other errors → preserve typed rationale, never clear form
//   • Client-side double-submit guard + graceful 409 fallback
//
// Ref: DS v1.0 FR-7, Implementation Blueprint Submission DTOs
// ---------------------------------------------------------------------------

// ---- Verdict colour hints (subtle, not distracting) -----------------------
const VERDICT_RING = {
  SUPPORTED:           'border-emerald-500/40 bg-emerald-500/5',
  CONTRADICTED:        'border-red-500/40 bg-red-500/5',
  MISLEADING:          'border-amber-500/40 bg-amber-500/5',
  INSUFFICIENT:        'border-gray-500/40 bg-gray-500/5',
  PARTIALLY_SUPPORTED: 'border-indigo-500/40 bg-indigo-500/5',
};

function SubmissionPage() {
  const { id: caseId } = useParams();
  const navigate = useNavigate();

  // Brief — for the case reference strip
  const { brief, loading: briefLoading } = useCaseBrief(caseId);

  // Evidence Locker — pre-populate evidence links
  const { serialize } = useEvidenceLocker(caseId);
  const initialEvidence = useMemo(() => serialize(), [serialize]);

  // ---- Form state ----------------------------------------------------------
  const [verdict, setVerdict] = useState('');
  const [rationale, setRationale] = useState('');
  const [evidenceLinks, setEvidenceLinks] = useState(initialEvidence);
  const [errors, setErrors] = useState({
    verdict: null,
    rationale: null,
    evidenceLinks: null,
  });
  const [touched, setTouched] = useState({
    verdict: false,
    rationale: false,
    evidenceLinks: false,
  });

  // ---- Submission state ----------------------------------------------------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false); // client-side guard

  // ---- Handlers ------------------------------------------------------------
  const touch = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleVerdictChange = (value) => {
    setVerdict(value);
    touch('verdict');
    // Clear verdict error immediately on selection
    setErrors((prev) => ({ ...prev, verdict: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side double-submit guard
    if (hasSubmitted || isSubmitting) return;

    // Validate all fields
    const payload = { verdict, rationale, evidenceLinks };
    const fieldErrors = validateSubmission(payload);
    setErrors(fieldErrors);
    setTouched({ verdict: true, rationale: true, evidenceLinks: true });

    if (!isValid(fieldErrors)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitInvestigation(caseId, payload);
      setHasSubmitted(true);

      // Navigate back to the workspace — it will show the submitted state
      navigate(`/chat/${caseId}`, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const errorCode = err.response?.data?.code;

      if (status === 409 && errorCode === 'SESSION_ALREADY_SUBMITTED') {
        // Already submitted — redirect to workspace (shows submitted state)
        setHasSubmitted(true);
        navigate(`/chat/${caseId}`, { replace: true });
        return;
      }

      // Any other failure — preserve form content, show error
      setSubmitError(
        err.response?.data?.message ||
          err.message ||
          'Something went wrong. Your work has been preserved — please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Render helpers ------------------------------------------------------
  const rationaleLength = rationale.trim().length;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">

        {/* ---- Back link -------------------------------------------------- */}
        <Link
          to={`/chat/${caseId}`}
          className="mb-6 inline-flex items-center gap-1 py-2 text-sm text-gray-500 transition-colors hover:text-gray-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to investigation
        </Link>

        {/* ---- Page title ------------------------------------------------- */}
        <h1 className="text-xl font-bold tracking-tight text-gray-100 sm:text-2xl">
          Submit your reasoning
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Review your investigation and submit your conclusion. An AI evaluator
          will assess the depth and quality of your reasoning.
        </p>

        {/* ---- Case reference ---------------------------------------------- */}
        {!briefLoading && brief && (
          <div className="mt-6 flex items-center gap-3 rounded-lg border border-gray-800/60 bg-gray-900/40 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-indigo-400">
                <path
                  fillRule="evenodd"
                  d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-300 truncate">{brief.claim}</p>
              <p className="text-[11px] text-gray-600">Case {caseId}</p>
            </div>
          </div>
        )}

        {/* ---- Form -------------------------------------------------------- */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">

          {/* ============================================================
              1. Verdict selector — card-style radio buttons
              ============================================================ */}
          <fieldset>
            <legend className="text-sm font-semibold text-gray-200">
              What does your investigation conclude?
            </legend>
            <p className="mt-1 text-xs text-gray-600">
              Choose the conclusion best supported by the evidence you gathered.
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {VERDICT_OPTIONS.map((opt) => {
                const selected = verdict === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleVerdictChange(opt.value)}
                    className={`group relative flex flex-col rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                      selected
                        ? `${VERDICT_RING[opt.value]} ring-1 ring-inset ring-white/10`
                        : 'border-gray-800/60 bg-gray-900/30 hover:border-gray-700/80 hover:bg-gray-900/50'
                    }`}
                  >
                    {/* Radio dot */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          selected
                            ? 'border-indigo-400 bg-indigo-500'
                            : 'border-gray-600 bg-gray-800/50'
                        }`}
                      >
                        {selected && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-semibold ${selected ? 'text-gray-100' : 'text-gray-300'}`}>
                          {opt.label}
                        </span>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-gray-600">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {touched.verdict && errors.verdict && (
              <p className="mt-2 text-xs text-red-400">{errors.verdict}</p>
            )}
          </fieldset>

          {/* ============================================================
              2. Rationale
              ============================================================ */}
          <div>
            <label
              htmlFor="rationale"
              className="block text-sm font-semibold text-gray-200"
            >
              Your reasoning
            </label>
            <p className="mt-1 text-xs text-gray-600">
              Explain how you reached your conclusion. Reference specific evidence.
            </p>

            <textarea
              id="rationale"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              onBlur={() => touch('rationale')}
              rows={6}
              placeholder="Walk through the key pieces of evidence that led to your verdict, and explain why they are reliable…"
              className={`mt-3 w-full resize-y rounded-lg border bg-gray-800/40 px-4 py-3 text-sm text-gray-100 placeholder-gray-600 outline-none transition-colors focus:ring-1 ${
                touched.rationale && errors.rationale
                  ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                  : 'border-gray-700/80 focus:border-indigo-500/60 focus:ring-indigo-500/20'
              }`}
            />

            <div className="mt-1.5 flex items-center justify-between">
              {touched.rationale && errors.rationale ? (
                <p className="text-xs text-red-400">{errors.rationale}</p>
              ) : (
                <span />
              )}
              <span
                className={`text-[11px] tabular-nums ${
                  rationaleLength < 50 ? 'text-gray-600' : 'text-gray-500'
                }`}
              >
                {rationaleLength} / 50 min
              </span>
            </div>
          </div>

          {/* ============================================================
              3. Evidence links (pre-populated, editable)
              ============================================================ */}
          <div>
            <label
              htmlFor="evidence-links"
              className="block text-sm font-semibold text-gray-200"
            >
              Evidence links
              <span className="ml-1.5 text-xs font-normal text-gray-600">
                (optional)
              </span>
            </label>
            <p className="mt-1 text-xs text-gray-600">
              One link per line. Pre-populated from your evidence locker — you
              can edit or add more.
            </p>

            <textarea
              id="evidence-links"
              value={evidenceLinks}
              onChange={(e) => setEvidenceLinks(e.target.value)}
              onBlur={() => touch('evidenceLinks')}
              rows={4}
              placeholder="https://example.com/source-article"
              className={`mt-3 w-full resize-y rounded-lg border bg-gray-800/40 px-4 py-3 font-mono text-xs text-gray-300 placeholder-gray-600 outline-none transition-colors focus:ring-1 ${
                touched.evidenceLinks && errors.evidenceLinks
                  ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                  : 'border-gray-700/80 focus:border-indigo-500/60 focus:ring-indigo-500/20'
              }`}
            />

            {touched.evidenceLinks && errors.evidenceLinks && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.evidenceLinks}
              </p>
            )}
          </div>

          {/* ============================================================
              Submit error banner — preserves form, never clears content
              ============================================================ */}
          {submitError && (
            <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-red-400">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="flex-1 text-sm text-red-300">{submitError}</p>
              <button
                type="button"
                onClick={() => setSubmitError(null)}
                className="shrink-0 text-red-400/60 transition-colors hover:text-red-300"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* ============================================================
              Submit button
              ============================================================ */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-800/60 pt-6">
            <Link
              to={`/chat/${caseId}`}
              className="rounded-lg border border-gray-700/80 px-5 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-300"
            >
              Back to investigation
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || hasSubmitted}
              className="relative flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white
                         transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950
                         disabled:opacity-60 disabled:hover:bg-indigo-600 disabled:hover:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Evaluating your reasoning…
                </>
              ) : hasSubmitted ? (
                'Submitted'
              ) : (
                'Submit investigation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmissionPage;
