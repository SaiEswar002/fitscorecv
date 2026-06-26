import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { ResumeData } from "@/lib/types/resume";

export function getHealthWarnings(data: ResumeData): string[] {
  const w: string[] = [];

  if (!data.contact.phone)
    w.push("Phone number missing");
  if (!data.contact.email)
    w.push("Email missing");
  if (!data.contact.linkedin && !data.contact.website)
    w.push("No LinkedIn or portfolio URL");
  if (!data.summary)
    w.push("Professional summary is empty");
  else if (data.summary.trim().split(/\s+/).length < 20)
    w.push("Summary is too short (aim for 30+ words)");
  if (data.experience.length === 0)
    w.push("No work experience added");
  else {
    const noDesc = data.experience.filter((e) => e.bullets.every((b) => !b.text.trim()));
    if (noDesc.length > 0)
      w.push(`${noDesc.length} experience entry has no bullet points`);
  }
  if (data.skills.technical.length === 0 && data.skills.tools.length === 0)
    w.push("No technical skills listed");
  if (data.projects.length === 0)
    w.push("No projects listed");

  return w;
}

interface Props { data: ResumeData; }

export function ResumeHealthPanel({ data }: Props) {
  const [open, setOpen] = useState(false);
  const warnings = getHealthWarnings(data);

  if (warnings.length === 0) return null;

  return (
    <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "#f59e0b" }}>
          <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
          Resume Health ({warnings.length})
        </span>
        {open
          ? <ChevronUp className="w-3.5 h-3.5" style={{ color: "var(--color-muted)" }} aria-hidden="true" />
          : <ChevronDown className="w-3.5 h-3.5" style={{ color: "var(--color-muted)" }} aria-hidden="true" />
        }
      </button>

      {open && (
        <ul className="px-3 pb-3 flex flex-col gap-1.5">
          {warnings.map((w) => (
            <li key={w} className="flex items-start gap-2 text-xs"
              style={{ color: "var(--color-muted)" }}>
              <span className="mt-0.5 w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" aria-hidden="true" />
              {w}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
