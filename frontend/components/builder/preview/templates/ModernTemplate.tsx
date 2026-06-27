import type { ResumeData } from "@/lib/types/resume";
import { getEffectiveSettings, FONT_CSS_MAP } from "@/lib/types/resume";

interface Props { data: ResumeData; }

const ACCENT = "#BE1A1A";

export function ModernTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = data;
  const settings = getEffectiveSettings(data);
  const fontCss  = FONT_CSS_MAP[settings.fontFamily] ?? FONT_CSS_MAP["Arial"];

  return (
    <div style={{ fontFamily: fontCss, lineHeight: settings.lineSpacing, color: "#1a1a1a", display: "flex", minHeight: "100%" }}>

      {/* Sidebar */}
      <div className="w-[30%] flex-shrink-0 p-[24px] flex flex-col gap-[16px]"
        style={{ background: "#1a1a1a", color: "#f5f5f5" }}>
        
        {settings.sectionOrder.filter(id => ["contact", "skills", "education", "certifications"].includes(id)).map((sectionId) => {
          switch (sectionId) {
            case "contact":
              return (
                <div key="contact">
                  {contact.name && (
                    <div className="mb-[12px]">
                      <h1 className="font-bold leading-tight text-white" style={{ fontSize: `${settings.nameSize}pt` }}>{contact.name}</h1>
                    </div>
                  )}
                  <SideSection title="Contact" accent={ACCENT} headingSize={settings.headingSize}>
                    {[
                      { label: "Email", value: contact.email },
                      { label: "Phone", value: contact.phone },
                      { label: "Location", value: contact.location },
                      { label: "LinkedIn", value: contact.linkedin },
                      { label: "Web", value: contact.website },
                    ].filter(x => x.value).map(x => (
                      <div key={x.label} className="mb-[4px]" style={{ fontSize: `${Math.max(8, settings.bodySize - 1.5)}pt` }}>
                        <span style={{ color: "#aaa" }}>{x.label}</span>
                        <p className="text-[#eee] break-words">{x.value}</p>
                      </div>
                    ))}
                  </SideSection>
                </div>
              );

            case "skills":
              if (skills.technical.length === 0 && skills.tools.length === 0 && skills.soft.length === 0) return null;
              return (
                <SideSection key="skills" title="Skills" accent={ACCENT} headingSize={settings.headingSize}>
                  {skills.technical.length > 0 && <SkillGroup label="Technical" tags={skills.technical} bodySize={settings.bodySize} />}
                  {skills.tools.length > 0 && <SkillGroup label="Tools" tags={skills.tools} bodySize={settings.bodySize} />}
                  {skills.soft.length > 0 && <SkillGroup label="Soft" tags={skills.soft} bodySize={settings.bodySize} />}
                </SideSection>
              );

            case "education":
              if (education.length === 0) return null;
              return (
                <SideSection key="education" title="Education" accent={ACCENT} headingSize={settings.headingSize}>
                  {education.map(edu => (
                    <div key={edu.id} className="mb-[6px]">
                      <p className="font-semibold text-white" style={{ fontSize: `${Math.max(8.5, settings.bodySize - 1.5)}pt` }}>{edu.degree}</p>
                      <p className="text-[#bbb]" style={{ fontSize: `${Math.max(8, settings.bodySize - 2)}pt` }}>{edu.school}</p>
                      <p className="text-[#999]" style={{ fontSize: `${Math.max(8, settings.bodySize - 2)}pt` }}>{edu.graduationYear}{edu.gpa ? ` · ${edu.gpa}` : ""}</p>
                    </div>
                  ))}
                </SideSection>
              );

            case "certifications":
              if (certifications.length === 0) return null;
              return (
                <SideSection key="certifications" title="Certifications" accent={ACCENT} headingSize={settings.headingSize}>
                  {certifications.map(cert => (
                    <p key={cert.id} className="text-[#ccc] mb-[3px]" style={{ fontSize: `${Math.max(8.5, settings.bodySize - 1.5)}pt` }}>
                      {cert.name}{cert.year ? ` (${cert.year})` : ""}
                    </p>
                  ))}
                </SideSection>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Main */}
      <div className="flex-1 p-[24px] flex flex-col gap-[14px]">
        {settings.sectionOrder.filter(id => ["summary", "experience", "projects"].includes(id)).map((sectionId) => {
          switch (sectionId) {
            case "summary":
              if (!summary) return null;
              return (
                <MainSection key="summary" title="Profile" accent={ACCENT} headingSize={settings.headingSize}>
                  <p className="text-[#333]" style={{ fontSize: `${settings.bodySize}pt` }}>{summary}</p>
                </MainSection>
              );

            case "experience":
              if (experience.length === 0) return null;
              return (
                <MainSection key="experience" title="Experience" accent={ACCENT} headingSize={settings.headingSize}>
                  {experience.map(exp => (
                    <div key={exp.id} className="mb-[10px]">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold" style={{ fontSize: `${settings.bodySize}pt` }}>{exp.title}</p>
                          <p style={{ color: ACCENT, fontSize: `${Math.max(8.5, settings.bodySize - 1.5)}pt` }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                        </div>
                        <p className="text-[#666] whitespace-nowrap ml-2" style={{ fontSize: `${Math.max(8, settings.bodySize - 2)}pt` }}>
                          {exp.startDate}{exp.startDate ? " – " : ""}{exp.current ? "Present" : exp.endDate}
                        </p>
                      </div>
                      <div className="mt-[4px]">
                        {exp.bullets.filter(b => b.text).map(b => (
                          <p key={b.id} className="ml-[10px] text-[#333] before:content-['▸'] before:mr-[5px]" style={{ color: "#333", fontSize: `${Math.max(9, settings.bodySize - 1)}pt` }}>{b.text}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </MainSection>
              );

            case "projects":
              if (projects.length === 0) return null;
              return (
                <MainSection key="projects" title="Projects" accent={ACCENT} headingSize={settings.headingSize}>
                  {projects.map(proj => (
                    <div key={proj.id} className="mb-[8px]">
                      <div className="flex justify-between">
                        <p className="font-bold" style={{ fontSize: `${settings.bodySize}pt` }}>{proj.name}</p>
                        {proj.url && <p className="text-[#666] underline" style={{ fontSize: `${Math.max(8, settings.bodySize - 2)}pt` }}>{proj.url}</p>}
                      </div>
                      {proj.description && <p className="text-[#333]" style={{ fontSize: `${Math.max(9, settings.bodySize - 1)}pt` }}>{proj.description}</p>}
                      {proj.technologies.length > 0 && <p className="italic text-[#666]" style={{ fontSize: `${Math.max(8, settings.bodySize - 2)}pt` }}>{proj.technologies.join(", ")}</p>}
                    </div>
                  ))}
                </MainSection>
              );
            
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

function SideSection({ title, accent, headingSize, children }: { title: string; accent: string; headingSize: number; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-bold uppercase tracking-[0.08em] mb-[6px] pb-[3px]"
        style={{ color: accent, borderBottom: `1px solid ${accent}`, fontSize: `${Math.max(8, headingSize - 3)}pt` }}>{title}</h2>
      {children}
    </div>
  );
}

function SkillGroup({ label, tags, bodySize }: { label: string; tags: string[]; bodySize: number }) {
  return (
    <div className="mb-[4px]">
      <p className="font-semibold text-[#aaa] mb-[2px]" style={{ fontSize: `${Math.max(8, bodySize - 2)}pt` }}>{label}</p>
      <p className="text-[#ddd]" style={{ fontSize: `${Math.max(8.5, bodySize - 1.5)}pt` }}>{tags.join(", ")}</p>
    </div>
  );
}

function MainSection({ title, accent, headingSize, children }: { title: string; accent: string; headingSize: number; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-bold uppercase tracking-[0.06em] mb-[6px] pb-[3px]"
        style={{ color: accent, borderBottom: `2px solid ${accent}`, fontSize: `${headingSize}pt` }}>{title}</h2>
      {children}
    </div>
  );
}
