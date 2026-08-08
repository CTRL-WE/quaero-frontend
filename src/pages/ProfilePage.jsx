import { useState, useEffect, useCallback } from 'react';
import { getProfile } from '../services/profileService';
import { getRankTier } from '../utils/rankTiers';
import { ComicPanel } from '../components/comic';
import ReputationCard from '../components/ReputationCard';
import CredibilityIndicator from '../components/CredibilityIndicator';
import XPProgressCard from '../components/XPProgressCard';

/* ── Badge shelf placeholder icons (SVG medal shapes) ─────────────── */

function MedalIcon({ shape = 'star' }) {
  const paths = {
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01z',
    shield: 'M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z',
    magnifier: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z',
    eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
    trophy: 'M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 22V14M14 22V14M18 2H6v7a6 6 0 006 6 6 6 0 006-6V2z',
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="var(--color-comic-ink)"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[shape] ?? paths.star} />
    </svg>
  );
}

/* ── Classified placeholder for future sections ───────────────────── */

function ClassifiedSection({ title }) {
  return (
    <div className="classified-placeholder">
      <span className="classified-stamp">Classified</span>
      <span
        style={{
          flex: 1,
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'var(--color-comic-ink)',
        }}
      >
        {title}
      </span>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */

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
          className="h-8 w-8 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          style={{ color: 'var(--color-comic-brown)' }}
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
        <span
          className="ml-3 text-sm"
          style={{ color: 'var(--color-comic-ink)', opacity: 0.6 }}
        >
          Opening dossier…
        </span>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <ComicPanel rotate={-1}>
          <div
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              color: 'var(--color-comic-red)',
              padding: '8px 16px',
            }}
          >
            ⚠ {error}
          </div>
        </ComicPanel>
        <button
          type="button"
          onClick={fetchProfile}
          className="comic-press min-h-[44px] rounded-sm px-5 py-2 font-bold text-sm uppercase tracking-wider"
          style={{
            background: 'var(--color-comic-red)',
            color: 'white',
            border: '3px solid var(--color-comic-ink)',
            boxShadow: '4px 4px 0 var(--color-comic-ink)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---------- Profile dossier ---------- */
  const {
    username,
    totalXp,
    credibility,
    leaderboardPosition,
    completedInvestigations,
  } = profile ?? {};

  const rankTier = totalXp !== undefined ? getRankTier(totalXp) : undefined;

  return (
    <section className="flex flex-1 items-start justify-center px-4 py-6 sm:py-12 sm:px-6">
      <div className="w-full max-w-md space-y-5">

        {/* ── Dossier heading ── */}
        <ComicPanel rotate={-0.5}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              letterSpacing: '0.05em',
              color: 'var(--color-comic-ink)',
              textAlign: 'center',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            Detective Dossier
          </h1>
        </ComicPanel>

        {/* ── ID card (ReputationCard) ── */}
        <ReputationCard
          xp={totalXp}
          credibility={credibility}
          rankTier={rankTier}
          leaderboardPosition={leaderboardPosition}
          username={username}
          completedInvestigations={completedInvestigations}
        />

        {/* ── Credibility gauge ── */}
        <ComicPanel rotate={0.8}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-comic-ink)',
              opacity: 0.5,
              marginBottom: 8,
            }}
          >
            Credibility Assessment
          </div>
          <div className="flex justify-center">
            <CredibilityIndicator credibility={credibility} />
          </div>
        </ComicPanel>

        {/* ── Rank progress tally ── */}
        <ComicPanel rotate={-0.3}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-comic-ink)',
              opacity: 0.5,
              marginBottom: 8,
            }}
          >
            Rank Progress
          </div>
          <XPProgressCard totalXp={totalXp} />
        </ComicPanel>

        {/* ── Badge shelf (stub) ── */}
        <ComicPanel rotate={0.4}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-comic-ink)',
              opacity: 0.5,
              marginBottom: 8,
            }}
          >
            Badge Shelf
          </div>
          {/* TODO: wire to real badge data once available */}
          <div className="badge-shelf">
            <div className="badge-slot"><MedalIcon shape="star" /></div>
            <div className="badge-slot"><MedalIcon shape="shield" /></div>
            <div className="badge-slot"><MedalIcon shape="magnifier" /></div>
            <div className="badge-slot"><MedalIcon shape="eye" /></div>
            <div className="badge-slot"><MedalIcon shape="trophy" /></div>
          </div>
        </ComicPanel>

        {/* ── Classified future sections ── */}
        <div className="space-y-3">
          <ClassifiedSection title="Daily Streak" />
          <ClassifiedSection title="Season Progress" />
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
