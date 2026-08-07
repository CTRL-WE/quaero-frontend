import ComicPanel from './ComicPanel';
import ComicButton from './ComicButton';
import StampBadge from './StampBadge';
import DetectiveMascot from './DetectiveMascot';
import CategoryChip from '../CategoryChip';

/* ── Helpers ─────────────────────────────────────────────────────── */

const DIFFICULTY_TONE  = { EASY: 'green', MEDIUM: 'amber', HARD: 'red' };
const DIFFICULTY_LABEL = { EASY: 'Easy',  MEDIUM: 'Medium', HARD: 'Hard' };

/** Compact number formatter (1200 → 1.2K). */
function shortNum(n) {
  if (n == null) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

/** Trim `publicEvidence` to roughly `max` characters on a word boundary. */
function truncate(text, max = 200) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max);
  const last = cut.lastIndexOf(' ');
  return `${cut.slice(0, last > 0 ? last : max)}…`;
}

/* ── Component ──────────────────────────────────────────────────── */

/**
 * CaseBriefing — full-screen comic splash shown before the existing
 * BriefPage content mounts.
 *
 * Props:
 *   brief      – the case brief object returned by getBrief()
 *   onContinue – callback to flip the hasSeenBriefing gate
 */
function CaseBriefing({ brief, onContinue }) {
  const caseNumber = (brief.id || '').replace(/[^0-9]/g, '').padStart(3, '0');
  const difficulty  = brief.verificationDifficulty || 'MEDIUM';

  return (
    <section
      className="bg-halftone min-h-full flex items-center justify-center px-4 py-10"
      style={{ animation: 'evidence-enter 0.45s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      <div className="w-full max-w-lg flex flex-col items-center text-center gap-6">

        {/* ── Kicker ── */}
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-comic-ink/40">
          Detective Bureau Presents
        </p>

        {/* ── Issue title ── */}
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-comic-red tracking-wide leading-tight">
            Case File — Issue No.{caseNumber}
          </h1>
          <p
            className="mt-3 text-lg sm:text-xl italic leading-snug text-comic-ink font-semibold"
          >
            {brief.claim}
          </p>
        </div>

        {/* ── Chips row: difficulty · category · engagement ── */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <StampBadge tone={DIFFICULTY_TONE[difficulty] || 'amber'}>
            {DIFFICULTY_LABEL[difficulty] || 'Medium'}
          </StampBadge>

          <CategoryChip category={brief.category} />

          {/* Inline engagement stats */}
          <div className="flex items-center gap-3 text-xs text-comic-ink/50">
            <span className="inline-flex items-center gap-1">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              {shortNum(brief.engagementLikes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              {shortNum(brief.engagementComments)}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              {shortNum(brief.engagementShares)}
            </span>
          </div>
        </div>

        {/* ── Mascot ── */}
        <DetectiveMascot size={120} />

        {/* ── Evidence blurb ── */}
        <ComicPanel className="text-left shadow-comic-sm w-full">
          <p className="text-sm leading-relaxed text-comic-ink/80">
            {truncate(brief.publicEvidence, 200)}
          </p>
        </ComicPanel>

        {/* ── CTA ── */}
        <ComicButton variant="primary" onClick={onContinue}>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          Begin Investigation
        </ComicButton>
      </div>
    </section>
  );
}

export default CaseBriefing;
