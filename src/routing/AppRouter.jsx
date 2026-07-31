import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';
import FeedPage from '../pages/FeedPage';
import BriefPage from '../pages/BriefPage';
import ChatPage from '../pages/ChatPage';
import SubmissionPage from '../pages/SubmissionPage';
import FeedbackPage from '../pages/FeedbackPage';
import ProfilePage from '../pages/ProfilePage';
import LeaderboardPage from '../pages/LeaderboardPage';
import BoardPage from '../pages/BoardPage';

// ---------------------------------------------------------------------------
// Placeholder pages — swap these out as real pages are built
// ---------------------------------------------------------------------------
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
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <FeedPage />,
          },
          {
            path: '/cases/:id/brief',
            element: <BriefPage />,
          },
          {
            path: '/cases/:id/investigate',
            element: <ChatPage />,
          },
          {
            path: '/submit',
            element: <SubmissionPage />,
          },
          {
            path: '/feedback',
            element: <FeedbackPage />,
          },
          {
            path: '/cases/:id/board',
            element: <BoardPage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/leaderboard',
            element: <LeaderboardPage />,
          },
        ],
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
