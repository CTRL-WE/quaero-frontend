import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, FlaskConical } from 'lucide-react';
import { submit } from '../services/submissionService';

/**
 * SubmissionPage — final step where the investigator reviews their evidence,
 * selects a verdict, writes their rationale, and submits for grading.
 *
 * Reads from location.state:
 *   caseId        – the case being investigated
 *   evidenceLinks – pre-serialised evidence from the Evidence Locker
 */

/* ── Verdict options ──────────────────────────────────────────────── */

const VERDICTS = [
  {
    value: 'TRUE',
    label: 'True',
    description: 'The claim is accurate and well-supported',
    ring: 'ring-emerald-500/30',
    checked: 'border-emerald-500 bg-emerald-500/10 ring-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  {
    value: 'FALSE',
    label: 'False',
    description: 'The claim is inaccurate or fabricated',
    ring: 'ring-red-500/30',
    checked: 'border-red-500 bg-red-500/10 ring-red-500/30',
    dot: 'bg-red-500',
  },
  {
    value: 'MISLEADING',
    label: 'Misleading',
    description: 'Partially true but presented deceptively',
    ring: 'ring-amber-500/30',
    checked: 'border-amber-500 bg-amber-500/10 ring-amber-500/30',
    dot: 'bg-amber-500',
  },
  {
    value: 'UNVERIFIED',
    label: 'Unverified',
    description: 'Insufficient evidence to determine',
    ring: 'ring-gray-500/30',
    checked: 'border-gray-400 bg-gray-500/10 ring-gray-500/30',
    dot: 'bg-gray-400',
  },
];

const MIN_RATIONALE_LENGTH = 80;

/* ── Component ────────────────────────────────────────────────────── */

function SubmissionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const caseId = location.state?.caseId ?? 'unknown';
  const prefilled = location.state?.evidenceLinks ?? '';

  // ── Form state ──
  const [verdict, setVerdict] = useState('');
  const [rationale, setRationale] = useState('');
  const [evidenceLinks, setEvidenceLinks] = useState(prefilled);

  // ── Submission state ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const rationaleLength = rationale.trim().length;
  const rationaleOk = rationaleLength >= MIN_RATIONALE_LENGTH;
  const canSubmit = verdict && rationaleOk && evidenceLinks.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await submit(caseId, verdict, rationale.trim(), evidenceLinks.trim());

      navigate('/feedback', {
        state: result,
        replace: true,
      });
    } catch (err) {
      console.error('Submission failed:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.',
      );
      // Never clear the user's typed rationale or evidence
      setIsSubmitting(false);
    }
  };

  /* ── Loading overlay ── */
  if (isSubmitting) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full
                        bg-accent-muted animate-pulse">
          <FlaskConical size={24} strokeWidth={1.8} className="text-accent" />
        </div>
        <p className="text-sm font-medium text-text-primary">
          Evaluating your reasoning…
        </p>
        <p className="text-xs text-text-muted">
          This may take a few seconds.
        </p>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <article className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted
                   transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to Investigation
      </button>

      {/* Header */}
      <div className="mb-8 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center
                         rounded-base bg-accent-muted text-accent">
          <Scale size={20} strokeWidth={1.8} />
        </span>
        <div>
          <h1 className="text-xl font-medium text-text-primary">
            Submit Your Findings
          </h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            Present your verdict and the reasoning behind it.
          </p>
        </div>
      </div>

      {/* Error banner — retry-capable */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-base border border-red-500/20
                        bg-red-500/8 px-4 py-3 animate-evidence-enter">
          <span className="mt-0.5 text-red-400 shrink-0">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-red-400">{error}</p>
            <p className="mt-1 text-xs text-text-muted">
              Your rationale and evidence have been preserved — just hit submit again.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* ── Verdict selector ── */}
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-text-secondary">
            Your Verdict
          </legend>
          <div className="grid grid-cols-2 gap-2.5">
            {VERDICTS.map((v) => {
              const isSelected = verdict === v.value;
              return (
                <label
                  key={v.value}
                  className={`relative flex cursor-pointer items-start gap-2.5
                              rounded-base border px-3.5 py-3 transition-all duration-150
                              ring-1 ${
                                isSelected
                                  ? `${v.checked} border-transparent`
                                  : 'border-border-hairline bg-surface-card ring-transparent hover:border-white/10'
                              }`}
                >
                  <input
                    type="radio"
                    name="verdict"
                    value={v.value}
                    checked={isSelected}
                    onChange={(e) => setVerdict(e.target.value)}
                    className="sr-only"
                  />
                  {/* Custom radio dot */}
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center
                                rounded-full border-2 transition-colors ${
                                  isSelected ? 'border-current' : 'border-text-muted'
                                }`}
                  >
                    {isSelected && (
                      <span className={`h-2 w-2 rounded-full ${v.dot}`} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-text-primary">
                      {v.label}
                    </span>
                    <p className="mt-0.5 text-[11px] leading-snug text-text-muted">
                      {v.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* ── Rationale ── */}
        <div>
          <label
            htmlFor="rationale"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            Rationale
          </label>
          <textarea
            id="rationale"
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Explain the reasoning behind your verdict — what evidence supports your conclusion and why…"
            rows={5}
            className="w-full resize-y rounded-lg border border-border-hairline
                       bg-surface-page px-4 py-2.5 text-sm leading-relaxed text-text-primary
                       placeholder:text-text-muted outline-none transition-colors
                       focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
          />
          {/* Character count + minimum hint */}
          <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-text-muted">
              Minimum {MIN_RATIONALE_LENGTH} characters
            </span>
            <span
              className={rationaleOk ? 'text-emerald-400' : 'text-text-muted'}
            >
              {rationaleLength} / {MIN_RATIONALE_LENGTH}
            </span>
          </div>
        </div>

        {/* ── Evidence links (pre-filled from locker) ── */}
        <div>
          <label
            htmlFor="evidenceLinks"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            Evidence Links
          </label>
          <textarea
            id="evidenceLinks"
            value={evidenceLinks}
            onChange={(e) => setEvidenceLinks(e.target.value)}
            placeholder="Paste or review your evidence (one item per line)…"
            rows={5}
            className="w-full resize-y rounded-lg border border-border-hairline
                       bg-surface-page px-4 py-2.5 text-sm font-mono leading-relaxed
                       text-text-primary placeholder:text-text-muted outline-none
                       transition-colors
                       focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
          />
          {prefilled && (
            <p className="mt-1.5 text-xs text-text-muted">
              Pre-filled from your Evidence Locker. Edit freely before submitting.
            </p>
          )}
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex w-full items-center justify-center gap-2.5
                     rounded-base bg-accent px-6 py-3.5
                     text-sm font-medium text-white shadow-sm
                     transition-all duration-200
                     hover:bg-accent-hover hover:shadow-md active:scale-[0.98]
                     disabled:opacity-40 disabled:pointer-events-none"
        >
          <Scale size={16} strokeWidth={2} />
          Submit Findings
        </button>
      </form>
    </article>
  );
}

export default SubmissionPage;
