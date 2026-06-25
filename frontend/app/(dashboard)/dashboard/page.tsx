import { createClient } from "@/lib/supabase/server";
import { FileText, Target, Link2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

// ── Feature Cards (Coming Soon shells) ────────────────────────────────────────

const DASHBOARD_CARDS = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create and manage your ATS-optimized resumes.",
    href: "/builder",
    available: false,
  },
  {
    icon: Target,
    title: "ATS Checker",
    description: "Analyze your resume against any job description.",
    href: "/ats",
    available: false,
  },
  {
    icon: Link2,
    title: "Job Match",
    description: "See how well your resume fits a job listing.",
    href: "/match",
    available: false,
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description: "AI-powered improvements for your resume content.",
    href: "/builder",
    available: false,
  },
];

// ── Dashboard Home Page ────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName =
    user?.user_metadata?.full_name?.split(" ")?.[0] ??
    user?.email?.split("@")?.[0] ??
    "there";

  return (
    <div className="max-w-5xl">
      {/* Welcome header */}
      <div className="mb-10">
        <h1
          className="text-3xl font-black mb-2"
          style={{ color: "var(--color-heading)" }}
        >
          Welcome back, {firstName} 👋
        </h1>
        <p style={{ color: "var(--color-body)" }}>
          Your career optimization hub. More features are on the way — stay tuned.
        </p>
      </div>

      {/* Quick stat row */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 p-6 rounded-2xl card-glass"
      >
        {[
          { label: "Resumes Created", value: "0" },
          { label: "ATS Analyses Run", value: "0" },
          { label: "Best ATS Score", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              className="text-3xl font-black mb-1"
              style={{
                color: "var(--color-heading)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
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
            <div
              key={card.title}
              className="relative rounded-2xl p-6 card-glass group transition-all duration-300"
            >
              {/* Coming soon badge */}
              {!card.available && (
                <span
                  className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: "var(--color-badge-bg)",
                    color: "var(--color-muted)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  Coming Soon
                </span>
              )}

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: "var(--color-badge-bg)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: "var(--color-cta)" }}
                  aria-hidden="true"
                />
              </div>

              <h2
                className="text-base font-bold mb-1"
                style={{ color: "var(--color-heading)" }}
              >
                {card.title}
              </h2>
              <p className="text-sm mb-4" style={{ color: "var(--color-body)" }}>
                {card.description}
              </p>

              {card.available ? (
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: "var(--color-cta)" }}
                >
                  Open
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              ) : (
                <span className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                  Available in Phase {
                    card.title === "Resume Builder" ? "3" :
                    card.title === "ATS Checker" ? "5" :
                    card.title === "Job Match" ? "6" : "7"
                  }
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
