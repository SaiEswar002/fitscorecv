"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AuthCard,
  FormField,
  FormAlert,
  GoogleButton,
  OrDivider,
  SubmitButton,
} from "@/components/auth/AuthFormComponents";

// ── Password Strength ─────────────────────────────────────────────────────────

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (password.length === 0) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
  if (score <= 2) return { score, label: "Fair", color: "#f59e0b" };
  if (score <= 3) return { score, label: "Good", color: "#3b82f6" };
  return { score, label: "Strong", color: "#22c55e" };
}

interface PasswordStrengthBarProps {
  password: string;
}

function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{
              background: i <= score ? color : "var(--color-border)",
            }}
          />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color }}>
        {label} password
      </p>
    </div>
  );
}

// ── Main Signup Page ──────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  // ── Email Sign Up ────────────────────────────────────────────────────────

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Supabase may require email confirmation depending on project settings.
    // Show success and let user know to check email.
    setSuccess(
      "Account created! Check your email to confirm your address, then sign in."
    );
    setLoading(false);
  }

  // ── Google OAuth ─────────────────────────────────────────────────────────

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  if (success) {
    return (
      <AuthCard
        title="Check your email ✉️"
        subtitle="We sent you a confirmation link"
      >
        <FormAlert type="success" message={success} />
        <p
          className="mt-4 text-sm text-center"
          style={{ color: "var(--color-muted)" }}
        >
          Didn&apos;t get the email?{" "}
          <button
            onClick={() => {
              setSuccess(null);
              setError(null);
            }}
            className="font-semibold hover:underline"
            style={{ color: "var(--color-cta)" }}
          >
            Try again
          </button>
        </p>
        <div className="mt-4">
          <Link href="/login" className="btn-ghost w-full justify-center text-sm py-3">
            Back to Sign In
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join 50,000+ job seekers. It's free."
    >
      {/* Google OAuth */}
      <GoogleButton
        onClick={handleGoogleSignUp}
        loading={googleLoading}
        label="Sign up with Google"
      />

      <OrDivider />

      {/* Alerts */}
      {error && <FormAlert type="error" message={error} />}

      {/* Sign up form */}
      <form onSubmit={handleSignUp} className="flex flex-col gap-4" noValidate>
        <FormField
          id="signup-name"
          label="Full name"
          type="text"
          placeholder="Jane Smith"
          value={fullName}
          onChange={setFullName}
          required
          autoComplete="name"
          disabled={loading}
        />
        <FormField
          id="signup-email"
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
          <FormField
            id="signup-password"
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={setPassword}
            required
            autoComplete="new-password"
            disabled={loading}
          />
          <PasswordStrengthBar password={password} />
        </div>

        {/* Terms agreement */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded flex-shrink-0 accent-red-600"
            id="signup-terms"
            aria-required="true"
          />
          <span className="text-sm" style={{ color: "var(--color-muted)" }}>
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-medium hover:underline"
              style={{ color: "var(--color-cta)" }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium hover:underline"
              style={{ color: "var(--color-cta)" }}
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        <SubmitButton
          label="Create free account"
          loading={loading}
          loadingLabel="Creating account..."
        />
      </form>

      {/* Sign in link */}
      <p
        className="mt-5 text-center text-sm"
        style={{ color: "var(--color-muted)" }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold hover:underline"
          style={{ color: "var(--color-cta)" }}
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
