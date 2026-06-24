"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────

interface ScoreMetric {
  label: string;
  value: number;
  color?: string;
}

// ── Constants ───────────────────────────────────────────────────────────────

const SCORE_METRICS: ScoreMetric[] = [
  { label: "Keyword Match", value: 82 },
  { label: "Skills Match", value: 74 },
  { label: "Experience Match", value: 68 },
  { label: "Format Score", value: 92 },
];

const MISSING_SKILLS = ["Docker", "AWS", "Kubernetes", "CI/CD"];

const SUGGESTIONS = [
  "Add more quantifiable achievements",
  "Include missing keywords in summary",
  "Improve your skills section",
];

const OVERALL_SCORE = 78;
const RING_RADIUS = 44;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// ── Counter Hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, started: boolean): number {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, started]);

  return current;
}

// ── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  animated: boolean;
  delay?: number;
}

function ProgressBar({ value, animated, delay = 0 }: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const timeout = setTimeout(() => {
      setWidth(value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [animated, value, delay]);

  return (
    <div
      className="h-2 rounded-full overflow-hidden"
      style={{ background: "var(--color-progress-track)" }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: "linear-gradient(90deg, var(--color-progress-fill) 0%, var(--color-cta-hover) 100%)",
          transition: `width 1s ease-out ${delay}ms`,
        }}
      />
    </div>
  );
}

// ── SVG Ring Score ────────────────────────────────────────────────────────────

interface ScoreRingProps {
  score: number;
  animated: boolean;
}

function ScoreRing({ score, animated }: ScoreRingProps) {
  const animatedScore = useCountUp(score, 1800, animated);
  const targetOffset =
    RING_CIRCUMFERENCE - (animatedScore / 100) * RING_CIRCUMFERENCE;

  const label =
    score >= 85 ? "Excellent" : score >= 70 ? "Good Match" : score >= 55 ? "Fair" : "Needs Work";
  const labelColor =
    score >= 85 ? "#22c55e" : score >= 70 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 120, height: 120 }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-md opacity-30"
          style={{
            background: "radial-gradient(circle, var(--color-score-ring) 0%, transparent 70%)",
          }}
        />
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="relative z-10 -rotate-90"
          aria-label={`ATS Score: ${animatedScore}%`}
        >
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="8"
            stroke="var(--color-score-track)"
          />
          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="8"
            stroke="url(#scoreGradient)"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={animated ? targetOffset : RING_CIRCUMFERENCE}
            style={{
              transition: animated
                ? "stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
            }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-score-ring)" />
              <stop offset="100%" stopColor="var(--color-cta-hover)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-black leading-none"
            style={{
              color: "var(--color-heading)",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            {animatedScore}%
          </span>
        </div>
      </div>
      <span
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{
          color: labelColor,
          background: `${labelColor}22`,
          border: `1px solid ${labelColor}44`,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ATSPreviewCard() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Small delay so the card renders first
          setTimeout(() => setHasAnimated(true), 300);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative w-full max-w-md mx-auto rounded-2xl p-6 overflow-hidden",
        "card-glass",
        "transition-all duration-700"
      )}
      style={{
        animation: "float 6s ease-in-out infinite",
        boxShadow: "var(--shadow-score)",
      }}
      aria-label="Example ATS Analysis Preview Card"
    >
      {/* Decorative background glow */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "var(--color-cta)" }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "var(--color-cta-hover)" }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>
            ATS Score
          </h3>
          <p
            className="text-xs mt-0.5 font-medium px-2 py-0.5 rounded-full inline-block"
            style={{
              color: "var(--color-badge-text)",
              background: "var(--color-badge-bg)",
              border: "1px solid var(--color-border)",
            }}
          >
            Example Analysis
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background:
                  i === 0
                    ? "#ef4444"
                    : i === 1
                    ? "#f59e0b"
                    : "#22c55e",
              }}
            />
          ))}
        </div>
      </div>

      {/* Score Ring */}
      <div className="relative z-10 flex justify-center mb-6">
        <ScoreRing score={OVERALL_SCORE} animated={hasAnimated} />
      </div>

      {/* Metrics */}
      <div className="relative z-10 space-y-3 mb-5">
        {SCORE_METRICS.map((metric, index) => (
          <div key={metric.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium" style={{ color: "var(--color-body)" }}>
                {metric.label}
              </span>
              <span
                className="text-xs font-bold"
                style={{
                  color: "var(--color-heading)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {metric.value}%
              </span>
            </div>
            <ProgressBar
              value={metric.value}
              animated={hasAnimated}
              delay={index * 150 + 400}
            />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="relative z-10 h-px mb-4" style={{ background: "var(--color-border)" }} />

      {/* Missing Skills */}
      <div className="relative z-10 mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
          Missing Skills
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MISSING_SKILLS.map((skill) => (
            <span
              key={skill}
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                color: "var(--color-tag-text)",
                background: "var(--color-tag-bg)",
                border: "1px solid var(--color-tag-border)",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="relative z-10">
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
          Top Suggestions
        </p>
        <ul className="space-y-1.5">
          {SUGGESTIONS.map((suggestion) => (
            <li
              key={suggestion}
              className="flex items-start gap-2 text-xs"
              style={{ color: "var(--color-body)" }}
            >
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "var(--color-cta)", marginTop: "5px" }}
              />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ATSPreviewCard;
