-- ============================================================
-- Migration: 002_resumes.sql
-- Creates public.resumes with a single resume_data JSONB field.
-- Metadata columns: id, user_id, title, template, status, timestamps.
-- ============================================================

create table if not exists public.resumes (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  title        text        not null default 'My Resume',
  template     text        not null default 'classic'
                           check (template in ('classic', 'modern', 'minimal')),
  status       text        not null default 'draft'
                           check (status in ('draft', 'complete')),
  resume_data  jsonb       not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── Index for fast per-user queries ──────────────────────────────────────────
create index if not exists resumes_user_id_idx
  on public.resumes (user_id, updated_at desc);

-- ── Trigger: keep updated_at current ─────────────────────────────────────────
-- Reuses the set_updated_at() function created in 001_profiles.sql
drop trigger if exists set_resumes_updated_at on public.resumes;

create trigger set_resumes_updated_at
  before update on public.resumes
  for each row
  execute function public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.resumes enable row level security;

create policy "Users can view own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resumes"
  on public.resumes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);
