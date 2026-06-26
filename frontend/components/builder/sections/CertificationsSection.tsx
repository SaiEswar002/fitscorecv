"use client";

import { Plus, Trash2 } from "lucide-react";
import { makeBlankCertification } from "@/lib/types/resume";
import type { ResumeCertification } from "@/lib/types/resume";
import { SectionHeader } from "./ContactSection";

interface Props { data: ResumeCertification[]; onChange: (d: ResumeCertification[]) => void; }

export function CertificationsSection({ data, onChange }: Props) {
  const update = (idx: number, patch: Partial<ResumeCertification>) => onChange(data.map((c, i) => i === idx ? { ...c, ...patch } : c));
  const remove = (idx: number) => onChange(data.filter((_, i) => i !== idx));
  const add = () => onChange([...data, makeBlankCertification()]);

  const inputStyle = {
    background: "var(--color-surface-elevated)", border: "1.5px solid var(--color-border)", color: "var(--color-heading)",
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader title="Certifications" subtitle="AWS, Google Cloud, PMP, CPA — anything relevant." />
      {data.length === 0 && (
        <div className="text-center py-8 rounded-xl" style={{ border: "1.5px dashed var(--color-border)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--color-muted)" }}>No certifications added yet.</p>
          <button onClick={add} className="text-sm font-semibold" style={{ color: "var(--color-cta)" }}>+ Add certification</button>
        </div>
      )}
      {data.map((cert, idx) => (
        <div key={cert.id} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)" }}>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["name", "issuer", "year"] as const).map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
                  {field === "name" ? "Certification" : field === "issuer" ? "Issuer" : "Year"}
                </label>
                <input type="text" value={cert[field]}
                  placeholder={field === "name" ? "AWS Solutions Architect" : field === "issuer" ? "Amazon Web Services" : "2023"}
                  onChange={(e) => update(idx, { [field]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-cta)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
                />
              </div>
            ))}
          </div>
          <button onClick={() => remove(idx)} className="p-1 mt-6 rounded hover:opacity-70" aria-label="Remove"><Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} /></button>
        </div>
      ))}
      {data.length > 0 && (
        <button onClick={add} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold self-start" style={{ border: "1.5px dashed var(--color-border)", color: "var(--color-cta)" }}>
          <Plus className="w-4 h-4" /> Add another
        </button>
      )}
    </div>
  );
}
