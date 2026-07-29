import { useState, useRef } from 'react';

/**
 * ChatInput — message composition bar with send button.
 *
 * Supports a `submittedMessage` prop: when provided, the input is fully
 * locked out and the message is displayed instead of the textarea — used
 * when the session status is SUBMITTED so the user gets a clear,
 * non-interactive explanation rather than a raw API error.
 *
 * @param {{
 *   onSend:           (text: string) => void,
 *   disabled?:        boolean,
 *   submittedMessage?: string | null,
 * }} props
 */
function ChatInput({ onSend, disabled = false, submittedMessage = null }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // ---- Submitted-session lockout ------------------------------------------
  if (submittedMessage) {
    return (
      <div className="shrink-0 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          {/* Lock icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 shrink-0 text-amber-400"
          >
            <path
              fillRule="evenodd"
              d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-amber-300/90">{submittedMessage}</p>
        </div>
      </div>
    );
  }

  // ---- Normal input mode --------------------------------------------------
  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends, Shift+Enter inserts newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    // Auto-grow the textarea
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="shrink-0 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder={disabled ? 'Waiting for response…' : 'Type your reasoning…'}
          className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-800/60 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none transition-colors duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:hover:shadow-none"
        >
          {/* Send arrow icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M3.105 2.29a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.084L2.28 16.76a.75.75 0 0 0 .826.95l15.3-5.1a.75.75 0 0 0 0-1.22l-15.3-5.1Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
