/**
 * TypingIndicator — animated "AI is thinking" dots.
 * Renders three pulsing dots inside a chat-bubble-shaped container.
 */
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-gray-800/80 border border-gray-700/50 px-5 py-3.5">
        <span className="sr-only">AI is thinking</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-2 w-2 rounded-full bg-indigo-400"
            style={{
              animation: 'typingDot 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default TypingIndicator;
