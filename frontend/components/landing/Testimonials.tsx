"use client";

import { Star, Quote } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  improvement: string;
}

// ── Testimonial Data ──────────────────────────────────────────────────────────

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Priya Sharma",
    role: "Marketing Manager",
    company: "Deloitte",
    content:
      "I spent months applying with no callbacks. After FitScoreCV optimized my resume, my ATS score jumped from 52% to 91%. I landed 4 interviews in my first week back. This platform genuinely changed my job search.",
    rating: 5,
    avatar: "PS",
    improvement: "ATS Score: 52% → 91%",
  },
  {
    id: "t2",
    name: "Marcus Johnson",
    role: "Senior Software Engineer",
    company: "Stripe",
    content:
      "As an engineer I was skeptical, but the ATS analysis is legitimately sophisticated. It caught keyword gaps I never would have noticed. The job matching feature alone is worth it — I can tell in 30 seconds if my resume fits a JD.",
    rating: 5,
    avatar: "MJ",
    improvement: "Got 3 FAANG interviews",
  },
  {
    id: "t3",
    name: "Aisha Okonkwo",
    role: "Financial Analyst",
    company: "HSBC",
    content:
      "The platform works for every industry, not just tech. My finance resume needed completely different keywords and formatting. FitScoreCV's AI understood this and gave tailored advice. I got my dream role in 6 weeks.",
    rating: 5,
    avatar: "AO",
    improvement: "Hired in 6 weeks",
  },
];

// ── Star Rating ───────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          style={{
            color: i < rating ? "#f59e0b" : "var(--color-border)",
            fill: i < rating ? "#f59e0b" : "transparent",
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ── Testimonial Card ──────────────────────────────────────────────────────────

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <div
      className="relative rounded-2xl p-6 card-glass flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 120}ms`,
      }}
    >
      {/* Quote icon */}
      <Quote
        className="w-8 h-8 opacity-20 absolute top-5 right-5"
        style={{ color: "var(--color-cta)" }}
        aria-hidden="true"
      />

      {/* Rating */}
      <StarRating rating={testimonial.rating} />

      {/* Content */}
      <blockquote
        className="text-sm leading-relaxed flex-1"
        style={{ color: "var(--color-body)" }}
      >
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      {/* Improvement badge */}
      <div
        className="inline-flex w-fit items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
        style={{
          background: "var(--color-badge-bg)",
          border: "1px solid var(--color-border)",
          color: "var(--color-cta)",
        }}
      >
        <span aria-hidden="true">📈</span>
        {testimonial.improvement}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--color-cta) 0%, var(--color-cta-hover) 100%)",
            color: "#ffffff",
          }}
          aria-hidden="true"
        >
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--color-heading)" }}>
            {testimonial.name}
          </p>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Testimonials Section ─────────────────────────────────────────────────

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-padding"
      style={{ background: "var(--color-surface)" }}
      aria-label="Customer testimonials"
    >
      <div className="container-max px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-muted)" }}
          >
            Real Results
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
            style={{ color: "var(--color-heading)" }}
          >
            Job Seekers Who{" "}
            <span style={{ color: "var(--color-cta)" }}>Got Hired</span>
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{ color: "var(--color-body)" }}
          >
            Across industries. Across experience levels. Real results from real people.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Trust metric */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          {[
            { value: "50,000+", label: "Job Seekers Helped" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "73%", label: "Got Interviews in 2 Weeks" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-3xl font-black"
                style={{
                  color: "var(--color-cta)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {stat.value}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
