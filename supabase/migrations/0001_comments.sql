-- TripTravelingGuide — comments table (Supabase Postgres)
-- Run this in Supabase → SQL Editor (or `supabase db push`).
-- The public site reads/writes comments through its own Next.js API route using
-- the SERVICE ROLE key (server-only), which bypasses RLS. RLS is still enabled
-- as defense-in-depth so the public anon key can't abuse the table directly.

create extension if not exists "pgcrypto";

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_slug  text not null,
  name       text not null check (char_length(name) between 1 and 80),
  body       text not null check (char_length(body) between 1 and 2000),
  parent_id  uuid references public.comments(id) on delete cascade,
  likes      integer not null default 0,
  approved   boolean not null default true,   -- flip default to false to moderate
  created_at timestamptz not null default now()
);

create index if not exists comments_post_slug_created_idx
  on public.comments (post_slug, created_at);

-- Atomic like increment (avoids read-then-write races).
create or replace function public.increment_comment_likes(comment_id uuid)
returns integer
language sql
as $$
  update public.comments
     set likes = likes + 1
   where id = comment_id
  returning likes;
$$;

-- Row Level Security ------------------------------------------------------
alter table public.comments enable row level security;

-- Anon (browser) may read approved comments only. Writes are NOT allowed for
-- anon — they go through the server (service role). Add an insert policy here
-- later if you ever move to direct browser inserts.
drop policy if exists "read approved comments" on public.comments;
create policy "read approved comments"
  on public.comments for select
  to anon, authenticated
  using (approved = true);
