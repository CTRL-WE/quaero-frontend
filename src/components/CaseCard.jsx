import { useNavigate } from 'react-router-dom';
import PlatformPost from './PlatformPost';
import CategoryChip from './CategoryChip';
import { ComicPanel, StampBadge } from './comic';

/* ── Helpers ─────────────────────────────────────────────────────── */

/** Turn an ISO date string into a compact relative label. */
function relativeTime(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);

  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30)  return `${days}d ago`;
  return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Compact number formatter (1200 → 1.2K). */
function shortNum(n) {
  if (n == null) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

/* ── Platform icon lookup (tiny, for the header row) ─────────────── */

const PLATFORM_ICONS = {
  INSTAGRAM: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 1.5a3 3 0 100 6 3 3 0 000-6zm4.75-2.5a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  ),
  TWITTER: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M13.808 10.469L20.88 2h-1.676l-6.142 7.353L8.158 2H2.5l7.418 11.12L2.5 22h1.676l6.486-7.765L15.842 22H21.5l-7.693-11.531zm-2.296 2.748l-.752-1.107L4.78 3.3h2.575l4.826 7.11.751 1.107 6.273 9.242h-2.574l-5.12-7.541z" />
    </svg>
  ),
  FACEBOOK: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  ),
  YOUTUBE: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M23.498 6.186a2.994 2.994 0 00-2.107-2.117C19.502 3.5 12 3.5 12 3.5s-7.502 0-9.39.569A2.994 2.994 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 002.108 2.117c1.888.569 9.39.569 9.39.569s7.502 0 9.39-.569a2.994 2.994 0 002.108-2.117C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  REDDIT: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701z" />
    </svg>
  ),
  TIKTOK: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  NEWS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z" />
    </svg>
  ),
  WHATSAPP: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  OTHER: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
};

const PLATFORM_COLORS = {
  INSTAGRAM: '#E1306C', TWITTER: '#1D9BF0', FACEBOOK: '#1877F2',
  YOUTUBE: '#FF0000',   REDDIT: '#FF4500',  TIKTOK: '#00F2EA',
  NEWS: '#A78BFA',      WHATSAPP: '#25D366', OTHER: '#6B7280',
};

/* ── Engagement icons ────────────────────────────────────────────── */

function LikesIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function CommentsIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function SharesIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

/* ── Difficulty → StampBadge mapping ─────────────────────────────── */

const DIFFICULTY_TONE  = { EASY: 'green', MEDIUM: 'amber', HARD: 'red' };
const DIFFICULTY_LABEL = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' };

/* ── Main component ──────────────────────────────────────────────── */

function CaseCard({
  id,
  platform,
  originalPoster,
  publishedAt,
  mediaUrl,
  mediaType,
  caption,
  engagementLikes,
  engagementComments,
  engagementShares,
  verificationDifficulty,
  category,
  completed,
}) {
  const navigate = useNavigate();
  const platformColor = PLATFORM_COLORS[platform] || PLATFORM_COLORS.OTHER;
  const caseNumber = id.replace(/[^0-9]/g, '').padStart(3, '0');

  return (
    <button
      type="button"
      onClick={() => navigate(`/cases/${id}/brief`)}
      className="w-full text-left cursor-pointer group
                 focus-visible:outline-2 focus-visible:outline-offset-4
                 focus-visible:outline-comic-red"
    >
      <ComicPanel className="transition-[filter] duration-200 group-hover:brightness-[1.03]">
        {/* ── Case number tag + difficulty stamp ── */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="font-display text-sm tracking-wider text-comic-brown uppercase">
            Case No.{caseNumber}
          </span>
          <StampBadge tone={DIFFICULTY_TONE[verificationDifficulty] || 'amber'}>
            {DIFFICULTY_LABEL[verificationDifficulty] || 'Medium'}
          </StampBadge>
        </div>

        {/* ── Header row: platform icon + poster + relative time ── */}
        <div className="flex items-center gap-2 pb-2">
          <span
            className="h-4 w-4 shrink-0"
            style={{ color: platformColor }}
          >
            {PLATFORM_ICONS[platform] || PLATFORM_ICONS.OTHER}
          </span>

          <span className="truncate text-xs font-semibold text-comic-ink">
            {originalPoster}
          </span>

          <span className="ml-auto shrink-0 text-[11px] text-comic-ink/40">
            {relativeTime(publishedAt)}
          </span>
        </div>

        {/* ── Media ── */}
        <div className="rounded overflow-hidden border-2 border-comic-ink/15">
          <PlatformPost
            platform={platform}
            mediaUrl={mediaUrl}
            mediaType={mediaType}
            caption={caption}
            size="card"
          />
        </div>

        {/* ── Caption (2 lines max) ── */}
        {caption && (
          <p className="pt-2.5 text-sm text-comic-ink/75 line-clamp-2 leading-snug">
            {caption}
          </p>
        )}

        {/* ── Engagement row ── */}
        <div className="flex items-center gap-4 pt-2.5 text-comic-ink/40">
          <span className="inline-flex items-center gap-1 text-xs">
            <LikesIcon />
            {shortNum(engagementLikes)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <CommentsIcon />
            {shortNum(engagementComments)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <SharesIcon />
            {shortNum(engagementShares)}
          </span>
        </div>

        {/* ── Bottom row: category + solved/open status ── */}
        <div className="flex items-center gap-2 pt-2.5">
          <CategoryChip category={category} />

          {completed ? (
            <span
              className="ml-auto inline-flex items-center gap-1
                         text-[11px] font-bold uppercase tracking-wider text-comic-green"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              Solved
            </span>
          ) : (
            <span
              className="ml-auto inline-flex items-center gap-1
                         text-[11px] font-bold uppercase tracking-wider text-comic-red"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  strokeLinecap="round"
                  d="M9 9l6 6"
                />
              </svg>
              Open
            </span>
          )}
        </div>
      </ComicPanel>
    </button>
  );
}

export default CaseCard;

