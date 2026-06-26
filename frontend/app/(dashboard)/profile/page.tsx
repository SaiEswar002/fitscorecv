import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Mail, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile — FitScoreCV",
  description: "View and manage your FitScoreCV profile.",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = user.user_metadata?.full_name as string | undefined;
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const joinedAt = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const initials = fullName
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    ?? user.email?.[0]?.toUpperCase()
    ?? "?";

  return (
    <div className="container-max px-4 md:px-6 py-10 max-w-2xl">
      <h1 className="text-2xl font-black mb-8" style={{ color: "var(--color-heading)" }}>
        Your Profile
      </h1>

      <div className="rounded-2xl p-8 card-glass flex flex-col items-center gap-6 text-center">
        {/* Avatar */}
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="Profile picture"
            className="w-24 h-24 rounded-full object-cover"
            style={{ outline: "3px solid var(--color-border)", outlineOffset: "2px" }}
          />
        ) : (
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white"
            style={{ background: "linear-gradient(135deg, var(--color-cta) 0%, var(--color-cta-hover) 100%)" }}>
            {initials}
          </div>
        )}

        <div>
          <p className="text-xl font-bold" style={{ color: "var(--color-heading)" }}>
            {fullName ?? "No name set"}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            {user.email}
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {[
            { icon: User, label: "Full Name", value: fullName ?? "—" },
            { icon: Mail, label: "Email", value: user.email ?? "—" },
            { icon: Calendar, label: "Member Since", value: joinedAt },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-xl"
              style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)" }}>
              <Icon className="w-4 h-4" style={{ color: "var(--color-cta)" }} aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>{label}</p>
              <p className="text-sm font-medium break-all" style={{ color: "var(--color-heading)" }}>{value}</p>
            </div>
          ))}
        </div>

        <p className="text-xs mt-2" style={{ color: "var(--color-muted)" }}>
          Profile editing coming in a future update.
        </p>
      </div>
    </div>
  );
}
