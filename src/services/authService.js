/* eslint-disable no-unused-vars */
import apiClient from '../api/apiClient';


/**
 * Mock response shape matching backend user payload.
 */
const MOCK_AUTH_RESPONSE = {
  jwt: 'mock-jwt-token',
  id: 1,
  username: 'testuser',
  role: 'USER',
};

// TODO: replace with real apiClient call once Auth endpoint is live
export const signup = async (username, email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_AUTH_RESPONSE);
    }, 500);
  });
};

/*
// Real Axios implementation to replace the mock when backend is live:
export const signup = async (username, email, password) => {
  const response = await apiClient.post('/auth/signup', { username, email, password });
  return response.data;
};
*/

// TODO: replace with real apiClient call once Auth endpoint is live
export const login = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_AUTH_RESPONSE);
    }, 500);
  });
};

/*
// Real Axios implementation to replace the mock when backend is live:
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};
*/
