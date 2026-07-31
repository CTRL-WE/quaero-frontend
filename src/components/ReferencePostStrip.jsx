import { Pin } from 'lucide-react';
import PlatformPost from './PlatformPost';

/**
 * ReferencePostStrip — a compact, anchored bar showing the original post
 * being investigated. Wraps PlatformPost in 'card' mode as a tiny thumbnail
 * alongside a one-line caption.
 *
 * Props:
 *   platform  – INSTAGRAM | TWITTER | FACEBOOK | YOUTUBE | REDDIT | …
 *   mediaUrl  – source URL for the media
 *   mediaType – IMAGE | VIDEO | SCREENSHOT | TEXT_ONLY
 *   caption   – original post caption (truncated to one line)
 */

function ReferencePostStrip({ platform, mediaUrl, mediaType, caption }) {
  return (
    <div
      className="flex items-center gap-3 rounded-base border border-border-hairline
                 bg-surface-card/80 px-3 py-2 backdrop-blur-sm
                 transition-colors duration-200 hover:border-white/10"
    >
      {/* Pinned-reference indicator */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center
                       text-text-muted">
        <Pin size={13} strokeWidth={2} className="rotate-45" />
      </span>

      {/* Compact thumbnail — constrained so PlatformPost stays tiny */}
      <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md">
        <PlatformPost
          platform={platform}
          mediaUrl={mediaUrl}
          mediaType={mediaType}
          caption={caption}
          size="card"
        />
      </div>

      {/* One-line caption */}
      <p className="min-w-0 flex-1 truncate text-xs leading-snug text-text-secondary">
        {caption}
      </p>

      {/* Subtle "Reference" label */}
      <span
        className="hidden sm:inline-flex shrink-0 rounded-full bg-white/5 px-2 py-0.5
                   text-[10px] font-medium uppercase tracking-wider text-text-muted
                   ring-1 ring-white/6"
      >
        Reference
      </span>
    </div>
  );
}

export default ReferencePostStrip;
