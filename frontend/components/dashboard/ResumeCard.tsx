"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText, MoreVertical, Edit2, Copy, Archive, Trash2,
  ExternalLink, Star, RotateCcw, Download, Check, X,
  Clock, Calendar, Layers,
} from "lucide-react";
import type { Resume } from "@/lib/types/resume";
import { computeCompleteness } from "@/components/builder/CompletenessBar";
import {
  archiveResume, unarchiveResume, deleteResume,
  duplicateResume, renameResume,
} from "@/lib/actions/resume";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function computeWordCount(resume: Resume): number {
  const d = resume.resume_data;
  if (!d) return 0;
  const text = [
    d.contact?.name, d.contact?.email, d.contact?.location,
    d.summary,
    ...(d.experience ?? []).map(e => `${e.title} ${e.company} ${e.bullets?.map(b => b.text).join(" ")}`),
    ...(d.education ?? []).map(e => `${e.degree} ${e.school}`),
    ...(d.skills?.technical ?? []),
    ...(d.skills?.tools ?? []),
    ...(d.skills?.soft ?? []),
    ...(d.certifications ?? []).map(c => c.name),
    ...(d.projects ?? []).map(p => `${p.name} ${p.description}`),
  ].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}

function templateBadgeColor(template: string) {
  if (template === "modern")  return { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" };
  if (template === "minimal") return { bg: "rgba(16,185,129,0.12)", text: "#10b981" };
  return { bg: "var(--color-badge-bg)", text: "var(--color-cta)" };
}

// ── Types ────────────────────────────────────────────────────────────────────

interface ResumeCardProps {
  resume: Resume;
  isPinned: boolean;
  onPin: (id: string) => void;
  onDeleted: (id: string) => void;
  onArchived: (id: string) => void;
  onUnarchived: (id: string) => void;
  onRenamed: (id: string, title: string) => void;
  onDuplicated: (newResume: Resume) => void;
}

// ── Card ─────────────────────────────────────────────────────────────────────

export function ResumeCard({
  resume, isPinned, onPin,
  onDeleted, onArchived, onUnarchived, onRenamed, onDuplicated,
}: ResumeCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [renaming, setRenaming]         = useState(false);
  const [renameVal, setRenameVal]       = useState(resume.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition]    = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);

  const isArchived = resume.status === "archived";
  const wordCount  = computeWordCount(resume);
  const pages      = Math.max(1, Math.ceil(wordCount / 400));
  const { score: completeness } = resume.resume_data
    ? computeCompleteness(resume.resume_data)
    : { score: 0 };
  const templateColors = templateBadgeColor(resume.template);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Focus rename input when opened
  useEffect(() => {
    if (renaming) renameRef.current?.select();
  }, [renaming]);

  function handleRenameSubmit() {
    const trimmed = renameVal.trim();
    if (!trimmed) { setRenameVal(resume.title); setRenaming(false); return; }
    startTransition(async () => {
      await renameResume(resume.id, trimmed);
      onRenamed(resume.id, trimmed);
      setRenaming(false);
    });
  }

  function handleDuplicate() {
    setMenuOpen(false);
    startTransition(async () => {
      const newId = await duplicateResume(resume.id);
      // Optimistically push to list via router refresh; parent also handles
      router.refresh();
      onDuplicated({ ...resume, id: newId, title: `${resume.title} (Copy)`, status: "draft" });
    });
  }

  function handleArchive() {
    setMenuOpen(false);
    startTransition(async () => {
      await archiveResume(resume.id);
      onArchived(resume.id);
    });
  }

  function handleUnarchive() {
    setMenuOpen(false);
    startTransition(async () => {
      await unarchiveResume(resume.id);
      onUnarchived(resume.id);
    });
  }

  function handleDelete() {
    setMenuOpen(false);
    setConfirmDelete(true);
  }

  function handleDeleteConfirmed() {
    startTransition(async () => {
      await deleteResume(resume.id);
      onDeleted(resume.id);
      setConfirmDelete(false);
    });
  }

  const completenessColor =
    completeness >= 80 ? "#22c55e" :
    completeness >= 50 ? "#f59e0b" :
    "var(--color-cta)";

  return (
    <>
      <div
        className="relative rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 group"
        style={{
          background: "var(--color-card-bg)",
          border: isPinned
            ? "1.5px solid var(--color-cta)"
            : "1px solid var(--color-card-border)",
          boxShadow: "var(--shadow-card)",
          opacity: isPending ? 0.6 : 1,
        }}
        aria-label={`Resume card: ${resume.title}`}
      >
        {/* Pin indicator */}
        {isPinned && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: "var(--color-badge-bg)", color: "var(--color-cta)", border: "1px solid var(--color-border)" }}>
            <Star className="w-2.5 h-2.5 fill-current" />
            Pinned
          </div>
        )}

        {/* Top row: icon + title + menu */}
        <div className={`flex items-start gap-3 ${isPinned ? "mt-5" : ""}`}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--color-badge-bg)", border: "1px solid var(--color-border)" }}>
            <FileText className="w-5 h-5" style={{ color: "var(--color-cta)" }} />
          </div>

          <div className="flex-1 min-w-0">
            {renaming ? (
              <div className="flex items-center gap-1.5">
                <input
                  ref={renameRef}
                  value={renameVal}
                  onChange={e => setRenameVal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleRenameSubmit();
                    if (e.key === "Escape") { setRenameVal(resume.title); setRenaming(false); }
                  }}
                  className="flex-1 text-sm font-bold bg-transparent outline-none border-b-2 min-w-0"
                  style={{ color: "var(--color-heading)", borderColor: "var(--color-cta)" }}
                  aria-label="Rename resume"
                />
                <button onClick={handleRenameSubmit} className="p-1 rounded text-green-500 hover:bg-green-500/10" aria-label="Confirm rename"><Check className="w-3.5 h-3.5" /></button>
                <button onClick={() => { setRenameVal(resume.title); setRenaming(false); }} className="p-1 rounded text-red-500 hover:bg-red-500/10" aria-label="Cancel rename"><X className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <h3 className="text-sm font-bold truncate leading-snug" style={{ color: "var(--color-heading)" }}>
                {resume.title}
              </h3>
            )}

            {/* Template badge */}
            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
              style={{ background: templateColors.bg, color: templateColors.text }}>
              {resume.template}
            </span>
          </div>

          {/* 3-dot menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "var(--color-muted)", border: "1px solid var(--color-border)" }}
              aria-label="Card options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-48 rounded-xl p-1 z-50"
                style={{
                  background: "var(--color-card-bg)",
                  border: "1px solid var(--color-card-border)",
                  boxShadow: "var(--shadow-card)",
                }}
                role="menu"
              >
                <MenuButton icon={ExternalLink} label="Open" onClick={() => router.push(`/builder/${resume.id}`)} />
                <MenuButton icon={Edit2} label="Rename" onClick={() => { setMenuOpen(false); setRenaming(true); }} />
                <MenuButton icon={Copy} label="Duplicate" onClick={handleDuplicate} />
                <MenuButton icon={Star} label={isPinned ? "Unpin" : "Pin"} onClick={() => { setMenuOpen(false); onPin(resume.id); }} />
                <div className="my-1 h-px" style={{ background: "var(--color-border)" }} />
                {isArchived ? (
                  <MenuButton icon={RotateCcw} label="Unarchive" onClick={handleUnarchive} />
                ) : (
                  <MenuButton icon={Archive} label="Archive" onClick={handleArchive} />
                )}
                <MenuButton icon={Trash2} label="Delete" onClick={handleDelete} danger />
              </div>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]" style={{ color: "var(--color-muted)" }}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {fmtDate(resume.updated_at)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Created {fmtDate(resume.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            ~{pages}p · {wordCount}w
          </span>
        </div>

        {/* Completeness bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
              Completeness
            </span>
            <span className="text-[11px] font-black" style={{ color: completenessColor }}>
              {completeness}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--color-surface)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completeness}%`, background: completenessColor }} />
          </div>
        </div>

        {/* Future: ATS score / Job Match placeholder (hidden until Phase 5) */}
        {/* <div className="text-xs text-muted">ATS: --  ·  Match: --</div> */}

        {/* Actions footer */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/builder/${resume.id}`}
            className="flex-1 text-center py-1.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-cta)" }}
          >
            Open
          </Link>
          <button
            onClick={handleDuplicate}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
            aria-label="Duplicate resume"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          {isArchived ? (
            <button
              onClick={handleUnarchive}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
              style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
              aria-label="Unarchive"
              title="Unarchive"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleArchive}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
              style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
              aria-label="Archive"
              title="Archive"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="max-w-sm w-full rounded-2xl p-6"
            style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", boxShadow: "var(--shadow-card)" }}>
            <h3 className="text-base font-black mb-2" style={{ color: "var(--color-heading)" }}>
              Delete Permanently?
            </h3>
            <p className="text-sm mb-5" style={{ color: "var(--color-muted)" }}>
              <strong style={{ color: "var(--color-body)" }}>&ldquo;{resume.title}&rdquo;</strong> will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors"
                style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={isPending}
                className="flex-1 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "#ef4444" }}
              >
                {isPending ? "Deleting…" : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Menu Button helper ────────────────────────────────────────────────────────

function MenuButton({
  icon: Icon, label, onClick, danger = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors"
      style={{ color: danger ? "#ef4444" : "var(--color-heading)" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = danger
          ? "rgba(239,68,68,0.08)"
          : "var(--color-badge-bg)";
      }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      role="menuitem"
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      {label}
    </button>
  );
}
