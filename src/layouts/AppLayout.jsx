import { Outlet } from 'react-router-dom';

const Navbar = () => (
  <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-6 shrink-0">
    <span className="text-white font-semibold text-lg tracking-wide">Quaero</span>
    {/* TODO: replace with real Navbar component */}
  </header>
);

const AppLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
    <Navbar />
    <main className="flex-1 flex flex-col overflow-auto">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
