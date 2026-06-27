import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData, ResumeTemplate, ResumeSettings } from "@/lib/types/resume";
import { makeBlankSettings } from "@/lib/types/resume";

interface Props { data: ResumeData; template: ResumeTemplate; title: string; settings?: ResumeSettings; }

// @react-pdf/renderer only supports built-in fonts without registration
// Map user font choice to the closest built-in
const PDF_FONT_MAP: Record<string, string> = {
  "Arial":            "Helvetica",
  "Georgia":          "Times-Roman",
  "Times New Roman":  "Times-Roman",
  "Calibri":          "Helvetica",
  "Cambria":          "Times-Roman",
};

const PDF_MARGIN_MAP: Record<string, string> = {
  narrow: "20pt 20pt",
  normal: "28pt 36pt",
  wide:   "36pt 52pt",
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const base = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9.5, color: "#1a1a1a", padding: "28pt 36pt" },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  contactLine: { fontSize: 8.5, color: "#444", marginBottom: 8 },
  sectionTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.8, borderBottomWidth: 1, borderBottomColor: "#1a1a1a", borderBottomStyle: "solid", paddingBottom: 2, marginBottom: 5, marginTop: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  bold: { fontFamily: "Helvetica-Bold" },
  italic: { fontFamily: "Helvetica-Oblique" },
  small: { fontSize: 8.5, color: "#555" },
  bullet: { marginLeft: 10, marginBottom: 1.5 },
  body: { lineHeight: 1.4, marginBottom: 2 },
});

// ── Classic PDF ─────────────────────────────────────────────────────────────
type StyleOverrides = { pageStyle?: object; boldStyle?: object; italicStyle?: object; s: ResumeSettings; };
function ClassicPDF({ data, pageStyle, boldStyle, italicStyle, s }: { data: ResumeData } & StyleOverrides) {
  const { contact, summary, experience, education, skills, certifications, projects } = data;
  const allSkills = [...skills.technical, ...skills.tools, ...skills.soft];
  const pg   = { ...base.page, ...pageStyle };
  const bd   = { ...base.bold, ...boldStyle };
  const it   = { ...base.italic, ...italicStyle };

  return (
    <Page size="A4" style={pg}>
      {s.sectionOrder.map((sectionId) => {
        switch (sectionId) {
          case "contact":
            if (!contact.name) return null;
            return (
              <View key="contact" style={{ marginBottom: 6, textAlign: "center" }}>
                <Text style={{ ...base.name, fontSize: s.nameSize }}>{contact.name}</Text>
                <Text style={{ ...base.contactLine, fontSize: Math.max(8, s.bodySize - 1.5) }}>
                  {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean).join("  ·  ")}
                </Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: "#1a1a1a", borderBottomStyle: "solid" }} />
              </View>
            );
          
          case "summary":
            if (!summary) return null;
            return (
              <View key="summary">
                <Text style={{ ...base.sectionTitle, fontSize: s.headingSize }}>Professional Summary</Text>
                <Text style={{ ...base.body, fontSize: s.bodySize }}>{summary}</Text>
              </View>
            );

          case "experience":
            if (experience.length === 0) return null;
            return (
              <View key="experience">
                <Text style={{ ...base.sectionTitle, fontSize: s.headingSize }}>Work Experience</Text>
                {experience.map(exp => (
                  <View key={exp.id} style={{ marginBottom: 8 }}>
                    <View style={base.row}>
                      <Text style={{ ...bd, fontSize: s.bodySize }}>{exp.title}</Text>
                      <Text style={{ ...base.small, fontSize: Math.max(8, s.bodySize - 1.5) }}>{exp.startDate}{exp.startDate ? " – " : ""}{exp.current ? "Present" : exp.endDate}</Text>
                    </View>
                    <Text style={[it, { color: "#444", marginBottom: 2, fontSize: s.bodySize }]}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</Text>
                    {exp.bullets.filter(b => b.text).map(b => (
                      <Text key={b.id} style={{ ...base.bullet, fontSize: s.bodySize }}>• {b.text}</Text>
                    ))}
                  </View>
                ))}
              </View>
            );

          case "education":
            if (education.length === 0) return null;
            return (
              <View key="education">
                <Text style={{ ...base.sectionTitle, fontSize: s.headingSize }}>Education</Text>
                {education.map(edu => (
                  <View key={edu.id} style={{ marginBottom: 5 }}>
                    <View style={base.row}>
                      <Text style={{ ...bd, fontSize: s.bodySize }}>{edu.degree}</Text>
                      <Text style={{ ...base.small, fontSize: Math.max(8, s.bodySize - 1.5) }}>{edu.graduationYear}</Text>
                    </View>
                    <Text style={[it, { color: "#444", fontSize: s.bodySize }]}>{edu.school}{edu.location ? `, ${edu.location}` : ""}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</Text>
                  </View>
                ))}
              </View>
            );

          case "skills":
            if (allSkills.length === 0) return null;
            return (
              <View key="skills">
                <Text style={{ ...base.sectionTitle, fontSize: s.headingSize }}>Skills</Text>
                <Text style={{ ...base.body, fontSize: s.bodySize }}>{allSkills.join(" · ")}</Text>
              </View>
            );

          case "certifications":
            if (certifications.length === 0) return null;
            return (
              <View key="certifications">
                <Text style={{ ...base.sectionTitle, fontSize: s.headingSize }}>Certifications</Text>
                {certifications.map(c => <Text key={c.id} style={{ ...base.body, fontSize: s.bodySize }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}</Text>)}
              </View>
            );

          case "projects":
            if (projects.length === 0) return null;
            return (
              <View key="projects">
                <Text style={{ ...base.sectionTitle, fontSize: s.headingSize }}>Projects</Text>
                {projects.map(proj => (
                  <View key={proj.id} style={{ marginBottom: 5 }}>
                    <View style={base.row}>
                      <Text style={{ ...bd, fontSize: s.bodySize }}>{proj.name}</Text>
                      {proj.url && <Text style={{ ...base.small, fontSize: Math.max(8, s.bodySize - 1.5) }}>{proj.url}</Text>}
                    </View>
                    {proj.description && <Text style={{ ...base.body, fontSize: s.bodySize }}>{proj.description}</Text>}
                    {proj.technologies.length > 0 && <Text style={[it, { color: "#555", fontSize: Math.max(8, s.bodySize - 1.5) }]}>{proj.technologies.join(", ")}</Text>}
                  </View>
                ))}
              </View>
            );

          default:
            return null;
        }
      })}
    </Page>
  );
}

// ── Minimal PDF (same structure as Classic but lighter borders) ─────────────
function MinimalPDF({ data, pageStyle, boldStyle, s }: { data: ResumeData } & StyleOverrides) {
  const { contact, summary, experience, education, skills, certifications, projects } = data;
  const allSkills = [...skills.technical, ...skills.tools, ...skills.soft];
  const pg       = { ...base.page, ...pageStyle };
  const bd       = { ...base.bold, ...boldStyle };
  const minTitle = { ...base.sectionTitle, borderBottomColor: "#999" };

  return (
    <Page size="A4" style={pg}>
      {s.sectionOrder.map((sectionId) => {
        switch (sectionId) {
          case "contact":
            if (!contact.name) return null;
            return (
              <View key="contact" style={{ marginBottom: 8 }}>
                <Text style={{ ...base.name, fontSize: s.nameSize }}>{contact.name}</Text>
                <Text style={{ ...base.contactLine, fontSize: Math.max(8, s.bodySize - 1.5) }}>
                  {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean).join("  |  ")}
                </Text>
              </View>
            );

          case "summary":
            if (!summary) return null;
            return (
              <View key="summary">
                <Text style={{ ...minTitle, fontSize: s.headingSize }}>Summary</Text>
                <Text style={{ ...base.body, fontSize: s.bodySize }}>{summary}</Text>
              </View>
            );

          case "experience":
            if (experience.length === 0) return null;
            return (
              <View key="experience">
                <Text style={{ ...minTitle, fontSize: s.headingSize }}>Experience</Text>
                {experience.map(exp => (
                  <View key={exp.id} style={{ marginBottom: 7 }}>
                    <View style={base.row}>
                      <Text style={{ ...bd, fontSize: s.bodySize }}>{exp.title}{exp.company ? `, ${exp.company}` : ""}</Text>
                      <Text style={{ ...base.small, fontSize: Math.max(8, s.bodySize - 1.5) }}>{exp.startDate}{exp.startDate ? "–" : ""}{exp.current ? "Present" : exp.endDate}</Text>
                    </View>
                    {exp.bullets.filter(b => b.text).map(b => <Text key={b.id} style={{ ...base.bullet, fontSize: s.bodySize }}>- {b.text}</Text>)}
                  </View>
                ))}
              </View>
            );

          case "education":
            if (education.length === 0) return null;
            return (
              <View key="education">
                <Text style={{ ...minTitle, fontSize: s.headingSize }}>Education</Text>
                {education.map(edu => (
                  <View key={edu.id} style={{ marginBottom: 5 }}>
                    <View style={base.row}>
                      <Text style={{ ...bd, fontSize: s.bodySize }}>{edu.degree}{edu.school ? `, ${edu.school}` : ""}</Text>
                      <Text style={{ ...base.small, fontSize: Math.max(8, s.bodySize - 1.5) }}>{edu.graduationYear}</Text>
                    </View>
                  </View>
                ))}
              </View>
            );

          case "skills":
            if (allSkills.length === 0) return null;
            return (
              <View key="skills">
                <Text style={{ ...minTitle, fontSize: s.headingSize }}>Skills</Text>
                <Text style={{ ...base.body, fontSize: s.bodySize }}>{allSkills.join(", ")}</Text>
              </View>
            );

          case "certifications":
            if (certifications.length === 0) return null;
            return (
              <View key="certifications">
                <Text style={{ ...minTitle, fontSize: s.headingSize }}>Certifications</Text>
                {certifications.map(c => <Text key={c.id} style={{ ...base.body, fontSize: s.bodySize }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}</Text>)}
              </View>
            );

          case "projects":
            if (projects.length === 0) return null;
            return (
              <View key="projects">
                <Text style={{ ...minTitle, fontSize: s.headingSize }}>Projects</Text>
                {projects.map(proj => (
                  <View key={proj.id} style={{ marginBottom: 5 }}>
                    <Text style={{ ...bd, fontSize: s.bodySize }}>{proj.name}{proj.url ? ` (${proj.url})` : ""}</Text>
                    {proj.description && <Text style={{ ...base.body, fontSize: s.bodySize }}>{proj.description}</Text>}
                  </View>
                ))}
              </View>
            );

          default:
            return null;
        }
      })}
    </Page>
  );
}

// ── Modern PDF ─────────────────────────────────────────────────────────────
function ModernPDF({ data, pageStyle, boldStyle, s }: { data: ResumeData } & StyleOverrides) {
  const ACCENT = "#BE1A1A";
  const { contact, summary, experience, education, skills, certifications, projects } = data;
  const bd = { ...base.bold, ...boldStyle };

  const sideTitle = { fontSize: Math.max(7, s.headingSize - 4.5), fontFamily: "Helvetica-Bold", color: ACCENT, textTransform: "uppercase" as const, letterSpacing: 0.6, borderBottomWidth: 1, borderBottomColor: ACCENT, borderBottomStyle: "solid" as const, paddingBottom: 2, marginBottom: 5, marginTop: 12 };
  const mainTitle = { fontSize: Math.max(9, s.headingSize - 3), fontFamily: "Helvetica-Bold", textTransform: "uppercase" as const, letterSpacing: 0.6, color: ACCENT, borderBottomWidth: 1.5, borderBottomColor: ACCENT, borderBottomStyle: "solid" as const, paddingBottom: 2, marginBottom: 6, marginTop: 10 };

  return (
    <Page size="A4" style={{ ...base.page, ...pageStyle, flexDirection: "row", padding: 0 }}>
      {/* Sidebar */}
      <View style={{ width: "30%", backgroundColor: "#1a1a1a", padding: "24pt 14pt", color: "#f0f0f0" }}>
        
        {s.sectionOrder.filter(id => ["contact", "skills", "education", "certifications"].includes(id)).map((sectionId) => {
          switch (sectionId) {
            case "contact":
              return (
                <View key="contact">
                  {contact.name && <Text style={{ fontSize: Math.max(13, s.nameSize - 13), fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 12 }}>{contact.name}</Text>}
                  <Text style={{ ...sideTitle, marginTop: 0 }}>Contact</Text>
                  {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean).map((v, i) => (
                    <Text key={i} style={{ fontSize: Math.max(7.5, s.bodySize - 2.5), color: "#ccc", marginBottom: 3 }}>{v}</Text>
                  ))}
                </View>
              );

            case "skills":
              if (skills.technical.length === 0 && skills.tools.length === 0 && skills.soft.length === 0) return null;
              return (
                <View key="skills">
                  <Text style={sideTitle}>Skills</Text>
                  {skills.technical.length > 0 && <><Text style={{ fontSize: Math.max(7, s.bodySize - 3), color: "#aaa" }}>Technical</Text><Text style={{ fontSize: Math.max(8, s.bodySize - 2), color: "#ddd", marginBottom: 4 }}>{skills.technical.join(", ")}</Text></>}
                  {skills.tools.length > 0 && <><Text style={{ fontSize: Math.max(7, s.bodySize - 3), color: "#aaa" }}>Tools</Text><Text style={{ fontSize: Math.max(8, s.bodySize - 2), color: "#ddd", marginBottom: 4 }}>{skills.tools.join(", ")}</Text></>}
                  {skills.soft.length > 0 && <><Text style={{ fontSize: Math.max(7, s.bodySize - 3), color: "#aaa" }}>Soft</Text><Text style={{ fontSize: Math.max(8, s.bodySize - 2), color: "#ddd" }}>{skills.soft.join(", ")}</Text></>}
                </View>
              );

            case "education":
              if (education.length === 0) return null;
              return (
                <View key="education">
                  <Text style={sideTitle}>Education</Text>
                  {education.map(edu => (
                    <View key={edu.id} style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: Math.max(8, s.bodySize - 2), fontFamily: "Helvetica-Bold", color: "#fff" }}>{edu.degree}</Text>
                      <Text style={{ fontSize: Math.max(7.5, s.bodySize - 2.5), color: "#bbb" }}>{edu.school}</Text>
                      <Text style={{ fontSize: Math.max(7, s.bodySize - 3), color: "#888" }}>{edu.graduationYear}</Text>
                    </View>
                  ))}
                </View>
              );

            case "certifications":
              if (certifications.length === 0) return null;
              return (
                <View key="certifications">
                  <Text style={sideTitle}>Certifications</Text>
                  {certifications.map(c => <Text key={c.id} style={{ fontSize: Math.max(8, s.bodySize - 2), color: "#ccc", marginBottom: 2 }}>{c.name}{c.year ? ` (${c.year})` : ""}</Text>)}
                </View>
              );

            default:
              return null;
          }
        })}
      </View>

      {/* Main */}
      <View style={{ flex: 1, padding: "24pt 20pt" }}>
        {s.sectionOrder.filter(id => ["summary", "experience", "projects"].includes(id)).map((sectionId) => {
          switch (sectionId) {
            case "summary":
              if (!summary) return null;
              return (
                <View key="summary">
                  <Text style={{ ...mainTitle, marginTop: 0 }}>Profile</Text>
                  <Text style={{ ...base.body, fontSize: s.bodySize, marginBottom: 10 }}>{summary}</Text>
                </View>
              );

            case "experience":
              if (experience.length === 0) return null;
              return (
                <View key="experience">
                  <Text style={mainTitle}>Experience</Text>
                  {experience.map(exp => (
                    <View key={exp.id} style={{ marginBottom: 9 }}>
                      <View style={base.row}>
                        <View>
                          <Text style={{ fontSize: Math.max(10, s.bodySize), fontFamily: "Helvetica-Bold" }}>{exp.title}</Text>
                          <Text style={{ fontSize: Math.max(8.5, s.bodySize - 1.5), color: ACCENT }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</Text>
                        </View>
                        <Text style={{ ...base.small, fontSize: Math.max(8.5, s.bodySize - 1.5) }}>{exp.startDate}{exp.startDate ? " – " : ""}{exp.current ? "Present" : exp.endDate}</Text>
                      </View>
                      {exp.bullets.filter(b => b.text).map(b => <Text key={b.id} style={{ ...base.bullet, fontSize: s.bodySize, marginTop: 2 }}>▸ {b.text}</Text>)}
                    </View>
                  ))}
                </View>
              );

            case "projects":
              if (projects.length === 0) return null;
              return (
                <View key="projects">
                  <Text style={mainTitle}>Projects</Text>
                  {projects.map(proj => (
                    <View key={proj.id} style={{ marginBottom: 7 }}>
                      <View style={base.row}>
                        <Text style={{ ...bd, fontSize: s.bodySize }}>{proj.name}</Text>
                        {proj.url && <Text style={{ ...base.small, fontSize: Math.max(8.5, s.bodySize - 1.5) }}>{proj.url}</Text>}
                      </View>
                      {proj.description && <Text style={{ ...base.body, fontSize: s.bodySize }}>{proj.description}</Text>}
                      {proj.technologies.length > 0 && <Text style={[base.small, { fontFamily: "Helvetica-Oblique", fontSize: Math.max(8.5, s.bodySize - 1.5) }]}>{proj.technologies.join(", ")}</Text>}
                    </View>
                  ))}
                </View>
              );

            default:
              return null;
          }
        })}
      </View>
    </Page>
  );
}

// ── Root document ─────────────────────────────────────────────────────────────
export function ResumePDF({ data, template, title, settings }: Props) {
  const s      = settings ?? makeBlankSettings();
  const font   = PDF_FONT_MAP[s.fontFamily] ?? "Helvetica";
  const fontBd = font === "Times-Roman" ? "Times-Bold" : "Helvetica-Bold";
  const fontIt = font === "Times-Roman" ? "Times-Italic" : "Helvetica-Oblique";
  const margin = PDF_MARGIN_MAP[s.margins] ?? PDF_MARGIN_MAP["normal"];

  // Build per-document overrides (we don't pass fontSize here since it's mapped per element, but keep it for layout calculations)
  const pageStyle = { ...base.page, fontFamily: font, lineHeight: s.lineSpacing, padding: margin };
  const boldStyle = { fontFamily: fontBd };
  const italicStyle = { fontFamily: fontIt };

  return (
    <Document title={title} author={data.contact.name} subject="Resume">
      {template === "modern"  ? <ModernPDF  data={data} pageStyle={pageStyle} boldStyle={boldStyle} italicStyle={italicStyle} s={s} /> :
       template === "minimal" ? <MinimalPDF data={data} pageStyle={pageStyle} boldStyle={boldStyle} italicStyle={italicStyle} s={s} /> :
                                <ClassicPDF data={data} pageStyle={pageStyle} boldStyle={boldStyle} italicStyle={italicStyle} s={s} />}
    </Document>
  );
}
