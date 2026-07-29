import { useState, useCallback, useEffect, useRef } from 'react';
import {
  getSessionStatus,
  sendMessage,
} from '../services/investigationService';

// ---------------------------------------------------------------------------
// Environment flag — when true, the hook uses mock response shapes
// (userMsg / aiMsg) instead of the real ChatMessageResponse shape.
// ---------------------------------------------------------------------------
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// ---------------------------------------------------------------------------
// useInvestigationSession
//
// Manages the full lifecycle of an investigation chat session:
//   • resuming an existing session via GET /investigations/{caseId}/status
//   • sending messages via POST /investigations/{caseId}/messages
//   • optimistic user-message rendering
//   • per-message retry-capable error state (never clears the conversation)
//   • turn count + submission nudge tracking
//   • submitted-session guard (disables further input)
//
// When VITE_USE_MOCK_API=true, delegates to in-memory mocks so the UI
// works without a running backend.
// ---------------------------------------------------------------------------

/**
 * @param {string|number|null} caseId
 *   If provided the hook will automatically initialise on mount.
 *   Pass `null` to defer initialisation (call `initSession` manually).
 *
 * @returns {{
 *   messages:         Array<{ id: number|string, sender: 'AI'|'USER', text: string, timestamp: string, failed?: boolean }>,
 *   isLoading:        boolean,
 *   isSending:        boolean,
 *   error:            string | null,
 *   turnCount:        number,
 *   nudgeSubmission:  boolean,
 *   sessionStatus:    string | null,
 *   isSubmitted:      boolean,
 *   send:             (text: string) => Promise<void>,
 *   retrySend:        (text: string) => Promise<void>,
 *   initSession:      (caseId: string|number) => Promise<void>,
 *   clearError:       () => void,
 *   dismissNudge:     () => void,
 * }}
 */
const useInvestigationSession = (caseId = null) => {
  // ---- State --------------------------------------------------------------
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [nudgeSubmission, setNudgeSubmission] = useState(false);
  const [sessionStatus, setSessionStatus] = useState(null);

  // Derived — a session that has already been submitted is read-only
  const isSubmitted = sessionStatus === 'SUBMITTED';

  // Track the active caseId so send() doesn't need it as a parameter
  const activeCaseId = useRef(null);

  // Monotonically increasing client-side id for optimistic messages
  const nextOptimisticId = useRef(0);

  // ---- Initialise / resume a session --------------------------------------
  const initSession = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    activeCaseId.current = id;

    try {
      // Check whether a session already exists for this case.
      // The real API has no separate "create session" endpoint — sessions
      // are created implicitly by the messages endpoint if none exists yet.
      const data = await getSessionStatus(id);

      setMessages(data.messages ?? []);
      setTurnCount(data.turnCount ?? 0);
      setNudgeSubmission(data.nudgeSubmission ?? false);
      setSessionStatus(data.status ?? null);
    } catch (err) {
      // A 404 means no session exists yet — that's fine, the first
      // sendMessage call will implicitly create one.
      if (err.response?.status === 404) {
        setMessages([]);
        setTurnCount(0);
        setNudgeSubmission(false);
        setSessionStatus(null);
      } else {
        console.error('[useInvestigationSession] initSession failed:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load investigation session.');
      }
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
      if (!trimmed || !activeCaseId.current) return;

      // Client-side guard: reject sending into a submitted session.
      // The backend will also reject with SessionAlreadySubmittedException,
      // but catching it here avoids a wasted round-trip.
      if (isSubmitted) return;

      // -- Optimistic append of the user's message --------------------------
      const optimisticId = `optimistic-${++nextOptimisticId.current}`;
      const optimisticMsg = {
        id: optimisticId,
        sender: 'USER',
        text: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      setIsSending(true);
      setError(null);

      try {
        if (USE_MOCK) {
          // Mock returns { userMsg, aiMsg, turnCount, nudgeSubmission }
          const result = await sendMessage(activeCaseId.current, trimmed);

          setMessages((prev) => {
            // Replace the optimistic message with the "real" mock message,
            // then append the AI reply.
            const withoutOptimistic = prev.filter((m) => m.id !== optimisticId);
            return [...withoutOptimistic, result.userMsg, result.aiMsg];
          });

          setTurnCount(result.turnCount);
          if (result.nudgeSubmission) {
            setNudgeSubmission(true);
          }
        } else {
          // Real API returns ChatMessageResponse:
          //   { aiReply, turnCount, nudgeSubmission }
          const data = await sendMessage(activeCaseId.current, trimmed);

          const aiMsg = {
            id: `ai-${Date.now()}`,
            sender: 'AI',
            text: data.aiReply,
            timestamp: new Date().toISOString(),
          };

          // Replace optimistic id with a stable one and append AI reply
          setMessages((prev) => {
            const updated = prev.map((m) =>
              m.id === optimisticId ? { ...m, id: `user-${Date.now()}` } : m,
            );
            return [...updated, aiMsg];
          });

          setTurnCount(data.turnCount);
          if (data.nudgeSubmission) {
            setNudgeSubmission(true);
          }
        }
      } catch (err) {
        console.error('[useInvestigationSession] send failed:', err);

        // Detect SessionAlreadySubmittedException from the backend and
        // reflect it as a submitted-session guard rather than a raw error.
        const status = err.response?.status;
        const errorCode = err.response?.data?.code;

        if (status === 409 && errorCode === 'SESSION_ALREADY_SUBMITTED') {
          setSessionStatus('SUBMITTED');
          // Remove the optimistic message — it will never succeed
          setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
          setError('This investigation has already been submitted. No further messages can be sent.');
          setIsSending(false);
          return;
        }

        // Surface a retry-capable error on the *specific* failed message —
        // never clear the rest of the conversation (per Frontend Handbook
        // Screen 5 Error States).
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId ? { ...m, failed: true } : m,
          ),
        );
        setError(err.response?.data?.message || err.message || 'Failed to send message. Tap to retry.');
      } finally {
        setIsSending(false);
      }
    },
    [isSubmitted],
  );

  // ---- Retry a failed message ---------------------------------------------
  const retrySend = useCallback(
    async (text) => {
      // Remove any failed messages that match this text before resending,
      // so the user doesn't see duplicates.
      setMessages((prev) => prev.filter((m) => !(m.failed && m.text === text)));
      await send(text);
    },
    [send],
  );

  // ---- Helpers ------------------------------------------------------------
  const clearError = useCallback(() => setError(null), []);
  const dismissNudge = useCallback(() => setNudgeSubmission(false), []);

  // ---- Public API ---------------------------------------------------------
  return {
    messages,
    isLoading,
    isSending,
    error,
    turnCount,
    nudgeSubmission,
    sessionStatus,
    isSubmitted,
    send,
    retrySend,
    initSession,
    clearError,
    dismissNudge,
  };
};

export default useInvestigationSession;
