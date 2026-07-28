import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBrief } from '../services/caseService';
import PlatformPost from '../components/PlatformPost';

/* ── Helpers ─────────────────────────────────────────────────────── */

const PLATFORM_LABELS = {
  INSTAGRAM: 'Instagram', TWITTER: 'X (Twitter)', FACEBOOK: 'Facebook',
  YOUTUBE: 'YouTube',     REDDIT: 'Reddit',        TIKTOK: 'TikTok',
  NEWS: 'News',           WHATSAPP: 'WhatsApp',    OTHER: 'Source',
};

const PLATFORM_COLORS = {
  INSTAGRAM: '#E1306C', TWITTER: '#1D9BF0', FACEBOOK: '#1877F2',
  YOUTUBE: '#FF0000',   REDDIT: '#FF4500',  TIKTOK: '#00F2EA',
  NEWS: '#A78BFA',      WHATSAPP: '#25D366', OTHER: '#6B7280',
};

const PLATFORM_ICONS = {
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
  INSTAGRAM: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 1.5a3 3 0 100 6 3 3 0 000-6zm4.75-2.5a1 1 0 110 2 1 1 0 010-2z" />
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

/** Format a number compactly: 24300 → "24.3K". */
function shortNum(n) {
  if (n == null) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

/** Format an ISO date string into a readable form: "Mar 14, 2026 · 9:22 AM". */
function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

/* ── Mocked comment previews ─────────────────────────────────────── */

const MOCK_COMMENTS = [
  { handle: '@curious_observer', text: 'Has anyone else seen this? Seems wild if true.' },
  { handle: '@local_newshound',  text: 'I live nearby — heard rumors about this for months.' },
  { handle: '@skeptic99',        text: 'Going to need a lot more context before I believe this.' },
];

/* ── Main component ──────────────────────────────────────────────── */

function BriefPage() {
  const { id: caseId } = useParams();
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getBrief(caseId);
        if (!cancelled) setBrief(data);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [caseId]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <svg
          className="h-8 w-8 animate-spin text-accent"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="ml-3 text-sm text-text-muted">Loading post…</span>
      </div>
    );
  }

  /* ---------- Not found ---------- */
  if (notFound || !brief) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <h1 className="text-4xl font-medium text-text-muted">404</h1>
        <p className="text-sm text-text-muted">Post not found.</p>
        <Link
          to="/"
          className="mt-2 rounded-base bg-accent px-5 py-2 text-sm font-medium text-white
                     transition-colors hover:bg-accent-hover"
        >
          ← Back to Feed
        </Link>
      </div>
    );
  }

  /* ---------- Derived values ---------- */
  const platformLabel = PLATFORM_LABELS[brief.platform] || 'Source';
  const platformColor = PLATFORM_COLORS[brief.platform] || PLATFORM_COLORS.OTHER;
  const platformIcon  = PLATFORM_ICONS[brief.platform]  || PLATFORM_ICONS.OTHER;

  /* ---------- Observe screen ---------- */
  return (
    <article className="mx-auto w-full max-w-xl px-4 py-6 sm:py-10 sm:px-6">
      {/* Back link */}
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 py-2 text-sm text-text-muted
                   transition-colors hover:text-text-primary"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Feed
      </Link>

      {/* ── Post card container ── */}
      <div className="rounded-base border border-border-hairline bg-surface-card overflow-hidden">

        {/* ── Poster header ── */}
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
          {/* Platform icon avatar */}
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${platformColor}18`, color: platformColor }}
          >
            <span className="h-4.5 w-4.5">{platformIcon}</span>
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium text-text-primary">
                {brief.originalPoster}
              </span>
              {/* Verified badge (always shown on Observe) */}
              <svg className="h-4 w-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xs text-text-muted">{platformLabel}</span>
          </div>
        </div>

        {/* ── Media (full size) ── */}
        <PlatformPost
          platform={brief.platform}
          mediaUrl={brief.mediaUrl}
          mediaType={brief.mediaType}
          caption={brief.caption}
          size="full"
        />

        {/* ── Caption ── */}
        {brief.caption && (
          <p className="px-4 pt-3.5 text-sm leading-relaxed text-text-primary">
            {brief.caption}
          </p>
        )}

        {/* ── Engagement row ── */}
        <div className="flex items-center gap-6 px-4 pt-4 pb-3 border-b border-border-hairline">
          {/* Likes */}
          <button type="button" className="group inline-flex items-center gap-1.5 text-text-muted transition-colors hover:text-red-400">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span className="text-sm font-medium">{shortNum(brief.engagementLikes)}</span>
          </button>

          {/* Comments */}
          <button type="button" className="group inline-flex items-center gap-1.5 text-text-muted transition-colors hover:text-accent">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span className="text-sm font-medium">{shortNum(brief.engagementComments)}</span>
          </button>

          {/* Shares */}
          <button type="button" className="group inline-flex items-center gap-1.5 text-text-muted transition-colors hover:text-emerald-400">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span className="text-sm font-medium">{shortNum(brief.engagementShares)}</span>
          </button>
        </div>

        {/* ── Mock comment previews ── */}
        <div className="px-4 py-3 space-y-2.5 border-b border-border-hairline">
          {MOCK_COMMENTS.map((c) => (
            <div key={c.handle} className="flex gap-2 text-sm">
              <span className="shrink-0 font-medium text-text-secondary">{c.handle}</span>
              <span className="text-text-muted line-clamp-1">{c.text}</span>
            </div>
          ))}
        </div>

        {/* ── Source metadata ── */}
        <div className="flex items-center gap-2 px-4 py-3 text-xs text-text-muted">
          <span
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: platformColor }}
          >
            {platformIcon}
          </span>
          <span>Posted on {platformLabel}</span>
          <span className="text-border-hairline">·</span>
          <span>{formatDate(brief.publishedAt)}</span>
        </div>
      </div>

      {/* ── Start Investigation button ── */}
      <button
        type="button"
        className="mt-6 inline-flex w-full items-center justify-center gap-2.5
                   rounded-base bg-accent px-6 py-3.5
                   text-sm font-medium text-white shadow-sm
                   transition-all duration-200
                   hover:bg-accent-hover hover:shadow-md active:scale-[0.98]"
      >
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
        Start Investigation
      </button>
    </article>
  );
}

export default BriefPage;
