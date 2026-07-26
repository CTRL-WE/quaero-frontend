import { useState, useEffect, useCallback } from 'react';
import { getProfile } from '../services/profileService';
import RankBadge from '../components/RankBadge';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ---------- Loading ---------- */
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
        <span className="ml-3 text-sm text-gray-400">Loading profile…</span>
      </div>
    );
  }

  /* ---------- Error ---------- */
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
          onClick={fetchProfile}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white
                     transition-colors hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---------- Profile card ---------- */
  const { username, totalXp, credibilityScore, rank } = profile ?? {};

  return (
    <section className="flex flex-1 items-start justify-center px-4 py-12 sm:px-6">
      <div
        className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900
                    p-8 shadow-lg"
      >
        {/* Avatar placeholder + username */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full
                        bg-blue-500/10 text-2xl font-bold text-blue-400 ring-2 ring-blue-500/25"
          >
            {(username ?? '?')[0].toUpperCase()}
          </div>

          <h1 className="text-xl font-bold tracking-tight text-gray-100">
            {username ?? 'Unknown'}
          </h1>

          <RankBadge rank={rank ?? 'Unranked'} />
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {/* Total XP */}
          <div
            className="flex flex-col items-center rounded-xl border border-gray-800
                        bg-gray-950 px-4 py-5"
          >
            <span className="text-2xl font-bold text-gray-100">
              {totalXp ?? 0}
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Total XP
            </span>
          </div>

          {/* Credibility Score */}
          <div
            className="flex flex-col items-center rounded-xl border border-gray-800
                        bg-gray-950 px-4 py-5"
          >
            <span className="text-2xl font-bold text-gray-100">
              {credibilityScore ?? 0}
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Credibility
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
