import { Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';

const AuthLayout = () => (
  <div className="bg-halftone min-h-screen flex items-center justify-center px-4">
    <div
      className="w-full max-w-md p-5 sm:p-8"
      style={{
        background: 'var(--color-comic-paper)',
        border: '4px solid var(--color-comic-ink)',
        borderRadius: 6,
        boxShadow: '8px 8px 0 var(--color-comic-ink)',
      }}
    >
      {/* Brand mark */}
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="Quaero logo" className="h-[60px] w-auto" />
      </div>

      {/* Page content (Login / Signup) */}
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
