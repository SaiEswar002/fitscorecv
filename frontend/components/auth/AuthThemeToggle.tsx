"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

/**
 * Minimal theme toggle for auth pages (no full Navbar).
 */
export function AuthThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg" style={{ background: "var(--color-surface-elevated)" }} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
      style={{
        background: "var(--color-surface-elevated)",
        border: "1px solid var(--color-border)",
        color: "var(--color-heading)",
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
}
