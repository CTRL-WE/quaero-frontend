// PLACEHOLDER MASCOT — swap with final logo/character art when provided.

/**
 * DetectiveMascot — a small SVG illustration of a detective silhouette
 * built from clean geometric shapes: fedora hat, round head, trench coat,
 * and magnifying glass. Reads well at 48 px through 160 px.
 *
 * Props:
 *   size – width and height in px (default 64)
 */
function DetectiveMascot({ size = 64 }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Detective mascot"
      role="img"
    >
      {/* ── Trench coat body ── */}
      <path
        d="M19 36 L14 58 L50 58 L45 36 Z"
        fill="var(--color-comic-brown, #8a6a3c)"
        stroke="var(--color-comic-ink, #161412)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Coat lapels */}
      <path
        d="M26 36 L32 47 L38 36"
        fill="var(--color-comic-paper, #f3e6c8)"
        stroke="var(--color-comic-ink, #161412)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Coat buttons */}
      <circle cx="32" cy="49" r="1.2" fill="var(--color-comic-ink, #161412)" />
      <circle cx="32" cy="53" r="1.2" fill="var(--color-comic-ink, #161412)" />

      {/* ── Head ── */}
      <circle
        cx="32"
        cy="26"
        r="10"
        fill="var(--color-comic-paper, #f3e6c8)"
        stroke="var(--color-comic-ink, #161412)"
        strokeWidth="2.5"
      />

      {/* Eyes */}
      <circle cx="28" cy="25" r="2" fill="var(--color-comic-ink, #161412)" />
      <circle cx="36" cy="25" r="2" fill="var(--color-comic-ink, #161412)" />
      {/* Eye shine */}
      <circle cx="28.8" cy="24.2" r="0.7" fill="white" />
      <circle cx="36.8" cy="24.2" r="0.7" fill="white" />

      {/* Slight smile */}
      <path
        d="M28 30 Q32 33, 36 30"
        stroke="var(--color-comic-ink, #161412)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Fedora hat ── */}
      {/* Hat crown */}
      <path
        d="M19 17 L22 5 L42 5 L45 17"
        fill="var(--color-comic-brown, #8a6a3c)"
        stroke="var(--color-comic-ink, #161412)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Hat brim */}
      <ellipse
        cx="32"
        cy="17"
        rx="16"
        ry="3.5"
        fill="var(--color-comic-brown, #8a6a3c)"
        stroke="var(--color-comic-ink, #161412)"
        strokeWidth="2"
      />
      {/* Hat band */}
      <rect
        x="21"
        y="12"
        width="22"
        height="3"
        rx="1"
        fill="var(--color-comic-red, #e03e2d)"
      />

      {/* ── Magnifying glass ── */}
      {/* Handle */}
      <line
        x1="49"
        y1="46"
        x2="55"
        y2="55"
        stroke="var(--color-comic-brown, #8a6a3c)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Rim */}
      <circle
        cx="46"
        cy="42"
        r="7"
        fill="var(--color-comic-blue, #2e64a8)"
        fillOpacity="0.15"
        stroke="var(--color-comic-ink, #161412)"
        strokeWidth="2.5"
      />
      {/* Glass shine */}
      <path
        d="M42 38 Q44 36, 46 38"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

export default DetectiveMascot;
