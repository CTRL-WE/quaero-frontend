import { useParams } from 'react-router-dom';
import useInvestigationSession from '../hooks/useInvestigationSession';
import ChatMessageList from '../components/ChatMessageList';
import ChatInput from '../components/ChatInput';

// ---------------------------------------------------------------------------
// ChatPage — AI-mentor Socratic investigation interface
//
// Composes:
//   • useInvestigationSession  → session lifecycle, messages, send()
//   • ChatMessageList          → renders messages + typing indicator
//   • ChatInput                → textarea + send button
//
// Reads caseId from the URL via useParams() (route: /chat/:caseId).
// ---------------------------------------------------------------------------
function ChatPage() {
  const { caseId } = useParams();

  const {
    messages,
    isLoading,
    isSending,
    error,
    send,
    clearError,
  } = useInvestigationSession(caseId);

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
            Case #{caseId}
          </span>
        </div>
      </div>

      {/* ---- Loading skeleton ---- */}
      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse [animation-delay:150ms]" />
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse [animation-delay:300ms]" />
          </div>
        </div>
      )}

      {/* ---- Error banner ---- */}
      {error && (
        <div className="mx-auto max-w-3xl px-4 pt-4 sm:px-6">
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
        </div>
      )}

      {/* ---- Scrollable conversation area ---- */}
      {!isLoading && (
        <ChatMessageList messages={messages} isTyping={isSending} />
      )}

      {/* ---- Input bar ---- */}
      <ChatInput
        onSend={send}
        disabled={isLoading || isSending}
      />
    </div>
  );
}

export default ChatPage;