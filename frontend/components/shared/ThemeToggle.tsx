"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="w-9 h-9 rounded-lg"
        style={{ background: "var(--color-surface-elevated)" }}
      />
    );
  }

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        style={{
          background: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border)",
          color: "var(--color-heading)",
        }}
        aria-label="Toggle theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {theme === "dark" ? (
          <Moon className="w-4 h-4" aria-hidden="true" />
        ) : theme === "light" ? (
          <Sun className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Monitor className="w-4 h-4" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 mt-2 w-36 rounded-xl p-1.5 z-50 origin-top-right shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            style={{
              background: "var(--color-card-bg)",
              border: "1px solid var(--color-card-border)",
              boxShadow: "var(--shadow-card)",
              backdropFilter: "blur(12px)",
            }}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="theme-menu"
          >
            <button
              onClick={() => toggleTheme("light")}
              className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:bg-opacity-80"
              style={{
                color: "var(--color-heading)",
                background: theme === "light" ? "var(--color-badge-bg)" : "transparent",
              }}
              role="menuitem"
            >
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </div>
              {theme === "light" && <Check className="w-3 h-3" />}
            </button>
            <button
              onClick={() => toggleTheme("dark")}
              className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:bg-opacity-80"
              style={{
                color: "var(--color-heading)",
                background: theme === "dark" ? "var(--color-badge-bg)" : "transparent",
              }}
              role="menuitem"
            >
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </div>
              {theme === "dark" && <Check className="w-3 h-3" />}
            </button>
            <button
              onClick={() => toggleTheme("system")}
              className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:bg-opacity-80"
              style={{
                color: "var(--color-heading)",
                background: theme === "system" ? "var(--color-badge-bg)" : "transparent",
              }}
              role="menuitem"
            >
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                <span>System</span>
              </div>
              {theme === "system" && <Check className="w-3 h-3" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
