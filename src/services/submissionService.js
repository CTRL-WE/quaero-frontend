import apiClient from '../api/apiClient';

// ---------------------------------------------------------------------------
// Environment flag
// ---------------------------------------------------------------------------
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// ---------------------------------------------------------------------------
// Mock implementation
//
// Simulates the Gemini grading step with a realistic delay (2-4 s).
// Returns a SubmissionFeedbackResponse that mirrors the backend contract.
// ---------------------------------------------------------------------------

// Track which cases have already been submitted in mock mode
const mockSubmitted = new Set();

const mockSubmit = async (caseId, { verdict, rationale, evidenceLinks }) => {
  // Simulate 409 — SessionAlreadySubmittedException
  if (mockSubmitted.has(caseId)) {
    const err = new Error('Investigation already submitted.');
    err.response = {
      status: 409,
      data: {
        code: 'SESSION_ALREADY_SUBMITTED',
        message: 'You have already submitted your reasoning for this case.',
      },
    };
    throw err;
  }

  return new Promise((resolve) => {
    // Simulate Gemini grading latency (2-4 s)
    const delay = 2000 + Math.random() * 2000;

    setTimeout(() => {
      mockSubmitted.add(caseId);

      resolve({
        submissionId: `sub-${Date.now()}`,
        caseId,
        verdict,
        score: Math.floor(60 + Math.random() * 35), // 60-94
        grade: 'B+',
        feedback:
          'Your investigation demonstrated solid critical thinking. ' +
          'You correctly identified primary sources and evaluated their ' +
          'reliability before drawing conclusions. Consider broadening ' +
          'your evidence base with cross-referenced data in future cases.',
        strengths: [
          'Systematic source verification',
          'Clear reasoning chain from evidence to conclusion',
        ],
        improvements: [
          'Explore alternative interpretations of the evidence',
          'Quantify confidence levels for each piece of evidence',
        ],
      });
    }, delay);
  });
};

// ---------------------------------------------------------------------------
// Real API implementation
//
// Contract (Implementation Blueprint — Submission DTOs):
//   POST /cases/{caseId}/submissions
//   Body:  SubmissionRequest  { verdict, rationale, evidenceLinks }
//   Resp:  SubmissionFeedbackResponse
//          { submissionId, caseId, verdict, score, grade, feedback,
//            strengths[], improvements[] }
//
// 409  → SessionAlreadySubmittedException (code: SESSION_ALREADY_SUBMITTED)
// ---------------------------------------------------------------------------

const realSubmit = async (caseId, { verdict, rationale, evidenceLinks }) => {
  const response = await apiClient.post(`/cases/${caseId}/submissions`, {
    verdict,
    rationale,
    evidenceLinks,
  });
  return response.data;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Submit an investigation's reasoning for grading.
 *
 * @param {string|number} caseId
 * @param {{
 *   verdict:       string,
 *   rationale:     string,
 *   evidenceLinks: string,
 * }} payload — matches SubmissionRequest DTO
 * @returns {Promise<import('./submissionService').SubmissionFeedbackResponse>}
 * @throws On 409 (already submitted) or other API errors
 */
export const submitInvestigation = USE_MOCK ? mockSubmit : realSubmit;
