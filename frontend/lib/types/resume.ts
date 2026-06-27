// ── Section IDs (shared between builder and types) ────────────────────────────

export type SectionId =
  | "contact"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "projects";

export const ALL_SECTION_IDS: SectionId[] = [
  "contact", "summary", "experience", "education", "skills", "certifications", "projects",
];

// ── Typography / display settings ─────────────────────────────────────────────

export type ResumeFontFamily =
  | "Arial"
  | "Georgia"
  | "Times New Roman"
  | "Calibri"
  | "Cambria";

export const RESUME_FONTS: ResumeFontFamily[] = [
  "Arial", "Georgia", "Times New Roman", "Calibri", "Cambria",
];

export const FONT_CSS_MAP: Record<ResumeFontFamily, string> = {
  "Arial":            "Arial, 'Liberation Sans', Helvetica, sans-serif",
  "Georgia":          "Georgia, 'Liberation Serif', serif",
  "Times New Roman":  "'Times New Roman', Times, 'Liberation Serif', serif",
  "Calibri":          "Calibri, 'Trebuchet MS', sans-serif",
  "Cambria":          "Cambria, Georgia, serif",
};

export type ResumeMarginsPreset = "narrow" | "normal" | "wide";

export const MARGIN_PX_MAP: Record<ResumeMarginsPreset, string> = {
  narrow: "18px 20px",
  normal: "28px 36px",
  wide:   "36px 52px",
};

export interface ResumeSettings {
  fontFamily:   ResumeFontFamily;
  nameSize:     number;               // 22 | 24 | 26 | 28 | 30
  headingSize:  number;               // 11 | 12 | 13 | 14 | 15
  bodySize:     number;               // 10 | 11 | 12 | 13
  lineSpacing:  number;               // line-height multiplier (1.0 | 1.15 | 1.5)
  margins:      ResumeMarginsPreset;  // "narrow" | "normal" | "wide"
  sectionOrder: SectionId[];          // user-specified section order
  fontSize?:    number;               // Deprecated: kept for backward compatibility
}

export function makeBlankSettings(): ResumeSettings {
  return {
    fontFamily:   "Arial",
    nameSize:     26,
    headingSize:  12,
    bodySize:     10,
    lineSpacing:  1.15,
    margins:      "normal",
    sectionOrder: [...ALL_SECTION_IDS],
  };
}

/** Merges stored settings with defaults — safe against missing keys from old data. */
export function getEffectiveSettings(data: ResumeData): ResumeSettings {
  const defaults = makeBlankSettings();
  const stored = data.settings;
  if (!stored) return defaults;
  
  // Backward compatibility: if old fontSize exists but new sizes don't, map them
  const fallbackBody = stored.fontSize ?? defaults.bodySize;
  const fallbackHeading = stored.fontSize ? stored.fontSize + 2 : defaults.headingSize;
  const fallbackName = stored.fontSize ? stored.fontSize + 16 : defaults.nameSize;

  return {
    fontFamily:   stored.fontFamily   ?? defaults.fontFamily,
    nameSize:     stored.nameSize     ?? fallbackName,
    headingSize:  stored.headingSize  ?? fallbackHeading,
    bodySize:     stored.bodySize     ?? fallbackBody,
    lineSpacing:  stored.lineSpacing  ?? defaults.lineSpacing,
    margins:      stored.margins      ?? defaults.margins,
    sectionOrder: (stored.sectionOrder?.length > 0)
      ? stored.sectionOrder
      : defaults.sectionOrder,
  };
}

// ── Resume Data Types ──────────────────────────────────────────────────────────

export interface ResumeContact {
  name:     string;
  email:    string;
  phone:    string;
  location: string;
  linkedin: string;
  website:  string;
}

export interface ResumeExperienceBullet {
  id:   string;
  text: string;
}

export interface ResumeExperience {
  id:        string;
  title:     string;
  company:   string;
  location:  string;
  startDate: string;   // e.g. "Jan 2022"
  endDate:   string;   // e.g. "Dec 2023" or ""
  current:   boolean;
  bullets:   ResumeExperienceBullet[];
}

export interface ResumeEducation {
  id:             string;
  degree:         string;
  school:         string;
  location:       string;
  graduationYear: string;
  gpa:            string;
}

export interface ResumeSkills {
  technical: string[];
  tools:     string[];
  soft:      string[];
}

export interface ResumeCertification {
  id:     string;
  name:   string;
  issuer: string;
  year:   string;
}

export interface ResumeProject {
  id:           string;
  name:         string;
  description:  string;
  url:          string;
  technologies: string[];
}

export interface ResumeData {
  contact:        ResumeContact;
  summary:        string;
  experience:     ResumeExperience[];
  education:      ResumeEducation[];
  skills:         ResumeSkills;
  certifications: ResumeCertification[];
  projects:       ResumeProject[];
  settings?:      ResumeSettings;  // Optional: backward-compat with existing records
}

export type ResumeTemplate = "classic" | "modern" | "minimal";

export interface Resume {
  id:          string;
  user_id:     string;
  title:       string;
  template:    ResumeTemplate;
  status:      "draft" | "complete";
  resume_data: ResumeData;
  created_at:  string;
  updated_at:  string;
}

// ── Default / blank values ────────────────────────────────────────────────────

export function makeBlankContact(): ResumeContact {
  return { name: "", email: "", phone: "", location: "", linkedin: "", website: "" };
}

export function makeBlankExperience(): ResumeExperience {
  return {
    id: crypto.randomUUID(),
    title: "", company: "", location: "",
    startDate: "", endDate: "", current: false,
    bullets: [{ id: crypto.randomUUID(), text: "" }],
  };
}

export function makeBlankEducation(): ResumeEducation {
  return {
    id: crypto.randomUUID(),
    degree: "", school: "", location: "", graduationYear: "", gpa: "",
  };
}

export function makeBlankSkills(): ResumeSkills {
  return { technical: [], tools: [], soft: [] };
}

export function makeBlankCertification(): ResumeCertification {
  return { id: crypto.randomUUID(), name: "", issuer: "", year: "" };
}

export function makeBlankProject(): ResumeProject {
  return { id: crypto.randomUUID(), name: "", description: "", url: "", technologies: [] };
}

export function makeBlankResumeData(): ResumeData {
  return {
    contact:        makeBlankContact(),
    summary:        "",
    experience:     [],
    education:      [],
    skills:         makeBlankSkills(),
    certifications: [],
    projects:       [],
    settings:       makeBlankSettings(),
  };
}

/** 
 * Safely parses data from the database, falling back to defaults if fields are missing.
 * Also handles migrating the experimental "sections" array back to the flat structure.
 */
export function normalizeResumeData(data: any): ResumeData {
  const blank = makeBlankResumeData();
  if (!data) return blank;

  // Handle rollback from experimental 'sections' array
  if (data.sections && Array.isArray(data.sections)) {
    const contactSec = data.sections.find((s: any) => s.type === "contact");
    const summarySec = data.sections.find((s: any) => s.type === "summary");
    const expSecs = data.sections.filter((s: any) => s.type === "experience");
    const eduSecs = data.sections.filter((s: any) => s.type === "education");
    const skillSec = data.sections.find((s: any) => s.type === "skills");
    const certSecs = data.sections.filter((s: any) => s.type === "certifications");
    const projSecs = data.sections.filter((s: any) => s.type === "projects");

    return {
      contact: contactSec?.items ?? blank.contact,
      summary: summarySec?.items ?? blank.summary,
      experience: expSecs.flatMap((s: any) => s.items || []),
      education: eduSecs.flatMap((s: any) => s.items || []),
      skills: skillSec?.items ?? blank.skills,
      certifications: certSecs.flatMap((s: any) => s.items || []),
      projects: projSecs.flatMap((s: any) => s.items || []),
      settings: data.settings ?? blank.settings,
    };
  }

  // Normal fallback
  return {
    contact:        data.contact        ?? blank.contact,
    summary:        data.summary        ?? blank.summary,
    experience:     data.experience     ?? blank.experience,
    education:      data.education      ?? blank.education,
    skills:         data.skills         ?? blank.skills,
    certifications: data.certifications ?? blank.certifications,
    projects:       data.projects       ?? blank.projects,
    settings:       data.settings       ?? blank.settings,
  };
}
