import { useAuthContext } from '../contexts/AuthContext';

/**
 * Convenience hook that imports and re-exports useAuthContext,
 * allowing pages/components to consume auth state easily.
 */
const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
