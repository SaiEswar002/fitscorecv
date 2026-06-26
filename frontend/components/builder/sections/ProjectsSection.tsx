"use client";

import { useState, type KeyboardEvent } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { makeBlankProject } from "@/lib/types/resume";
import type { ResumeProject } from "@/lib/types/resume";
import { SectionHeader } from "./ContactSection";

interface Props { data: ResumeProject[]; onChange: (d: ResumeProject[]) => void; }

function TechTagInput({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  function add(raw: string) {
    const tags = raw.split(/[,\n]/).map(t => t.trim()).filter(t => t && !values.includes(t));
    if (tags.length) onChange([...values, ...tags]);
    setInput("");
  }
  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(input); }
    if (e.key === "Backspace" && !input && values.length) onChange(values.slice(0, -1));
  }
  return (
    <div className="flex flex-wrap gap-1.5 p-2 rounded-lg min-h-[36px]"
      style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)" }}>
      {values.map(v => (
        <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
          style={{ background: "var(--color-badge-bg)", color: "var(--color-cta)" }}>
          {v}
          <button onClick={() => onChange(values.filter(x => x !== v))} aria-label={`Remove ${v}`}><X className="w-2.5 h-2.5" /></button>
        </span>
      ))}
      <input value={input} placeholder={values.length ? "" : "React, Node.js, AWS…"}
        onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
        onBlur={() => { if (input.trim()) add(input); }}
        className="flex-1 min-w-[80px] bg-transparent text-xs outline-none" style={{ color: "var(--color-heading)" }}
      />
    </div>
  );
}

export function ProjectsSection({ data, onChange }: Props) {
  const update = (idx: number, patch: Partial<ResumeProject>) => onChange(data.map((p, i) => i === idx ? { ...p, ...patch } : p));
  const remove = (idx: number) => onChange(data.filter((_, i) => i !== idx));
  const add = () => onChange([...data, makeBlankProject()]);

  const inputCls = "w-full px-3 py-2 rounded-lg text-sm outline-none transition-all";
  const inputStyle = { background: "var(--color-surface-elevated)", border: "1.5px solid var(--color-border)", color: "var(--color-heading)" };
  const fo = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "var(--color-cta)"; };
  const bl = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = "var(--color-border)"; };

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader title="Projects" subtitle="Side projects, open source, or significant work samples." />
      {data.length === 0 && (
        <div className="text-center py-8 rounded-xl" style={{ border: "1.5px dashed var(--color-border)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--color-muted)" }}>No projects added yet.</p>
          <button onClick={add} className="text-sm font-semibold" style={{ color: "var(--color-cta)" }}>+ Add project</button>
        </div>
      )}
      {data.map((proj, idx) => (
        <div key={proj.id} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)" }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold" style={{ color: "var(--color-heading)" }}>{proj.name || `Project ${idx + 1}`}</span>
            <button onClick={() => remove(idx)} className="p-1 rounded hover:opacity-70" aria-label="Remove"><Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Project Name</label>
              <input type="text" value={proj.name} placeholder="FitScoreCV" onChange={e => update(idx, { name: e.target.value })} className={inputCls} style={inputStyle} onFocus={fo} onBlur={bl} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>URL (optional)</label>
              <input type="url" value={proj.url} placeholder="https://github.com/…" onChange={e => update(idx, { url: e.target.value })} className={inputCls} style={inputStyle} onFocus={fo} onBlur={bl} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Description</label>
            <textarea rows={3} value={proj.description} placeholder="Built an ATS-first resume optimizer that…"
              onChange={e => update(idx, { description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none transition-all"
              style={{ ...inputStyle, lineHeight: "1.5" }} onFocus={fo} onBlur={bl}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Technologies Used</label>
            <TechTagInput values={proj.technologies} onChange={v => update(idx, { technologies: v })} />
          </div>
        </div>
      ))}
      {data.length > 0 && (
        <button onClick={add} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold self-start" style={{ border: "1.5px dashed var(--color-border)", color: "var(--color-cta)" }}>
          <Plus className="w-4 h-4" /> Add another project
        </button>
      )}
    </div>
  );
}
