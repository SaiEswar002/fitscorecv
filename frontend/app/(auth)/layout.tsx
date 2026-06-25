import type { Metadata } from "next";
import Link from "next/link";
import { AuthThemeToggle } from "@/components/auth/AuthThemeToggle";

export const metadata: Metadata = {
  title: {
    template: "%s — FitScoreCV",
    default: "FitScoreCV",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Minimal header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-1 select-none"
          aria-label="FitScoreCV — Back to home"
        >
          <span
            className="text-xl font-black tracking-tight"
            style={{ color: "var(--color-heading)" }}
          >
            FitScore
          </span>
          <span
            className="text-xl font-black tracking-tight px-1 py-0.5 rounded"
            style={{
              color: "#ffffff",
              background: "var(--color-cta)",
              lineHeight: 1,
            }}
          >
            CV
          </span>
        </Link>
        <AuthThemeToggle />
      </header>

      {/* Page content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          © {new Date().getFullYear()} FitScoreCV. All rights reserved. &nbsp;·&nbsp;{" "}
          <Link
            href="/privacy"
            className="hover:underline"
            style={{ color: "var(--color-cta)" }}
          >
            Privacy Policy
          </Link>
          &nbsp;·&nbsp;
          <Link
            href="/terms"
            className="hover:underline"
            style={{ color: "var(--color-cta)" }}
          >
            Terms
          </Link>
        </p>
      </footer>
    </div>
  );
}
