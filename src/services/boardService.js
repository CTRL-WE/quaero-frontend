import apiClient from '../api/apiClient';

// ---------------------------------------------------------------------------
// Environment flag
// ---------------------------------------------------------------------------
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_BOARD_ENTRIES = [
  {
    submissionId: 'sub-100',
    submitter: { username: 'You', isCurrentUser: true },
    verdict: 'CONTRADICTED',
    rationale:
      'The financial figures in the claim are based on a single whistleblower memo with no corroborating audit. The hospital chain\u2019s publicly filed CMS data shows no anomalous billing patterns for the period in question.',
    credibility: 'Rising Investigator',
    evidenceLinks:
      '[Official website] CMS Medicare Claims Database — https://www.cms.gov/claims (Collected)\n[Government source] OIG Semi-Annual Report — https://oig.hhs.gov/reports (Collected)',
    helpfulCount: 3,
    isHelpful: false,
  },
  {
    submissionId: 'sub-101',
    submitter: { username: 'investigator_al', isCurrentUser: false },
    verdict: 'SUPPORTED',
    rationale:
      'Cross-referencing CMS billing data with the whistleblower documents reveals consistent upcoding patterns across all four facilities. Three independent former employees corroborate the systematic nature of the billing changes.',
    credibility: 'Seasoned Analyst',
    evidenceLinks:
      '[Fact-check source] Reuters Healthcare Fact Check — https://reuters.com/fact-check/healthcare (Collected)',
    helpfulCount: 7,
    isHelpful: true,
  },
  {
    submissionId: 'sub-102',
    submitter: { username: 'truth_seeker_99', isCurrentUser: false },
    verdict: 'PARTIALLY_SUPPORTED',
    rationale:
      'The core allegation of overbilling appears to have merit based on the leaked memos, but the $4.3 million figure is unverifiable without access to the complete audit trail. The methodology behind that estimate is unclear.',
    credibility: 'Novice',
    evidenceLinks: '',
    helpfulCount: 1,
    isHelpful: false,
  },
];

// Track mock helpful state per submission
const mockHelpfulState = new Map(
  MOCK_BOARD_ENTRIES.map((e) => [e.submissionId, e.isHelpful]),
);

// ---------------------------------------------------------------------------
// Mock implementations
// ---------------------------------------------------------------------------

const mockGetBoard = async (caseId) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 403 for cases the user hasn't submitted for.
      // All mock case IDs are "submitted" for demo purposes.
      // To test 403, uncomment: reject(make403());
      const entries = MOCK_BOARD_ENTRIES.map((e) => ({
        ...e,
        isHelpful: mockHelpfulState.get(e.submissionId) ?? e.isHelpful,
        helpfulCount: e.helpfulCount + (mockHelpfulState.get(e.submissionId) && !e.isHelpful ? 1 : 0),
      }));
      resolve({ caseId, entries });
    }, 400);
  });

const mockToggleHelpful = async (caseId, submissionId) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const current = mockHelpfulState.get(submissionId) ?? false;
      mockHelpfulState.set(submissionId, !current);
      resolve({ submissionId, isHelpful: !current });
    }, 200);
  });

// ---------------------------------------------------------------------------
// Real API implementations
//
// Contract (Implementation Blueprint — Board DTOs):
//   GET    /cases/{caseId}/board
//          → { caseId, entries: BoardEntry[] }
//          BoardEntry: { submissionId, submitter: {username, isCurrentUser},
//                        verdict, rationale, credibility, evidenceLinks,
//                        helpfulCount, isHelpful }
//          403 → user has not submitted for this case
//
//   POST   /cases/{caseId}/board/submissions/{id}/helpful
//          → { submissionId, isHelpful: true }
//
//   DELETE /cases/{caseId}/board/submissions/{id}/helpful
//          → { submissionId, isHelpful: false }
// ---------------------------------------------------------------------------

const realGetBoard = async (caseId) => {
  const response = await apiClient.get(`/cases/${caseId}/board`);
  return response.data;
};

const realToggleHelpful = async (caseId, submissionId, currentlyHelpful) => {
  if (currentlyHelpful) {
    const response = await apiClient.delete(
      `/cases/${caseId}/board/submissions/${submissionId}/helpful`,
    );
    return response.data;
  }
  const response = await apiClient.post(
    `/cases/${caseId}/board/submissions/${submissionId}/helpful`,
  );
  return response.data;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch the investigation board for a case.
 * @param {string|number} caseId
 * @returns {Promise<{ caseId: string, entries: object[] }>}
 * @throws 403 if user hasn't submitted for this case
 */
export const getBoard = USE_MOCK ? mockGetBoard : realGetBoard;

/**
 * Toggle the helpful vote on a board submission.
 * @param {string|number} caseId
 * @param {string} submissionId
 * @param {boolean} currentlyHelpful — current state (determines POST vs DELETE)
 * @returns {Promise<{ submissionId: string, isHelpful: boolean }>}
 */
export const toggleHelpful = USE_MOCK ? mockToggleHelpful : realToggleHelpful;
