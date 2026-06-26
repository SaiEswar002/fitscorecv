import type { Metadata } from "next";
import { Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings — FitScoreCV",
  description: "Manage your FitScoreCV account settings.",
};

export default function SettingsPage() {
  return (
    <div className="container-max px-4 md:px-6 py-10 max-w-2xl">
      <h1 className="text-2xl font-black mb-8" style={{ color: "var(--color-heading)" }}>
        Settings
      </h1>

      <div className="rounded-2xl p-10 card-glass flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--color-badge-bg)", border: "1px solid var(--color-border)" }}>
          <Settings className="w-7 h-7" style={{ color: "var(--color-cta)" }} aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold" style={{ color: "var(--color-heading)" }}>
          Account Settings
        </h2>
        <p className="text-sm max-w-sm" style={{ color: "var(--color-muted)" }}>
          Notification preferences, privacy controls, and account management will be available here in a future update.
        </p>
        <span className="text-xs px-3 py-1 rounded-full font-semibold mt-2"
          style={{ background: "var(--color-badge-bg)", color: "var(--color-muted)", border: "1px solid var(--color-border)" }}>
          Coming Soon
        </span>
      </div>
    </div>
  );
}
