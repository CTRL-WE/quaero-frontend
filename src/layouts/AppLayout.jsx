import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AppLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
    <Navbar />
    <main className="flex-1 flex flex-col overflow-auto">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;

