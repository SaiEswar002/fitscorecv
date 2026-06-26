import type { ResumeData } from "@/lib/types/resume";
import { CheckCircle, Circle } from "lucide-react";

interface SectionStatus { id: string; label: string; complete: boolean; }

export function computeCompleteness(data: ResumeData): {
  score: number;
  sections: SectionStatus[];
} {
  const sections: SectionStatus[] = [
    { id: "contact",        label: "Contact",        complete: !!(data.contact.name && data.contact.email) },
    { id: "summary",        label: "Summary",        complete: data.summary.trim().length >= 30 },
    { id: "experience",     label: "Experience",     complete: data.experience.length > 0 },
    { id: "education",      label: "Education",      complete: data.education.length > 0 },
    { id: "skills",         label: "Skills",         complete: (
        data.skills.technical.length + data.skills.tools.length + data.skills.soft.length > 0
      ) },
    { id: "certifications", label: "Certifications", complete: data.certifications.length > 0 },
    { id: "projects",       label: "Projects",       complete: data.projects.length > 0 },
  ];

  const filled = sections.filter((s) => s.complete).length;
  const score  = Math.round((filled / sections.length) * 100);

  return { score, sections };
}

interface Props { data: ResumeData; }

export function CompletenessBar({ data }: Props) {
  const { score, sections } = computeCompleteness(data);

  const color =
    score >= 80 ? "#22c55e" :
    score >= 50 ? "#f59e0b" :
                  "var(--color-cta)";

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
          Completeness
        </p>
        <span className="text-xs font-black" style={{ color }}>
          {score}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-3"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }} />
      </div>

      {/* Per-section checklist */}
      <div className="flex flex-col gap-0.5">
        {sections.map((s) => (
          <div key={s.id} className="flex items-center gap-2 py-0.5">
            {s.complete
              ? <CheckCircle className="w-3 h-3 flex-shrink-0 text-green-500" aria-hidden="true" />
              : <Circle className="w-3 h-3 flex-shrink-0" style={{ color: "var(--color-muted)" }} aria-hidden="true" />
            }
            <span className="text-xs" style={{
              color: s.complete ? "var(--color-body)" : "var(--color-muted)",
              textDecoration: s.complete ? "none" : "none",
            }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
