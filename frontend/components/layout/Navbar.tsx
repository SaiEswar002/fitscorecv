"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Templates", href: "/templates", hasDropdown: true },
  { label: "ATS Checker", href: "/ats" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

// ── Logo ──────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1 select-none" aria-label="FitScoreCV Home">
      <span className="text-xl font-black tracking-tight" style={{ color: "var(--color-heading)" }}>
        FitScore
      </span>
      <span
        className="text-xl font-black tracking-tight px-1 py-0.5 rounded"
        style={{ color: "#ffffff", background: "var(--color-cta)", lineHeight: 1 }}
      >
        CV
      </span>
    </Link>
  );
}

// ── User Avatar Button (authenticated state) ──────────────────────────────────

function UserAvatarButton() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const initials =
    user.user_metadata?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? user.email?.[0]?.toUpperCase() ?? "?";

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
        style={{
          background: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border)",
        }}
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
            style={{ background: "var(--color-cta)" }}
          >
            {initials}
          </div>
        )}
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform duration-200"
          style={{ color: "var(--color-muted)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            className="absolute right-0 top-full mt-2 w-44 rounded-xl p-1.5 z-50"
            style={{
              background: "var(--color-card-bg)",
              border: "1px solid var(--color-card-border)",
              boxShadow: "var(--shadow-card)",
              backdropFilter: "blur(12px)",
            }}
            role="menu"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-opacity-80"
              style={{ color: "var(--color-heading)" }}
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <LayoutDashboard className="w-4 h-4" aria-hidden="true" style={{ color: "var(--color-cta)" }} />
              Dashboard
            </Link>
            <div className="my-1 h-px" style={{ background: "var(--color-border)" }} />
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors"
              style={{ color: "#ef4444" }}
              role="menuitem"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────

export function Navbar() {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 20), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isAuthenticated = !loading && !!user;

  return (
    <>
      <style>{`
        .nav-link { color: var(--color-muted); transition: color 0.2s ease; font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 0.25rem; text-decoration: none; }
        .nav-link:hover { color: var(--color-cta); }
        .nav-login-btn { color: var(--color-heading); font-size: 0.875rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 0.5rem; text-decoration: none; transition: color 0.2s ease; }
        .nav-login-btn:hover { color: var(--color-cta); }
        .mobile-nav-link { color: var(--color-heading); font-size: 1.125rem; font-weight: 600; display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid var(--color-border); text-decoration: none; transition: color 0.2s ease; }
        .mobile-nav-link:hover { color: var(--color-cta); }
      `}</style>

      <header
        className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300")}
        style={{
          background: scrolled ? "var(--color-nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-nav-border)" : "1px solid transparent",
          boxShadow: scrolled ? "var(--shadow-nav)" : "none",
        }}
      >
        <nav className="container-max flex items-center justify-between px-4 md:px-6 h-16" aria-label="Main navigation">
          <Logo />

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-6" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} role="listitem">
                <Link href={item.href} className="nav-link">
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {loading ? (
              <div className="w-20 h-8 rounded-lg animate-pulse" style={{ background: "var(--color-surface-elevated)" }} />
            ) : isAuthenticated ? (
              <>
                <Link href="/dashboard" className="nav-login-btn flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                  Dashboard
                </Link>
                <UserAvatarButton />
              </>
            ) : (
              <>
                <Link href="/login" className="nav-login-btn">Login</Link>
                <Link href="/signup" className="btn-primary text-sm px-4 py-2" aria-label="Get Started Free">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)", color: "var(--color-heading)" }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-4 h-4" aria-hidden="true" /> : <Menu className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        className={cn("fixed inset-0 z-40 md:hidden flex flex-col transition-all duration-300 ease-in-out", mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        style={{ background: "var(--color-nav-bg)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)" }}
        role="dialog" aria-modal="true" aria-label="Mobile navigation"
      >
        <div className="h-16" />
        <nav className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="mobile-nav-link">
              {item.label}
              {item.hasDropdown && <ChevronDown className="w-5 h-5" style={{ color: "var(--color-muted)" }} aria-hidden="true" />}
            </Link>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary text-base py-3 justify-center">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-ghost text-base py-3 justify-center">Login</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-base py-3 justify-center">Get Started Free</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
