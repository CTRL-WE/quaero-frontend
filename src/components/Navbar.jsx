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
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-6 shrink-0">
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
      <nav className="flex items-center gap-5">
        <Link
          to="/profile"
          className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          Profile
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700
                     bg-gray-800 px-3.5 py-1.5 text-sm font-medium text-gray-300
                     transition-all hover:border-red-500/50 hover:bg-red-500/10
                     hover:text-red-400"
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
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
