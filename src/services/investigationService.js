/* eslint-disable no-unused-vars */
import apiClient from '../api/apiClient';

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

const randomAIResponse = () =>
  MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];

// ---------------------------------------------------------------------------
// Placeholder methods — return mock promises so the UI can be developed
// independently of the backend.  Swap in the commented-out Axios calls
// once the real investigation API is live.
// ---------------------------------------------------------------------------

/**
 * Start a new investigation session for a given case.
 *
 * @param {string|number} caseId - The case to investigate
 * @returns {Promise<{ sessionId: string, caseId: string|number, status: string, createdAt: string }>}
 */
export const startSession = async (caseId) => {
  // TODO: replace with real apiClient call once Investigation endpoint is live
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sessionId: `session-${Date.now()}`,
        caseId,
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }, 400);
  });
};

/*
// Real Axios implementation:
export const startSession = async (caseId) => {
  const response = await apiClient.post('/investigations/sessions', { caseId });
  return response.data;
};
*/

/**
 * Send a user message within an investigation session and receive an AI reply.
 *
 * @param {string} sessionId - Active session identifier
 * @param {string} text      - The user's message text
 * @returns {Promise<{ userMsg: object, aiMsg: object }>}
 */
export const sendMessage = async (sessionId, text) => {
  // TODO: replace with real apiClient call once Investigation endpoint is live
  return new Promise((resolve) => {
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
      resolve({ userMsg, aiMsg });
    }, 800 + Math.random() * 1200); // 0.8–2s simulated latency
  });
};

/*
// Real Axios implementation:
export const sendMessage = async (sessionId, text) => {
  const response = await apiClient.post(
    `/investigations/${sessionId}/messages`,
    { text },
  );
  return response.data;
};
*/

/**
 * Retrieve an existing investigation session and its message history.
 *
 * @param {string} sessionId - Session to fetch
 * @returns {Promise<{ sessionId: string, caseId: string, status: string, messages: object[] }>}
 */
export const getSession = async (sessionId) => {
  // TODO: replace with real apiClient call once Investigation endpoint is live
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sessionId,
        caseId: '1024',
        status: 'active',
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
};

/*
// Real Axios implementation:
export const getSession = async (sessionId) => {
  const response = await apiClient.get(`/investigations/${sessionId}`);
  return response.data;
};
*/
