import type { ResumeData } from "@/lib/types/resume";

interface Props { data: ResumeData; }

// ATS-safe single-column classic layout
export function ClassicTemplate({ data }: Props) {
  const { contact, summary, experience, education, skills, certifications, projects } = data;
  const allSkills = [...(skills.technical ?? []), ...(skills.tools ?? []), ...(skills.soft ?? [])];

  return (
    <div className="font-serif text-[10pt] text-[#1a1a1a] leading-[1.45] p-[32px]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Header */}
      {contact.name && (
        <div className="text-center mb-[14px]">
          <h1 className="text-[22pt] font-bold tracking-tight text-[#1a1a1a]">{contact.name}</h1>
          <p className="text-[9pt] text-[#444] mt-[4px] flex flex-wrap justify-center gap-x-3 gap-y-0.5">
            {[contact.email, contact.phone, contact.location, contact.linkedin, contact.website]
              .filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
          </p>
        </div>
      )}

      <Divider />

      {/* Summary */}
      {summary && <Section title="Professional Summary"><p className="text-[9.5pt]">{summary}</p></Section>}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="Work Experience">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-[10px]">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{exp.title}</span>
                <span className="text-[8.5pt] text-[#555]">{exp.startDate}{exp.startDate ? " – " : ""}{exp.current ? "Present" : exp.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline mb-[3px]">
                <span className="italic text-[#444]">{exp.company}{exp.location ? `, ${exp.location}` : ""}</span>
              </div>
              {exp.bullets.filter(b => b.text).map((b) => (
                <p key={b.id} className="ml-[12px] text-[9.5pt] before:content-['•'] before:mr-[5px]">{b.text}</p>
              ))}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu) => (
            <div key={edu.id} className="mb-[6px]">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{edu.degree}</span>
                <span className="text-[8.5pt] text-[#555]">{edu.graduationYear}</span>
              </div>
              <p className="italic text-[#444] text-[9pt]">{edu.school}{edu.location ? `, ${edu.location}` : ""}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {allSkills.length > 0 && (
        <Section title="Skills">
          <p className="text-[9.5pt]">{allSkills.join(" · ")}</p>
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((cert) => (
            <p key={cert.id} className="text-[9.5pt] mb-[3px]">
              <span className="font-semibold">{cert.name}</span>
              {cert.issuer ? ` — ${cert.issuer}` : ""}{cert.year ? ` (${cert.year})` : ""}
            </p>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj) => (
            <div key={proj.id} className="mb-[8px]">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{proj.name}</span>
                {proj.url && <span className="text-[8pt] text-[#555] underline">{proj.url}</span>}
              </div>
              {proj.description && <p className="text-[9.5pt]">{proj.description}</p>}
              {proj.technologies.length > 0 && (
                <p className="text-[8.5pt] text-[#555] italic">{proj.technologies.join(", ")}</p>
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
    <div className="mb-[12px]">
      <h2 className="text-[10pt] font-bold uppercase tracking-[0.06em] mb-[4px] pb-[2px]"
        style={{ borderBottom: "1.5px solid #1a1a1a" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ borderColor: "#1a1a1a", borderTopWidth: "1px", margin: "8px 0" }} />;
}
