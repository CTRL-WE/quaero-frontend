// import apiClient from '../api/apiClient';

const MOCK_DELAY_BOARD = 500;
const MOCK_DELAY_HELPFUL = 400;

/* ── Mock board entries — varied verdicts for demo purposes ────────── */

const MOCK_BOARD_ENTRIES = [
  {
    submissionId: 'sub-001',
    submitterUsername: 'factfinder_42',
    verdict: 'FALSE',
    rationale:
      'The leaked memos are authentic, but the claim grossly misrepresents the timeline. CMS records show the billing codes were corrected six months before the article was published.',
    evidenceLinks: [
      'https://example.com/cms-billing-correction-2024',
      'https://example.com/original-memo-archive',
    ],
    submitterCredibility: 91.2,
    helpfulCount: 14,
    hasCurrentUserMarkedHelpful: false,
  },
  {
    submissionId: 'sub-002',
    submitterUsername: 'skeptic_lens',
    verdict: 'MISLEADING',
    rationale:
      'While the core documents are real, key context about the Medicare upcoding settlement was omitted. The claim cherry-picks data to support a narrative that the full record does not sustain.',
    evidenceLinks: [
      'https://example.com/medicare-settlement-summary',
    ],
    submitterCredibility: 76.5,
    helpfulCount: 8,
    hasCurrentUserMarkedHelpful: true,
  },
  {
    submissionId: 'sub-003',
    submitterUsername: 'open_inquiry',
    verdict: 'TRUE',
    rationale:
      'I cross-referenced the memos with three independent auditing reports and all figures match. The claim appears factually accurate when taken at face value.',
    evidenceLinks: [
      'https://example.com/independent-audit-2024',
      'https://example.com/financial-disclosures',
      'https://example.com/senate-hearing-transcript',
    ],
    submitterCredibility: 64.0,
    helpfulCount: 3,
    hasCurrentUserMarkedHelpful: false,
  },
  {
    submissionId: 'sub-004',
    submitterUsername: 'data_sleuth',
    verdict: 'UNVERIFIABLE',
    rationale:
      'The primary source cited in the claim is behind a paywall and the authoring organisation has not responded to verification requests. Without access to the underlying dataset, I cannot confirm or deny the figures presented.',
    evidenceLinks: [
      'https://example.com/foia-request-status',
    ],
    submitterCredibility: 83.7,
    helpfulCount: 21,
    hasCurrentUserMarkedHelpful: false,
  },
];

// TODO: replace with real apiClient call once Board endpoint is live
// export async function getBoard(caseId) {
//   const { data } = await apiClient.get(`/cases/${caseId}/board`);
//   return data;
// }

/**
 * Fetch all board submissions for a given case.
 *
 * @param {string} _caseId – the case whose board to fetch (unused in mock)
 * @returns {Promise<Array<{
 *   submissionId: string,
 *   submitterUsername: string,
 *   verdict: string,
 *   rationale: string,
 *   evidenceLinks: string[],
 *   submitterCredibility: number,
 *   helpfulCount: number,
 *   hasCurrentUserMarkedHelpful: boolean,
 * }>>}
 */
export function getBoard(_caseId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_BOARD_ENTRIES);
    }, MOCK_DELAY_BOARD);
  });
}

// TODO: replace with real apiClient calls once Board endpoint is live
// export async function toggleHelpful(caseId, submissionId, currentlyMarked) {
//   if (currentlyMarked) {
//     const { data } = await apiClient.delete(
//       `/cases/${caseId}/board/submissions/${submissionId}/helpful`,
//     );
//     return data;
//   }
//   const { data } = await apiClient.post(
//     `/cases/${caseId}/board/submissions/${submissionId}/helpful`,
//   );
//   return data;
// }

/**
 * Toggle the "helpful" mark on a board submission for the current user.
 *
 * @param {string}  _caseId        – the case (unused in mock)
 * @param {string}  _submissionId  – the submission to toggle (unused in mock)
 * @param {boolean} currentlyMarked – whether the user has already marked it helpful
 * @returns {Promise<{ helpfulCount: number, hasCurrentUserMarkedHelpful: boolean }>}
 */
export function toggleHelpful(_caseId, _submissionId, currentlyMarked) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entry = MOCK_BOARD_ENTRIES.find(
        (e) => e.submissionId === _submissionId,
      );
      const baseCount = entry ? entry.helpfulCount : 5;

      resolve({
        helpfulCount: currentlyMarked ? baseCount - 1 : baseCount + 1,
        hasCurrentUserMarkedHelpful: !currentlyMarked,
      });
    }, MOCK_DELAY_HELPFUL);
  });
}
