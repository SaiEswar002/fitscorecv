import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthCard } from "@/components/auth/AuthFormComponents";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your FitScoreCV account.",
};

/**
 * Loading skeleton shown while LoginForm hydrates.
 * Matches the AuthCard dimensions so there's no layout shift.
 */
function LoginSkeleton() {
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your FitScoreCV account">
      <div className="flex flex-col gap-4 animate-pulse">
        {/* Google button skeleton */}
        <div
          className="h-12 rounded-xl"
          style={{ background: "var(--color-surface-elevated)" }}
        />
        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
          <div className="w-5 h-3 rounded" style={{ background: "var(--color-border)" }} />
          <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        </div>
        {/* Email field */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-24 rounded" style={{ background: "var(--color-border)" }} />
          <div className="h-12 rounded-xl" style={{ background: "var(--color-surface-elevated)" }} />
        </div>
        {/* Password field */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-20 rounded" style={{ background: "var(--color-border)" }} />
          <div className="h-12 rounded-xl" style={{ background: "var(--color-surface-elevated)" }} />
        </div>
        {/* Submit button */}
        <div className="h-12 rounded-xl" style={{ background: "var(--color-cta)", opacity: 0.4 }} />
      </div>
    </AuthCard>
  );
}

/**
 * Page shell — Server Component.
 *
 * useSearchParams() is called inside <LoginForm> (a client component).
 * Next.js requires any client component using useSearchParams() to be
 * wrapped in <Suspense> when the page is statically prerendered.
 * Moving it here (the page) directly would cause a build error on Vercel.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
