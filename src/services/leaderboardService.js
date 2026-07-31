// import apiClient from '../api/apiClient';

const MOCK_DELAY = 500;

// Pre-sorted by credibility desc, then xp desc. Positions match index + 1.
// 'testuser' matches the mocked profile in profileService.js for isCurrentUser testing.
const mockLeaderboard = [
  { username: 'guardian_prime', position: 1, xp: 2150, credibility: 96.2, completedInvestigations: 34 },
  { username: 'factchecker99', position: 2, xp: 1820, credibility: 93.8, completedInvestigations: 28 },
  { username: 'clarity_seeker', position: 3, xp: 1340, credibility: 89.1, completedInvestigations: 22 },
  { username: 'deep_analyst', position: 4, xp: 780, credibility: 85.4, completedInvestigations: 14 },
  { username: 'testuser', position: 5, xp: 240, credibility: 78.5, completedInvestigations: 5 },
  { username: 'new_explorer', position: 6, xp: 45, credibility: 62.0, completedInvestigations: 1 },
];

// TODO: Replace with real apiClient call → GET /leaderboard (Reputation API contract).
// The response is wrapped in an ApiResponse envelope:
//   { success: boolean, data: object, message: string, timestamp: string }
// The real implementation should unwrap .data before returning.
//
// export async function getLeaderboard() {
//   const { data } = await apiClient.get('/leaderboard');
//   return data.data;
// }
export function getLeaderboard() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockLeaderboard), MOCK_DELAY);
  });
}
