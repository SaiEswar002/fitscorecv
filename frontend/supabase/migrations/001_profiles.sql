-- ============================================================
-- Migration: 001_profiles.sql
-- Creates public.profiles table linked to auth.users
-- with auto-creation trigger and Row Level Security policies.
-- ============================================================

-- User profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id          uuid        references auth.users(id) on delete cascade primary key,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- ── Trigger: auto-create profile on user signup ───────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop existing trigger if it exists (idempotent)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ── Trigger: keep updated_at fresh ───────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────

alter table public.profiles enable row level security;

-- Users can only read their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Service role can do everything (needed for the trigger)
create policy "Service role full access"
  on public.profiles
  for all
  using (auth.role() = 'service_role');
