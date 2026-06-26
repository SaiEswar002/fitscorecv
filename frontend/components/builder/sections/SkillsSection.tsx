"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import type { ResumeSkills } from "@/lib/types/resume";
import { SectionHeader } from "./ContactSection";

interface Props { data: ResumeSkills; onChange: (d: ResumeSkills) => void; }

type SkillGroup = keyof ResumeSkills;

const GROUPS: { key: SkillGroup; label: string; placeholder: string; tip: string }[] = [
  { key: "technical", label: "Technical Skills", placeholder: "React, TypeScript, Python…", tip: "Match keywords from job descriptions for ATS." },
  { key: "tools", label: "Tools & Platforms", placeholder: "GitHub, Docker, Figma…", tip: "Include version control, cloud platforms, dev tools." },
  { key: "soft", label: "Soft Skills", placeholder: "Leadership, Communication…", tip: "Keep to 4–6 soft skills. Quality over quantity." },
];

function TagInput({ label, placeholder, tip, values, onChange }: { label: string; placeholder: string; tip: string; values: string[]; onChange: (vals: string[]) => void; }) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tags = raw.split(/[,\n]/).map((t) => t.trim()).filter((t) => t && !values.includes(t));
    if (tags.length) onChange([...values, ...tags]);
    setInput("");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(input); }
    if (e.key === "Backspace" && !input && values.length) onChange(values.slice(0, -1));
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>{label}</label>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>{tip}</p>
      </div>
      <div className="flex flex-wrap gap-2 p-2.5 rounded-xl min-h-[44px] transition-all"
        style={{ background: "var(--color-surface-elevated)", border: "1.5px solid var(--color-border)" }}
        onClick={() => document.getElementById(`skill-input-${label}`)?.focus()}>
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: "var(--color-badge-bg)", color: "var(--color-cta)", border: "1px solid var(--color-border)" }}>
            {v}
            <button onClick={(e) => { e.stopPropagation(); onChange(values.filter((x) => x !== v)); }} className="hover:opacity-70" aria-label={`Remove ${v}`}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input id={`skill-input-${label}`} value={input} placeholder={values.length ? "" : placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => { if (input.trim()) addTag(input); }}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none"
          style={{ color: "var(--color-heading)" }}
        />
      </div>
      <p className="text-xs" style={{ color: "var(--color-muted)" }}>Press Enter or comma to add a tag.</p>
    </div>
  );
}

export function SkillsSection({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Skills" subtitle="Add skills as tags. ATS scans for exact keyword matches." />
      {GROUPS.map((g) => (
        <TagInput key={g.key} label={g.label} placeholder={g.placeholder} tip={g.tip}
          values={data[g.key]} onChange={(vals) => onChange({ ...data, [g.key]: vals })} />
      ))}
    </div>
  );
}
