"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
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

// ── Logo Component ─────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-1 select-none"
      aria-label="FitScoreCV Home"
    >
      <span
        className="text-xl font-black tracking-tight"
        style={{ color: "var(--color-heading)" }}
      >
        FitScore
      </span>
      <span
        className="text-xl font-black tracking-tight px-1 py-0.5 rounded"
        style={{
          color: "#ffffff",
          background: "var(--color-cta)",
          lineHeight: 1,
        }}
      >
        CV
      </span>
    </Link>
  );
}

// ── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="w-9 h-9 rounded-lg"
        style={{ background: "var(--color-surface-elevated)" }}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
      style={{
        background: "var(--color-surface-elevated)",
        border: "1px solid var(--color-border)",
        color: "var(--color-heading)",
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <Sun className="w-4 h-4" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4" aria-hidden="true" />
      )}
    </button>
  );
}

// ── Main Navbar ────────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

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
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* CSS hover styles */}
      <style>{`
        .nav-link {
          color: var(--color-muted);
          transition: color 0.2s ease;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          text-decoration: none;
        }
        .nav-link:hover {
          color: var(--color-cta);
        }
        .nav-login-btn {
          color: var(--color-heading);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .nav-login-btn:hover {
          color: var(--color-cta);
        }
        .mobile-nav-link {
          color: var(--color-heading);
          font-size: 1.125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid var(--color-border);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .mobile-nav-link:hover {
          color: var(--color-cta);
        }
      `}</style>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300"
        )}
        style={{
          background: scrolled ? "var(--color-nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled
            ? "blur(20px) saturate(180%)"
            : "none",
          borderBottom: scrolled
            ? "1px solid var(--color-nav-border)"
            : "1px solid transparent",
          boxShadow: scrolled ? "var(--shadow-nav)" : "none",
        }}
      >
        <nav
          className="container-max flex items-center justify-between px-4 md:px-6 h-16"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Logo />

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-6" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} role="listitem">
                <Link href={item.href} className="nav-link">
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="nav-login-btn">
              Login
            </Link>
            <Link
              href="/dashboard"
              className="btn-primary text-sm px-4 py-2"
              aria-label="Get Started Free — Create your account"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border)",
                color: "var(--color-heading)",
              }}
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
                <X className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Menu className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 md:hidden flex flex-col",
          "transition-all duration-300 ease-in-out",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        style={{
          background: "var(--color-nav-bg)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="h-16" />
        <nav
          className="flex-1 flex flex-col px-6 py-8 gap-0 overflow-y-auto"
          aria-label="Mobile navigation links"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="mobile-nav-link"
            >
              {item.label}
              {item.hasDropdown && (
                <ChevronDown
                  className="w-5 h-5"
                  aria-hidden="true"
                  style={{ color: "var(--color-muted)" }}
                />
              )}
            </Link>
          ))}

          {/* Mobile CTAs */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="btn-ghost text-base py-3 justify-center"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-base py-3 justify-center"
            >
              Get Started Free
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
