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
      className="flex items-center gap-3 rounded-lg border-[3px] border-comic-ink
                 bg-comic-paper px-3 py-2
                 transition-colors duration-200 hover:bg-comic-yellow/10"
    >
      {/* Pinned-reference indicator */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center
                       text-comic-red">
        <Pin size={13} strokeWidth={2} className="rotate-45" />
      </span>

      {/* Compact thumbnail — constrained so PlatformPost stays tiny */}
      <div className="h-10 w-14 shrink-0 overflow-hidden rounded border-2 border-comic-ink/20">
        <PlatformPost
          platform={platform}
          mediaUrl={mediaUrl}
          mediaType={mediaType}
          caption={caption}
          size="card"
        />
      </div>

      {/* One-line caption */}
      <p className="min-w-0 flex-1 truncate text-xs leading-snug font-semibold text-comic-ink/70">
        {caption}
      </p>

      {/* "EXHIBIT A" label */}
      <span
        className="hidden sm:inline-flex shrink-0 rounded border-2 border-comic-ink/20 
                   bg-comic-yellow/30 px-2 py-0.5
                   text-[10px] font-bold uppercase tracking-wider text-comic-ink/60"
      >
        Exhibit A
      </span>
    </div>
  );
}

export default ReferencePostStrip;

