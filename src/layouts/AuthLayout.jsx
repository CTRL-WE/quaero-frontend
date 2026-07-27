import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
    <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-5 sm:p-8">
      {/* Brand mark */}
      <div className="mb-8 text-center">
        <span className="text-2xl font-bold text-white tracking-wide">Quaero</span>
      </div>

      {/* Page content (Login / Signup) */}
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
