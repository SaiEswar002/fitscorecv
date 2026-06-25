"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AuthCard,
  FormField,
  FormAlert,
  GoogleButton,
  OrDivider,
  SubmitButton,
} from "@/components/auth/AuthFormComponents";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const urlError = searchParams.get("error");

  // Show URL-level errors (e.g. from OAuth callback)
  useEffect(() => {
    if (urlError) setError(decodeURIComponent(urlError));
  }, [urlError]);

  const supabase = createClient();

  // ── Email / Password Sign In ─────────────────────────────────────────────

  async function handleEmailSignIn(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  // ── Google OAuth ─────────────────────────────────────────────────────────

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback?next=${redirectTo}`,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // On success, user is redirected to Google — no further handling needed here
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your FitScoreCV account"
    >
      {/* Google OAuth */}
      <GoogleButton
        onClick={handleGoogleSignIn}
        loading={googleLoading}
        label="Continue with Google"
      />

      <OrDivider />

      {/* Alerts */}
      {error && <FormAlert type="error" message={error} />}
      {success && <FormAlert type="success" message={success} />}

      {/* Email + Password form */}
      <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4" noValidate>
        <FormField
          id="login-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
          disabled={loading}
        />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-sm font-semibold"
              style={{ color: "var(--color-heading)" }}
            >
              Password <span style={{ color: "var(--color-cta)" }} aria-hidden="true">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium hover:underline"
              style={{ color: "var(--color-cta)" }}
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none"
            style={{
              background: "var(--color-surface-elevated)",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-heading)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--color-cta)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(190,26,26,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        <SubmitButton
          label="Sign in"
          loading={loading}
          loadingLabel="Signing in..."
        />
      </form>

      {/* Sign up link */}
      <p
        className="mt-5 text-center text-sm"
        style={{ color: "var(--color-muted)" }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold hover:underline"
          style={{ color: "var(--color-cta)" }}
        >
          Sign up free
        </Link>
      </p>
    </AuthCard>
  );
}
