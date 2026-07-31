// import apiClient from '../api/apiClient';
import { getRankTier } from '../utils/rankTiers';

const MOCK_DELAY = 400;

const MOCK_TOTAL_XP = 240;

const mockProfile = {
  username: 'testuser',
  totalXp: MOCK_TOTAL_XP,
  credibility: null, // nullable — simulates a brand-new user with no credibility score yet
  completedInvestigations: 5,
  successfulSubmissions: 3,
  rankTier: getRankTier(MOCK_TOTAL_XP),
  leaderboardPosition: 42,
};

// TODO: Replace with real apiClient call → GET /profile (Reputation API contract).
// The response is wrapped in an ApiResponse envelope:
//   { success: boolean, data: object, message: string, timestamp: string }
// The real implementation should unwrap .data before returning.
//
// export async function getProfile() {
//   const { data } = await apiClient.get('/profile');
//   return data.data;
// }
export function getProfile() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProfile), MOCK_DELAY);
  });
}
