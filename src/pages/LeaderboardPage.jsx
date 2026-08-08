import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getLeaderboard } from '../services/leaderboardService';
import LeaderboardTable from '../components/LeaderboardTable';
import { ComicPanel } from '../components/comic';

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
        <ComicPanel rotate={-0.3}>
          <div className="flex items-center justify-between">
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                letterSpacing: '0.04em',
                color: 'var(--color-comic-ink)',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              Leaderboard
            </h1>

            <button
              type="button"
              onClick={fetchLeaderboard}
              disabled={loading}
              className="comic-press inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: '2px solid var(--color-comic-ink)',
                background: 'var(--color-comic-paper)',
                color: 'var(--color-comic-ink)',
                boxShadow: '2px 2px 0 var(--color-comic-ink)',
              }}
              aria-label="Refresh leaderboard"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Refresh
            </button>
          </div>
        </ComicPanel>

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
