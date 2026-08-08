import { useState, useEffect, useCallback } from 'react';
import { getFeed } from '../services/caseService';
import CaseCard from '../components/CaseCard';
import { DetectiveMascot } from '../components/comic';

/* ── Starburst seal (rendered only when there's a new case today) ── */

function Starburst() {
  return (
    <div
      className="relative ml-auto flex h-16 w-16 shrink-0 items-center justify-center"
      aria-label="New case today"
    >
      <div
        className="absolute inset-0 bg-comic-red"
        style={{
          clipPath:
            'polygon(50% 0%, 61% 11%, 78% 4%, 76% 22%, 97% 24%, 87% 39%, 100% 50%, 87% 61%, 97% 76%, 76% 78%, 78% 96%, 61% 89%, 50% 100%, 39% 89%, 22% 96%, 24% 78%, 3% 76%, 13% 61%, 0% 50%, 13% 39%, 3% 24%, 24% 22%, 22% 4%, 39% 11%)',
          transform: 'rotate(15deg)',
        }}
      />
      <span className="relative z-10 text-center font-display text-[10px] leading-tight text-white">
        NEW CASE
        <br />
        TODAY!
      </span>
    </div>
  );
}

/* ── Page component ─────────────────────────────────────────────── */

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

  /* Does any uncompleted case have a publishedAt matching today? */
  const hasNewCaseToday = cases.some((c) => {
    if (c.completed) return false;
    const pub = new Date(c.publishedAt);
    const now = new Date();
    return pub.toDateString() === now.toDateString();
  });

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="bg-halftone flex flex-1 items-center justify-center p-10">
        <svg
          className="h-8 w-8 animate-spin text-comic-red"
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
        <span className="ml-3 text-sm font-bold text-comic-ink">
          Loading case files…
        </span>
      </div>
    );
  }

  /* ---------- Error state ---------- */
  if (error) {
    return (
      <div className="bg-halftone flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <div
          className="w-full max-w-md border-comic bg-comic-paper
                      px-5 py-4 text-center text-sm font-bold text-comic-red"
        >
          {error}
        </div>
        <button
          type="button"
          onClick={fetchFeed}
          className="min-h-[44px] w-full sm:w-auto rounded-lg border-[3px] border-comic-ink
                     bg-comic-red px-5 py-2 text-sm font-bold text-white
                     shadow-comic-sm comic-press"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---------- Empty state ---------- */
  if (cases.length === 0) {
    return (
      <div className="bg-halftone flex flex-1 items-center justify-center p-10">
        <DetectiveMascot size={48} />
        <p className="ml-4 font-display text-lg text-comic-ink/50">
          No case files to investigate yet.
        </p>
      </div>
    );
  }

  /* ---------- Feed grid ---------- */
  return (
    <section className="bg-halftone min-h-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Headline area ── */}
        <div className="flex items-center gap-4 mb-10">
          <DetectiveMascot size={56} />
          <h1 className="font-display text-3xl sm:text-4xl text-comic-ink tracking-wide">
            Open Case Files
          </h1>
          {hasNewCaseToday && <Starburst />}
        </div>

        {/* ── Case grid ── */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <CaseCard key={c.id} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeedPage;

