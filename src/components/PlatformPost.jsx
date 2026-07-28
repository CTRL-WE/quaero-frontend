/**
 * PlatformPost — polymorphic media component.
 *
 * Props:
 *   platform   – INSTAGRAM | TWITTER | FACEBOOK | YOUTUBE | REDDIT | TIKTOK | NEWS | WHATSAPP | OTHER
 *   mediaUrl   – source URL for the media
 *   mediaType  – IMAGE | VIDEO | SCREENSHOT | TEXT_ONLY
 *   caption    – short caption string (1-2 lines)
 *   size       – 'card' (fixed-aspect thumbnail for Feed) | 'full' (larger display for Observe)
 */

/* ── Platform metadata lookup ────────────────────────────────────── */
const PLATFORM_META = {
  INSTAGRAM: {
    label: 'Instagram',
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 1.5a3 3 0 100 6 3 3 0 000-6zm4.75-2.5a1 1 0 110 2 1 1 0 010-2z" />
      </svg>
    ),
  },
  TWITTER: {
    label: 'X / Twitter',
    color: '#1D9BF0',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M13.808 10.469L20.88 2h-1.676l-6.142 7.353L8.158 2H2.5l7.418 11.12L2.5 22h1.676l6.486-7.765L15.842 22H21.5l-7.693-11.531zm-2.296 2.748l-.752-1.107L4.78 3.3h2.575l4.826 7.11.751 1.107 6.273 9.242h-2.574l-5.12-7.541z" />
      </svg>
    ),
  },
  FACEBOOK: {
    label: 'Facebook',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  YOUTUBE: {
    label: 'YouTube',
    color: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M23.498 6.186a2.994 2.994 0 00-2.107-2.117C19.502 3.5 12 3.5 12 3.5s-7.502 0-9.39.569A2.994 2.994 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 002.108 2.117c1.888.569 9.39.569 9.39.569s7.502 0 9.39-.569a2.994 2.994 0 002.108-2.117C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  REDDIT: {
    label: 'Reddit',
    color: '#FF4500',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.094z" />
      </svg>
    ),
  },
  TIKTOK: {
    label: 'TikTok',
    color: '#00F2EA',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  NEWS: {
    label: 'News',
    color: '#A78BFA',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
        <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z" />
      </svg>
    ),
  },
  WHATSAPP: {
    label: 'WhatsApp',
    color: '#25D366',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  OTHER: {
    label: 'Source',
    color: '#6B7280',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
};

/* ── Size presets ─────────────────────────────────────────────────── */
const SIZE_CLASSES = {
  card: 'aspect-[4/3] max-h-52',
  full: 'aspect-video w-full',
};

/* ── Internal renderers ──────────────────────────────────────────── */

function ImageMedia({ mediaUrl, caption, sizeClass }) {
  return (
    <img
      src={mediaUrl}
      alt={caption || ''}
      loading="lazy"
      className={`${sizeClass} w-full object-cover rounded-base`}
    />
  );
}

function VideoMedia({ mediaUrl, caption, sizeClass }) {
  return (
    <video
      src={mediaUrl}
      controls
      preload="metadata"
      aria-label={caption || 'Video'}
      className={`${sizeClass} w-full rounded-base bg-black object-cover`}
    />
  );
}

function PlaceholderMedia({ caption, mediaType, sizeClass }) {
  const isScreenshot = mediaType === 'SCREENSHOT';

  return (
    <div
      className={`${sizeClass} w-full rounded-base bg-surface-overlay
                   flex flex-col items-center justify-center gap-2 px-4
                   border border-border-hairline`}
    >
      {/* Icon */}
      <span className="text-text-muted">
        {isScreenshot ? (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        ) : (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 6.1H3M21 12.1H3M15.1 18H3" />
          </svg>
        )}
      </span>

      {/* Caption preview */}
      {caption && (
        <p className="text-xs text-text-secondary text-center line-clamp-2 max-w-[80%]">
          {caption}
        </p>
      )}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

function PlatformPost({ platform, mediaUrl, mediaType, caption, size = 'card' }) {
  const meta = PLATFORM_META[platform] || PLATFORM_META.OTHER;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.card;

  let media;
  switch (mediaType) {
    case 'IMAGE':
      media = <ImageMedia mediaUrl={mediaUrl} caption={caption} sizeClass={sizeClass} />;
      break;
    case 'VIDEO':
      media = <VideoMedia mediaUrl={mediaUrl} caption={caption} sizeClass={sizeClass} />;
      break;
    case 'SCREENSHOT':
    case 'TEXT_ONLY':
    default:
      media = <PlaceholderMedia caption={caption} mediaType={mediaType} sizeClass={sizeClass} />;
      break;
  }

  return (
    <div className="relative isolate overflow-hidden rounded-base">
      {media}

      {/* Platform badge */}
      <span
        className="absolute top-2 left-2 z-10 inline-flex items-center gap-1
                   rounded-full px-2 py-0.5 text-[10px] font-medium leading-none
                   backdrop-blur-sm"
        style={{
          color: meta.color,
          backgroundColor: `${meta.color}18`,
          boxShadow: `inset 0 0 0 1px ${meta.color}30`,
        }}
        title={meta.label}
      >
        <span className="h-3 w-3 shrink-0">{meta.icon}</span>
        {size === 'full' && <span>{meta.label}</span>}
      </span>
    </div>
  );
}

export default PlatformPost;
