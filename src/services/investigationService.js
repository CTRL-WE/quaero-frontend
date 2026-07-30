// import apiClient from '../api/apiClient';

const MOCK_DELAY = 1200;
const SOFT_NUDGE_TURN = 5;

/* ── Mock AI replies — cycled through for demo purposes ───────────── */

const MOCK_REPLIES = [
  'That\'s an interesting point \u2014 what would you check to confirm it?',
  'How could you verify that this source is trustworthy rather than just popular?',
  'What would change about your conclusion if that piece of evidence turned out to be false?',
  'Can you think of an alternative explanation that fits the same facts?',
  'Good reasoning. What\'s the strongest counter-argument someone could make?',
  'Is there a primary source you could consult to corroborate this?',
  'How does this new piece of evidence relate to what you found earlier?',
  'What gaps remain in your analysis before you\'d feel confident submitting?',
];

let mockReplyIndex = 0;

// TODO: replace with real apiClient call once Investigation endpoint is live
// export async function sendMessage(caseId, messageText) {
//   const { data } = await apiClient.post(
//     `/investigations/${caseId}/messages`,
//     { message: messageText },
//   );
//   return data;
// }

/**
 * Simulate sending a user message and receiving an AI mentor reply.
 *
 * @param {string}  _caseId      – the case being investigated (unused in mock)
 * @param {string}  _messageText – the user's message (unused in mock)
 * @param {number}  currentTurn  – the user's turn count *after* this message
 * @returns {Promise<{ reply: string, turnCount: number, nudgeSubmission: boolean }>}
 */
export function sendMessage(_caseId, _messageText, currentTurn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reply = MOCK_REPLIES[mockReplyIndex % MOCK_REPLIES.length];
      mockReplyIndex += 1;

      resolve({
        reply,
        turnCount: currentTurn,
        nudgeSubmission: currentTurn >= SOFT_NUDGE_TURN,
      });
    }, MOCK_DELAY);
  });
}
