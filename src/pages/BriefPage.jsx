import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBrief } from '../services/caseService';

function BriefPage() {
  const { id: caseId } = useParams();
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getBrief(caseId);
        if (!cancelled) setBrief(data);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [caseId]);

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
        <span className="ml-3 text-sm text-gray-400">Loading brief…</span>
      </div>
    );
  }

  /* ---------- Not found ---------- */
  if (notFound || !brief) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <h1 className="text-4xl font-bold text-gray-300">404</h1>
        <p className="text-sm text-gray-500">Case not found.</p>
        <Link
          to="/"
          className="mt-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white
                     transition-colors hover:bg-blue-700"
        >
          ← Back to Feed
        </Link>
      </div>
    );
  }

  /* ---------- Brief content ---------- */
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500
                   transition-colors hover:text-gray-300"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Feed
      </Link>

      <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-100 sm:text-3xl">
        {brief.claim}
      </h1>

      <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-gray-400">
        {brief.publicEvidence}
      </p>

      {/* TODO: wire to investigation flow once built */}
      <button
        type="button"
        className="mt-10 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3
                   text-sm font-semibold text-white shadow-sm transition-all
                   hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        Start Investigation
      </button>
    </article>
  );
}

export default BriefPage;
