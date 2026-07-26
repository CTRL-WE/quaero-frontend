import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';

// ---------------------------------------------------------------------------
// Placeholder pages — swap these out as real pages are built
// ---------------------------------------------------------------------------
const HomePage = () => <div>Home Page (placeholder)</div>;
const ProfilePage = () => <div>Profile Page (placeholder)</div>;
const NotFoundPage = () => <div>404 — Page Not Found</div>;

// ---------------------------------------------------------------------------
// Route tree
// ---------------------------------------------------------------------------
const router = createBrowserRouter([
  // Public routes wrapped in AuthLayout
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },

  // Protected routes — require a valid token
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },

  // 404 catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// ---------------------------------------------------------------------------
// AppRouter — mount this once at the top of the component tree
// ---------------------------------------------------------------------------
const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
