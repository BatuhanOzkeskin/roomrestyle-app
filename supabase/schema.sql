-- ============================================================================
-- RoomRestyle — Supabase schema, Row Level Security, and Storage policies
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- This is what guarantees each user can only ever see their own data.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---- projects table --------------------------------------------------------
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at   timestamptz not null default now(),
  style        text,
  prompt       text,
  input_path   text,
  output_path  text,
  status       text not null default 'processing',   -- processing | done | failed
  items        jsonb                                  -- "make this room real" shopping list
);

create index if not exists projects_user_created_idx
  on public.projects (user_id, created_at desc);

-- ---- Row Level Security: a user only touches their own rows -----------------
alter table public.projects enable row level security;

drop policy if exists projects_select_own on public.projects;
create policy projects_select_own on public.projects
  for select using (auth.uid() = user_id);

drop policy if exists projects_insert_own on public.projects;
create policy projects_insert_own on public.projects
  for insert with check (auth.uid() = user_id);

drop policy if exists projects_update_own on public.projects;
create policy projects_update_own on public.projects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists projects_delete_own on public.projects;
create policy projects_delete_own on public.projects
  for delete using (auth.uid() = user_id);

-- ---- Storage: one private bucket, each user isolated to their own folder ----
insert into storage.buckets (id, name, public)
values ('rooms', 'rooms', false)
on conflict (id) do nothing;

-- Files are stored as:  <user_id>/inputs/<uuid>  and  <user_id>/outputs/<uuid>
-- The first path segment must equal the user's id → cross-user access is blocked.
drop policy if exists rooms_select_own on storage.objects;
create policy rooms_select_own on storage.objects
  for select using (
    bucket_id = 'rooms' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists rooms_insert_own on storage.objects;
create policy rooms_insert_own on storage.objects
  for insert with check (
    bucket_id = 'rooms' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists rooms_update_own on storage.objects;
create policy rooms_update_own on storage.objects
  for update using (
    bucket_id = 'rooms' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists rooms_delete_own on storage.objects;
create policy rooms_delete_own on storage.objects
  for delete using (
    bucket_id = 'rooms' and (storage.foldername(name))[1] = auth.uid()::text
  );
