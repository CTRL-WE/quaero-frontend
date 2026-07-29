/**
 * ReferencePostStrip — collapsed, non-scrolling strip at the top of the
 * Investigation Workspace showing the original post's claim being investigated.
 *
 * Persistent so the user can glance back at what they're investigating
 * without navigating away from the workspace.
 *
 * @param {{
 *   brief:   { id: string, claim: string, publicEvidence?: string } | null,
 *   loading: boolean,
 *   caseId:  string,
 * }} props
 */
function ReferencePostStrip({ brief, loading, caseId }) {
  if (loading) {
    return (
      <div className="shrink-0 border-b border-gray-800/60 bg-gray-900/40 px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-gray-800" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-800" />
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-gray-800/60" />
          </div>
        </div>
      </div>
    );
  }

  if (!brief) return null;

  return (
    <div className="shrink-0 border-b border-gray-800/60 bg-gray-900/40 px-4 py-2.5 sm:px-5">
      <div className="flex items-center gap-3">
        {/* Thumbnail placeholder — small icon badge representing the case */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4.5 w-4.5 text-indigo-400"
          >
            <path
              fillRule="evenodd"
              d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Claim text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200 leading-snug truncate">
            {brief.claim}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500">
            Case {caseId}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReferencePostStrip;
