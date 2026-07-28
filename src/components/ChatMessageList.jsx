import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';

/**
 * ChatMessageList — scrollable message container with auto-scroll.
 *
 * @param {{ messages: object[], isTyping: boolean }} props
 */
function ChatMessageList({ messages, isTyping = false }) {
  const bottomRef = useRef(null);

  // Auto-scroll to the bottom whenever messages change or typing starts
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8 text-indigo-400"
              >
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 20.97V18.5a47.41 47.41 0 0 1-1.087-.064C2.99 18.212 1.5 16.6 1.5 14.693V6.385c0-1.866 1.37-3.477 3.413-3.727ZM17.04 6.75c-2.262-.188-4.578-.188-6.84 0-1.418.118-2.45 1.274-2.45 2.558v4.286c0 1.284 1.032 2.44 2.45 2.558.738.061 1.48.106 2.225.134l2.856 2.856a.75.75 0 0 0 1.28-.53v-2.148a46.82 46.82 0 0 0 .479-.026c1.418-.118 2.45-1.274 2.45-2.558V9.308c0-1.284-1.032-2.44-2.45-2.558Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-200">Start Your Investigation</h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Ask a question or share a claim. The AI mentor will guide your
              reasoning through thoughtful questions.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            sender={msg.sender}
            text={msg.text}
            timestamp={msg.timestamp}
          />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Invisible anchor for auto-scroll */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatMessageList;
