import { Navigate, Outlet } from 'react-router-dom';

const TOKEN_KEY = 'quaero_token';

/**
 * Wraps routes that require authentication.
 * Redirects to /login if no token is found in localStorage.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
