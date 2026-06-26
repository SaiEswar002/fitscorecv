"use client";

import { SectionHeader } from "./ContactSection";

interface Props {
  data: string;
  onChange: (val: string) => void;
}

const MAX = 600;

export function SummarySection({ data, onChange }: Props) {
  const len = data.length;
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Professional Summary"
        subtitle="2–4 sentences. Use keywords from the job description for ATS."
      />
      <div className="flex flex-col gap-1.5">
        <textarea
          id="summary-text"
          rows={6}
          maxLength={MAX}
          placeholder="Results-driven Software Engineer with 5+ years building scalable web applications…"
          value={data}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all resize-none"
          style={{
            background: "var(--color-surface-elevated)",
            border: "1.5px solid var(--color-border)",
            color: "var(--color-heading)",
            lineHeight: "1.6",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-cta)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(190,26,26,0.1)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        <div className="flex justify-between items-center">
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            💡 Tip: Include job title keywords, years of experience, and 1–2 key achievements.
          </p>
          <span className="text-xs font-medium tabular-nums" style={{ color: len > MAX * 0.9 ? "#ef4444" : "var(--color-muted)" }}>
            {len}/{MAX}
          </span>
        </div>
      </div>
    </div>
  );
}
