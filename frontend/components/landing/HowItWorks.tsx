"use client";

import { Upload, BarChart3, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

// ── Steps Data ────────────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    number: "01",
    icon: Upload,
    title: "Create or Upload",
    description:
      "Build your resume with our intuitive builder or upload your existing resume in PDF or DOCX format.",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Get ATS Score",
    description:
      "Our advanced AI analyzes your resume against the job description and provides a detailed, actionable score.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Improve & Get Hired",
    description:
      "Follow personalized, AI-powered suggestions to optimize your resume and land more interviews.",
  },
];

// ── Step Card ─────────────────────────────────────────────────────────────────

interface StepCardProps {
  step: Step;
  index: number;
  isFirst: boolean;
}

function StepCard({ step, index, isFirst }: StepCardProps) {
  const Icon = step.icon;

  return (
    <div className="flex flex-col items-center text-center relative">
      {/* Step number + icon */}
      <div className="relative flex flex-col items-center mb-6">
        {/* Outer ring */}
        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
          style={{
            background: isFirst
              ? "var(--color-step-active)"
              : "var(--color-surface)",
            border: isFirst
              ? "none"
              : "2px solid var(--color-step-inactive)",
            boxShadow: isFirst ? "var(--shadow-cta)" : "none",
          }}
        >
          <Icon
            className="w-8 h-8"
            style={{
              color: isFirst ? "#ffffff" : "var(--color-muted)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Step number badge */}
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
          style={{
            background: "var(--color-surface)",
            border: `2px solid ${isFirst ? "var(--color-step-active)" : "var(--color-step-inactive)"}`,
            color: isFirst ? "var(--color-step-active)" : "var(--color-muted)",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          {index + 1}
        </div>
      </div>

      {/* Text */}
      <h3
        className="text-lg font-bold mb-2"
        style={{ color: "var(--color-heading)" }}
      >
        {step.title}
      </h3>
      <p
        className="text-sm leading-relaxed max-w-[240px]"
        style={{ color: "var(--color-body)" }}
      >
        {step.description}
      </p>
    </div>
  );
}

// ── Connector Line ─────────────────────────────────────────────────────────────

function ConnectorLine() {
  return (
    <div
      className="hidden lg:flex items-center justify-center flex-1 mt-[-36px] mb-6 px-4"
      aria-hidden="true"
    >
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, var(--color-step-active) 0%, var(--color-step-line) 50%, var(--color-step-inactive) 100%)",
        }}
      />
      {/* Arrow dot */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0 -ml-1"
        style={{ background: "var(--color-step-line)" }}
      />
    </div>
  );
}

// ── Main How It Works ─────────────────────────────────────────────────────────

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-padding"
      style={{ background: "var(--color-surface-elevated)" }}
      aria-label="How FitScoreCV works"
    >
      <div className="container-max px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-muted)" }}
          >
            Simple Process
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
            style={{ color: "var(--color-heading)" }}
          >
            3 Simple Steps to a{" "}
            <span style={{ color: "var(--color-cta)" }}>Better Resume</span>
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{ color: "var(--color-body)" }}
          >
            No complicated setup. No learning curve. Just results.
          </p>
        </div>

        {/* Steps */}
        <div
          className="relative flex flex-col lg:flex-row items-start lg:items-start justify-between gap-10 lg:gap-0"
          role="list"
          aria-label="Steps to improve your resume"
        >
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className="flex flex-col lg:flex-row items-center flex-1"
              role="listitem"
            >
              <StepCard step={step} index={index} isFirst={index === 0} />
              {index < STEPS.length - 1 && <ConnectorLine />}
            </div>
          ))}
        </div>

        {/* Mobile step connectors (vertical) */}
        <div className="lg:hidden flex flex-col items-center gap-0 mt-0" aria-hidden="true">
          {/* Handled by gap in flex-col above */}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
