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
      lineHeight: settings.lineSpacing,
      padding:    MARGIN_PX_MAP[settings.margins] ?? MARGIN_PX_MAP["normal"],
      color:      "#111",
    }}>

      {settings.sectionOrder.map((sectionId) => {
        switch (sectionId) {
          case "contact":
            if (!contact.name) return null;
            return (
              <div key="contact" className="mb-[10px]">
                <h1 className="font-bold text-[#111]" style={{ fontSize: `${settings.nameSize}pt` }}>{contact.name}</h1>
                <p className="text-[#444] mt-[2px]" style={{ fontSize: `${Math.max(8, settings.bodySize - 1.5)}pt` }}>
                  {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean).join("  |  ")}
                </p>
              </div>
            );

          case "summary":
            if (!summary) return null;
            return (
              <MinSection key="summary" title="Summary" headingSize={settings.headingSize}>
                <p style={{ fontSize: `${settings.bodySize}pt` }}>{summary}</p>
              </MinSection>
            );

          case "experience":
            if (experience.length === 0) return null;
            return (
              <MinSection key="experience" title="Experience" headingSize={settings.headingSize}>
                {experience.map(exp => (
                  <div key={exp.id} className="mb-[8px]" style={{ fontSize: `${settings.bodySize}pt` }}>
                    <div className="flex justify-between">
                      <strong>{exp.title}{exp.company ? `, ${exp.company}` : ""}</strong>
                      <span className="text-[#555]">{exp.startDate}{exp.startDate ? "–" : ""}{exp.current ? "Present" : exp.endDate}</span>
                    </div>
                    {exp.location && <p className="text-[#555]" style={{ fontSize: `${Math.max(8, settings.bodySize - 1.5)}pt` }}>{exp.location}</p>}
                    {exp.bullets.filter(b => b.text).map(b => (
                      <p key={b.id} className="ml-[12px] before:content-['-'] before:mr-[4px]">{b.text}</p>
                    ))}
                  </div>
                ))}
              </MinSection>
            );

          case "education":
            if (education.length === 0) return null;
            return (
              <MinSection key="education" title="Education" headingSize={settings.headingSize}>
                {education.map(edu => (
                  <div key={edu.id} className="mb-[5px]" style={{ fontSize: `${settings.bodySize}pt` }}>
                    <div className="flex justify-between">
                      <strong>{edu.degree}{edu.school ? `, ${edu.school}` : ""}</strong>
                      <span className="text-[#555]">{edu.graduationYear}</span>
                    </div>
                    {edu.location && <p className="text-[#555]">{edu.location}{edu.gpa ? `  ·  GPA: ${edu.gpa}` : ""}</p>}
                  </div>
                ))}
              </MinSection>
            );

          case "skills":
            if (allSkills.length === 0) return null;
            return (
              <MinSection key="skills" title="Skills" headingSize={settings.headingSize}>
                <p style={{ fontSize: `${settings.bodySize}pt` }}>{allSkills.join(", ")}</p>
              </MinSection>
            );

          case "certifications":
            if (certifications.length === 0) return null;
            return (
              <MinSection key="certifications" title="Certifications" headingSize={settings.headingSize}>
                {certifications.map(cert => (
                  <p key={cert.id} style={{ fontSize: `${settings.bodySize}pt` }}>{cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}{cert.year ? ` (${cert.year})` : ""}</p>
                ))}
              </MinSection>
            );

          case "projects":
            if (projects.length === 0) return null;
            return (
              <MinSection key="projects" title="Projects" headingSize={settings.headingSize}>
                {projects.map(proj => (
                  <div key={proj.id} className="mb-[5px]" style={{ fontSize: `${settings.bodySize}pt` }}>
                    <strong>{proj.name}</strong>{proj.url ? ` (${proj.url})` : ""}
                    {proj.description && <p>{proj.description}</p>}
                    {proj.technologies.length > 0 && <p className="text-[#555]">Technologies: {proj.technologies.join(", ")}</p>}
                  </div>
                ))}
              </MinSection>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

function MinSection({ title, headingSize, children }: { title: string; headingSize: number; children: React.ReactNode }) {
  return (
    <div className="mb-[10px]">
      <h2 className="font-bold uppercase tracking-wider mb-[3px] pb-[2px]"
        style={{ borderBottom: "1px solid #999", fontSize: `${headingSize}pt` }}>{title}</h2>
      {children}
    </div>
  );
}
