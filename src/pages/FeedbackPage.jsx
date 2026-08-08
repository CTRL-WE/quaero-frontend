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
import RankUpBanner from '../components/RankUpBanner';
import { ComicPanel, ComicButton, StampBadge, DetectiveMascot } from '../components/comic';

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

  // Color shifts based on score — using comic palette
  let color = 'var(--color-comic-red, #e03e2d)';
  if (score >= 70) color = 'var(--color-comic-green, #3f9142)';
  else if (score >= 40) color = 'var(--color-comic-yellow, #ffce3a)';

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
        stroke="rgba(22,20,18,0.12)"
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
      <div className="bg-halftone flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <DetectiveMascot size={56} />
        <h1 className="font-display text-lg text-comic-ink">
          Nothing to show here
        </h1>
        <p className="max-w-xs text-center text-sm text-comic-ink/60 font-semibold">
          It looks like you navigated here directly. Complete an investigation
          and submit your findings to see your feedback.
        </p>
        <Link
          to="/"
          className="mt-2 rounded-lg border-[3px] border-comic-ink bg-comic-red
                     px-5 py-2.5 text-sm font-bold text-white shadow-comic-sm comic-press"
        >
          Back to Case Board
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
    previousRank,
    newRank,
  } = data;

  // DEBUG — remove after verifying rank-up logic in browser console
  console.log('[DEBUG RankUp]', {
    previousRank,
    newRank,
    willShowBanner:
      !!(previousRank && newRank && previousRank.name !== newRank.name),
  });

  // Show the rank-up banner only when the user actually crossed a tier boundary
  const didRankUp =
    previousRank && newRank && previousRank.name !== newRank.name;

  return (
    <article className="bg-halftone min-h-full">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10 space-y-8">

        {/* ═══════════════════════════════════════════════════════════════
            Score + XP — hero ComicPanel with CASE CLOSED stamp
            ═══════════════════════════════════════════════════════════ */}
        <ComicPanel className="relative overflow-visible p-6 sm:p-8">
          {/* ── CASE CLOSED stamp — overlapping top-right corner ── */}
          <div
            className="absolute -top-6 -right-4 z-10 flex h-28 w-28 items-center
                       justify-center sm:h-32 sm:w-32"
            style={{ transform: 'rotate(12deg)' }}
            aria-hidden="true"
          >
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: '4px solid var(--color-comic-red, #e03e2d)',
                opacity: 0.7,
              }}
            />
            {/* Inner ring */}
            <div
              className="absolute inset-1.5 rounded-full"
              style={{
                border: '3px solid var(--color-comic-red, #e03e2d)',
              }}
            />
            {/* Text */}
            <div className="relative flex flex-col items-center justify-center">
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em] sm:text-xs"
                style={{ color: 'var(--color-comic-red, #e03e2d)' }}
              >
                Case
              </span>
              <span
                className="font-display text-xl leading-none sm:text-2xl"
                style={{ color: 'var(--color-comic-red, #e03e2d)' }}
              >
                CLOSED
              </span>
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            {/* Score ring */}
            <div className="relative">
              <ScoreRing score={reasoningScore} size={110} stroke={9} />
              {/* Centered number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-comic-ink leading-none">
                  {reasoningScore}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-comic-ink/50 mt-0.5 font-bold">
                  Score
                </span>
              </div>
            </div>

            {/* XP + Credibility */}
            <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
              {/* XP earned */}
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-comic-yellow" />
                <span className="text-lg font-bold text-comic-ink">
                  +{xpEarned} XP
                </span>
                <span className="text-sm text-comic-ink/50 font-semibold">earned</span>
              </div>

              {/* Credibility change */}
              <div className="flex items-center gap-2 rounded-lg border-2 border-comic-ink/15
                              bg-comic-paper/80 px-3 py-1.5">
                <TrendingUp size={14} className="text-comic-green" />
                <span className="text-sm text-comic-ink/70 font-semibold">
                  Credibility:&nbsp;
                  <span className="font-bold text-comic-ink">
                    {updatedCredibility}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </ComicPanel>

        {/* ═══════════════════════════════════════════════════════════════
            Rank-up celebration (shown only when tier boundary crossed)
            ═══════════════════════════════════════════════════════════ */}
        {didRankUp && (
          <RankUpBanner previousTier={previousRank} newTier={newRank} />
        )}

        {/* ═══════════════════════════════════════════════════════════════
            Ground Truth reveal — the core "reasoning over correctness" moment
            ═══════════════════════════════════════════════════════════ */}
        <ComicPanel>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full
                               bg-comic-purple/15 text-comic-purple">
                <Brain size={17} strokeWidth={2} />
              </span>
              <h2 className="font-display text-base text-comic-ink tracking-wide">
                Ground Truth
              </h2>
            </div>

            <p className="text-base leading-relaxed text-comic-ink sm:text-lg sm:leading-relaxed font-medium">
              {groundTruth}
            </p>

            <div className="border-t-2 border-comic-ink/10 pt-4">
              <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-comic-ink/50">
                How your reasoning measured up
              </h3>
              <p className="text-sm leading-relaxed text-comic-ink/70">
                {explanation}
              </p>
            </div>
          </div>
        </ComicPanel>

        {/* ═══════════════════════════════════════════════════════════════
            Learning Summary
            ═══════════════════════════════════════════════════════════ */}
        {learningSummary && (
          <ComicPanel>
            <div className="p-5 sm:p-6 flex gap-3">
              <BookOpen size={18} strokeWidth={1.8} className="mt-0.5 shrink-0 text-comic-purple" />
              <div>
                <h3 className="mb-1 text-sm font-bold text-comic-ink">
                  Key Takeaway
                </h3>
                <p className="text-sm leading-relaxed text-comic-ink/65">
                  {learningSummary}
                </p>
              </div>
            </div>
          </ComicPanel>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            Trusted References
            ═══════════════════════════════════════════════════════════ */}
        {trustedReferences.length > 0 && (
          <ComicPanel>
            <div className="p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Link2 size={15} strokeWidth={2} className="text-comic-ink/40" />
                <h3 className="text-sm font-bold text-comic-ink">
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
                      className="inline-flex items-center gap-1.5 text-sm text-comic-blue
                                 font-semibold transition-colors hover:text-comic-red
                                 hover:underline break-all"
                    >
                      <ArrowRight size={12} strokeWidth={2} className="shrink-0" />
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ComicPanel>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            Action buttons
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <ComicButton
            variant="primary"
            onClick={() => navigate(`/cases/${data?.caseId ?? 'unknown'}/board`)}
            className="flex-1 justify-center py-3"
          >
            View Investigation Board
          </ComicButton>

          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2
                       rounded-lg border-[3px] border-comic-ink/20 bg-comic-paper px-5 py-3
                       text-sm font-bold text-comic-ink/60
                       transition-all duration-200
                       hover:text-comic-ink hover:border-comic-ink/40 comic-press"
          >
            <Home size={15} strokeWidth={2} />
            Back to Case Board
          </Link>
        </div>
      </div>
    </article>
  );
}

export default FeedbackPage;

