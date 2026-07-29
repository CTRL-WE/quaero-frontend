import apiClient from '../api/apiClient';

// ---------------------------------------------------------------------------
// Environment flag — set VITE_USE_MOCK_API=true in .env to fall back to
// in-memory mocks when the backend is unreachable.
// ---------------------------------------------------------------------------
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// ---------------------------------------------------------------------------
// Mock data — Socratic AI-mentor responses for investigations
// ---------------------------------------------------------------------------
const MOCK_AI_RESPONSES = [
  "That's a solid observation. What underlying assumption does it depend on?",
  "Interesting angle. Can you identify a piece of evidence that could disprove this?",
  "Good. Now consider the source's motivation — does that change your confidence?",
  "Before moving on, how would you rank the reliability of the evidence so far?",
  "What would a sceptic say about this conclusion? How would you respond?",
  "You're reasoning well. Is there a logical fallacy that could weaken this argument?",
];

let mockIdCounter = 200;

// Per-case mock turn counter so the mock can simulate nudgeSubmission
const mockTurnCounts = {};

const randomAIResponse = () =>
  MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];

// ---------------------------------------------------------------------------
// Mock implementations (used when USE_MOCK is true)
// ---------------------------------------------------------------------------

const mockGetSessionStatus = async (caseId) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        caseId,
        status: 'ACTIVE',
        turnCount: mockTurnCounts[caseId] ?? 2,
        nudgeSubmission: false,
        messages: [
          {
            id: 1,
            sender: 'AI',
            text: 'Welcome to your investigation. Before deciding whether a claim is true or false, what evidence would you want to verify first?',
            timestamp: new Date(Date.now() - 180_000).toISOString(),
          },
          {
            id: 2,
            sender: 'USER',
            text: 'I would first check who originally made the claim and whether reliable sources reported it.',
            timestamp: new Date(Date.now() - 120_000).toISOString(),
          },
          {
            id: 3,
            sender: 'AI',
            text: 'Good start. How would you judge whether a source is reliable rather than simply popular?',
            timestamp: new Date(Date.now() - 60_000).toISOString(),
          },
        ],
      });
    }, 300);
  });

const mockSendMessage = async (caseId, text) =>
  new Promise((resolve) => {
    const currentTurn = (mockTurnCounts[caseId] ?? 2) + 1;
    mockTurnCounts[caseId] = currentTurn;

    const userMsg = {
      id: ++mockIdCounter,
      sender: 'USER',
      text,
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      const aiMsg = {
        id: ++mockIdCounter,
        sender: 'AI',
        text: randomAIResponse(),
        timestamp: new Date().toISOString(),
      };

      // Simulate the backend's nudgeSubmission flag — triggers around
      // turn 5 (the backend decides; this mock just approximates it).
      const nudgeSubmission = currentTurn >= 5;

      resolve({
        userMsg,
        aiMsg,
        turnCount: currentTurn,
        nudgeSubmission,
      });
    }, 800 + Math.random() * 1200);
  });

// ---------------------------------------------------------------------------
// Real API implementations
//
// Contract (DS v1.0 / API Blueprint §5):
//   GET  /investigations/{caseId}/status   → { caseId, status, messages[],
//                                              turnCount, nudgeSubmission }
//   POST /investigations/{caseId}/messages  → ChatMessageResponse
//        Body: { caseId, text }
//        Resp: { aiReply, turnCount, nudgeSubmission }
//
// All requests go through the shared apiClient which attaches the JWT and
// normalizes errors via the ApiErrorResponse interceptor.
// ---------------------------------------------------------------------------

const realGetSessionStatus = async (caseId) => {
  const response = await apiClient.get(`/investigations/${caseId}/status`);
  return response.data;
};

const realSendMessage = async (caseId, text) => {
  const response = await apiClient.post(
    `/investigations/${caseId}/messages`,
    { caseId, text },
  );
  return response.data;
};

// ---------------------------------------------------------------------------
// Public API — delegates to mock or real based on USE_MOCK flag
// ---------------------------------------------------------------------------

/**
 * Check whether an investigation session already exists for a case.
 * Returns the session status, conversation history, turn count, and
 * nudgeSubmission flag.
 *
 * @param {string|number} caseId - The case to check
 * @returns {Promise<{
 *   caseId: string,
 *   status: string,
 *   turnCount: number,
 *   nudgeSubmission: boolean,
 *   messages: object[]
 * }>}
 */
export const getSessionStatus = USE_MOCK ? mockGetSessionStatus : realGetSessionStatus;

/**
 * Send a user message within an investigation and receive an AI reply.
 *
 * Mock mode returns { userMsg, aiMsg, turnCount, nudgeSubmission }.
 * Real mode returns the raw ChatMessageResponse from the API:
 *   { aiReply, turnCount, nudgeSubmission }
 *
 * @param {string|number} caseId - The case being investigated
 * @param {string} text          - The user's message text
 * @returns {Promise<object>}
 */
export const sendMessage = USE_MOCK ? mockSendMessage : realSendMessage;
