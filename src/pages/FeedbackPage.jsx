import { useParams, useLocation, Link } from 'react-router-dom';
import { VERDICT_OPTIONS } from '../utils/validators';

// ---------------------------------------------------------------------------
// FeedbackPage — Screen 7 (Frontend Handbook)
//
// Displays the SubmissionFeedbackResponse received via route state from the
// SubmissionPage.  There is NO GET endpoint to re-fetch this data — if the
// user arrives without route state (refresh / bookmark) we show a graceful
// fallback directing them to the Case Brief.
//
// Design principle (DS §2): explanation and learning summary are visually
// prominent — not small captions under a large score number.
//
// Ref: DS v1.0 FR-10, Implementation Blueprint SubmissionFeedbackResponse
// ---------------------------------------------------------------------------

// ---- Timeline steps (DS v2.0 §6 — client-side composition) ----------------
const TIMELINE_STEPS = [
  { key: 'post',       label: 'Original post' },
  { key: 'observe',    label: 'Observation' },
  { key: 'evidence',   label: 'Evidence' },
  { key: 'mentor',     label: 'AI Mentor' },
  { key: 'submission', label: 'Submission' },
  { key: 'truth',      label: 'Ground truth' },
  { key: 'score',      label: 'Score' },
];

// ---- Score ring colour by tier ---------------------------------------------
function scoreColour(score) {
  if (score >= 85) return { ring: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
  if (score >= 65) return { ring: 'text-indigo-400',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20' };
  return { ring: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
}

// ---- Verdict label lookup --------------------------------------------------
function verdictLabel(value) {
  return VERDICT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Investigation timeline strip */
function TimelineStrip() {
  return (
    <div className="flex items-center gap-0 overflow-x-auto py-1">
      {TIMELINE_STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center shrink-0">
          {/* Step dot + label */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-500/25">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </div>
            <span className="text-[9px] font-medium text-gray-500 whitespace-nowrap">
              {step.label}
            </span>
          </div>
          {/* Connector line (not after last) */}
          {i < TIMELINE_STEPS.length - 1 && (
            <div className="mx-1 h-px w-6 bg-gray-700/60 sm:w-8" />
          )}
        </div>
      ))}
    </div>
  );
}

/** Stat card (score, XP, credibility) */
function StatCard({ label, value, sublabel, colourClasses }) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg border px-4 py-3 ${
        colourClasses?.bg ?? 'bg-gray-900/40'
      } ${colourClasses?.border ?? 'border-gray-800/60'}`}
    >
      <span
        className={`text-2xl font-bold tabular-nums ${
          colourClasses?.ring ?? 'text-gray-200'
        }`}
      >
        {value}
      </span>
      <span className="mt-0.5 text-[11px] font-medium text-gray-400">
        {label}
      </span>
      {sublabel && (
        <span className="mt-0.5 text-[10px] text-gray-600">{sublabel}</span>
      )}
    </div>
  );
}

/** Section wrapper — consistent heading style */
function Section({ icon, title, children, prominent = false }) {
  return (
    <section
      className={`rounded-lg border px-5 py-4 ${
        prominent
          ? 'border-indigo-500/15 bg-indigo-500/[0.03]'
          : 'border-gray-800/60 bg-gray-900/30'
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h2
          className={`text-sm font-semibold ${
            prominent ? 'text-gray-100' : 'text-gray-300'
          }`}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// FeedbackPage (main export)
// ---------------------------------------------------------------------------

function FeedbackPage() {
  const { id: caseId } = useParams();
  const location = useLocation();

  /** @type {import('../services/submissionService').SubmissionFeedbackResponse | undefined} */
  const feedback = location.state?.feedback;

  // ---- No route state fallback (refresh / bookmark) -----------------------
  if (!feedback) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800/60 border border-gray-700/40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-gray-500">
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-200">
            Feedback unavailable
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
            Feedback data is only available immediately after submitting your
            investigation. Please return to the case to review your work.
          </p>
        </div>
        <Link
          to={`/cases/${caseId}/brief`}
          className="mt-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20"
        >
          Go to case brief
        </Link>
      </div>
    );
  }

  // ---- Destructure feedback ------------------------------------------------
  const {
    verdict,
    reasoningScore,
    xpEarned,
    updatedCredibility,
    groundTruth,
    explanation,
    trustedReferences,
    learningSummary,
    degradedGrading,
  } = feedback;

  const colours = scoreColour(reasoningScore ?? 0);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">

        {/* ---- Header ------------------------------------------------------ */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-emerald-400">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-100 sm:text-2xl">
              Investigation complete
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Your reasoning for Case {caseId} has been evaluated.
            </p>
          </div>
        </div>

        {/* ---- Verdict badge ----------------------------------------------- */}
        {verdict && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-800/60 bg-gray-900/40 px-4 py-2">
            <span className="text-xs text-gray-500">Your verdict:</span>
            <span className="text-xs font-semibold text-gray-200">
              {verdictLabel(verdict)}
            </span>
          </div>
        )}

        {/* ---- Degraded grading notice ------------------------------------- */}
        {degradedGrading && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-amber-500/15 bg-amber-500/5 px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-amber-400">
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-xs font-semibold text-amber-300">
                Simplified evaluation
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-amber-400/70">
                {degradedGrading.reason ||
                  'This evaluation used a simplified rubric. Your score may not reflect the full depth of your reasoning.'}
              </p>
            </div>
          </div>
        )}

        {/* ---- Investigation Timeline (DS v2.0 §6) ------------------------- */}
        <div className="mt-6 rounded-lg border border-gray-800/60 bg-gray-900/30 px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
            Investigation timeline
          </p>
          <TimelineStrip />
        </div>

        {/* ---- Content sections --------------------------------------------- */}
        <div className="mt-6 space-y-4">

          {/* Explanation — visually prominent (reasoning-over-correctness) */}
          <Section
            prominent
            title="Evaluation feedback"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-indigo-400">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            <p className="text-sm leading-relaxed text-gray-300">
              {explanation}
            </p>
          </Section>

          {/* Ground truth */}
          <Section
            prominent
            title="Ground truth"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-indigo-400">
                <path d="M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM5.05 3.05a.75.75 0 0 1 1.06 0l1.062 1.06A.75.75 0 1 1 6.11 5.173L5.05 4.11a.75.75 0 0 1 0-1.06ZM14.95 3.05a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.06 0ZM3 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 8ZM14 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 14 8ZM7.172 13.889a.75.75 0 0 1-1.061-1.06l1.06-1.062a.75.75 0 0 1 1.062 1.061l-1.06 1.06ZM12.828 13.889l1.061-1.06a.75.75 0 0 0-1.06-1.062l-1.062 1.061a.75.75 0 0 0 1.06 1.06ZM10 14a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 14Z" />
                <path d="M10 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
              </svg>
            }
          >
            <p className="text-sm leading-relaxed text-gray-300">
              {groundTruth}
            </p>
          </Section>

          {/* Learning summary — visually prominent */}
          <Section
            prominent
            title="What to take away"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-indigo-400">
                <path d="M10.75 2.567a1.5 1.5 0 0 0-1.5 0L2.6 6.326a.75.75 0 0 0 0 1.348l6.65 3.76a1.5 1.5 0 0 0 1.5 0l6.65-3.76a.75.75 0 0 0 0-1.348l-6.65-3.76ZM2.5 11.5a.75.75 0 0 1 .75.75v3c0 .414.336.75.75.75h12a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 1 1.5 0v3A2.25 2.25 0 0 1 16 17.5H4a2.25 2.25 0 0 1-2.25-2.25v-3a.75.75 0 0 1 .75-.75Z" />
              </svg>
            }
          >
            <p className="text-sm leading-relaxed text-gray-300">
              {learningSummary}
            </p>
          </Section>

          {/* ---- Stats row: Score, XP, Credibility -------------------------- */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label="Reasoning score"
              value={reasoningScore ?? '—'}
              colourClasses={colours}
            />
            <StatCard
              label="XP earned"
              value={xpEarned != null ? `+${xpEarned}` : '—'}
            />
            <StatCard
              label="Credibility"
              value={updatedCredibility ?? '—'}
              sublabel="Current tier"
            />
          </div>

          {/* Trusted references */}
          {trustedReferences && trustedReferences.length > 0 && (
            <Section
              title="Trusted references"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-500">
                  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
                  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
                </svg>
              }
            >
              <ul className="space-y-2">
                {trustedReferences.map((ref, i) => (
                  <li key={i}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600 transition-colors group-hover:text-indigo-400">
                        <path
                          fillRule="evenodd"
                          d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-gray-300 transition-colors group-hover:text-indigo-300">
                          {ref.title}
                        </span>
                        <p className="mt-0.5 text-[10px] text-gray-600 truncate">
                          {ref.url}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* ---- CTAs --------------------------------------------------------- */}
        <div className="mt-8 flex flex-col gap-3 border-t border-gray-800/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-700/80 px-5 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M12 2.25a.75.75 0 0 1 .75.75v8.514L9.766 8.03a.75.75 0 0 0-1.061.015L6.5 10.307 4.784 8.467a.75.75 0 0 0-1.081.013L2.25 10.12V3A.75.75 0 0 1 3 2.25h9Z"
                clipRule="evenodd"
              />
              <path d="M2.25 12.193V13A.75.75 0 0 0 3 13.75h9a.75.75 0 0 0 .75-.75v-.37l-3.201-3.867-2.254 2.373a.75.75 0 0 1-1.073.018L4.23 9.044l-1.98 3.149Z" />
            </svg>
            Back to feed
          </Link>

          <Link
            to={`/cases/${caseId}/board`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20"
          >
            View investigation board
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeedbackPage;
