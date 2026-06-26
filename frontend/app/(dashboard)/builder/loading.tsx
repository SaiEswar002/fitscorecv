/**
 * Shown while /builder fetches/creates the latest resume and redirects.
 * Matches the split-pane layout so there's no jarring layout shift.
 */
export default function BuilderLoading() {
  return (
    <div className="flex items-center justify-center"
      style={{ height: "calc(100vh - 56px)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse"
          style={{ background: "var(--color-badge-bg)" }}>
          <svg className="w-5 h-5 animate-spin" style={{ color: "var(--color-cta)" }}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
          Opening your resume…
        </p>
      </div>
    </div>
  );
}
