"use client";

import Link from "next/link";
import { FileText, Target, Link2, Sparkles, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  href: string;
  gradient: string;
}

// ── Feature Data ──────────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Create professional, ATS-friendly resumes in minutes with our easy-to-use builder. Dozens of templates optimized for every industry.",
    cta: "Build Now",
    href: "/builder",
    gradient: "from-red-800/20 to-red-600/10",
  },
  {
    icon: Target,
    title: "ATS Checker",
    description:
      "Get an instant ATS score and detailed analysis of your resume. Know exactly where you stand before you apply.",
    cta: "Check Now",
    href: "/ats",
    gradient: "from-orange-800/20 to-red-600/10",
  },
  {
    icon: Link2,
    title: "Job Match",
    description:
      "Paste any job description and instantly see how well your resume fits. Get a detailed breakdown of matches and gaps.",
    cta: "Match Now",
    href: "/match",
    gradient: "from-rose-800/20 to-pink-600/10",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description:
      "Get AI-powered suggestions to strengthen your resume bullets, improve your summary, and stand out from the crowd.",
    cta: "Improve Now",
    href: "/builder",
    gradient: "from-red-900/20 to-rose-700/10",
  },
];

// ── Feature Card ──────────────────────────────────────────────────────────────

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        "group relative rounded-2xl p-6 overflow-hidden",
        "card-glass",
        "cursor-pointer transition-all duration-300 hover:-translate-y-1"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl",
          `bg-gradient-to-br ${feature.gradient}`
        )}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
        style={{
          background: "var(--color-badge-bg)",
          border: "1px solid var(--color-border)",
        }}
      >
        <Icon
          className="w-6 h-6"
          style={{ color: "var(--color-cta)" }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: "var(--color-heading)" }}
        >
          {feature.title}
        </h3>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: "var(--color-body)" }}
        >
          {feature.description}
        </p>

        {/* CTA Link */}
        <Link
          href={feature.href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group/link"
          style={{ color: "var(--color-cta)" }}
          aria-label={`${feature.cta} — ${feature.title}`}
        >
          {feature.cta}
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          border: "1px solid var(--color-cta)",
          boxShadow: "inset 0 0 24px rgba(190, 26, 26, 0.06)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

// ── Main Features Section ─────────────────────────────────────────────────────

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="section-padding"
      style={{ background: "var(--color-surface)" }}
      aria-label="Features"
    >
      <div className="container-max px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-muted)" }}
          >
            Platform Features
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
            style={{ color: "var(--color-heading)" }}
          >
            Everything You Need to{" "}
            <span style={{ color: "var(--color-cta)" }}>Get Hired</span>
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--color-body)" }}
          >
            One platform. Every tool you need to create a standout resume,
            optimize for ATS systems, and land your dream role.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
