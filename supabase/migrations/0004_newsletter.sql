-- TripTravelingGuide — newsletter subscribers.
-- Run this in Supabase → SQL Editor (or `supabase db push`) AFTER the earlier
-- migrations. The public site writes here through its Next.js API route using the
-- SERVICE ROLE key (server-only), which bypasses RLS. RLS stays enabled with no
-- anon policy, so the public anon key can never read or write the subscriber list.

create extension if not exists "pgcrypto";

create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique check (char_length(email) between 3 and 200),
  status        text not null default 'subscribed',  -- subscribed | unsubscribed
  created_at    timestamptz not null default now()
);

create index if not exists newsletter_subscribers_created_idx
  on public.newsletter_subscribers (created_at desc);

alter table public.newsletter_subscribers enable row level security;

-- No anon/authenticated policies: only the server (service role) may touch this
-- table. RLS with zero policies fully blocks the public anon key.
