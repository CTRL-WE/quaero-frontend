import { useState, useCallback, useEffect } from 'react';
import {
  startSession,
  sendMessage,
  getSession,
} from '../services/investigationService';

// ---------------------------------------------------------------------------
// useInvestigationSession
//
// Manages the full lifecycle of an investigation chat session:
//   • starting / resuming a session
//   • sending messages (with optimistic user-message append)
//   • loading & error states
//
// All data currently comes from mock promises in investigationService.
// When the real backend is live, only the service layer changes — this
// hook and every component that uses it stay exactly the same.
// ---------------------------------------------------------------------------

/**
 * @param {string|number|null} caseId
 *   If provided the hook will automatically start a session on mount.
 *   Pass `null` to defer initialisation (call `initSession` manually).
 *
 * @returns {{
 *   messages:    Array<{ id: number, sender: 'AI'|'USER', text: string, timestamp: string }>,
 *   isLoading:   boolean,
 *   isSending:   boolean,
 *   error:       string | null,
 *   sessionId:   string | null,
 *   send:        (text: string) => Promise<void>,
 *   initSession: (caseId: string|number) => Promise<void>,
 *   clearError:  () => void,
 * }}
 */
const useInvestigationSession = (caseId = null) => {
  // ---- State --------------------------------------------------------------
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // ---- Initialise / resume a session --------------------------------------
  const initSession = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create a new session for the case
      const session = await startSession(id);
      setSessionId(session.sessionId);

      // 2. Fetch the conversation history (may include a welcome message)
      const data = await getSession(session.sessionId);
      setMessages(data.messages ?? []);
    } catch (err) {
      console.error('[useInvestigationSession] initSession failed:', err);
      setError(err.message || 'Failed to start investigation session.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-start on mount when a caseId is provided
  useEffect(() => {
    if (caseId !== null) {
      initSession(caseId);
    }
  }, [caseId, initSession]);

  // ---- Send a user message ------------------------------------------------
  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || !sessionId) return;

      setIsSending(true);
      setError(null);

      try {
        const { userMsg, aiMsg } = await sendMessage(sessionId, trimmed);

        // Append both the user's message and the AI reply
        setMessages((prev) => [...prev, userMsg, aiMsg]);
      } catch (err) {
        console.error('[useInvestigationSession] send failed:', err);
        setError(err.message || 'Failed to send message.');
      } finally {
        setIsSending(false);
      }
    },
    [sessionId],
  );

  // ---- Helpers ------------------------------------------------------------
  const clearError = useCallback(() => setError(null), []);

  // ---- Public API ---------------------------------------------------------
  return {
    messages,
    isLoading,
    isSending,
    error,
    sessionId,
    send,
    initSession,
    clearError,
  };
};

export default useInvestigationSession;
