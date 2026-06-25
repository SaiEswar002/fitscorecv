"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AuthCard,
  FormField,
  FormAlert,
  SubmitButton,
} from "@/components/auth/AuthFormComponents";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Password updated — sign out all other sessions and redirect
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthCard
      title="Set new password"
      subtitle="Choose a strong password for your account"
    >
      {error && <FormAlert type="error" message={error} />}

      <form onSubmit={handleReset} className="flex flex-col gap-4" noValidate>
        <FormField
          id="reset-password"
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={setPassword}
          required
          autoComplete="new-password"
          disabled={loading}
          hint="At least 8 characters with a mix of letters and numbers"
        />
        <FormField
          id="reset-confirm-password"
          label="Confirm new password"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          autoComplete="new-password"
          disabled={loading}
        />
        <SubmitButton
          label="Update password"
          loading={loading}
          loadingLabel="Updating..."
        />
      </form>

      <Link
        href="/login"
        className="mt-5 flex items-center justify-center gap-1.5 text-sm hover:underline"
        style={{ color: "var(--color-muted)" }}
      >
        Back to Sign In
      </Link>
    </AuthCard>
  );
}
