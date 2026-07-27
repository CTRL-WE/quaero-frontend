import { useState, useRef, useEffect } from 'react';
import ChatBubble from '../components/ChatBubble';
import useInvestigationSession from '../hooks/useInvestigationSession';

// ---------------------------------------------------------------------------
// ChatPage — AI-mentor Socratic investigation interface
//
// Wires together:
//   • useInvestigationSession  → session lifecycle, messages, send()
//   • ChatBubble               → renders each message
//   • Local state              → textarea input
//
// Uses mock service data — no real API calls yet.
// ---------------------------------------------------------------------------
function ChatPage() {
  const {
    messages,
    isLoading,
    isSending,
    error,
    send,
    clearError,
  } = useInvestigationSession('1024');

  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to the newest message whenever the list changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Send handler --------------------------------------------------------
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await send(trimmed);
  };

  // Enter sends, Shift+Enter inserts a newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow the textarea as the user types
  const handleInput = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  const canSend = input.trim().length > 0 && !isSending;

  // -----------------------------------------------------------------------
  return (
    <div className="flex flex-1 flex-col overflow-hidden">

      {/* ---- Header ---- */}
      <div className="shrink-0 border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-100">
              AI Mentor Investigation
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">
              The AI will guide your reasoning through questions.
            </p>
          </div>
          <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400">
            Case #1024
          </span>
        </div>
      </div>

      {/* ---- Scrollable conversation area ---- */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-4">

          {/* Loading skeleton */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="ml-3 text-red-400/70 transition-colors hover:text-red-300"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Messages */}
          {!isLoading &&
            messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                timestamp={msg.timestamp}
              />
            ))}

          {/* Sending indicator */}
          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] sm:max-w-[70%]">
                <p className="mb-1.5 text-xs font-medium text-gray-500">
                  AI Mentor
                </p>
                <div className="rounded-2xl rounded-bl-md border border-gray-700/50 bg-gray-800/80 px-4 py-3 shadow-lg shadow-black/10">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invisible anchor for auto-scroll */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* ---- Input bar ---- */}
      <div className="shrink-0 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            placeholder={isLoading ? 'Starting session…' : 'Type your reasoning…'}
            className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none transition-colors duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:hover:shadow-none"
          >
            {isSending ? (
              /* Spinner while sending */
              <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              /* Send arrow icon */
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M3.105 2.29a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.084L2.28 16.76a.75.75 0 0 0 .826.95l15.3-5.1a.75.75 0 0 0 0-1.22l-15.3-5.1Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;