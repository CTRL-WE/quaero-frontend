/**
 * SpeechBubble — chat bubble with a real CSS-drawn triangular tail.
 *
 * The tail is rendered via ::before / ::after pseudo-elements defined in
 * src/index.css (.speech-bubble-ai, .speech-bubble-user). A custom property
 * --speech-bubble-bg is set inline so the tail fill matches the bubble bg.
 *
 * Props:
 *   children – message content
 *   variant  – 'ai' (tail left, purple bg) | 'user' (tail right, red bg)
 */
function SpeechBubble({ children, variant = 'ai' }) {
  const isAi = variant === 'ai';

  const bubbleBg = isAi ? '#ece0f5' : 'var(--color-comic-red, #e03e2d)';
  const textColor = isAi ? 'text-comic-ink' : 'text-white';
  const tailClass = isAi ? 'speech-bubble-ai' : 'speech-bubble-user';

  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`
          ${tailClass}
          max-w-[75%] rounded-lg
          border-[3px] border-comic-ink
          px-4 py-3 text-sm leading-relaxed
          ${textColor}
        `}
        style={{
          backgroundColor: bubbleBg,
          '--speech-bubble-bg': bubbleBg,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default SpeechBubble;
