import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-4 sm:px-6 shrink-0">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 group">
        <span
          className="text-lg font-bold tracking-wide text-white
                     transition-colors group-hover:text-blue-400"
        >
          Quaero
        </span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right-side actions */}
      <nav className="flex items-center gap-3 sm:gap-5">
        {/* Profile — icon-only on mobile, icon+text on sm+ */}
        <Link
          to="/profile"
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px]
                     text-sm font-medium text-gray-400 transition-colors hover:text-white"
          aria-label="Profile"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="hidden sm:inline">Profile</span>
        </Link>

        {/* Leaderboard — icon-only on mobile, icon+text on sm+ */}
        <Link
          to="/leaderboard"
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px]
                     text-sm font-medium text-gray-400 transition-colors hover:text-white"
          aria-label="Leaderboard"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 11h-.5A3.375 3.375 0 009 14.25v4.5m7.5 0h-6M6 9H4.5a2.25 2.25 0 01-2.25-2.25v0A2.25 2.25 0 014.5 4.5H6v4.5zm12 0h1.5a2.25 2.25 0 002.25-2.25v0A2.25 2.25 0 0019.5 4.5H18v4.5zM6 4.5h12V9a6 6 0 01-12 0V4.5z"
            />
          </svg>
          <span className="hidden sm:inline">Leaderboard</span>
        </Link>

        {/* Logout — icon-only on mobile, icon+text on sm+ */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-700
                     bg-gray-800 min-h-[44px] px-3 sm:px-3.5 py-1.5 text-sm font-medium text-gray-300
                     transition-all hover:border-red-500/50 hover:bg-red-500/10
                     hover:text-red-400"
          aria-label="Logout"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
