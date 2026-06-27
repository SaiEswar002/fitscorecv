"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, SlidersHorizontal, Plus, ArrowRight, FileText,
  SortAsc, Star, Archive, X,
} from "lucide-react";
import type { Resume, ResumeTemplate } from "@/lib/types/resume";
import { ResumeCard } from "./ResumeCard";

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "classic" | "modern" | "minimal" | "archived";
type SortKey   = "updated" | "created" | "alpha" | "template";

interface Props {
  initialResumes: Resume[];
  mostRecentId:   string | null;
}

// ── Main Client Component ─────────────────────────────────────────────────────

export function ResumeManagerClient({ initialResumes, mostRecentId }: Props) {
  const router = useRouter();

  // Local state — operates on server-fetched list without extra DB calls
  const [resumes, setResumes]         = useState<Resume[]>(initialResumes);
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState<FilterTab>("all");
  const [sort, setSort]               = useState<SortKey>("updated");
  const [pinnedId, setPinnedId]       = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("fitscore_pinned_resume");
  });
  const [showSortMenu, setShowSortMenu] = useState(false);

  // ── Pin ─────────────────────────────────────────────────────────────────────
  const handlePin = useCallback((id: string) => {
    const next = pinnedId === id ? null : id;
    setPinnedId(next);
    if (next) localStorage.setItem("fitscore_pinned_resume", next);
    else localStorage.removeItem("fitscore_pinned_resume");
  }, [pinnedId]);

  // ── CRUD callbacks ──────────────────────────────────────────────────────────
  const handleDeleted = useCallback((id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    if (pinnedId === id) { setPinnedId(null); localStorage.removeItem("fitscore_pinned_resume"); }
  }, [pinnedId]);

  const handleArchived = useCallback((id: string) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, status: "archived" as const } : r));
  }, []);

  const handleUnarchived = useCallback((id: string) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, status: "draft" as const } : r));
  }, []);

  const handleRenamed = useCallback((id: string, title: string) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, title } : r));
  }, []);

  const handleDuplicated = useCallback((newResume: Resume) => {
    setResumes(prev => [newResume, ...prev]);
  }, []);

  // ── Filtering + Sorting ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...resumes];

    // Filter by tab
    if (filter === "archived") {
      list = list.filter(r => r.status === "archived");
    } else {
      list = list.filter(r => r.status !== "archived");
      if (filter !== "all") {
        list = list.filter(r => r.template === (filter as ResumeTemplate));
      }
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) || r.template.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sort === "updated") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sort === "created") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === "alpha")   return a.title.localeCompare(b.title);
      if (sort === "template") return a.template.localeCompare(b.template);
      return 0;
    });

    // Pin first
    if (pinnedId) {
      const pinnedIdx = list.findIndex(r => r.id === pinnedId);
      if (pinnedIdx > 0) {
        const [pinned] = list.splice(pinnedIdx, 1);
        list.unshift(pinned);
      }
    }

    return list;
  }, [resumes, filter, search, sort, pinnedId]);

  const activeCount  = resumes.filter(r => r.status !== "archived").length;
  const archiveCount = resumes.filter(r => r.status === "archived").length;

  // ── Tabs config ─────────────────────────────────────────────────────────────
  const TABS: { id: FilterTab; label: string; count?: number }[] = [
    { id: "all",      label: "All",      count: activeCount },
    { id: "classic",  label: "Classic" },
    { id: "modern",   label: "Modern" },
    { id: "minimal",  label: "Minimal" },
    { id: "archived", label: "Archived", count: archiveCount },
  ];

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "updated",  label: "Recently Updated" },
    { key: "created",  label: "Recently Created" },
    { key: "alpha",    label: "Alphabetical" },
    { key: "template", label: "Template" },
  ];

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: "var(--color-badge-bg)", border: "1px solid var(--color-border)" }}>
          <FileText className="w-10 h-10" style={{ color: "var(--color-cta)" }} />
        </div>
        <h2 className="text-2xl font-black mb-3" style={{ color: "var(--color-heading)" }}>
          You haven&apos;t created a resume yet.
        </h2>
        <p className="text-sm mb-8 max-w-sm" style={{ color: "var(--color-muted)" }}>
          Build your first ATS-optimized resume with live preview, custom templates, and PDF export.
        </p>
        <Link
          href="/builder/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--color-cta)" }}
        >
          <Plus className="w-4 h-4" />
          Create Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/builder/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 flex-shrink-0"
          style={{ background: "var(--color-cta)" }}
        >
          <Plus className="w-4 h-4" />
          New Resume
        </Link>

        {mostRecentId && (
          <Link
            href={`/builder/${mostRecentId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
          >
            Continue Last Resume
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}

        {/* Import — future placeholder */}
        <button
          disabled
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 opacity-40 cursor-not-allowed"
          style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
          title="Coming soon"
        >
          Import Resume
        </button>
      </div>

      {/* ── Search + Sort toolbar ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--color-muted)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resumes…"
            className="w-full pl-9 pr-8 py-2 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--color-heading)",
            }}
            aria-label="Search resumes"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-muted)" }}
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(v => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)", background: "var(--color-surface-elevated)" }}
            aria-label="Sort options"
          >
            <SortAsc className="w-4 h-4" />
            {SORT_OPTIONS.find(s => s.key === sort)?.label}
          </button>
          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowSortMenu(false)} />
              <div
                className="absolute right-0 top-full mt-1.5 w-48 rounded-xl p-1 z-40"
                style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", boxShadow: "var(--shadow-card)" }}
              >
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setSort(opt.key); setShowSortMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors"
                    style={{ color: sort === opt.key ? "var(--color-cta)" : "var(--color-heading)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-badge-bg)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    {sort === opt.key && <SortAsc className="w-3.5 h-3.5" />}
                    {sort !== opt.key && <span className="w-3.5" />}
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter resumes">
        {TABS.map(tab => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(tab.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: isActive ? "var(--color-cta)"   : "var(--color-surface-elevated)",
                color:      isActive ? "#ffffff"             : "var(--color-muted)",
                border:     isActive ? "1px solid transparent" : "1px solid var(--color-border)",
              }}
            >
              {tab.id === "archived" && <Archive className="w-3 h-3" />}
              {tab.id === "all"      && <SlidersHorizontal className="w-3 h-3" />}
              {tab.label}
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.25)" : "var(--color-badge-bg)",
                    color: isActive ? "#fff" : "var(--color-muted)",
                  }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Results count ────────────────────────────────────────────────────── */}
      {search && (
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
        </p>
      )}

      {/* ── Resume Grid ─────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl" style={{ border: "1px dashed var(--color-border)" }}>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--color-muted)" }}>
            No resumes match your filters.
          </p>
          <button
            onClick={() => { setSearch(""); setFilter("all"); }}
            className="text-xs font-semibold mt-2"
            style={{ color: "var(--color-cta)" }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(resume => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              isPinned={pinnedId === resume.id}
              onPin={handlePin}
              onDeleted={handleDeleted}
              onArchived={handleArchived}
              onUnarchived={handleUnarchived}
              onRenamed={handleRenamed}
              onDuplicated={handleDuplicated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
