import type { ResumeData } from "@/lib/types/resume";
import { getEffectiveSettings, FONT_CSS_MAP } from "@/lib/types/resume";

interface Props { data: ResumeData; }

const ACCENT = "#BE1A1A";

export function ModernTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = data;
  const settings = getEffectiveSettings(data);
  const fontCss  = FONT_CSS_MAP[settings.fontFamily] ?? FONT_CSS_MAP["Arial"];

  return (
    <div style={{ fontFamily: fontCss, fontSize: `${settings.fontSize}pt`, lineHeight: settings.lineSpacing, color: "#1a1a1a", display: "flex", minHeight: "100%" }}>

      {/* Sidebar */}
      <div className="w-[30%] flex-shrink-0 p-[24px] flex flex-col gap-[16px]"
        style={{ background: "#1a1a1a", color: "#f5f5f5" }}>

        {contact.name && (
          <div>
            <h1 className="text-[14pt] font-bold leading-tight text-white">{contact.name}</h1>
          </div>
        )}

        {/* Contact */}
        <SideSection title="Contact" accent={ACCENT}>
          {[
            { label: "Email", value: contact.email },
            { label: "Phone", value: contact.phone },
            { label: "Location", value: contact.location },
            { label: "LinkedIn", value: contact.linkedin },
            { label: "Web", value: contact.website },
          ].filter(x => x.value).map(x => (
            <div key={x.label} className="text-[8.5pt] mb-[4px]">
              <span style={{ color: "#aaa" }}>{x.label}</span>
              <p className="text-[#eee] break-words">{x.value}</p>
            </div>
          ))}
        </SideSection>

        {/* Skills sidebar */}
        {(skills.technical.length > 0 || skills.tools.length > 0 || skills.soft.length > 0) && (
          <SideSection title="Skills" accent={ACCENT}>
            {skills.technical.length > 0 && <SkillGroup label="Technical" tags={skills.technical} />}
            {skills.tools.length > 0 && <SkillGroup label="Tools" tags={skills.tools} />}
            {skills.soft.length > 0 && <SkillGroup label="Soft" tags={skills.soft} />}
          </SideSection>
        )}

        {/* Education sidebar */}
        {education.length > 0 && (
          <SideSection title="Education" accent={ACCENT}>
            {education.map(edu => (
              <div key={edu.id} className="mb-[6px]">
                <p className="font-semibold text-[8.5pt] text-white">{edu.degree}</p>
                <p className="text-[8pt] text-[#bbb]">{edu.school}</p>
                <p className="text-[8pt] text-[#999]">{edu.graduationYear}{edu.gpa ? ` · ${edu.gpa}` : ""}</p>
              </div>
            ))}
          </SideSection>
        )}

        {/* Certifications sidebar */}
        {certifications.length > 0 && (
          <SideSection title="Certifications" accent={ACCENT}>
            {certifications.map(cert => (
              <p key={cert.id} className="text-[8.5pt] text-[#ccc] mb-[3px]">
                {cert.name}{cert.year ? ` (${cert.year})` : ""}
              </p>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 p-[24px] flex flex-col gap-[14px]">
        {summary && (
          <MainSection title="Profile" accent={ACCENT}>
            <p className="text-[9.5pt] text-[#333]">{summary}</p>
          </MainSection>
        )}

        {experience.length > 0 && (
          <MainSection title="Experience" accent={ACCENT}>
            {experience.map(exp => (
              <div key={exp.id} className="mb-[10px]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[10pt]">{exp.title}</p>
                    <p className="text-[8.5pt]" style={{ color: ACCENT }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  </div>
                  <p className="text-[8pt] text-[#666] whitespace-nowrap ml-2">
                    {exp.startDate}{exp.startDate ? " – " : ""}{exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                <div className="mt-[4px]">
                  {exp.bullets.filter(b => b.text).map(b => (
                    <p key={b.id} className="ml-[10px] text-[9pt] text-[#333] before:content-['▸'] before:mr-[5px]" style={{ color: "#333" }}>{b.text}</p>
                  ))}
                </div>
              </div>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects" accent={ACCENT}>
            {projects.map(proj => (
              <div key={proj.id} className="mb-[8px]">
                <div className="flex justify-between">
                  <p className="font-bold">{proj.name}</p>
                  {proj.url && <p className="text-[8pt] text-[#666] underline">{proj.url}</p>}
                </div>
                {proj.description && <p className="text-[9pt] text-[#333]">{proj.description}</p>}
                {proj.technologies.length > 0 && <p className="text-[8pt] italic text-[#666]">{proj.technologies.join(", ")}</p>}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function SideSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[8pt] font-bold uppercase tracking-[0.08em] mb-[6px] pb-[3px]"
        style={{ color: accent, borderBottom: `1px solid ${accent}` }}>{title}</h2>
      {children}
    </div>
  );
}

function SkillGroup({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="mb-[4px]">
      <p className="text-[8pt] font-semibold text-[#aaa] mb-[2px]">{label}</p>
      <p className="text-[8.5pt] text-[#ddd]">{tags.join(", ")}</p>
    </div>
  );
}

function MainSection({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[10pt] font-bold uppercase tracking-[0.06em] mb-[6px] pb-[3px]"
        style={{ color: accent, borderBottom: `2px solid ${accent}` }}>{title}</h2>
      {children}
    </div>
  );
}
