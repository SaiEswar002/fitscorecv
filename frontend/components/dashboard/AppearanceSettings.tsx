"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Palette } from "lucide-react";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="rounded-2xl p-6 md:p-10 card-glass flex flex-col gap-6 w-full animate-pulse">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="flex gap-4">
          <div className="h-24 flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-24 flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-24 flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>
    );
  }

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="rounded-2xl p-6 md:p-10 card-glass flex flex-col gap-6 w-full">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--color-badge-bg)", border: "1px solid var(--color-border)" }}
        >
          <Palette className="w-5 h-5" style={{ color: "var(--color-cta)" }} />
        </div>
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--color-heading)" }}>
            Appearance
          </h2>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            Customize how FitScoreCV looks on your device.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        {options.map(({ value, label, icon: Icon }) => {
          const isActive = theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all duration-200 border-2"
              style={{
                background: isActive ? "var(--color-badge-bg)" : "transparent",
                borderColor: isActive ? "var(--color-cta)" : "var(--color-border)",
                color: isActive ? "var(--color-cta)" : "var(--color-heading)",
              }}
              aria-pressed={isActive}
            >
              <Icon className="w-6 h-6" />
              <span className="font-semibold text-sm">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
