import type { ResumeData } from "@/lib/types/resume";
import { getEffectiveSettings, FONT_CSS_MAP, MARGIN_PX_MAP } from "@/lib/types/resume";

interface Props { data: ResumeData; }

// Ultra-clean, maximum ATS compatibility — pure text, no visual decoration
export function MinimalTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = data;
  const settings  = getEffectiveSettings(data);
  const allSkills = [...skills.technical, ...skills.tools, ...skills.soft];

  return (
    <div style={{
      fontFamily: FONT_CSS_MAP[settings.fontFamily] ?? FONT_CSS_MAP["Arial"],
      fontSize:   `${settings.fontSize}pt`,
      lineHeight: settings.lineSpacing,
      padding:    MARGIN_PX_MAP[settings.margins] ?? MARGIN_PX_MAP["normal"],
      color:      "#111",
    }}>

      {/* Header */}
      {contact.name && (
        <div className="mb-[10px]">
          <h1 className="text-[18pt] font-bold text-[#111]">{contact.name}</h1>
          <p className="text-[9pt] text-[#444] mt-[2px]">
            {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean).join("  |  ")}
          </p>
        </div>
      )}

      {summary && <MinSection title="Summary"><p>{summary}</p></MinSection>}

      {experience.length > 0 && (
        <MinSection title="Experience">
          {experience.map(exp => (
            <div key={exp.id} className="mb-[8px]">
              <div className="flex justify-between">
                <strong>{exp.title}{exp.company ? `, ${exp.company}` : ""}</strong>
                <span className="text-[#555]">{exp.startDate}{exp.startDate ? "–" : ""}{exp.current ? "Present" : exp.endDate}</span>
              </div>
              {exp.location && <p className="text-[#555] text-[8.5pt]">{exp.location}</p>}
              {exp.bullets.filter(b => b.text).map(b => (
                <p key={b.id} className="ml-[12px] before:content-['-'] before:mr-[4px]">{b.text}</p>
              ))}
            </div>
          ))}
        </MinSection>
      )}

      {education.length > 0 && (
        <MinSection title="Education">
          {education.map(edu => (
            <div key={edu.id} className="mb-[5px]">
              <div className="flex justify-between">
                <strong>{edu.degree}{edu.school ? `, ${edu.school}` : ""}</strong>
                <span className="text-[#555]">{edu.graduationYear}</span>
              </div>
              {edu.location && <p className="text-[#555]">{edu.location}{edu.gpa ? `  ·  GPA: ${edu.gpa}` : ""}</p>}
            </div>
          ))}
        </MinSection>
      )}

      {allSkills.length > 0 && (
        <MinSection title="Skills">
          <p>{allSkills.join(", ")}</p>
        </MinSection>
      )}

      {certifications.length > 0 && (
        <MinSection title="Certifications">
          {certifications.map(cert => (
            <p key={cert.id}>{cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}{cert.year ? ` (${cert.year})` : ""}</p>
          ))}
        </MinSection>
      )}

      {projects.length > 0 && (
        <MinSection title="Projects">
          {projects.map(proj => (
            <div key={proj.id} className="mb-[5px]">
              <strong>{proj.name}</strong>{proj.url ? ` (${proj.url})` : ""}
              {proj.description && <p>{proj.description}</p>}
              {proj.technologies.length > 0 && <p className="text-[#555]">Technologies: {proj.technologies.join(", ")}</p>}
            </div>
          ))}
        </MinSection>
      )}
    </div>
  );
}

function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-[10px]">
      <h2 className="text-[9.5pt] font-bold uppercase tracking-wider mb-[3px] pb-[2px]"
        style={{ borderBottom: "1px solid #999" }}>{title}</h2>
      {children}
    </div>
  );
}
