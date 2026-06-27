import type { ResumeData } from "@/lib/types/resume";
import { getEffectiveSettings, FONT_CSS_MAP, MARGIN_PX_MAP } from "@/lib/types/resume";

interface Props { data: ResumeData; }

// ATS-safe single-column classic layout
export function ClassicTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = data;
  const settings  = getEffectiveSettings(data);
  const allSkills = [...(skills.technical ?? []), ...(skills.tools ?? []), ...(skills.soft ?? [])];

  const rootStyle: React.CSSProperties = {
    fontFamily: FONT_CSS_MAP[settings.fontFamily] ?? FONT_CSS_MAP["Arial"],
    lineHeight: settings.lineSpacing,
    padding:    MARGIN_PX_MAP[settings.margins] ?? MARGIN_PX_MAP["normal"],
    color:      "#1a1a1a",
  };

  const nameStyle = { fontSize: `${settings.nameSize}pt`, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 };
  const headingStyle = {
    fontSize: `${settings.headingSize}pt`, fontWeight: 700, textTransform: "uppercase" as const,
    letterSpacing: "0.06em", marginBottom: "4px", paddingBottom: "2px",
    borderBottom: "1.5px solid #1a1a1a",
  };
  const bodyStyle = { fontSize: `${settings.bodySize}pt` };
  const smallStyle = { fontSize: `${Math.max(8, settings.bodySize - 1.5)}pt`, color: "#555" };
  const italicStyle = { fontStyle: "italic", color: "#444" };

  return (
    <div style={rootStyle}>

      {settings.sectionOrder.map((sectionId) => {
        switch (sectionId) {
          case "contact":
            if (!contact.name) return null;
            return (
              <div key="contact">
                <div style={{ textAlign: "center", marginBottom: "14px" }}>
                  <h1 style={nameStyle}>{contact.name}</h1>
                  <p style={{ ...smallStyle, marginTop: "4px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 12px" }}>
                    {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website]
                      .filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
                  </p>
                </div>
                <Divider />
              </div>
            );
          
          case "summary":
            if (!summary) return null;
            return (
              <Section key="summary" title="Professional Summary" headingStyle={headingStyle}>
                <p style={bodyStyle}>{summary}</p>
              </Section>
            );

          case "experience":
            if (experience.length === 0) return null;
            return (
              <Section key="experience" title="Work Experience" headingStyle={headingStyle}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ ...bodyStyle, fontWeight: 700 }}>{exp.title}</span>
                      <span style={smallStyle}>
                        {exp.startDate}{exp.startDate ? " – " : ""}{exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px" }}>
                      <span style={{ ...bodyStyle, ...italicStyle }}>
                        {exp.company}{exp.location ? `, ${exp.location}` : ""}
                      </span>
                    </div>
                    {exp.bullets.filter((b) => b.text).map((b) => (
                      <p key={b.id} style={{ ...bodyStyle, marginLeft: "12px", marginBottom: "2px" }}>
                        • {b.text}
                      </p>
                    ))}
                  </div>
                ))}
              </Section>
            );

          case "education":
            if (education.length === 0) return null;
            return (
              <Section key="education" title="Education" headingStyle={headingStyle}>
                {education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ ...bodyStyle, fontWeight: 700 }}>{edu.degree}</span>
                      <span style={smallStyle}>{edu.graduationYear}</span>
                    </div>
                    <p style={{ ...bodyStyle, ...italicStyle }}>
                      {edu.school}{edu.location ? `, ${edu.location}` : ""}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                    </p>
                  </div>
                ))}
              </Section>
            );

          case "skills":
            if (allSkills.length === 0) return null;
            return (
              <Section key="skills" title="Skills" headingStyle={headingStyle}>
                <p style={bodyStyle}>{allSkills.join(" · ")}</p>
              </Section>
            );

          case "certifications":
            if (certifications.length === 0) return null;
            return (
              <Section key="certifications" title="Certifications" headingStyle={headingStyle}>
                {certifications.map((cert) => (
                  <p key={cert.id} style={{ ...bodyStyle, marginBottom: "3px" }}>
                    <strong>{cert.name}</strong>
                    {cert.issuer ? ` — ${cert.issuer}` : ""}{cert.year ? ` (${cert.year})` : ""}
                  </p>
                ))}
              </Section>
            );

          case "projects":
            if (projects.length === 0) return null;
            return (
              <Section key="projects" title="Projects" headingStyle={headingStyle}>
                {projects.map((proj) => (
                  <div key={proj.id} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ ...bodyStyle, fontWeight: 700 }}>{proj.name}</span>
                      {proj.url && <span style={{ ...smallStyle, textDecoration: "underline" }}>{proj.url}</span>}
                    </div>
                    {proj.description && <p style={bodyStyle}>{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <p style={{ ...smallStyle, fontStyle: "italic", marginTop: "2px" }}>
                        {proj.technologies.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </Section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

function Section({ title, headingStyle, children }: { title: string; headingStyle: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <h2 style={headingStyle}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ borderColor: "#1a1a1a", borderTopWidth: "1px", margin: "8px 0" }} />;
}
