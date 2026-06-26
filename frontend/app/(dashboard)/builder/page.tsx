import { redirect } from "next/navigation";
import { getOrCreateLatestResume } from "@/lib/actions/resume";

/**
 * /builder entry point — Server Component.
 * Finds (or creates) the user's latest resume, then redirects to /builder/[id].
 * Shows a loading UI while the server action runs (via the loading.tsx sibling).
 */
export default async function BuilderEntryPage() {
  let id: string;
  try {
    id = await getOrCreateLatestResume();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    // If the resumes table doesn't exist yet (migration not run), show a clear message
    if (message.includes("schema cache") || message.includes("does not exist")) {
      return (
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-lg text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-xl font-black mb-3" style={{ color: "var(--color-heading)" }}>
              Database Setup Required
            </h1>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--color-muted)" }}>
              The <code className="px-1.5 py-0.5 rounded text-xs font-mono"
                style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)", color: "var(--color-cta)" }}>
                resumes
              </code> table hasn&apos;t been created in your Supabase project yet.
            </p>
            <div className="text-left rounded-xl p-4 mb-6"
              style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-muted)" }}>
                To fix this:
              </p>
              <ol className="text-sm space-y-1.5 list-decimal list-inside" style={{ color: "var(--color-body)" }}>
                <li>Open your Supabase Dashboard</li>
                <li>Go to <strong>SQL Editor</strong></li>
                <li>Paste and run the contents of <code className="text-xs font-mono"
                  style={{ color: "var(--color-cta)" }}>supabase/migrations/002_resumes.sql</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <a href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "var(--color-cta)" }}>
              Back to Dashboard
            </a>
          </div>
        </div>
      );
    }

    // Generic error fallback
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <p className="text-lg font-bold mb-2" style={{ color: "var(--color-heading)" }}>
            Something went wrong
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>{message}</p>
          <a href="/dashboard" className="text-sm font-semibold" style={{ color: "var(--color-cta)" }}>
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  redirect(`/builder/${id}`);
}
