// import apiClient from '../api/apiClient';

const MOCK_DELAY = 1500;

// TODO: replace with real apiClient call once Submission endpoint is live
// export async function submit(caseId, verdict, rationale, evidenceLinks) {
//   const { data } = await apiClient.post(`/cases/${caseId}/submissions`, {
//     verdict,
//     rationale,
//     evidenceLinks,
//   });
//   return data;
// }

/**
 * Submit an investigation's findings for grading.
 *
 * @param {string} _caseId        – the case being investigated (unused in mock)
 * @param {string} _verdict       – TRUE | FALSE | MISLEADING | UNVERIFIABLE
 * @param {string} _rationale     – free-text reasoning from the investigator
 * @param {string} _evidenceLinks – newline-separated evidence string
 * @returns {Promise<{
 *   reasoningScore: number,
 *   xpEarned: number,
 *   updatedCredibility: number,
 *   groundTruth: string,
 *   explanation: string,
 *   trustedReferences: string[],
 *   learningSummary: string,
 * }>}
 */
export function submit(_caseId, _verdict, _rationale, _evidenceLinks) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reasoningScore: 78,
        xpEarned: 45,
        updatedCredibility: 82.3,
        groundTruth:
          'The claim is partially misleading \u2014 while the memos are real, the context around Medicare upcoding was omitted.',
        explanation:
          'Your reasoning correctly identified the need for source verification, though evidence depth could improve.',
        trustedReferences: [
          'https://example.com/cms-audit-report',
          'https://example.com/healthcare-fraud-database',
        ],
        learningSummary:
          'Always check whether leaked documents are presented with full context before drawing conclusions.',
      });
    }, MOCK_DELAY);
  });
}
