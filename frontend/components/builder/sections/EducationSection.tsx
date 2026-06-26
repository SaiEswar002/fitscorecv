"use client";

import { Plus, Trash2 } from "lucide-react";
import { makeBlankEducation } from "@/lib/types/resume";
import type { ResumeEducation } from "@/lib/types/resume";
import { SectionHeader } from "./ContactSection";

interface Props { data: ResumeEducation[]; onChange: (d: ResumeEducation[]) => void; }

function TF({ label, id, value, onChange, placeholder }: { label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>{label}</label>
      <input id={id} type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
        style={{ background: "var(--color-surface-elevated)", border: "1.5px solid var(--color-border)", color: "var(--color-heading)" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-cta)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
      />
    </div>
  );
}

export function EducationSection({ data, onChange }: Props) {
  const update = (idx: number, patch: Partial<ResumeEducation>) => onChange(data.map((e, i) => i === idx ? { ...e, ...patch } : e));
  const remove = (idx: number) => onChange(data.filter((_, i) => i !== idx));
  const add = () => onChange([...data, makeBlankEducation()]);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader title="Education" subtitle="List your highest degree first." />
      {data.length === 0 && (
        <div className="text-center py-8 rounded-xl" style={{ border: "1.5px dashed var(--color-border)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--color-muted)" }}>No education added yet.</p>
          <button onClick={add} className="text-sm font-semibold" style={{ color: "var(--color-cta)" }}>+ Add education</button>
        </div>
      )}
      {data.map((edu, idx) => (
        <div key={edu.id} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)" }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold" style={{ color: "var(--color-heading)" }}>
              {edu.degree || edu.school ? `${edu.degree}${edu.school ? ` — ${edu.school}` : ""}` : `Education ${idx + 1}`}
            </span>
            <button onClick={() => remove(idx)} className="p-1 rounded-lg hover:opacity-70" aria-label="Remove"><Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TF label="Degree / Qualification" id={`edu-degree-${idx}`} value={edu.degree} placeholder="B.S. Computer Science" onChange={(v) => update(idx, { degree: v })} />
            <TF label="School / University" id={`edu-school-${idx}`} value={edu.school} placeholder="MIT" onChange={(v) => update(idx, { school: v })} />
            <TF label="Location" id={`edu-loc-${idx}`} value={edu.location} placeholder="Cambridge, MA" onChange={(v) => update(idx, { location: v })} />
            <div className="grid grid-cols-2 gap-2">
              <TF label="Grad Year" id={`edu-year-${idx}`} value={edu.graduationYear} placeholder="2022" onChange={(v) => update(idx, { graduationYear: v })} />
              <TF label="GPA (optional)" id={`edu-gpa-${idx}`} value={edu.gpa} placeholder="3.8 / 4.0" onChange={(v) => update(idx, { gpa: v })} />
            </div>
          </div>
        </div>
      ))}
      {data.length > 0 && (
        <button onClick={add} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold self-start transition-all" style={{ border: "1.5px dashed var(--color-border)", color: "var(--color-cta)" }}>
          <Plus className="w-4 h-4" /> Add another
        </button>
      )}
    </div>
  );
}
