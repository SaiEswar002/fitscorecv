"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  User, FileText, Briefcase, GraduationCap, Star, Award, FolderKanban,
  Eye, Edit3, AlignJustify, ChevronLeft, ChevronRight,
  Loader2, CheckCircle, Save, Download, Trash2, GripVertical, ZoomIn,
  Type, Minus, Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { Resume, ResumeData, ResumeTemplate, SectionId, ResumeSettings } from "@/lib/types/resume";
import {
  makeBlankResumeData, makeBlankContact, makeBlankSkills,
  getEffectiveSettings, RESUME_FONTS, ALL_SECTION_IDS,
} from "@/lib/types/resume";
import { updateResumeData, updateResumeMeta, deleteResume } from "@/lib/actions/resume";

import { ContactSection }       from "./sections/ContactSection";
import { SummarySection }       from "./sections/SummarySection";
import { ExperienceSection }    from "./sections/ExperienceSection";
import { EducationSection }     from "./sections/EducationSection";
import { SkillsSection }        from "./sections/SkillsSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { ProjectsSection }      from "./sections/ProjectsSection";
import { ResumePreview }        from "./preview/ResumePreview";
import { DownloadButton }       from "./pdf/DownloadButton";
import { ConfirmDialog }        from "./ConfirmDialog";
import { CompletenessBar }      from "./CompletenessBar";
import { ResumeHealthPanel }    from "./ResumeHealthPanel";

// ── Constants ─────────────────────────────────────────────────────────────────

const SECTION_META: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "contact",        label: "Contact",        icon: User },
  { id: "summary",        label: "Summary",        icon: FileText },
  { id: "experience",     label: "Experience",     icon: Briefcase },
  { id: "education",      label: "Education",      icon: GraduationCap },
  { id: "skills",         label: "Skills",         icon: Star },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "projects",       label: "Projects",       icon: FolderKanban },
];

const SECTION_LABEL: Record<SectionId, string> = Object.fromEntries(
  SECTION_META.map((s) => [s.id, s.label])
) as Record<SectionId, string>;

const TEMPLATES: { id: ResumeTemplate; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "modern",  label: "Modern" },
  { id: "minimal", label: "Minimal" },
];

const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25] as const;
const FONT_SIZES  = [9, 10, 11, 12] as const;
const LINE_SPACINGS = [
  { value: 1.0,  label: "1.0" },
  { value: 1.15, label: "1.15" },
  { value: 1.5,  label: "1.5" },
];
const MARGIN_PRESETS: { value: ResumeSettings["margins"]; label: string }[] = [
  { value: "narrow", label: "Narrow" },
  { value: "normal", label: "Normal" },
  { value: "wide",   label: "Wide" },
];

type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";
type MobileTab  = "sections" | "editor" | "preview";

interface ConfirmState {
  title:   string;
  message: string;
  danger?: boolean;
  onConfirm: () => void;
}

interface Props { resume: Resume; }

// ── BuilderShell ──────────────────────────────────────────────────────────────

export function BuilderShell({ resume }: Props) {
  const router  = useRouter();

  // ── Core state ───────────────────────────────────────────────────────────
  const [data, setData]           = useState<ResumeData>(resume.resume_data ?? makeBlankResumeData());
  const [template, setTemplate]   = useState<ResumeTemplate>(resume.template);
  const [title, setTitle]         = useState(resume.title);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // ── Layout state ─────────────────────────────────────────────────────────
  const [activeSection, setActiveSection]   = useState<SectionId>("contact");
  const [mobileTab, setMobileTab]           = useState<MobileTab>("editor");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewOpen, setPreviewOpen]       = useState(true); // desktop/tablet
  const [zoom, setZoom]                     = useState<number | "fit">("fit");

  // ── Typography state ─────────────────────────────────────────────────────
  const effectiveSettings = getEffectiveSettings(data);
  const [settings, setSettings] = useState<ResumeSettings>(effectiveSettings);

  // ── Section order (drag-and-drop) ────────────────────────────────────────
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(
    effectiveSettings.sectionOrder ?? [...ALL_SECTION_IDS]
  );
  const [draggedId, setDraggedId] = useState<SectionId | null>(null);
  const dragOverId = useRef<SectionId | null>(null);

  // ── Confirmation dialog ───────────────────────────────────────────────────
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  // ── Auto-save ─────────────────────────────────────────────────────────────
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setSaveStatus("dirty");
    triggerSave(nextData);
  }

  function handleSettingsChange(patch: Partial<ResumeSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    const nextData = { ...data, settings: next };
    handleDataChange(nextData);
  }

  async function handleManualSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    try {
      await updateResumeData(resume.id, data);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
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

  async function handleTitleBlur() {
    const trimmed = title.trim() || "My Resume";
    setTitle(trimmed);
    await updateResumeMeta(resume.id, { title: trimmed });
  }

  // ── Drag-and-drop section reordering ─────────────────────────────────────
  function handleDragStart(id: SectionId) {
    setDraggedId(id);
  }
  function handleDragOver(e: React.DragEvent, id: SectionId) {
    e.preventDefault();
    dragOverId.current = id;
    if (!draggedId || draggedId === id) return;
    setSectionOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(draggedId);
      const to   = next.indexOf(id);
      if (from === -1 || to === -1) return prev;
      next.splice(from, 1);
      next.splice(to, 0, draggedId);
      return next;
    });
  }
  function handleDragEnd() {
    setDraggedId(null);
    dragOverId.current = null;
    handleSettingsChange({ sectionOrder });
  }

  // ── Clear / Reset ─────────────────────────────────────────────────────────
  function confirmClearSection(id: SectionId) {
    setConfirm({
      title:   `Clear ${SECTION_LABEL[id]}`,
      message: `This will remove all data from the ${SECTION_LABEL[id]} section. This cannot be undone.`,
      danger:  true,
      onConfirm: () => {
        let next = { ...data };
        switch (id) {
          case "contact":        next = { ...next, contact: makeBlankContact() }; break;
          case "summary":        next = { ...next, summary: "" }; break;
          case "experience":     next = { ...next, experience: [] }; break;
          case "education":      next = { ...next, education: [] }; break;
          case "skills":         next = { ...next, skills: makeBlankSkills() }; break;
          case "certifications": next = { ...next, certifications: [] }; break;
          case "projects":       next = { ...next, projects: [] }; break;
        }
        handleDataChange(next);
        setConfirm(null);
      },
    });
  }

  function confirmResetResume() {
    setConfirm({
      title:   "Reset Entire Resume",
      message: "This will erase all content across every section and start fresh. This cannot be undone.",
      danger:  true,
      onConfirm: () => {
        const blank = makeBlankResumeData();
        handleDataChange(blank);
        setConfirm(null);
      },
    });
  }

  function confirmDeleteResume() {
    setConfirm({
      title:   "Delete Resume",
      message: `"${title}" will be permanently deleted. This cannot be undone.`,
      danger:  true,
      onConfirm: async () => {
        await deleteResume(resume.id);
        router.push("/dashboard");
        setConfirm(null);
      },
    });
  }

  // Cleanup timer on unmount
  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  // ── Section renderer ──────────────────────────────────────────────────────
  function renderSection(id: SectionId) {
    switch (id) {
      case "contact":        return <ContactSection data={data.contact} onChange={(c) => handleDataChange({ ...data, contact: c })} />;
      case "summary":        return <SummarySection data={data.summary} onChange={(s) => handleDataChange({ ...data, summary: s })} />;
      case "experience":     return <ExperienceSection data={data.experience} onChange={(e) => handleDataChange({ ...data, experience: e })} />;
      case "education":      return <EducationSection data={data.education} onChange={(e) => handleDataChange({ ...data, education: e })} />;
      case "skills":         return <SkillsSection data={data.skills} onChange={(s) => handleDataChange({ ...data, skills: s })} />;
      case "certifications": return <CertificationsSection data={data.certifications} onChange={(c) => handleDataChange({ ...data, certifications: c })} />;
      case "projects":       return <ProjectsSection data={data.projects} onChange={(p) => handleDataChange({ ...data, projects: p })} />;
    }
  }

  // ── Save indicator ────────────────────────────────────────────────────────
  function SaveIndicator() {
    if (saveStatus === "saving") return <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-muted)" }}><Loader2 className="w-3 h-3 animate-spin" />Saving…</span>;
    if (saveStatus === "saved")  return <span className="flex items-center gap-1 text-xs text-green-500"><CheckCircle className="w-3 h-3" />Saved</span>;
    if (saveStatus === "dirty")  return <span className="text-xs" style={{ color: "var(--color-muted)" }}>Unsaved changes</span>;
    if (saveStatus === "error")  return <span className="text-xs text-red-500">Save failed</span>;
    return null;
  }

  // ── Sidebar sections in drag order ────────────────────────────────────────
  const orderedSections = sectionOrder
    .map((id) => SECTION_META.find((s) => s.id === id)!)
    .filter(Boolean);

  // ── Layout heights ────────────────────────────────────────────────────────
  // DashboardNav = 56px, BuilderToolbar = 48px  → inner area = calc(100vh - 104px)
  const INNER_H = "calc(100vh - 56px - 48px)";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b flex-wrap md:flex-nowrap"
        style={{
          background:    "var(--color-nav-bg)",
          borderColor:   "var(--color-border)",
          backdropFilter: "blur(12px)",
          height: "48px",
          minHeight: "48px",
          overflow: "hidden",
        }}
      >
        {/* Left group */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Sidebar toggle — desktop */}
          <button
            onClick={() => setSidebarCollapsed((p) => !p)}
            className="hidden md:flex p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--color-muted)" }}
            aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Resume title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="text-sm font-semibold bg-transparent outline-none border-b border-transparent focus:border-current transition-all"
            style={{ color: "var(--color-heading)", maxWidth: "180px", minWidth: "80px" }}
            aria-label="Resume title"
          />

          <SaveIndicator />
        </div>

        {/* Separator */}
        <div className="hidden md:block w-px h-5 flex-shrink-0" style={{ background: "var(--color-border)" }} />

        {/* Typography controls — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
          {/* Font family */}
          <select
            value={settings.fontFamily}
            onChange={(e) => handleSettingsChange({ fontFamily: e.target.value as ResumeSettings["fontFamily"] })}
            className="text-xs rounded-lg px-2 py-1 outline-none"
            style={{
              background: "var(--color-surface-elevated)",
              border:     "1px solid var(--color-border)",
              color:      "var(--color-heading)",
              maxWidth:   "120px",
            }}
            aria-label="Font family"
          >
            {RESUME_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>

          {/* Font size */}
          <div className="flex items-center gap-0.5 rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--color-border)" }}>
            <button
              onClick={() => handleSettingsChange({ fontSize: Math.max(9, settings.fontSize - 1) })}
              className="p-1.5" style={{ background: "var(--color-surface-elevated)", color: "var(--color-muted)" }}
              aria-label="Decrease font size"
            ><Minus className="w-3 h-3" /></button>
            <span className="text-xs px-2 font-mono" style={{ background: "var(--color-surface-elevated)", color: "var(--color-heading)" }}>
              {settings.fontSize}pt
            </span>
            <button
              onClick={() => handleSettingsChange({ fontSize: Math.min(12, settings.fontSize + 1) })}
              className="p-1.5" style={{ background: "var(--color-surface-elevated)", color: "var(--color-muted)" }}
              aria-label="Increase font size"
            ><Plus className="w-3 h-3" /></button>
          </div>

          {/* Line spacing */}
          <select
            value={settings.lineSpacing}
            onChange={(e) => handleSettingsChange({ lineSpacing: parseFloat(e.target.value) })}
            className="text-xs rounded-lg px-2 py-1 outline-none"
            style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)", color: "var(--color-heading)" }}
            aria-label="Line spacing"
          >
            {LINE_SPACINGS.map((ls) => <option key={ls.value} value={ls.value}>↕ {ls.label}</option>)}
          </select>

          {/* Margins */}
          <select
            value={settings.margins}
            onChange={(e) => handleSettingsChange({ margins: e.target.value as ResumeSettings["margins"] })}
            className="text-xs rounded-lg px-2 py-1 outline-none"
            style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)", color: "var(--color-heading)" }}
            aria-label="Margins"
          >
            {MARGIN_PRESETS.map((m) => <option key={m.value} value={m.value}>⊞ {m.label}</option>)}
          </select>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-px h-5 flex-shrink-0" style={{ background: "var(--color-border)" }} />

        {/* Right group */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* Mobile view toggle */}
          <div className="flex md:hidden rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
            {(["sections", "editor", "preview"] as MobileTab[]).map((tab) => {
              const icons: Record<MobileTab, React.ReactNode> = {
                sections: <AlignJustify className="w-3 h-3" />,
                editor:   <Edit3 className="w-3 h-3" />,
                preview:  <Eye className="w-3 h-3" />,
              };
              return (
                <button key={tab} onClick={() => setMobileTab(tab)}
                  className="px-2.5 py-1.5 text-xs font-medium flex items-center gap-1 capitalize"
                  style={{
                    background: mobileTab === tab ? "var(--color-cta)" : "var(--color-surface-elevated)",
                    color:      mobileTab === tab ? "#fff" : "var(--color-muted)",
                  }}>
                  {icons[tab]}
                  <span className="hidden sm:inline">{tab}</span>
                </button>
              );
            })}
          </div>

          {/* Preview toggle — tablet/desktop */}
          <button
            onClick={() => setPreviewOpen((p) => !p)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: previewOpen ? "var(--color-badge-bg)" : "var(--color-surface-elevated)",
              border:     "1px solid var(--color-border)",
              color:      previewOpen ? "var(--color-cta)" : "var(--color-muted)",
            }}
            aria-label="Toggle preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Preview</span>
          </button>

          {/* Manual save */}
          <button
            onClick={handleManualSave}
            disabled={saveStatus === "saving"}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
            style={{ background: "var(--color-surface-elevated)", border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
            aria-label="Save resume"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Save</span>
          </button>

          {/* Download PDF */}
          <DownloadButton data={data} template={template} title={title} settings={settings} />

          {/* Delete */}
          <button
            onClick={confirmDeleteResume}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--color-muted)" }}
            aria-label="Delete resume"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className="flex overflow-hidden" style={{ height: INNER_H }}>

        {/* ── Sidebar ── */}
        {!sidebarCollapsed && (
          <aside
            className={[
              "flex-shrink-0 flex flex-col border-r overflow-y-auto",
              // Mobile: sidebar only shown when mobileTab === "sections"
              mobileTab === "sections" ? "flex w-full md:w-[210px]" : "hidden md:flex md:w-[210px]",
            ].join(" ")}
            style={{ background: "var(--color-surface-elevated)", borderColor: "var(--color-border)" }}
          >
            {/* Sections nav */}
            <div className="p-3">
              <p className="text-xs font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: "var(--color-muted)" }}>
                Sections
              </p>
              {orderedSections.map(({ id, label, icon: Icon }) => (
                <div
                  key={id}
                  draggable
                  onDragStart={() => handleDragStart(id)}
                  onDragOver={(e) => handleDragOver(e, id)}
                  onDragEnd={handleDragEnd}
                  className={[
                    "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium mb-0.5 transition-all cursor-pointer select-none",
                    draggedId === id ? "opacity-40" : "",
                  ].join(" ")}
                  style={{
                    background: activeSection === id ? "var(--color-badge-bg)" : "transparent",
                    color:      activeSection === id ? "var(--color-cta)" : "var(--color-muted)",
                    border:     activeSection === id ? "1px solid var(--color-border)" : "1px solid transparent",
                  }}
                  onClick={() => { setActiveSection(id); setMobileTab("editor"); }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to ${label} section`}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setActiveSection(id); setMobileTab("editor"); } }}
                >
                  <GripVertical className="w-3 h-3 flex-shrink-0 opacity-40" aria-hidden="true" />
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </div>

            {/* Template picker */}
            <div className="p-3 border-t" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: "var(--color-muted)" }}>
                Template
              </p>
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => handleTemplateChange(t.id)}
                  className="w-full text-left px-2 py-1.5 rounded-lg mb-0.5 text-sm transition-all"
                  style={{
                    background: template === t.id ? "var(--color-badge-bg)" : "transparent",
                    color:      template === t.id ? "var(--color-cta)"      : "var(--color-muted)",
                    fontWeight: template === t.id ? 600 : 400,
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Completeness */}
            <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
              <CompletenessBar data={data} />
            </div>

            {/* Health */}
            <ResumeHealthPanel data={data} />

            {/* Reset */}
            <div className="p-3 border-t mt-auto" style={{ borderColor: "var(--color-border)" }}>
              <button
                onClick={confirmResetResume}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg text-left transition-all"
                style={{ color: "var(--color-muted)" }}
              >
                ↺ Reset entire resume
              </button>
            </div>
          </aside>
        )}

        {/* ── Editor ── */}
        <div
          className={[
            "flex-1 flex flex-col overflow-y-auto",
            mobileTab === "preview"  ? "hidden md:flex" :
            mobileTab === "sections" ? "hidden md:flex" : "flex",
          ].join(" ")}
          style={{ background: "var(--color-surface)", minWidth: 0 }}
        >
          {/* Section header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-1 flex-shrink-0">
            <h2 className="text-base font-bold" style={{ color: "var(--color-heading)" }}>
              {SECTION_LABEL[activeSection]}
            </h2>
            <button
              onClick={() => confirmClearSection(activeSection)}
              className="text-xs px-2.5 py-1 rounded-lg transition-all"
              style={{ color: "var(--color-muted)", border: "1px solid var(--color-border)" }}
            >
              Clear section
            </button>
          </div>

          <div className="px-5 py-4 flex-1">
            {renderSection(activeSection)}
          </div>
        </div>

        {/* ── Preview ── */}
        {previewOpen && (
          <div
            className={[
              "flex-shrink-0 flex flex-col border-l overflow-hidden",
              mobileTab === "preview" ? "flex flex-1 w-full md:w-auto" :
              mobileTab === "editor"  ? "hidden md:flex" :
              mobileTab === "sections" ? "hidden md:flex" : "flex",
            ].join(" ")}
            style={{
              width:       "clamp(320px, 42%, 540px)",
              borderColor: "var(--color-border)",
              background:  "#e2e8f0",
            }}
          >
            {/* Zoom bar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b flex-shrink-0"
              style={{ background: "var(--color-nav-bg)", borderColor: "var(--color-border)" }}>
              <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                Preview
              </span>
              <div className="flex items-center gap-1">
                <ZoomIn className="w-3 h-3" style={{ color: "var(--color-muted)" }} aria-hidden="true" />
                <select
                  value={zoom === "fit" ? "fit" : String(zoom)}
                  onChange={(e) => setZoom(e.target.value === "fit" ? "fit" : parseFloat(e.target.value))}
                  className="text-xs rounded px-1 py-0.5 outline-none"
                  style={{ background: "transparent", color: "var(--color-muted)" }}
                  aria-label="Preview zoom"
                >
                  <option value="fit">Fit</option>
                  {ZOOM_LEVELS.map((z) => <option key={z} value={z}>{Math.round(z * 100)}%</option>)}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <ResumePreview data={data} template={template} zoom={zoom} />
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile bottom tab bar ────────────────────────────────────────── */}
      <div className="md:hidden flex border-t flex-shrink-0"
        style={{ background: "var(--color-nav-bg)", borderColor: "var(--color-border)" }}>
        {([
          { tab: "sections" as MobileTab, icon: AlignJustify, label: "Sections" },
          { tab: "editor"   as MobileTab, icon: Edit3,        label: "Edit" },
          { tab: "preview"  as MobileTab, icon: Eye,          label: "Preview" },
        ]).map(({ tab, icon: Icon, label }) => (
          <button key={tab} onClick={() => setMobileTab(tab)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium"
            style={{ color: mobileTab === tab ? "var(--color-cta)" : "var(--color-muted)" }}>
            <Icon className="w-5 h-5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Confirmation dialog ──────────────────────────────────────────── */}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          danger={confirm.danger}
          confirmLabel="Yes, proceed"
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
