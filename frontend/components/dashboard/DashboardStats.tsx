import type { Resume } from "@/lib/types/resume";
import { computeCompleteness } from "@/components/builder/CompletenessBar";
import { FileText, Archive, Download, TrendingUp, UserCheck, BarChart2 } from "lucide-react";

// ── Word count helper (server-safe, no DOM) ──────────────────────────────────

function computeWordCount(resume: Resume): number {
  const d = resume.resume_data;
  if (!d) return 0;
  const text = [
    d.contact?.name, d.contact?.email, d.contact?.location,
    d.summary,
    ...(d.experience ?? []).map(e => `${e.title} ${e.company} ${e.bullets?.map(b => b.text).join(" ")}`),
    ...(d.education ?? []).map(e => `${e.degree} ${e.school}`),
    ...(d.skills?.technical ?? []),
    ...(d.skills?.tools ?? []),
    ...(d.skills?.soft ?? []),
    ...(d.certifications ?? []).map(c => c.name),
    ...(d.projects ?? []).map(p => `${p.name} ${p.description}`),
  ].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}

// ── Profile completion ────────────────────────────────────────────────────────

function computeProfileCompletion(userMeta: Record<string, unknown>): number {
  const fields = [
    userMeta?.full_name,
    userMeta?.avatar_url,
    userMeta?.email,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  resumes: Resume[];
  userMeta: Record<string, unknown>;
}

export function DashboardStats({ resumes, userMeta }: Props) {
  const active   = resumes.filter(r => r.status !== "archived");
  const archived = resumes.filter(r => r.status === "archived");

  // Average resume completeness
  const avgCompletion = active.length > 0
    ? Math.round(
        active.reduce((sum, r) => sum + computeCompleteness(r.resume_data).score, 0) / active.length
      )
    : 0;

  // Profile completion
  const profilePct = computeProfileCompletion(userMeta);

  const STATS = [
    {
      icon: FileText,
      label: "Total Resumes",
      value: String(active.length),
      sub: archived.length > 0 ? `${archived.length} archived` : null,
      color: "var(--color-cta)",
    },
    {
      icon: Archive,
      label: "Archived",
      value: String(archived.length),
      sub: null,
      color: "var(--color-muted)",
    },
    {
      icon: TrendingUp,
      label: "Best ATS Score",
      value: "—",
      sub: "Coming in Phase 5",
      color: "var(--color-muted)",
    },
    {
      icon: BarChart2,
      label: "Avg ATS Score",
      value: "—",
      sub: "Coming in Phase 5",
      color: "var(--color-muted)",
    },
    {
      icon: UserCheck,
      label: "Profile",
      value: `${profilePct}%`,
      sub: profilePct < 100 ? "Complete your profile" : "Profile complete",
      color: profilePct >= 80 ? "#22c55e" : profilePct >= 50 ? "#f59e0b" : "var(--color-cta)",
    },
    {
      icon: Download,
      label: "Resume Completion",
      value: active.length > 0 ? `${avgCompletion}%` : "—",
      sub: active.length > 0 ? `avg across ${active.length} resume${active.length > 1 ? "s" : ""}` : null,
      color: avgCompletion >= 80 ? "#22c55e" : avgCompletion >= 50 ? "#f59e0b" : "var(--color-cta)",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {STATS.map(stat => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl p-4 flex flex-col gap-1"
            style={{
              background: "var(--color-card-bg)",
              border: "1px solid var(--color-card-border)",
            }}
          >
            <Icon className="w-4 h-4 mb-1" style={{ color: stat.color }} />
            <p className="text-2xl font-black leading-none" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider leading-tight"
              style={{ color: "var(--color-muted)" }}>
              {stat.label}
            </p>
            {stat.sub && (
              <p className="text-[10px] leading-tight" style={{ color: "var(--color-muted)" }}>
                {stat.sub}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
