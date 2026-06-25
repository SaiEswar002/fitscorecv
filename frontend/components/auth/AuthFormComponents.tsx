"use client";

import { type ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// ── Auth Card ─────────────────────────────────────────────────────────────────

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div
      className="w-full max-w-md rounded-2xl p-8 card-glass"
      style={{ boxShadow: "var(--shadow-score)" }}
    >
      <div className="mb-7">
        <h1
          className="text-2xl font-black mb-1"
          style={{ color: "var(--color-heading)" }}
        >
          {title}
        </h1>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
}

// ── Form Field ────────────────────────────────────────────────────────────────

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  hint?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
  disabled = false,
  hint,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-semibold"
        style={{ color: "var(--color-heading)" }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--color-cta)" }} aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
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
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-xs" style={{ color: "var(--color-muted)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Alert ─────────────────────────────────────────────────────────────────────

interface AlertProps {
  type: "error" | "success";
  message: string;
}

export function FormAlert({ type, message }: AlertProps) {
  const isError = type === "error";
  return (
    <div
      className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
      role="alert"
      aria-live="polite"
      style={{
        background: isError
          ? "rgba(239,68,68,0.1)"
          : "rgba(34,197,94,0.1)",
        border: `1px solid ${isError ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
        color: isError ? "#ef4444" : "#22c55e",
      }}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
      )}
      <span>{message}</span>
    </div>
  );
}

// ── Google OAuth Button ───────────────────────────────────────────────────────

interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}

export function GoogleButton({
  onClick,
  loading = false,
  label = "Continue with Google",
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        background: "var(--color-surface-elevated)",
        border: "1.5px solid var(--color-border)",
        color: "var(--color-heading)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
      aria-label="Continue with Google"
    >
      {/* Google G logo */}
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        />
      </svg>
      {loading ? "Connecting..." : label}
    </button>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────

export function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
      <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
        or
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
    </div>
  );
}

// ── Submit Button ─────────────────────────────────────────────────────────────

interface SubmitButtonProps {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
}

export function SubmitButton({
  label,
  loading = false,
  loadingLabel = "Please wait...",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn-primary w-full py-3.5 justify-center text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
      aria-disabled={loading}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
