"use client";

import { Plus, Trash2, GripVertical, X } from "lucide-react";
import { makeBlankExperience } from "@/lib/types/resume";
import type { ResumeExperience, ResumeExperienceBullet } from "@/lib/types/resume";
import { SectionHeader } from "./ContactSection";

interface Props {
  data: ResumeExperience[];
  onChange: (data: ResumeExperience[]) => void;
}

function TextInput({ label, id, value, onChange, placeholder, className = "" }: {
  label?: string; id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>{label}</label>}
      <input id={id} type="text" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
        style={{ background: "var(--color-surface-elevated)", border: "1.5px solid var(--color-border)", color: "var(--color-heading)" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-cta)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
      />
    </div>
  );
}

export function ExperienceSection({ data, onChange }: Props) {
  function update(idx: number, patch: Partial<ResumeExperience>) {
    const next = data.map((e, i) => i === idx ? { ...e, ...patch } : e);
    onChange(next);
  }
  function remove(idx: number) { onChange(data.filter((_, i) => i !== idx)); }
  function addEntry() { onChange([...data, makeBlankExperience()]); }

  function updateBullet(expIdx: number, bIdx: number, text: string) {
    const bullets = data[expIdx].bullets.map((b, i) => i === bIdx ? { ...b, text } : b);
    update(expIdx, { bullets });
  }
  function addBullet(expIdx: number) {
    const bullets = [...data[expIdx].bullets, { id: crypto.randomUUID(), text: "" }];
    update(expIdx, { bullets });
  }
  function removeBullet(expIdx: number, bIdx: number) {
    const bullets = data[expIdx].bullets.filter((_, i) => i !== bIdx);
    update(expIdx, { bullets });
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader title="Work Experience" subtitle="List your most recent roles first." />
      {data.length === 0 && (
        <div className="text-center py-8 rounded-xl" style={{ border: "1.5px dashed var(--color-border)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--color-muted)" }}>No experience added yet.</p>
          <button onClick={addEntry} className="text-sm font-semibold" style={{ color: "var(--color-cta)" }}>+ Add your first role</button>
        </div>
      )}
      {data.map((exp, idx) => (
        <div key={exp.id} className="rounded-xl p-4 flex flex-col gap-3"
          style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4" style={{ color: "var(--color-muted)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--color-heading)" }}>
                {exp.title || exp.company ? `${exp.title}${exp.company ? ` @ ${exp.company}` : ""}` : `Role ${idx + 1}`}
              </span>
            </div>
            <button onClick={() => remove(idx)} className="p-1 rounded-lg hover:opacity-70 transition-opacity" aria-label="Remove experience">
              <Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput label="Job Title" id={`exp-title-${idx}`} value={exp.title} placeholder="Software Engineer" onChange={(v) => update(idx, { title: v })} />
            <TextInput label="Company" id={`exp-company-${idx}`} value={exp.company} placeholder="Acme Corp" onChange={(v) => update(idx, { company: v })} />
            <TextInput label="Location" id={`exp-loc-${idx}`} value={exp.location} placeholder="New York, NY / Remote" onChange={(v) => update(idx, { location: v })} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Dates</label>
              <div className="flex items-center gap-2">
                <input type="text" value={exp.startDate} placeholder="Jan 2022" onChange={(e) => update(idx, { startDate: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)", color: "var(--color-heading)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-cta)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
                />
                <span className="text-sm" style={{ color: "var(--color-muted)" }}>–</span>
                {exp.current ? (
                  <span className="flex-1 px-3 py-2 text-sm rounded-lg" style={{ background: "var(--color-badge-bg)", color: "var(--color-cta)" }}>Present</span>
                ) : (
                  <input type="text" value={exp.endDate} placeholder="Dec 2023" onChange={(e) => update(idx, { endDate: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
                    style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)", color: "var(--color-heading)" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-cta)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
                  />
                )}
              </div>
              <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
                <input type="checkbox" checked={exp.current} onChange={(e) => update(idx, { current: e.target.checked, endDate: e.target.checked ? "" : exp.endDate })}
                  className="rounded" style={{ accentColor: "var(--color-cta)" }} />
                <span className="text-xs" style={{ color: "var(--color-muted)" }}>I currently work here</span>
              </label>
            </div>
          </div>
          {/* Bullet points */}
          <div className="flex flex-col gap-2 mt-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Key Achievements / Responsibilities</label>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>💡 Start each bullet with a strong action verb. Quantify results (e.g., "Reduced load time by 40%").</p>
            {exp.bullets.map((bullet: ResumeExperienceBullet, bIdx: number) => (
              <div key={bullet.id} className="flex items-start gap-2">
                <span className="mt-2.5 text-xs" style={{ color: "var(--color-cta)" }}>•</span>
                <input type="text" value={bullet.text} placeholder="Increased conversion rate by 25% by redesigning checkout flow…"
                  onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)", color: "var(--color-heading)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-cta)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
                />
                {exp.bullets.length > 1 && (
                  <button onClick={() => removeBullet(idx, bIdx)} className="mt-2 p-1 rounded hover:opacity-70" aria-label="Remove bullet">
                    <X className="w-3.5 h-3.5" style={{ color: "var(--color-muted)" }} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addBullet(idx)} className="text-xs font-medium self-start mt-1 flex items-center gap-1" style={{ color: "var(--color-cta)" }}>
              <Plus className="w-3 h-3" /> Add bullet
            </button>
          </div>
        </div>
      ))}
      {data.length > 0 && (
        <button onClick={addEntry}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold self-start transition-all"
          style={{ border: "1.5px dashed var(--color-border)", color: "var(--color-cta)" }}>
          <Plus className="w-4 h-4" /> Add another role
        </button>
      )}
    </div>
  );
}
