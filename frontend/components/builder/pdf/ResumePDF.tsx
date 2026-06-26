import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData, ResumeTemplate } from "@/lib/types/resume";

interface Props { data: ResumeData; template: ResumeTemplate; title: string; }

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

// ── Classic PDF ───────────────────────────────────────────────────────────────
function ClassicPDF({ data }: { data: ResumeData }) {
  const { contact, summary, experience, education, skills, certifications, projects } = data;
  const allSkills = [...skills.technical, ...skills.tools, ...skills.soft];

  return (
    <Page size="A4" style={base.page}>
      {contact.name && (
        <View style={{ marginBottom: 6, textAlign: "center" }}>
          <Text style={base.name}>{contact.name}</Text>
          <Text style={base.contactLine}>
            {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean).join("  ·  ")}
          </Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "#1a1a1a", borderBottomStyle: "solid" }} />
        </View>
      )}
      {summary && (<>
        <Text style={base.sectionTitle}>Professional Summary</Text>
        <Text style={base.body}>{summary}</Text>
      </>)}
      {experience.length > 0 && (<>
        <Text style={base.sectionTitle}>Work Experience</Text>
        {experience.map(exp => (
          <View key={exp.id} style={{ marginBottom: 8 }}>
            <View style={base.row}>
              <Text style={base.bold}>{exp.title}</Text>
              <Text style={base.small}>{exp.startDate}{exp.startDate ? " – " : ""}{exp.current ? "Present" : exp.endDate}</Text>
            </View>
            <Text style={[base.italic, { color: "#444", marginBottom: 2 }]}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</Text>
            {exp.bullets.filter(b => b.text).map(b => (
              <Text key={b.id} style={base.bullet}>• {b.text}</Text>
            ))}
          </View>
        ))}
      </>)}
      {education.length > 0 && (<>
        <Text style={base.sectionTitle}>Education</Text>
        {education.map(edu => (
          <View key={edu.id} style={{ marginBottom: 5 }}>
            <View style={base.row}>
              <Text style={base.bold}>{edu.degree}</Text>
              <Text style={base.small}>{edu.graduationYear}</Text>
            </View>
            <Text style={[base.italic, { color: "#444" }]}>{edu.school}{edu.location ? `, ${edu.location}` : ""}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</Text>
          </View>
        ))}
      </>)}
      {allSkills.length > 0 && (<>
        <Text style={base.sectionTitle}>Skills</Text>
        <Text style={base.body}>{allSkills.join(" · ")}</Text>
      </>)}
      {certifications.length > 0 && (<>
        <Text style={base.sectionTitle}>Certifications</Text>
        {certifications.map(c => <Text key={c.id} style={base.body}>{c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}</Text>)}
      </>)}
      {projects.length > 0 && (<>
        <Text style={base.sectionTitle}>Projects</Text>
        {projects.map(proj => (
          <View key={proj.id} style={{ marginBottom: 5 }}>
            <View style={base.row}>
              <Text style={base.bold}>{proj.name}</Text>
              {proj.url && <Text style={base.small}>{proj.url}</Text>}
            </View>
            {proj.description && <Text style={base.body}>{proj.description}</Text>}
            {proj.technologies.length > 0 && <Text style={[base.small, { fontFamily: "Helvetica-Oblique" }]}>{proj.technologies.join(", ")}</Text>}
          </View>
        ))}
      </>)}
    </Page>
  );
}

// ── Minimal PDF (same structure as Classic but lighter borders) ───────────────
function MinimalPDF({ data }: { data: ResumeData }) {
  const { contact, summary, experience, education, skills, certifications, projects } = data;
  const allSkills = [...skills.technical, ...skills.tools, ...skills.soft];
  const minTitle = { ...base.sectionTitle, borderBottomColor: "#999" };

  return (
    <Page size="A4" style={base.page}>
      {contact.name && (
        <View style={{ marginBottom: 8 }}>
          <Text style={base.name}>{contact.name}</Text>
          <Text style={base.contactLine}>
            {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean).join("  |  ")}
          </Text>
        </View>
      )}
      {summary && (<><Text style={minTitle}>Summary</Text><Text style={base.body}>{summary}</Text></>)}
      {experience.length > 0 && (<>
        <Text style={minTitle}>Experience</Text>
        {experience.map(exp => (
          <View key={exp.id} style={{ marginBottom: 7 }}>
            <View style={base.row}>
              <Text style={base.bold}>{exp.title}{exp.company ? `, ${exp.company}` : ""}</Text>
              <Text style={base.small}>{exp.startDate}{exp.startDate ? "–" : ""}{exp.current ? "Present" : exp.endDate}</Text>
            </View>
            {exp.bullets.filter(b => b.text).map(b => <Text key={b.id} style={base.bullet}>- {b.text}</Text>)}
          </View>
        ))}
      </>)}
      {education.length > 0 && (<>
        <Text style={minTitle}>Education</Text>
        {education.map(edu => (
          <View key={edu.id} style={{ marginBottom: 5 }}>
            <View style={base.row}>
              <Text style={base.bold}>{edu.degree}{edu.school ? `, ${edu.school}` : ""}</Text>
              <Text style={base.small}>{edu.graduationYear}</Text>
            </View>
          </View>
        ))}
      </>)}
      {allSkills.length > 0 && (<><Text style={minTitle}>Skills</Text><Text style={base.body}>{allSkills.join(", ")}</Text></>)}
      {certifications.length > 0 && (<>
        <Text style={minTitle}>Certifications</Text>
        {certifications.map(c => <Text key={c.id} style={base.body}>{c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}</Text>)}
      </>)}
      {projects.length > 0 && (<>
        <Text style={minTitle}>Projects</Text>
        {projects.map(proj => (
          <View key={proj.id} style={{ marginBottom: 5 }}>
            <Text style={base.bold}>{proj.name}{proj.url ? ` (${proj.url})` : ""}</Text>
            {proj.description && <Text style={base.body}>{proj.description}</Text>}
          </View>
        ))}
      </>)}
    </Page>
  );
}

// ── Modern PDF ────────────────────────────────────────────────────────────────
function ModernPDF({ data }: { data: ResumeData }) {
  const ACCENT = "#BE1A1A";
  const { contact, summary, experience, education, skills, certifications, projects } = data;

  return (
    <Page size="A4" style={{ ...base.page, flexDirection: "row", padding: 0 }}>
      {/* Sidebar */}
      <View style={{ width: "30%", backgroundColor: "#1a1a1a", padding: "24pt 14pt", color: "#f0f0f0" }}>
        {contact.name && <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 12 }}>{contact.name}</Text>}
        <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: ACCENT, textTransform: "uppercase", letterSpacing: 0.6, borderBottomWidth: 1, borderBottomColor: ACCENT, borderBottomStyle: "solid", paddingBottom: 2, marginBottom: 5 }}>Contact</Text>
        {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website].filter(Boolean).map((v, i) => (
          <Text key={i} style={{ fontSize: 7.5, color: "#ccc", marginBottom: 3 }}>{v}</Text>
        ))}
        {(skills.technical.length > 0 || skills.tools.length > 0 || skills.soft.length > 0) && (<>
          <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: ACCENT, textTransform: "uppercase", letterSpacing: 0.6, borderBottomWidth: 1, borderBottomColor: ACCENT, borderBottomStyle: "solid", paddingBottom: 2, marginBottom: 5, marginTop: 12 }}>Skills</Text>
          {skills.technical.length > 0 && <><Text style={{ fontSize: 7, color: "#aaa" }}>Technical</Text><Text style={{ fontSize: 8, color: "#ddd", marginBottom: 4 }}>{skills.technical.join(", ")}</Text></>}
          {skills.tools.length > 0 && <><Text style={{ fontSize: 7, color: "#aaa" }}>Tools</Text><Text style={{ fontSize: 8, color: "#ddd", marginBottom: 4 }}>{skills.tools.join(", ")}</Text></>}
          {skills.soft.length > 0 && <><Text style={{ fontSize: 7, color: "#aaa" }}>Soft</Text><Text style={{ fontSize: 8, color: "#ddd" }}>{skills.soft.join(", ")}</Text></>}
        </>)}
        {education.length > 0 && (<>
          <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: ACCENT, textTransform: "uppercase", letterSpacing: 0.6, borderBottomWidth: 1, borderBottomColor: ACCENT, borderBottomStyle: "solid", paddingBottom: 2, marginBottom: 5, marginTop: 12 }}>Education</Text>
          {education.map(edu => (
            <View key={edu.id} style={{ marginBottom: 6 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#fff" }}>{edu.degree}</Text>
              <Text style={{ fontSize: 7.5, color: "#bbb" }}>{edu.school}</Text>
              <Text style={{ fontSize: 7, color: "#888" }}>{edu.graduationYear}</Text>
            </View>
          ))}
        </>)}
        {certifications.length > 0 && (<>
          <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: ACCENT, textTransform: "uppercase", letterSpacing: 0.6, borderBottomWidth: 1, borderBottomColor: ACCENT, borderBottomStyle: "solid", paddingBottom: 2, marginBottom: 5, marginTop: 12 }}>Certifications</Text>
          {certifications.map(c => <Text key={c.id} style={{ fontSize: 8, color: "#ccc", marginBottom: 2 }}>{c.name}{c.year ? ` (${c.year})` : ""}</Text>)}
        </>)}
      </View>
      {/* Main */}
      <View style={{ flex: 1, padding: "24pt 20pt" }}>
        {summary && (<>
          <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.6, color: ACCENT, borderBottomWidth: 1.5, borderBottomColor: ACCENT, borderBottomStyle: "solid", paddingBottom: 2, marginBottom: 6 }}>Profile</Text>
          <Text style={{ ...base.body, marginBottom: 10 }}>{summary}</Text>
        </>)}
        {experience.length > 0 && (<>
          <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.6, color: ACCENT, borderBottomWidth: 1.5, borderBottomColor: ACCENT, borderBottomStyle: "solid", paddingBottom: 2, marginBottom: 6 }}>Experience</Text>
          {experience.map(exp => (
            <View key={exp.id} style={{ marginBottom: 9 }}>
              <View style={base.row}>
                <View>
                  <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>{exp.title}</Text>
                  <Text style={{ fontSize: 8.5, color: ACCENT }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</Text>
                </View>
                <Text style={base.small}>{exp.startDate}{exp.startDate ? " – " : ""}{exp.current ? "Present" : exp.endDate}</Text>
              </View>
              {exp.bullets.filter(b => b.text).map(b => <Text key={b.id} style={{ ...base.bullet, marginTop: 2 }}>▸ {b.text}</Text>)}
            </View>
          ))}
        </>)}
        {projects.length > 0 && (<>
          <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.6, color: ACCENT, borderBottomWidth: 1.5, borderBottomColor: ACCENT, borderBottomStyle: "solid", paddingBottom: 2, marginBottom: 6, marginTop: 10 }}>Projects</Text>
          {projects.map(proj => (
            <View key={proj.id} style={{ marginBottom: 7 }}>
              <View style={base.row}>
                <Text style={base.bold}>{proj.name}</Text>
                {proj.url && <Text style={base.small}>{proj.url}</Text>}
              </View>
              {proj.description && <Text style={base.body}>{proj.description}</Text>}
              {proj.technologies.length > 0 && <Text style={[base.small, { fontFamily: "Helvetica-Oblique" }]}>{proj.technologies.join(", ")}</Text>}
            </View>
          ))}
        </>)}
      </View>
    </Page>
  );
}

// ── Root document ─────────────────────────────────────────────────────────────
export function ResumePDF({ data, template, title }: Props) {
  return (
    <Document title={title} author={data.contact.name} subject="Resume">
      {template === "modern" ? <ModernPDF data={data} /> :
        template === "minimal" ? <MinimalPDF data={data} /> :
          <ClassicPDF data={data} />}
    </Document>
  );
}
