"use client";

import type { ResumeContact } from "@/lib/types/resume";

interface Props {
  data: ResumeContact;
  onChange: (data: ResumeContact) => void;
}

function Field({
  label, id, type = "text", placeholder, value, onChange, autoComplete,
}: {
  label: string; id: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-muted)" }}>
        {label}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} value={value} autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
        style={{
          background: "var(--color-surface-elevated)",
          border: "1.5px solid var(--color-border)",
          color: "var(--color-heading)",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-cta)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(190,26,26,0.1)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
      />
    </div>
  );
}

export function ContactSection({ data, onChange }: Props) {
  const set = (key: keyof ResumeContact) => (val: string) =>
    onChange({ ...data, [key]: val });

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Contact Information"
        subtitle="This appears at the top of your resume." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" id="contact-name" placeholder="Jane Smith"
          value={data.name} onChange={set("name")} autoComplete="name" />
        <Field label="Email" id="contact-email" type="email" placeholder="jane@example.com"
          value={data.email} onChange={set("email")} autoComplete="email" />
        <Field label="Phone" id="contact-phone" type="tel" placeholder="+1 (555) 000-0000"
          value={data.phone} onChange={set("phone")} autoComplete="tel" />
        <Field label="Location" id="contact-location" placeholder="San Francisco, CA"
          value={data.location} onChange={set("location")} />
        <Field label="LinkedIn URL" id="contact-linkedin" placeholder="linkedin.com/in/janesmith"
          value={data.linkedin} onChange={set("linkedin")} />
        <Field label="Portfolio / Website" id="contact-website" placeholder="janesmith.dev"
          value={data.website} onChange={set("website")} />
      </div>
    </div>
  );
}

// ── Shared header ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-base font-bold" style={{ color: "var(--color-heading)" }}>{title}</h2>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>{subtitle}</p>}
    </div>
  );
}
