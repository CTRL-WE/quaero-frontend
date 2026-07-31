import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  TrendingUp,
  BookOpen,
  Link2,
  ArrowRight,
  Home,
} from 'lucide-react';

/**
 * FeedbackPage — post-submission reveal screen.
 *
 * Reads from location.state (passed by SubmissionPage on success):
 *   reasoningScore, xpEarned, updatedCredibility,
 *   groundTruth, explanation, trustedReferences[], learningSummary
 */

/* ── Score ring helper ────────────────────────────────────────────── */

function ScoreRing({ score, size = 100, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  // Color shifts based on score
  let color = '#ef4444'; // red
  if (score >= 70) color = '#34d399'; // emerald
  else if (score >= 40) color = '#fbbf24'; // amber

  return (
    <svg
      width={size}
      height={size}
      className="shrink-0 -rotate-90"
      aria-label={`Reasoning score: ${score}`}
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
      {/* Filled arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - filled}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

/* ── Component ────────────────────────────────────────────────────── */

function FeedbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  /* ── Guard: missing state ── */
  if (!data || typeof data.reasoningScore === 'undefined') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <Brain size={36} strokeWidth={1.4} className="text-text-muted opacity-50" />
        <h1 className="text-lg font-medium text-text-primary">
          Nothing to show here
        </h1>
        <p className="max-w-xs text-center text-sm text-text-secondary">
          It looks like you navigated here directly. Complete an investigation
          and submit your findings to see your feedback.
        </p>
        <Link
          to="/"
          className="mt-2 rounded-base bg-accent px-5 py-2.5 text-sm font-medium text-white
                     transition-colors hover:bg-accent-hover"
        >
          Back to Feed
        </Link>
      </div>
    );
  }

  const {
    reasoningScore,
    xpEarned,
    updatedCredibility,
    groundTruth,
    explanation,
    trustedReferences = [],
    learningSummary,
  } = data;

  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10 space-y-8">

      {/* ═══════════════════════════════════════════════════════════════
          Score + XP — top hero strip
          ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden rounded-base border border-border-hairline
                   bg-surface-card p-6 sm:p-8"
      >
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 30%, rgba(59,130,246,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          {/* Score ring */}
          <div className="relative">
            <ScoreRing score={reasoningScore} size={110} stroke={9} />
            {/* Centered number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-text-primary leading-none">
                {reasoningScore}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-text-muted mt-0.5">
                Score
              </span>
            </div>
          </div>

          {/* XP + Credibility */}
          <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
            {/* XP earned */}
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              <span className="text-lg font-semibold text-text-primary">
                +{xpEarned} XP
              </span>
              <span className="text-sm text-text-muted">earned</span>
            </div>

            {/* Credibility change */}
            <div className="flex items-center gap-2 rounded-full bg-surface-overlay px-3 py-1.5">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-sm text-text-secondary">
                Credibility:&nbsp;
                <span className="font-medium text-text-primary">
                  {updatedCredibility}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Ground Truth reveal — the core "reasoning over correctness" moment
          ═══════════════════════════════════════════════════════════ */}
      <section
        className="rounded-base border border-accent/20 bg-accent/5 p-6 sm:p-8
                   space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full
                           bg-accent/15 text-accent">
            <Brain size={17} strokeWidth={2} />
          </span>
          <h2 className="text-base font-semibold text-text-primary tracking-wide">
            Ground Truth
          </h2>
        </div>

        <p className="text-base leading-relaxed text-text-primary sm:text-lg sm:leading-relaxed">
          {groundTruth}
        </p>

        <div className="border-t border-accent/10 pt-4">
          <h3 className="mb-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
            How your reasoning measured up
          </h3>
          <p className="text-sm leading-relaxed text-text-secondary">
            {explanation}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Learning Summary
          ═══════════════════════════════════════════════════════════ */}
      {learningSummary && (
        <section
          className="rounded-base border border-border-hairline bg-surface-card
                     p-5 sm:p-6 flex gap-3"
        >
          <BookOpen size={18} strokeWidth={1.8} className="mt-0.5 shrink-0 text-violet-400" />
          <div>
            <h3 className="mb-1 text-sm font-medium text-text-primary">
              Key Takeaway
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              {learningSummary}
            </p>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Trusted References
          ═══════════════════════════════════════════════════════════ */}
      {trustedReferences.length > 0 && (
        <section
          className="rounded-base border border-border-hairline bg-surface-card
                     p-5 sm:p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <Link2 size={15} strokeWidth={2} className="text-text-muted" />
            <h3 className="text-sm font-medium text-text-primary">
              Trusted References
            </h3>
          </div>

          <ul className="space-y-1.5">
            {trustedReferences.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent
                             transition-colors hover:text-accent-hover hover:underline
                             break-all"
                >
                  <ArrowRight size={12} strokeWidth={2} className="shrink-0" />
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Action buttons
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => navigate(`/cases/${data?.caseId ?? 'unknown'}/board`)}
          className="flex-1 inline-flex items-center justify-center gap-2
                     rounded-base bg-accent px-5 py-3
                     text-sm font-medium text-white
                     transition-all duration-200
                     hover:bg-accent-hover hover:shadow-md active:scale-[0.98]"
        >
          View Investigation Board
        </button>

        <Link
          to="/"
          className="flex-1 inline-flex items-center justify-center gap-2
                     rounded-base border border-border-hairline bg-surface-card px-5 py-3
                     text-sm font-medium text-text-secondary
                     transition-all duration-200
                     hover:text-text-primary hover:border-white/12"
        >
          <Home size={15} strokeWidth={2} />
          Back to Feed
        </Link>
      </div>
    </article>
  );
}

export default FeedbackPage;
