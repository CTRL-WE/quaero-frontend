// import apiClient from '../api/apiClient';

const MOCK_DELAY = 400;

const mockProfile = {
  username: 'testuser',
  totalXp: 240,
  credibilityScore: 78.5,
  rank: 'Investigator',
};

// TODO: replace with real apiClient call once Profile endpoint is live
// export async function getProfile() {
//   const { data } = await apiClient.get('/profile');
//   return data;
// }
export function getProfile() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProfile), MOCK_DELAY);
  });
}
