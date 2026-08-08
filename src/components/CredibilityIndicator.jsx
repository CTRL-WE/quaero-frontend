/**
 * CredibilityIndicator — hand-drawn SVG gauge (arc + needle).
 *
 * Props:
 *   credibility – number | null | undefined
 *     • undefined → skeleton (data still loading)
 *     • null      → valid "not yet rated" state
 *     • number    → rendered gauge with color-coded arc
 */

/* ── Color band based on score ────────────────────────────────────── */
function getScoreBand(score) {
  if (score >= 90) return { color: '#3f9142', label: 'Excellent' };
  if (score >= 70) return { color: '#2e64a8', label: 'Good' };
  if (score >= 50) return { color: '#ffce3a', label: 'Fair' };
  return { color: '#e03e2d', label: 'Low' };
}

/* ── Skeleton ─────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div
      className="flex flex-col items-center gap-1"
      aria-busy="true"
      aria-label="Loading credibility score"
      style={{ width: 120, height: 80 }}
    >
      <div
        className="animate-pulse"
        style={{
          width: 100,
          height: 52,
          borderRadius: '52px 52px 0 0',
          background: 'rgba(22, 20, 18, 0.08)',
        }}
      />
      <div
        className="animate-pulse"
        style={{
          width: 40,
          height: 10,
          borderRadius: 3,
          background: 'rgba(22, 20, 18, 0.08)',
        }}
      />
    </div>
  );
}

/* ── Gauge constants ──────────────────────────────────────────────── */
const GAUGE_R = 38;          // arc radius
const GAUGE_CX = 60;         // center X
const GAUGE_CY = 54;         // center Y (arc sits above this)
const STROKE_W = 8;
// Half-circle arc length
const ARC_LEN = Math.PI * GAUGE_R;

/* ── Component ────────────────────────────────────────────────────── */

function CredibilityIndicator({ credibility }) {
  /* Still loading */
  if (credibility === undefined) return <Skeleton />;

  /* Not yet rated (null is a valid state, distinct from 0) */
  if (credibility === null) {
    return (
      <div
        className="flex flex-col items-center"
        aria-label="Credibility: Not yet rated"
        style={{ width: 120 }}
      >
        <svg viewBox="0 0 120 70" width={120} height={70} aria-hidden="true">
          {/* Rough filter */}
          <defs>
            <filter id="cred-rough-empty">
              <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
            </filter>
          </defs>
          {/* Background arc */}
          <path
            d={`M ${GAUGE_CX - GAUGE_R} ${GAUGE_CY} A ${GAUGE_R} ${GAUGE_R} 0 0 1 ${GAUGE_CX + GAUGE_R} ${GAUGE_CY}`}
            fill="none"
            stroke="rgba(22,20,18,0.15)"
            strokeWidth={STROKE_W}
            strokeLinecap="round"
            filter="url(#cred-rough-empty)"
          />
        </svg>
        <span
          className="text-xs italic"
          style={{
            color: 'var(--color-comic-ink)',
            opacity: 0.5,
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
          }}
        >
          Not Rated
        </span>
      </div>
    );
  }

  /* ── Rated score ── */
  const band = getScoreBand(credibility);
  const displayValue = Number.isInteger(credibility)
    ? credibility.toString()
    : credibility.toFixed(1);

  // Clamp to 0–100 for gauge
  const clamped = Math.max(0, Math.min(100, credibility));
  const fillLen = (clamped / 100) * ARC_LEN;
  const dashOffset = ARC_LEN - fillLen;

  // Needle rotation: 0 = left (−90deg from 12 o'clock) → 100 = right (+90deg)
  // In SVG, the arc goes from 9 o'clock to 3 o'clock (left to right),
  // so needle rotates from -90deg to +90deg relative to vertical.
  const needleDeg = -90 + (clamped / 100) * 180;

  return (
    <div
      className="flex flex-col items-center"
      aria-label={`Credibility score: ${displayValue} out of 100, ${band.label}`}
      style={{ width: 120 }}
    >
      <svg viewBox="0 0 120 70" width={120} height={70} aria-hidden="true">
        <defs>
          {/* Rough hand-drawn filter */}
          <filter id="cred-rough">
            <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
          </filter>
        </defs>

        {/* Background arc (full 180°) */}
        <path
          d={`M ${GAUGE_CX - GAUGE_R} ${GAUGE_CY} A ${GAUGE_R} ${GAUGE_R} 0 0 1 ${GAUGE_CX + GAUGE_R} ${GAUGE_CY}`}
          fill="none"
          stroke="rgba(22,20,18,0.12)"
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          filter="url(#cred-rough)"
        />

        {/* Colored fill arc */}
        <path
          d={`M ${GAUGE_CX - GAUGE_R} ${GAUGE_CY} A ${GAUGE_R} ${GAUGE_R} 0 0 1 ${GAUGE_CX + GAUGE_R} ${GAUGE_CY}`}
          fill="none"
          stroke={band.color}
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeDasharray={ARC_LEN}
          strokeDashoffset={dashOffset}
          filter="url(#cred-rough)"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />

        {/* Needle */}
        <g
          style={{
            transformOrigin: `${GAUGE_CX}px ${GAUGE_CY}px`,
            '--needle-target': `${needleDeg}deg`,
            animation: 'needle-swing 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          }}
        >
          <line
            x1={GAUGE_CX}
            y1={GAUGE_CY}
            x2={GAUGE_CX}
            y2={GAUGE_CY - GAUGE_R + 6}
            stroke="var(--color-comic-ink)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {/* Needle hub */}
          <circle
            cx={GAUGE_CX}
            cy={GAUGE_CY}
            r={4}
            fill="var(--color-comic-ink)"
          />
        </g>

        {/* Score text */}
        <text
          x={GAUGE_CX}
          y={GAUGE_CY - 8}
          textAnchor="middle"
          fill="var(--color-comic-ink)"
          style={{
            fontSize: '14px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
          }}
        >
          {displayValue}
        </text>
      </svg>

      {/* Band label */}
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: band.color,
          marginTop: -2,
        }}
      >
        {band.label}
      </span>
    </div>
  );
}

export default CredibilityIndicator;
