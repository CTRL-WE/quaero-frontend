import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, FlaskConical } from 'lucide-react';
import { submit } from '../services/submissionService';
import { getProfile } from '../services/profileService';
import { getRankTier } from '../utils/rankTiers';
import { ComicButton, DetectiveMascot } from '../components/comic';

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
    bg: 'bg-comic-green',
    selectedBg: 'bg-comic-green/15',
    borderColor: 'border-comic-green',
    dotColor: 'bg-comic-green',
  },
  {
    value: 'FALSE',
    label: 'False',
    description: 'The claim is inaccurate or fabricated',
    bg: 'bg-comic-red',
    selectedBg: 'bg-comic-red/15',
    borderColor: 'border-comic-red',
    dotColor: 'bg-comic-red',
  },
  {
    value: 'MISLEADING',
    label: 'Misleading',
    description: 'Partially true but presented deceptively',
    bg: 'bg-comic-yellow',
    selectedBg: 'bg-comic-yellow/15',
    borderColor: 'border-comic-yellow',
    dotColor: 'bg-comic-yellow',
  },
  {
    value: 'UNVERIFIED',
    label: 'Unverified',
    description: 'Insufficient evidence to determine',
    bg: 'bg-comic-ink/30',
    selectedBg: 'bg-comic-ink/8',
    borderColor: 'border-comic-ink/40',
    dotColor: 'bg-comic-ink/40',
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

      // ── Rank-tier diff for the feedback page ──
      // No AuthContext caches totalXp today, so we read the last-known
      // value from profileService.  If that call fails we fall back to 0
      // so the feedback route always receives valid tier objects.
      let currentTotalXp = 0;
      try {
        const profile = await getProfile();
        currentTotalXp = profile.totalXp ?? 0;
      } catch {
        // Silently fall back — rank comparison is cosmetic, not critical.
      }

      const previousRank = getRankTier(currentTotalXp);
      const newRank = getRankTier(currentTotalXp + result.xpEarned);

      navigate('/feedback', {
        state: {
          ...result,
          caseId,
          xpEarned: result.xpEarned,
          updatedCredibility: result.updatedCredibility,
          previousRank,
          newRank,
        },
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
      <div className="bg-halftone flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <DetectiveMascot size={64} />
        <p className="text-sm font-bold text-comic-ink">
          Evaluating your reasoning…
        </p>
        <p className="text-xs text-comic-ink/50 font-semibold">
          This may take a few seconds.
        </p>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <article className="bg-halftone min-h-full">
      <div className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Back link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold
                     text-comic-ink/50 transition-colors hover:text-comic-ink"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Investigation
        </button>

        {/* Header */}
        <div className="mb-8 flex items-start gap-3">
          <DetectiveMascot size={44} />
          <div>
            <h1 className="font-display text-xl text-comic-ink">
              Submit Your Findings
            </h1>
            <p className="mt-0.5 text-sm text-comic-ink/60 font-semibold">
              Present your verdict and the reasoning behind it.
            </p>
          </div>
        </div>

        {/* Error banner — retry-capable */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border-[3px] border-comic-red
                          bg-comic-red/10 px-4 py-3 animate-evidence-enter">
            <span className="mt-0.5 text-comic-red shrink-0">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-comic-red">{error}</p>
              <p className="mt-1 text-xs text-comic-ink/50">
                Your rationale and evidence have been preserved — just hit submit again.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* ── Verdict selector ── */}
          <fieldset>
            <legend className="mb-3 text-sm font-bold text-comic-ink/70 uppercase tracking-wider">
              Your Verdict
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {VERDICTS.map((v) => {
                const isSelected = verdict === v.value;
                return (
                  <label
                    key={v.value}
                    className={`relative flex cursor-pointer items-start gap-2.5
                                rounded-lg border-[3px] px-3.5 py-3 transition-all duration-150
                                ${
                                  isSelected
                                    ? `${v.borderColor} ${v.selectedBg} shadow-comic-sm`
                                    : 'border-comic-ink/20 bg-comic-paper hover:border-comic-ink/40'
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
                                    isSelected ? v.borderColor : 'border-comic-ink/30'
                                  }`}
                    >
                      {isSelected && (
                        <span className={`h-2 w-2 rounded-full ${v.dotColor}`} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-comic-ink">
                        {v.label}
                      </span>
                      <p className="mt-0.5 text-[11px] leading-snug text-comic-ink/50">
                        {v.description}
                      </p>
                    </div>
                    {/* STAMPED indicator on selection */}
                    {isSelected && (
                      <span className="absolute top-1.5 right-2 text-[9px] font-bold uppercase
                                       tracking-widest text-comic-ink/30 rotate-[-12deg]">
                        ✓ Stamped
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* ── Rationale ── */}
          <div>
            <label
              htmlFor="rationale"
              className="mb-1.5 block text-sm font-bold text-comic-ink/70"
            >
              Rationale
            </label>
            <textarea
              id="rationale"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Explain the reasoning behind your verdict — what evidence supports your conclusion and why…"
              rows={5}
              className="w-full resize-y rounded-lg border-2 border-comic-ink/25
                         bg-white px-4 py-2.5 text-sm leading-relaxed text-comic-ink
                         placeholder:text-comic-ink/35 outline-none transition-colors
                         focus:border-comic-blue focus:ring-1 focus:ring-comic-blue/25"
            />
            {/* Character count + minimum hint */}
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="text-comic-ink/40 font-semibold">
                Minimum {MIN_RATIONALE_LENGTH} characters
              </span>
              <span
                className={rationaleOk ? 'text-comic-green font-bold' : 'text-comic-ink/40 font-semibold'}
              >
                {rationaleLength} / {MIN_RATIONALE_LENGTH}
              </span>
            </div>
          </div>

          {/* ── Evidence links (pre-filled from locker) ── */}
          <div>
            <label
              htmlFor="evidenceLinks"
              className="mb-1.5 block text-sm font-bold text-comic-ink/70"
            >
              Evidence Links
            </label>
            <textarea
              id="evidenceLinks"
              value={evidenceLinks}
              onChange={(e) => setEvidenceLinks(e.target.value)}
              placeholder="Paste or review your evidence (one item per line)…"
              rows={5}
              className="w-full resize-y rounded-lg border-2 border-comic-ink/25
                         bg-white px-4 py-2.5 text-sm font-mono leading-relaxed
                         text-comic-ink placeholder:text-comic-ink/35 outline-none
                         transition-colors
                         focus:border-comic-blue focus:ring-1 focus:ring-comic-blue/25"
            />
            {prefilled && (
              <p className="mt-1.5 text-xs text-comic-ink/40 font-semibold">
                Pre-filled from your Evidence Locker. Edit freely before submitting.
              </p>
            )}
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center gap-2.5
                       rounded-lg border-[3px] border-comic-ink
                       bg-comic-red px-6 py-3.5
                       text-sm font-bold text-white shadow-comic
                       comic-press
                       disabled:opacity-40 disabled:pointer-events-none"
          >
            <Scale size={16} strokeWidth={2} />
            Submit Findings
          </button>
        </form>
      </div>
    </article>
  );
}

export default SubmissionPage;
