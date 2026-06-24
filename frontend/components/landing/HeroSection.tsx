"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Trophy, CheckCircle2 } from "lucide-react";
import { ATSPreviewCard } from "@/components/landing/ATSPreviewCard";

// ── Trust Row ─────────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  "100% Free to Start",
  "No Credit Card",
  "Instant Results",
];

// ── Main Hero Section ─────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--color-hero-gradient-from) 0%, var(--color-hero-gradient-to) 100%)",
      }}
      aria-label="Hero section"
    >
      {/* Background decorative elements */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.06] pointer-events-none"
        style={{ background: "var(--color-cta)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.04] pointer-events-none"
        style={{ background: "var(--color-cta-hover)" }}
        aria-hidden="true"
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-cta) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-cta) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      <div className="container-max px-4 md:px-6 py-24 pt-32 md:pt-36 lg:pt-40 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left Column ── */}
          <div
            className="flex flex-col gap-6"
            style={{
              animation: "fade-up 0.7s ease-out forwards",
            }}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 w-fit">
              <span
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  color: "var(--color-badge-text)",
                  background: "var(--color-badge-bg)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Trophy className="w-4 h-4" aria-hidden="true" />
                #1 ATS Resume Platform for Job Seekers
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-black leading-[1.08] tracking-tight">
              <span style={{ color: "var(--color-heading)" }}>
                Build Better Resumes.
              </span>
              <br />
              <span style={{ color: "var(--color-cta)" }}>
                Get Higher ATS Scores.
              </span>
              <br />
              <span style={{ color: "var(--color-heading)" }}>
                Land More Interviews.
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg sm:text-xl leading-relaxed max-w-xl"
              style={{ color: "var(--color-body)" }}
            >
              Create ATS-friendly resumes, analyze your job fit, and get
              actionable insights to beat the competition.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/builder"
                className="btn-primary text-base px-6 py-3.5"
                aria-label="Create your resume — Go to resume builder"
              >
                Create Your Resume
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/ats"
                className="btn-ghost text-base px-6 py-3.5"
                aria-label="Check your ATS score"
              >
                Check ATS Score
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap gap-4 mt-1">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: "var(--color-muted)" }}
                >
                  <CheckCircle2
                    className="w-4 h-4 flex-shrink-0"
                    aria-hidden="true"
                    style={{ color: "var(--color-cta)" }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Column — ATS Card ── */}
          <div
            className="flex justify-center lg:justify-end"
            style={{
              animation: "slide-in-right 0.8s ease-out 0.2s both",
            }}
          >
            <ATSPreviewCard />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
