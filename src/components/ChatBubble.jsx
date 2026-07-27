/**
 * ChatBubble — reusable message bubble for AI-mentor conversations.
 *
 * Supports both AI and user messages with distinct alignment, styling,
 * avatar indicators, and optional hover-revealed timestamps.
 *
 * All colours are drawn from the project's Tailwind design tokens
 * (indigo-* for user accents, gray-* for AI / neutral surfaces).
 *
 * @param {{
 *   sender:     'AI' | 'USER',
 *   text:       string,
 *   timestamp?: string | number,
 *   className?: string,
 * }} props
 */
function ChatBubble({ sender, text, timestamp, className = '' }) {
  const isUser = sender === 'USER';

  // Format timestamp to short time (e.g. "2:35 PM") when provided
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}
    >
      <div className="group max-w-[80%] sm:max-w-[70%]">
        {/* ---- Sender label with avatar dot ---- */}
        <div
          className={`mb-1.5 flex items-center gap-1.5 text-xs font-medium ${
            isUser ? 'flex-row-reverse text-indigo-400' : 'text-gray-500'
          }`}
        >
          {/* Avatar dot — indigo for user, emerald for AI */}
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isUser ? 'bg-indigo-400' : 'bg-emerald-400'
            }`}
            aria-hidden="true"
          />
          <span>{isUser ? 'You' : 'AI Mentor'}</span>
        </div>

        {/* ---- Message bubble ---- */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed transition-shadow duration-200 ${
            isUser
              ? 'rounded-br-md bg-indigo-600 text-white shadow-lg shadow-indigo-500/10'
              : 'rounded-bl-md border border-gray-700/50 bg-gray-800/80 text-gray-200 shadow-lg shadow-black/10'
          }`}
        >
          {text}
        </div>

        {/* ---- Timestamp (appears on hover via group) ---- */}
        {formattedTime && (
          <p
            className={`mt-1 text-[11px] leading-none text-gray-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
              isUser ? 'text-right' : ''
            }`}
          >
            {formattedTime}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatBubble;