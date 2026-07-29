/**
 * EvidenceLocker — placeholder panel for the Investigation Workspace.
 *
 * Will be fully implemented in Prompt 5. For now renders a styled
 * empty-state to hold the panel's place in the 4-panel layout.
 *
 * Follows v1 Section 1 tokens: dark layered surface, hairline border,
 * soft radius, sentence case.
 */
function EvidenceLocker() {
  return (
    <div className="flex flex-col bg-gray-950/50 flex-1">
      {/* Panel header */}
      <div className="shrink-0 border-b border-gray-800/60 px-4 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Evidence locker
        </h2>
      </div>

      {/* Placeholder body */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-800/60 border border-gray-700/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 text-gray-600"
          >
            <path d="M3.196 12.87l-.825.483a.75.75 0 0 0 0 1.294l7.004 4.086a1.5 1.5 0 0 0 1.25 0l7.004-4.086a.75.75 0 0 0 0-1.294l-.825-.484-5.554 3.243a2.5 2.5 0 0 1-2.5 0L3.196 12.87Z" />
            <path d="M3.196 8.87l-.825.483a.75.75 0 0 0 0 1.294l7.004 4.086a1.5 1.5 0 0 0 1.25 0l7.004-4.086a.75.75 0 0 0 0-1.294l-.825-.484-5.554 3.243a2.5 2.5 0 0 1-2.5 0L3.196 8.87Z" />
            <path d="M10.625 2.458a1.5 1.5 0 0 0-1.25 0L2.37 6.544a.75.75 0 0 0 0 1.294l7.004 4.086a1.5 1.5 0 0 0 1.25 0l7.004-4.086a.75.75 0 0 0 0-1.294l-7.004-4.086Z" />
          </svg>
        </div>
        <p className="text-xs font-medium text-gray-500">
          No evidence collected yet
        </p>
        <p className="mt-1 max-w-[180px] text-[11px] leading-relaxed text-gray-600">
          Evidence items you gather during your investigation will appear here.
        </p>
      </div>
    </div>
  );
}

export default EvidenceLocker;
