import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// ---------------------------------------------------------------------------
// Placeholder pages — swap these out as real pages are built
// ---------------------------------------------------------------------------
const HomePage = () => <div>Home Page (placeholder)</div>;
const LoginPage = () => <div>Login Page (placeholder)</div>;
const SignupPage = () => <div>Signup Page (placeholder)</div>;
const ProfilePage = () => <div>Profile Page (placeholder)</div>;
const NotFoundPage = () => <div>404 — Page Not Found</div>;

// ---------------------------------------------------------------------------
// Route tree
// ---------------------------------------------------------------------------
const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
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
