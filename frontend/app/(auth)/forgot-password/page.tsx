"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AuthCard,
  FormField,
  FormAlert,
  SubmitButton,
} from "@/components/auth/AuthFormComponents";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const supabase = createClient();

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard
        title="Check your email 📬"
        subtitle="Password reset link sent"
      >
        <FormAlert
          type="success"
          message={`We sent a password reset link to ${email}. Check your inbox (and spam folder).`}
        />
        <div className="mt-5 space-y-3">
          <Link
            href="/login"
            className="btn-primary w-full justify-center text-sm py-3"
          >
            Back to Sign In
          </Link>
          <button
            onClick={() => setSent(false)}
            className="w-full text-sm text-center hover:underline"
            style={{ color: "var(--color-muted)" }}
          >
            Send again
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {error && <FormAlert type="error" message={error} />}

      <form onSubmit={handleReset} className="flex flex-col gap-4" noValidate>
        <FormField
          id="forgot-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
          disabled={loading}
        />
        <SubmitButton
          label="Send reset link"
          loading={loading}
          loadingLabel="Sending..."
        />
      </form>

      <Link
        href="/login"
        className="mt-5 flex items-center justify-center gap-1.5 text-sm hover:underline"
        style={{ color: "var(--color-muted)" }}
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        Back to Sign In
      </Link>
    </AuthCard>
  );
}
