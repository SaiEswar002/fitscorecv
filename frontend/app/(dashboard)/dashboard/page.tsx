import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import type { Resume } from "@/lib/types/resume";
import { normalizeResumeData } from "@/lib/types/resume";
import { DashboardStats }       from "@/components/dashboard/DashboardStats";
import { ResumeManagerClient }  from "@/components/dashboard/ResumeManagerClient";
import { ActivityWidget }       from "@/components/dashboard/ActivityWidget";

export const metadata: Metadata = {
  title: "Dashboard — FitScoreCV",
  description: "Your resume management workspace.",
};

// Force dynamic so stats are always fresh
export const dynamic = "force-dynamic";

// ── Server Component ──────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const firstName =
    user?.user_metadata?.full_name?.split(" ")?.[0] ??
    user?.email?.split("@")?.[0] ??
    "there";

  // Fetch all resumes (full data for word-count / completeness calculations)
  let resumes: Resume[] = [];
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      resumes = data.map(row => ({
        id:          row.id,
        user_id:     row.user_id,
        title:       row.title,
        template:    row.template as Resume["template"],
        status:      row.status   as Resume["status"],
        resume_data: normalizeResumeData(row.resume_data),
        created_at:  row.created_at,
        updated_at:  row.updated_at,
      }));
    }
  } catch {
    // Table not yet migrated — silently fall through
  }

  // Most-recently-updated NON-archived resume for "Continue Last Resume"
  const mostRecentId =
    resumes.find(r => r.status !== "archived")?.id ?? null;

  // User metadata for profile completion
  const userMeta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  // Inject email for completeness calculation
  if (user?.email) userMeta.email = user.email;

  return (
    <div className="container-max px-4 md:px-6 py-8 max-w-7xl space-y-8">

      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-black mb-1" style={{ color: "var(--color-heading)" }}>
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Your resume management workspace — build, manage, and track every resume.
        </p>
      </div>

      {/* Live stats */}
      <DashboardStats resumes={resumes} userMeta={userMeta} />

      {/* Main content: resume list + activity sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-6">

        {/* Resume Manager */}
        <section aria-label="Resume Manager">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black" style={{ color: "var(--color-heading)" }}>
              My Resumes
            </h2>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: "var(--color-badge-bg)", color: "var(--color-muted)" }}>
              {resumes.filter(r => r.status !== "archived").length} active
            </span>
          </div>

          <ResumeManagerClient
            initialResumes={resumes}
            mostRecentId={mostRecentId}
          />
        </section>

        {/* Sidebar: Activity */}
        <aside className="space-y-5" aria-label="Dashboard sidebar">
          {/* Activity widget — pass empty items until activity log is built */}
          <ActivityWidget items={[]} />

          {/* Feature cards — kept from original to preserve existing nav */}
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)" }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
              Coming Soon
            </h3>
            {[
              { label: "ATS Checker",    sub: "Phase 5" },
              { label: "Job Match",      sub: "Phase 6" },
              { label: "AI Suggestions", sub: "Phase 7" },
              { label: "Import Resume",  sub: "Phase 4" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: "var(--color-body)" }}>{item.label}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--color-badge-bg)", color: "var(--color-muted)" }}>
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
