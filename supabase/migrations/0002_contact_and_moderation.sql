-- TripTravelingGuide — contact form submissions + comment moderation.
-- Run this in Supabase → SQL Editor AFTER 0001_comments.sql (or `supabase db push`).
-- Both the public site (contact form) and the admin dashboard (moderation) read
-- and write these tables through their own server-side clients using the SERVICE
-- ROLE key, which bypasses RLS. RLS stays enabled as defense-in-depth.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Contact messages from the public /contact form.
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 200),
  message    text not null check (char_length(message) between 1 and 5000),
  -- Moderation/workflow state set from the dashboard:
  --   new | read | replied | archived
  status     text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- No anon/authenticated policies: only the server (service role) may touch this
-- table. Public inserts happen through the Next.js API route with the service
-- role key, and the dashboard reads/updates the same way. RLS with zero policies
-- means the public anon key is fully blocked.

-- ---------------------------------------------------------------------------
-- Comment moderation additions.
-- ---------------------------------------------------------------------------
-- Flag replies posted by the site team from the dashboard, so the public thread
-- and the moderation UI can badge them differently from visitor comments.
alter table public.comments
  add column if not exists is_admin_reply boolean not null default false;
