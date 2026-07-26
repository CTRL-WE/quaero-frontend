import { useNavigate } from 'react-router-dom';

function CaseCard({ id, claim, evidenceTeaser, completed }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/cases/${id}/brief`)}
      className="relative w-full text-left rounded-2xl border border-gray-800 bg-gray-900
                 p-5 shadow-sm transition-all duration-200
                 hover:shadow-md hover:border-blue-500/50 hover:-translate-y-0.5
                 focus-visible:outline-2 focus-visible:outline-blue-500"
    >
      {completed && (
        <span
          className="absolute top-3 right-3 inline-flex items-center gap-1
                     rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium
                     text-emerald-400 ring-1 ring-emerald-500/25"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          Completed
        </span>
      )}

      <h3 className="pr-24 text-base font-semibold text-gray-100 leading-snug">
        {claim}
      </h3>

      <p className="mt-2 text-sm text-gray-400 line-clamp-2">
        {evidenceTeaser}
      </p>
    </button>
  );
}

export default CaseCard;
