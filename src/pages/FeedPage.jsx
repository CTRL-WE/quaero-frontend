import { useState, useEffect, useCallback } from 'react';
import { getFeed } from '../services/caseService';
import CaseCard from '../components/CaseCard';

function FeedPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeed();
      setCases(data);
    } catch (err) {
      setError(err.message || 'Something went wrong while loading cases.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <svg
          className="h-8 w-8 animate-spin text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="ml-3 text-sm text-gray-400">Loading cases…</span>
      </div>
    );
  }

  /* ---------- Error state ---------- */
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <div
          className="w-full max-w-md rounded-xl border border-red-500/30 bg-red-500/10
                      px-5 py-4 text-center text-sm text-red-400"
        >
          {error}
        </div>
        <button
          type="button"
          onClick={fetchFeed}
          className="min-h-[44px] w-full sm:w-auto rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white
                     transition-colors hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---------- Empty state ---------- */
  if (cases.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-10">
        <p className="text-sm text-gray-500">No cases published yet.</p>
      </div>
    );
  }

  /* ---------- Feed grid ---------- */
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Case Feed</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <CaseCard key={c.id} {...c} />
        ))}
      </div>
    </section>
  );
}

export default FeedPage;
