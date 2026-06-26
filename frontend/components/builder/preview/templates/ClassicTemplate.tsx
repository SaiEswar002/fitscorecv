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
    fontSize:   `${settings.fontSize}pt`,
    lineHeight: settings.lineSpacing,
    padding:    MARGIN_PX_MAP[settings.margins] ?? MARGIN_PX_MAP["normal"],
    color:      "#1a1a1a",
  };

  return (
    <div style={rootStyle}>

      {/* Header */}
      {contact.name && (
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <h1 style={{ fontSize: "22pt", fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
            {contact.name}
          </h1>
          <p style={{ fontSize: "9pt", color: "#444", marginTop: "4px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 12px" }}>
            {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website]
              .filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
          </p>
        </div>
      )}

      <Divider />

      {/* Summary */}
      {summary && (
        <Section title="Professional Summary">
          <p style={{ fontSize: `${settings.fontSize - 0.5}pt` }}>{summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Work Experience">
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700 }}>{exp.title}</span>
                <span style={{ fontSize: "8.5pt", color: "#555" }}>
                  {exp.startDate}{exp.startDate ? " – " : ""}{exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px" }}>
                <span style={{ fontStyle: "italic", color: "#444" }}>
                  {exp.company}{exp.location ? `, ${exp.location}` : ""}
                </span>
              </div>
              {exp.bullets.filter((b) => b.text).map((b) => (
                <p key={b.id} style={{ marginLeft: "12px", fontSize: `${settings.fontSize - 0.5}pt` }}>
                  • {b.text}
                </p>
              ))}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700 }}>{edu.degree}</span>
                <span style={{ fontSize: "8.5pt", color: "#555" }}>{edu.graduationYear}</span>
              </div>
              <p style={{ fontStyle: "italic", color: "#444", fontSize: "9pt" }}>
                {edu.school}{edu.location ? `, ${edu.location}` : ""}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {allSkills.length > 0 && (
        <Section title="Skills">
          <p style={{ fontSize: `${settings.fontSize - 0.5}pt` }}>{allSkills.join(" · ")}</p>
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((cert) => (
            <p key={cert.id} style={{ fontSize: `${settings.fontSize - 0.5}pt`, marginBottom: "3px" }}>
              <strong>{cert.name}</strong>
              {cert.issuer ? ` — ${cert.issuer}` : ""}{cert.year ? ` (${cert.year})` : ""}
            </p>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700 }}>{proj.name}</span>
                {proj.url && <span style={{ fontSize: "8pt", color: "#555", textDecoration: "underline" }}>{proj.url}</span>}
              </div>
              {proj.description && <p style={{ fontSize: `${settings.fontSize - 0.5}pt` }}>{proj.description}</p>}
              {proj.technologies.length > 0 && (
                <p style={{ fontSize: "8.5pt", color: "#555", fontStyle: "italic" }}>
                  {proj.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <h2 style={{
        fontSize: "10pt", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.06em", marginBottom: "4px", paddingBottom: "2px",
        borderBottom: "1.5px solid #1a1a1a",
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ borderColor: "#1a1a1a", borderTopWidth: "1px", margin: "8px 0" }} />;
}
