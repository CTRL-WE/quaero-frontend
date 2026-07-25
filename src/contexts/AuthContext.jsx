import { createContext, useContext, useState, useEffect } from 'react';

const TOKEN_KEY = 'quaero_token';

// Create the context
const AuthContext = createContext(undefined);

/**
 * Safely decodes a JWT payload.
 * @param {string} token 
 * @returns {object|null}
 */
const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

/**
 * AuthProvider component that wraps the children with AuthContext.Provider.
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    const initialToken = localStorage.getItem(TOKEN_KEY);
    return initialToken ? decodeJWT(initialToken) : null;
  });

  const login = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    setToken(token);
    if (userData) {
      setUser(userData);
    } else {
      setUser(decodeJWT(token));
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  // Sync state if localStorage changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === TOKEN_KEY) {
        const newToken = e.newValue;
        setToken(newToken);
        setUser(newToken ? decodeJWT(newToken) : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the AuthContext.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
