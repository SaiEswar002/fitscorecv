"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";

export function CTABanner() {
  return (
    <section
      id="cta"
      className="section-padding relative overflow-hidden"
      aria-label="Call to action — Get started with FitScoreCV"
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, var(--color-cta) 0%, var(--color-cta-hover) 100%)",
          opacity: 0.92,
        }}
        aria-hidden="true"
      />

      {/* Decorative circles */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: "#ffffff" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10 pointer-events-none"
        style={{ background: "#ffffff" }}
        aria-hidden="true"
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container-max px-4 md:px-6 relative z-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-white/70">
          Start Today — It&apos;s Free
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-4">
          Ready to Land Your{" "}
          <br className="hidden sm:block" />
          Dream Job?
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join 50,000+ job seekers who improved their ATS scores and landed more
          interviews with FitScoreCV.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "#ffffff",
              color: "var(--color-cta)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
            aria-label="Get Started Free — Create your FitScoreCV account"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="/#how-it-works"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "#ffffff",
              border: "1.5px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(8px)",
            }}
            aria-label="See how FitScoreCV works"
          >
            <PlayCircle className="w-4 h-4" aria-hidden="true" />
            See How It Works
          </Link>
        </div>

        {/* Trust row */}
        <p className="mt-8 text-sm text-white/60">
          No credit card required &nbsp;·&nbsp; Free forever plan available
          &nbsp;·&nbsp; Cancel anytime
        </p>
      </div>
    </section>
  );
}

export default CTABanner;
