import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getLeaderboard } from '../services/leaderboardService';
import LeaderboardTable from '../components/LeaderboardTable';

/**
 * LeaderboardPage — fetches and displays the leaderboard.
 *
 * Rendered inside AppLayout via the router <Outlet />.
 * Uses useAuth().user to determine the current user's username
 * for row-highlighting in LeaderboardTable.
 */

function LeaderboardPage() {
  const { user } = useAuth();
  const currentUsername = user?.sub ?? user?.username ?? null;

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();
      setEntries(data);
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return (
    <section className="flex flex-1 items-start justify-center px-4 py-6 sm:py-12 sm:px-6">
      <div className="w-full max-w-2xl space-y-5">
        {/* ── Header row ── */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-gray-100">
            Leaderboard
          </h1>

          <button
            type="button"
            onClick={fetchLeaderboard}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-hairline
                       bg-surface-card px-3 py-1.5 text-xs font-medium text-text-secondary
                       transition-colors hover:bg-surface-overlay hover:text-text-primary
                       disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh leaderboard"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            Refresh
          </button>
        </div>

        {/* ── Table ── */}
        <LeaderboardTable
          entries={entries}
          isLoading={loading}
          error={error}
          currentUsername={currentUsername}
          onRetry={fetchLeaderboard}
        />
      </div>
    </section>
  );
}

export default LeaderboardPage;
