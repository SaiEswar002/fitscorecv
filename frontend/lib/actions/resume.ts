"use server";

import { createClient } from "@/lib/supabase/server";
import { makeBlankResumeData } from "@/lib/types/resume";
import type { ResumeData, ResumeTemplate, Resume } from "@/lib/types/resume";
import type { Json } from "@/lib/supabase/database.types";
import { revalidatePath } from "next/cache";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAuthedClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return { supabase, user };
}

/**
 * Cast a raw DB row (resume_data is Json) to our domain Resume type.
 * This is the single boundary where Json → ResumeData conversion happens.
 * The cast is safe: resume_data is always written as a valid ResumeData object.
 */
function rowToResume(row: {
  id: string;
  user_id: string;
  title: string;
  template: string;
  status: string;
  resume_data: Json;
  created_at: string;
  updated_at: string;
}): Resume {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    template: row.template as ResumeTemplate,
    status: row.status as "draft" | "complete" | "archived",
    // resume_data is written exclusively by this module as ResumeData,
    // so the cast is safe. Fallback to blank data if somehow null/malformed.
    resume_data: (row.resume_data as unknown as ResumeData) ?? makeBlankResumeData(),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/** Cast ResumeData to Json for Supabase JSONB insert/update.
 *  ResumeData is structurally compatible with Json — localized to write paths only. */
function toJson(data: ResumeData): Json {
  return data as unknown as Json;
}

// ── Actions ───────────────────────────────────────────────────────────────────

/** Create a blank resume and return its ID. */
export async function createResume(title = "My Resume"): Promise<string> {
  const { supabase, user } = await getAuthedClient();

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title,
      template: "classic",
      status: "draft",
      resume_data: toJson(makeBlankResumeData()),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/builder");
  return data.id;
}

/** Fetch a single resume by ID (ownership enforced by RLS). */
export async function getResume(id: string): Promise<Resume | null> {
  const { supabase } = await getAuthedClient();

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToResume(data);
}

/** List all resumes for the current user, newest first. */
export async function listResumes(): Promise<Resume[]> {
  const { supabase } = await getAuthedClient();

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data.map(rowToResume);
}

/** Update resume metadata (title, template, status). */
export async function updateResumeMeta(
  id: string,
  patch: { title?: string; template?: ResumeTemplate; status?: "draft" | "complete" | "archived" }
): Promise<void> {
  const { supabase } = await getAuthedClient();

  const { error } = await supabase
    .from("resumes")
    .update(patch)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/builder/${id}`);
}

/** Update the resume_data JSONB blob. */
export async function updateResumeData(
  id: string,
  resumeData: ResumeData
): Promise<void> {
  const { supabase } = await getAuthedClient();

  const { error } = await supabase
    .from("resumes")
    .update({ resume_data: toJson(resumeData) })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/** Delete a resume by ID. */
export async function deleteResume(id: string): Promise<void> {
  const { supabase } = await getAuthedClient();

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/builder");
  revalidatePath("/dashboard");
}

/** Duplicate a resume and return the new ID. */
export async function duplicateResume(id: string): Promise<string> {
  const { supabase, user } = await getAuthedClient();

  const { data: original, error: fetchError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !original) throw new Error("Resume not found");

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id:     user.id,
      title:       `${original.title} (Copy)`,
      template:    original.template,
      status:      "draft",
      resume_data: original.resume_data,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/builder");
  return data.id;
}

/** List resumes — metadata only (no resume_data blob) for dashboard listing. */
export async function listResumesMeta(): Promise<Omit<Resume, "resume_data">[]> {
  const { supabase } = await getAuthedClient();

  const { data, error } = await supabase
    .from("resumes")
    .select("id, user_id, title, template, status, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => ({
    id:         row.id,
    user_id:    row.user_id,
    title:      row.title,
    template:   row.template as ResumeTemplate,
    status:     row.status as "draft" | "complete",
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

/** Create a genuinely new blank resume (always fresh, never reopens existing). */
export async function createNewResume(title = "My Resume"): Promise<string> {
  return createResume(title);
}

/** Get the most recent NON-archived resume, or create one if none exist. Returns the ID. */
export async function getOrCreateLatestResume(): Promise<string> {
  const { supabase } = await getAuthedClient();

  const { data } = await supabase
    .from("resumes")
    .select("id")
    .neq("status", "archived")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (data?.id) return data.id;
  return createResume();
}

/** Archive a resume (soft-delete). Sets status to "archived". */
export async function archiveResume(id: string): Promise<void> {
  const { supabase } = await getAuthedClient();
  const { error } = await supabase
    .from("resumes")
    .update({ status: "archived" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

/** Restore an archived resume back to draft. */
export async function unarchiveResume(id: string): Promise<void> {
  const { supabase } = await getAuthedClient();
  const { error } = await supabase
    .from("resumes")
    .update({ status: "draft" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

/** Rename a resume title. */
export async function renameResume(id: string, title: string): Promise<void> {
  return updateResumeMeta(id, { title: title.trim() || "Untitled Resume" });
}

