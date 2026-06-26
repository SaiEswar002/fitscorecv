import { createClient } from "@/lib/supabase/server";
import { FileText, Target, Link2, Sparkles, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — FitScoreCV",
  description: "Your career optimization hub.",
};

// ── Feature Cards ─────────────────────────────────────────────────────────────

const DASHBOARD_CARDS = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Build ATS-optimized resumes with live preview and PDF export.",
    href: "/builder",
    available: true,
    cta: "Open Builder",
  },
  {
    icon: Target,
    title: "ATS Checker",
    description: "Analyze your resume against any job description.",
    href: "#",
    available: false,
    cta: "Coming in Phase 5",
  },
  {
    icon: Link2,
    title: "Job Match",
    description: "See how well your resume fits a job listing.",
    href: "#",
    available: false,
    cta: "Coming in Phase 6",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description: "AI-powered improvements for your resume content.",
    href: "#",
    available: false,
    cta: "Coming in Phase 7",
  },
];

// ── Dashboard Home Page ────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const firstName =
    user?.user_metadata?.full_name?.split(" ")?.[0] ??
    user?.email?.split("@")?.[0] ??
    "there";

  // Try to get resume count — gracefully handles case where table doesn't exist yet
  let resumeCount = 0;
  try {
    const { count } = await supabase
      .from("resumes")
      .select("*", { count: "exact", head: true });
    resumeCount = count ?? 0;
  } catch {
    // Table not yet created — migration hasn't been run
    resumeCount = 0;
  }

  return (
    <div className="container-max px-4 md:px-6 py-8 max-w-5xl">
      {/* Welcome header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black mb-2" style={{ color: "var(--color-heading)" }}>
          Welcome back, {firstName} 👋
        </h1>
        <p style={{ color: "var(--color-body)" }}>
          Your career optimization hub. Build your resume, track your ATS score, and land your next role.
        </p>
      </div>

      {/* Quick action */}
      <div className="mb-8 flex items-center gap-3 flex-wrap">
        <Link href="/builder"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--color-cta)" }}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Resume
        </Link>
        {resumeCount > 0 && (
          <Link href="/builder"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)" }}>
            Continue Last Resume
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* Quick stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 p-6 rounded-2xl card-glass">
        {[
          { label: "Resumes Created", value: String(resumeCount) },
          { label: "ATS Analyses Run", value: "0" },
          { label: "Best ATS Score", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-black mb-1"
              style={{ color: "var(--color-heading)", fontFamily: "var(--font-mono, monospace)" }}>
              {stat.value}
            </p>
            <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {DASHBOARD_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title}
              className="relative rounded-2xl p-6 card-glass group transition-all duration-300">
              {/* Coming soon badge */}
              {!card.available && (
                <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "var(--color-badge-bg)", color: "var(--color-muted)", border: "1px solid var(--color-border)" }}>
                  Coming Soon
                </span>
              )}

              {/* Icon */}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "var(--color-badge-bg)", border: "1px solid var(--color-border)" }}>
                <Icon className="w-5 h-5" style={{ color: "var(--color-cta)" }} aria-hidden="true" />
              </div>

              <h2 className="text-base font-bold mb-1" style={{ color: "var(--color-heading)" }}>
                {card.title}
              </h2>
              <p className="text-sm mb-4" style={{ color: "var(--color-body)" }}>
                {card.description}
              </p>

              {card.available ? (
                <Link href={card.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: "var(--color-cta)" }}>
                  {card.cta}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              ) : (
                <span className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                  {card.cta}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
