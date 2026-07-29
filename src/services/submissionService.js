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

        // ---- Scoring & progression ----
        reasoningScore: Math.floor(60 + Math.random() * 35), // 60-94
        xpEarned: Math.floor(100 + Math.random() * 150),     // 100-249
        updatedCredibility: 'Rising Investigator',

        // ---- Ground truth ----
        groundTruth:
          'The claim is substantiated by publicly available records. ' +
          'Independent audits and regulatory filings confirm the core ' +
          'allegations, although the exact financial figure cited has a ' +
          '±12 % margin depending on the accounting methodology used.',

        // ---- AI evaluator's feedback (must be visually prominent) ----
        explanation:
          'Your investigation demonstrated solid critical thinking. ' +
          'You correctly identified primary sources and evaluated their ' +
          'reliability before drawing conclusions. Your reasoning chain ' +
          'was logical and well-structured, moving from source identification ' +
          'to evidence evaluation to conclusion. One area for growth: you ' +
          'could strengthen your analysis by considering alternative ' +
          'interpretations of the financial data and quantifying your ' +
          'confidence level for each piece of evidence.',

        // ---- References ----
        trustedReferences: [
          { title: 'CMS Medicare Billing Compliance Guide', url: 'https://www.cms.gov/billing-compliance' },
          { title: 'Reuters Fact Check — Hospital Billing Practices', url: 'https://www.reuters.com/fact-check/hospital-billing' },
          { title: 'GAO Report on Healthcare Fraud Indicators', url: 'https://www.gao.gov/healthcare-fraud-2024' },
        ],

        // ---- Learning summary (must be visually prominent) ----
        learningSummary:
          'This investigation reinforced the importance of cross-referencing ' +
          'official records with independent sources. When evaluating financial ' +
          'claims, always verify the methodology behind reported figures — a ' +
          'single number can tell very different stories depending on how it ' +
          'was calculated. In future investigations, try to identify at least ' +
          'two independent data points that corroborate each key finding.',

        // ---- Degraded grading (null = normal, object = degraded) ----
        // Uncomment the next line to test the degraded UI:
        // degradedGrading: { reason: 'The AI evaluator used a simplified rubric due to high demand.' },
        degradedGrading: null,
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
//          { submissionId, caseId, verdict, reasoningScore, xpEarned,
//            updatedCredibility, groundTruth, explanation,
//            trustedReferences[{title,url}], learningSummary,
//            degradedGrading?: {reason} }
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
