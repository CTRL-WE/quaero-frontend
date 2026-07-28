import { useState, useEffect, useCallback } from 'react';
import { getProfile } from '../services/profileService';
import RankBadge from '../components/RankBadge';

/* ── Icons for reserved sections ─────────────────────────────────── */

function TrophyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 22V14M14 22V14" />
      <path d="M18 2H6v7a6 6 0 006 6 6 6 0 006-6V2z" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15l-3.5 2 1-4L6 10l4-.5L12 6l2 3.5 4 .5-3.5 3 1 4z" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function LeaderboardIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="14" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="14" rx="1" />
      <rect x="16" y="11" width="4" height="11" rx="1" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4.97 0 7-3.58 7-7 0-3-1.5-5.5-3-7.5-.7-.93-1.4-1.78-2-2.73-.4-.63-.78-1.3-1-2.02 0 0-1 1.62-1.5 2.75-.58 1.3-1.5 2.6-2.5 3.75C7.5 11 6 13 5.5 15c-.36 1.43-.5 3 .5 4.5 1.06 1.57 3.15 2.5 6 2.5z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

/* ── ReservedSection — "Coming soon" placeholder block ───────────── */

function ReservedSection({ title, icon }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-dashed border-gray-700
                 bg-gray-950/50 px-4 py-4"
    >
      {/* Section icon */}
      <span className="text-gray-600">{icon}</span>

      {/* Title */}
      <span className="text-sm font-medium text-gray-500">{title}</span>

      {/* Spacer */}
      <span className="flex-1" />

      {/* Coming soon pill */}
      <span
        className="inline-flex items-center gap-1 rounded-full bg-gray-800/60
                   px-2.5 py-0.5 text-[11px] font-medium leading-none text-gray-500
                   ring-1 ring-gray-700/50"
      >
        <LockIcon />
        Coming soon
      </span>
    </div>
  );
}

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
          className="min-h-[44px] w-full sm:w-auto rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white
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
    <section className="flex flex-1 items-start justify-center px-4 py-6 sm:py-12 sm:px-6">
      <div
        className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900
                    p-5 sm:p-8 shadow-lg"
      >
        {/* Avatar placeholder + username */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full
                        bg-blue-500/10 text-2xl font-bold text-blue-400 ring-2 ring-blue-500/25"
          >
            {(username ?? '?')[0].toUpperCase()}
          </div>

          <h1 className="text-xl font-bold tracking-tight text-gray-100 truncate max-w-full">
            {username ?? 'Unknown'}
          </h1>

          <RankBadge rank={rank ?? 'Unranked'} />
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {/* Total XP */}
          <div
            className="flex flex-col items-center rounded-xl border border-gray-800
                        bg-gray-950 px-2 sm:px-4 py-5"
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
                        bg-gray-950 px-2 sm:px-4 py-5"
          >
            <span className="text-2xl font-bold text-gray-100">
              {credibilityScore ?? 0}
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Credibility
            </span>
          </div>
        </div>

        {/* ── Reserved future sections ── */}
        <div className="mt-8 space-y-4">
          <ReservedSection title="Achievements" icon={<TrophyIcon />} />
          <ReservedSection title="Badges" icon={<BadgeIcon />} />
          <ReservedSection title="Leaderboard" icon={<LeaderboardIcon />} />
          <ReservedSection title="Daily Streak" icon={<FlameIcon />} />
          <ReservedSection title="Season Progress" icon={<CalendarIcon />} />
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
