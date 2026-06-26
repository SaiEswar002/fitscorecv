"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { User, FileText, Briefcase, GraduationCap, Star, Award, FolderKanban, Eye, Edit3, ChevronLeft, ChevronRight, Loader2, CheckCircle } from "lucide-react";

import type { Resume, ResumeData, ResumeTemplate } from "@/lib/types/resume";
import { makeBlankResumeData } from "@/lib/types/resume";
import { updateResumeData, updateResumeMeta } from "@/lib/actions/resume";

import { ContactSection } from "./sections/ContactSection";
import { SummarySection } from "./sections/SummarySection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { SkillsSection } from "./sections/SkillsSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ResumePreview } from "./preview/ResumePreview";
import { DownloadButton } from "./pdf/DownloadButton";

// ── Section registry ──────────────────────────────────────────────────────────

type SectionId = "contact" | "summary" | "experience" | "education" | "skills" | "certifications" | "projects";

const SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "contact", label: "Contact", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Star },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "projects", label: "Projects", icon: FolderKanban },
];

const TEMPLATES: { id: ResumeTemplate; label: string; desc: string }[] = [
  { id: "classic", label: "Classic", desc: "Traditional, single-column" },
  { id: "modern", label: "Modern", desc: "Accent sidebar, clean layout" },
  { id: "minimal", label: "Minimal", desc: "Ultra-clean, max ATS score" },
];

// ── Save status ───────────────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "saved" | "error";

// ── BuilderShell ──────────────────────────────────────────────────────────────

interface Props { resume: Resume; }

export function BuilderShell({ resume }: Props) {
  const [data, setData] = useState<ResumeData>(resume.resume_data ?? makeBlankResumeData());
  const [template, setTemplate] = useState<ResumeTemplate>(resume.template);
  const [title, setTitle] = useState(resume.title);
  const [activeSection, setActiveSection] = useState<SectionId>("contact");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Auto-save (debounced 1.5s) ───────────────────────────────────────────

  const triggerSave = useCallback(
    (nextData: ResumeData) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaveStatus("saving");
      saveTimer.current = setTimeout(async () => {
        try {
          await updateResumeData(resume.id, nextData);
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2500);
        } catch {
          setSaveStatus("error");
        }
      }, 1500);
    },
    [resume.id]
  );

  function handleDataChange(nextData: ResumeData) {
    setData(nextData);
    triggerSave(nextData);
  }

  async function handleTemplateChange(t: ResumeTemplate) {
    setTemplate(t);
    setSaveStatus("saving");
    try {
      await updateResumeMeta(resume.id, { template: t });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch { setSaveStatus("error"); }
  }

  // Cleanup timer on unmount
  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  // ── Render active section form ────────────────────────────────────────────

  function renderSection() {
    switch (activeSection) {
      case "contact": return <ContactSection data={data.contact} onChange={(c) => handleDataChange({ ...data, contact: c })} />;
      case "summary": return <SummarySection data={data.summary} onChange={(s) => handleDataChange({ ...data, summary: s })} />;
      case "experience": return <ExperienceSection data={data.experience} onChange={(e) => handleDataChange({ ...data, experience: e })} />;
      case "education": return <EducationSection data={data.education} onChange={(e) => handleDataChange({ ...data, education: e })} />;
      case "skills": return <SkillsSection data={data.skills} onChange={(s) => handleDataChange({ ...data, skills: s })} />;
      case "certifications": return <CertificationsSection data={data.certifications} onChange={(c) => handleDataChange({ ...data, certifications: c })} />;
      case "projects": return <ProjectsSection data={data.projects} onChange={(p) => handleDataChange({ ...data, projects: p })} />;
    }
  }

  // ── Save status icon ──────────────────────────────────────────────────────

  function SaveIndicator() {
    if (saveStatus === "saving") return <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-muted)" }}><Loader2 className="w-3 h-3 animate-spin" />Saving…</span>;
    if (saveStatus === "saved") return <span className="flex items-center gap-1 text-xs text-green-500"><CheckCircle className="w-3 h-3" />Saved</span>;
    if (saveStatus === "error") return <span className="text-xs text-red-500">Save failed</span>;
    return null;
  }

  return (
    <>
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ background: "var(--color-nav-bg)", borderColor: "var(--color-border)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarCollapsed(p => !p)} className="hidden md:flex items-center p-1.5 rounded-lg" style={{ color: "var(--color-muted)" }} aria-label="Toggle sidebar">
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            onBlur={() => updateResumeMeta(resume.id, { title })}
            className="text-sm font-semibold bg-transparent outline-none border-b border-transparent focus:border-current transition-all"
            style={{ color: "var(--color-heading)", maxWidth: "200px" }}
            aria-label="Resume title"
          />
          <SaveIndicator />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile view toggle */}
          <div className="flex md:hidden rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
            <button onClick={() => setMobileView("editor")}
              className="px-3 py-1.5 text-xs font-medium flex items-center gap-1"
              style={{ background: mobileView === "editor" ? "var(--color-cta)" : "var(--color-surface-elevated)", color: mobileView === "editor" ? "#fff" : "var(--color-muted)" }}>
              <Edit3 className="w-3 h-3" />Edit
            </button>
            <button onClick={() => setMobileView("preview")}
              className="px-3 py-1.5 text-xs font-medium flex items-center gap-1"
              style={{ background: mobileView === "preview" ? "var(--color-cta)" : "var(--color-surface-elevated)", color: mobileView === "preview" ? "#fff" : "var(--color-muted)" }}>
              <Eye className="w-3 h-3" />Preview
            </button>
          </div>
          <DownloadButton data={data} template={template} title={title} />
        </div>
      </div>

      {/* ── Main split layout ── */}
      <div className="flex overflow-hidden" style={{ height: "calc(100vh - 56px - 56px)" }}> {/* 56px topbar + 56px DashboardNav */}

        {/* ── Sidebar ── */}
        {!sidebarCollapsed && (
          <aside className={`flex-shrink-0 flex flex-col border-r overflow-y-auto ${mobileView === "preview" ? "hidden md:flex" : "flex"}`}
            style={{ width: "200px", background: "var(--color-surface-elevated)", borderColor: "var(--color-border)" }}>

            <div className="p-3">
              <p className="text-xs font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: "var(--color-muted)" }}>Sections</p>
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { setActiveSection(id); setMobileView("editor"); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 text-left transition-all"
                  style={{
                    background: activeSection === id ? "var(--color-badge-bg)" : "transparent",
                    color: activeSection === id ? "var(--color-cta)" : "var(--color-muted)",
                  }}>
                  <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-3 border-t mt-auto" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: "var(--color-muted)" }}>Template</p>
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => handleTemplateChange(t.id)}
                  className="w-full text-left px-3 py-2 rounded-lg mb-0.5 transition-all"
                  style={{
                    background: template === t.id ? "var(--color-badge-bg)" : "transparent",
                    border: template === t.id ? `1px solid var(--color-border)` : "1px solid transparent",
                  }}>
                  <p className="text-xs font-semibold" style={{ color: template === t.id ? "var(--color-cta)" : "var(--color-heading)" }}>{t.label}</p>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>{t.desc}</p>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* ── Editor panel ── */}
        <div className={`flex-1 overflow-y-auto p-5 ${mobileView === "preview" ? "hidden md:block" : "block"}`}
          style={{ background: "var(--color-surface)", minWidth: 0 }}>
          {renderSection()}
        </div>

        {/* ── Preview panel ── */}
        <div className={`flex-shrink-0 border-l overflow-hidden ${mobileView === "editor" ? "hidden md:block" : "block flex-1"}`}
          style={{ width: "clamp(300px, 45%, 560px)", borderColor: "var(--color-border)", background: "#e5e7eb" }}>
          <ResumePreview data={data} template={template} />
        </div>
      </div>
    </>
  );
}
