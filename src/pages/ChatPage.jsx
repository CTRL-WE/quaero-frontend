import { useParams } from 'react-router-dom';
import useInvestigationSession from '../hooks/useInvestigationSession';
import useCaseBrief from '../hooks/useCaseBrief';
import ReferencePostStrip from '../components/ReferencePostStrip';
import ChatMessageList from '../components/ChatMessageList';
import ChatInput from '../components/ChatInput';
import EvidenceLocker from '../components/EvidenceLocker';
import InvestigationProgress from '../components/InvestigationProgress';

// ---------------------------------------------------------------------------
// ChatPage — Investigation Workspace (4-panel layout)
//
// Four simultaneously visible zones on a single screen:
//   1. Reference Post   — collapsed top strip showing the original claim
//   2. AI Mentor        — existing ChatMessageList + ChatInput (unchanged)
//   3. Evidence Locker   — placeholder (Prompt 5)
//   4. Investigation Progress — persistent progress indicator + submit CTA
//
// Layout:
//   ┌──────────────── Reference Post Strip ──────────────────┐
//   │                                                        │
//   │  ┌─── AI Mentor (main) ───┐  ┌─ Evidence ─┐ ┌─ Prog ─┐│
//   │  │ ChatMessageList        │  │  Locker     │ │ ress   ││
//   │  │                        │  │  (P5)       │ │        ││
//   │  │                        │  │             │ │        ││
//   │  ├── ChatInput ───────────┤  │             │ │        ││
//   │  └────────────────────────┘  └─────────────┘ └────────┘│
//   └────────────────────────────────────────────────────────┘
//
// On mobile (< lg) the right-side panels stack below the chat.
//
// Design tokens (v1 §1): dark surfaces, layered grays, one accent (indigo),
// hairline borders, consistent soft radius, sentence case.
// ---------------------------------------------------------------------------
function ChatPage() {
  const { caseId } = useParams();

  // ---- Data hooks (no new API calls — reuses existing services) -----------
  const {
    messages,
    isLoading,
    isSending,
    error,
    turnCount,
    nudgeSubmission,
    isSubmitted,
    send,
    clearError,
  } = useInvestigationSession(caseId);

  const { brief, loading: briefLoading } = useCaseBrief(caseId);

  // Placeholder handler — will route to the Submission screen once it exists
  const handleSubmitInvestigation = () => {
    // TODO: navigate(`/cases/${caseId}/submit`) once the Submission page is built
    console.log(`[ChatPage] User wants to submit investigation for case ${caseId}`);
  };

  // -----------------------------------------------------------------------
  return (
    <div className="flex flex-1 flex-col overflow-hidden">

      {/* ================================================================
          Panel 1 — Reference Post strip (non-scrolling, top)
          ================================================================ */}
      <ReferencePostStrip
        brief={brief}
        loading={briefLoading}
        caseId={caseId}
      />

      {/* ================================================================
          Main workspace body — 3-column grid on lg+, stacked on mobile
          ================================================================ */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">

        {/* ==============================================================
            Panel 2 — AI Mentor (chat)
            The existing ChatMessageList + ChatInput, unchanged in behavior.
            ============================================================== */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">

          {/* Loading skeleton */}
          {isLoading && (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="px-4 pt-3 sm:px-5">
              <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
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

          {/* Scrollable conversation */}
          {!isLoading && (
            <ChatMessageList messages={messages} isTyping={isSending} />
          )}

          {/* Input bar (or submitted-session lockout) */}
          <ChatInput
            onSend={send}
            disabled={isLoading || isSending}
            submittedMessage={
              isSubmitted
                ? 'This investigation has been submitted. You can review your conversation above but cannot send new messages.'
                : null
            }
          />
        </div>

        {/* ==============================================================
            Right sidebar — Evidence Locker + Investigation Progress
            On lg+ this is a single vertical column to the right of the
            chat. On mobile the panels stack below.
            ============================================================== */}
        <div className="flex shrink-0 flex-col lg:w-[280px] border-t border-gray-800/60 lg:border-t-0 lg:border-l lg:border-gray-800/60">

          {/* Panel 3 — Evidence Locker (placeholder) */}
          <div className="flex flex-1 flex-col min-h-[140px] lg:min-h-0 overflow-y-auto">
            <EvidenceLocker />
          </div>

          {/* Panel 4 — Investigation Progress */}
          <div className="flex flex-col shrink-0">
            <InvestigationProgress
              turnCount={turnCount}
              nudgeSubmission={nudgeSubmission}
              isSubmitted={isSubmitted}
              onSubmit={handleSubmitInvestigation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;