import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-white'
        : 'text-gray-400 hover:text-gray-200'
    }`;

  return (
    <header className="h-14 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center px-6 shrink-0">
      <span className="text-white font-semibold text-lg tracking-wide mr-8">
        Quaero
      </span>

      <nav className="flex items-center gap-5 flex-1">
        <NavLink to="/" end className={linkClasses}>
          Home
        </NavLink>
        <NavLink to="/chat" className={linkClasses}>
          Chat
        </NavLink>
        <NavLink to="/profile" className={linkClasses}>
          Profile
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
      >
        Log out
      </button>
    </header>
  );
};

const AppLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
    <Navbar />
    <main className="flex-1 flex flex-col overflow-hidden">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;

