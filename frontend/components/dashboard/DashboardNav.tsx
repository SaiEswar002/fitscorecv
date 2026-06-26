"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, LogOut, User, Settings } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface DashboardNavProps {
  user: SupabaseUser;
}

// ── User Avatar ───────────────────────────────────────────────────────────────

function Avatar({ user }: { user: SupabaseUser }) {
  const initials =
    user.user_metadata?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? user.email?.[0]?.toUpperCase() ?? "?";

  const avatarUrl =
    user.user_metadata?.avatar_url as string | undefined;

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={user.user_metadata?.full_name ?? "User avatar"}
        className="w-8 h-8 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
      style={{
        background: "linear-gradient(135deg, var(--color-cta) 0%, var(--color-cta-hover) 100%)",
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

// ── Main DashboardNav ─────────────────────────────────────────────────────────

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const displayName =
    user.user_metadata?.full_name ?? user.email ?? "Account";

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* CSS styles */}
      <style>{`
        .dashboard-nav-link {
          color: var(--color-muted);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
          position: relative;
          padding-bottom: 2px;
        }
        .dashboard-nav-link:hover {
          color: var(--color-cta);
        }
        .dashboard-nav-link.active {
          color: var(--color-cta);
          font-weight: 600;
        }
        .dashboard-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--color-cta);
          border-radius: 1px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.5rem 0.75rem;
          width: 100%;
          text-align: left;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          transition: background 0.15s ease;
          cursor: pointer;
          background: none;
          border: none;
          color: var(--color-heading);
          text-decoration: none;
        }
        .dropdown-item:hover {
          background: var(--color-badge-bg);
        }
        .dropdown-item-danger {
          color: #ef4444;
        }
        .dropdown-item-danger:hover {
          background: rgba(239,68,68,0.1);
        }
      `}</style>

      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "var(--color-nav-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "var(--color-nav-border)",
        }}
      >
        <div className="container-max px-4 md:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-1 select-none">
            <span
              className="text-lg font-black tracking-tight"
              style={{ color: "var(--color-heading)" }}
            >
              FitScore
            </span>
            <span
              className="text-lg font-black tracking-tight px-1 py-0.5 rounded text-white"
              style={{ background: "var(--color-cta)", lineHeight: 1 }}
            >
              CV
            </span>
          </Link>

          {/* Nav links — only link to routes that exist */}
          <nav className="hidden md:flex items-center gap-5" aria-label="Dashboard navigation">
            <Link
              href="/dashboard"
              className={`dashboard-nav-link${pathname === "/dashboard" ? " active" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              href="/builder"
              className={`dashboard-nav-link${pathname.startsWith("/builder") ? " active" : ""}`}
            >
              Resume Builder
            </Link>
          </nav>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 hover:bg-opacity-80"
              style={{
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border)",
              }}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
            >
              <Avatar user={user} />
              <span
                className="hidden sm:block text-sm font-medium max-w-[120px] truncate"
                style={{ color: "var(--color-heading)" }}
              >
                {displayName}
              </span>
              <ChevronDown
                className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
                style={{
                  color: "var(--color-muted)",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl p-1.5 z-50"
                  style={{
                    background: "var(--color-card-bg)",
                    border: "1px solid var(--color-card-border)",
                    boxShadow: "var(--shadow-card)",
                    backdropFilter: "blur(12px)",
                  }}
                  role="menu"
                  aria-label="User account options"
                >
                  <div
                    className="px-3 py-2 mb-1 border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" aria-hidden="true" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" aria-hidden="true" />
                    Settings
                  </Link>

                  <div
                    className="my-1 border-t"
                    style={{ borderColor: "var(--color-border)" }}
                  />

                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="dropdown-item dropdown-item-danger w-full"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    {signingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default DashboardNav;
