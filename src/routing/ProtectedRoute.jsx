import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Wraps routes that require authentication.
 * Redirects to /login if no token is found in AuthContext.
 */
const ProtectedRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
