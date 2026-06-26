/**
 * Database type definitions for the Supabase client.
 * Phase 2: public.profiles
 * Phase 3: public.resumes (single resume_data JSONB field)
 *
 * Rules:
 * 1. This file must be self-contained — no @/ path alias imports.
 *    The @/ alias is resolved by Next.js/webpack; tsc --noEmit runs without it.
 *
 * 2. Table types must include `Relationships: []` to satisfy the
 *    GenericTable constraint in @supabase/supabase-js. Without it,
 *    Database["public"] does not extend GenericSchema, causing Schema to
 *    resolve as `never` and making every .from() call return `never`.
 *
 * 3. JSONB columns use the Json type (Supabase CLI standard).
 *    Application code in lib/actions/resume.ts handles Json → domain casts.
 */

// ── Supabase-standard Json type (matches Supabase CLI output) ─────────────────
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ── Database schema ───────────────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          template: string;
          status: string;
          resume_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          template?: string;
          status?: string;
          resume_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          template?: string;
          status?: string;
          resume_data?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
