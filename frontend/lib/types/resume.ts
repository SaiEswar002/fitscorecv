// ── Resume Data Types ─────────────────────────────────────────────────────────

export interface ResumeContact {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface ResumeExperienceBullet {
  id: string;
  text: string;
}

export interface ResumeExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;    // e.g. "Jan 2022"
  endDate: string;      // e.g. "Dec 2023" or ""
  current: boolean;
  bullets: ResumeExperienceBullet[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationYear: string;
  gpa: string;
}

export interface ResumeSkills {
  technical: string[];
  tools: string[];
  soft: string[];
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface ResumeData {
  contact: ResumeContact;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkills;
  certifications: ResumeCertification[];
  projects: ResumeProject[];
}

export type ResumeTemplate = "classic" | "modern" | "minimal";

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template: ResumeTemplate;
  status: "draft" | "complete";
  resume_data: ResumeData;
  created_at: string;
  updated_at: string;
}

// ── Default / blank values ────────────────────────────────────────────────────

export function makeBlankContact(): ResumeContact {
  return { name: "", email: "", phone: "", location: "", linkedin: "", website: "" };
}

export function makeBlankExperience(): ResumeExperience {
  return {
    id: crypto.randomUUID(),
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [{ id: crypto.randomUUID(), text: "" }],
  };
}

export function makeBlankEducation(): ResumeEducation {
  return {
    id: crypto.randomUUID(),
    degree: "",
    school: "",
    location: "",
    graduationYear: "",
    gpa: "",
  };
}

export function makeBlankSkills(): ResumeSkills {
  return { technical: [], tools: [], soft: [] };
}

export function makeBlankCertification(): ResumeCertification {
  return { id: crypto.randomUUID(), name: "", issuer: "", year: "" };
}

export function makeBlankProject(): ResumeProject {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    url: "",
    technologies: [],
  };
}

export function makeBlankResumeData(): ResumeData {
  return {
    contact: makeBlankContact(),
    summary: "",
    experience: [],
    education: [],
    skills: makeBlankSkills(),
    certifications: [],
    projects: [],
  };
}
