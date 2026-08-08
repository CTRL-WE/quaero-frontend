import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { login as authServiceLogin } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await authServiceLogin(email, password);
      // Store token and user details in AuthContext
      login(data.jwt, { id: data.id, username: data.username, role: data.role });
      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            letterSpacing: '0.04em',
            color: 'var(--color-comic-ink)',
            textTransform: 'uppercase',
          }}
        >
          Log In
        </h2>
        <p
          className="mt-2 text-sm font-medium"
          style={{ color: 'var(--color-comic-ink)', opacity: 0.5 }}
        >
          Welcome back to Quaero
        </p>
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-sm text-sm mb-6 break-words font-bold"
          style={{
            background: 'rgba(224, 62, 45, 0.1)',
            border: '2px solid var(--color-comic-red)',
            color: 'var(--color-comic-red)',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--color-comic-ink)', opacity: 0.55 }}
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[44px] rounded-sm px-4 py-2.5 text-sm transition-colors duration-200 focus:outline-none"
            style={{
              background: 'white',
              border: '2px solid var(--color-comic-ink)',
              color: 'var(--color-comic-ink)',
              boxShadow: '2px 2px 0 var(--color-comic-ink)',
            }}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--color-comic-ink)', opacity: 0.55 }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full min-h-[44px] rounded-sm px-4 py-2.5 text-sm transition-colors duration-200 focus:outline-none"
            style={{
              background: 'white',
              border: '2px solid var(--color-comic-ink)',
              color: 'var(--color-comic-ink)',
              boxShadow: '2px 2px 0 var(--color-comic-ink)',
            }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="comic-press w-full min-h-[44px] flex items-center justify-center rounded-sm px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors duration-200 disabled:opacity-50 mt-2"
          style={{
            background: 'var(--color-comic-red)',
            color: 'white',
            border: '3px solid var(--color-comic-ink)',
            boxShadow: '4px 4px 0 var(--color-comic-ink)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.06em',
          }}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Logging in...</span>
            </>
          ) : (
            'Log In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm font-medium" style={{ color: 'var(--color-comic-ink)', opacity: 0.55 }}>
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-bold transition-colors duration-200 hover:opacity-70"
          style={{ color: 'var(--color-comic-blue)' }}
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
