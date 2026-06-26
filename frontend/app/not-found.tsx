import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | FitScoreCV",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-surface)" }}>
      <div className="text-center max-w-md">
        <div className="text-8xl font-black mb-4 select-none"
          style={{ color: "var(--color-cta)", opacity: 0.15 }}>
          404
        </div>
        <h1 className="text-2xl font-black mb-3" style={{ color: "var(--color-heading)" }}>
          Page not found
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-cta)" }}>
            Go to Dashboard
          </Link>
          <Link href="/"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)" }}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
