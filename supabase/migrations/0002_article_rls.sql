-- Secure the Article table for public reads.
-- The dashboard writes as the `postgres` owner (BYPASSRLS), so this does not
-- affect the AI pipeline. It only governs what the public anon/authenticated
-- PostgREST roles may read: PUBLISHED posts only — drafts stay private.

alter table public."Article" enable row level security;

drop policy if exists "public reads published articles" on public."Article";
create policy "public reads published articles"
  on public."Article"
  for select
  to anon, authenticated
  using (status = 'published');
