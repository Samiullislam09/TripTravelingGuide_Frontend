import "server-only";

import { supabaseAdmin } from "@/lib/supabase/server";

// Newsletter signups are stored in Supabase Postgres (table
// `public.newsletter_subscribers`). All access runs server-side with the service
// role key, so RLS is bypassed and the public anon key can never touch the table.
// See supabase/migrations/0004_newsletter.sql for the schema.

const TABLE = "newsletter_subscribers";

export interface SubscribeResult {
  ok: true;
  alreadySubscribed: boolean;
}

// Idempotent subscribe. A repeat email is a no-op (unique constraint), reported
// back as alreadySubscribed so the UI can show a friendly message.
export async function addSubscriber(email: string): Promise<SubscribeResult> {
  const normalized = email.trim().toLowerCase();

  const { error } = await supabaseAdmin()
    .from(TABLE)
    .insert({ email: normalized });

  if (error) {
    // 23505 = unique_violation → the email is already on the list.
    if (error.code === "23505") {
      return { ok: true, alreadySubscribed: true };
    }
    throw new Error(error.message);
  }

  return { ok: true, alreadySubscribed: false };
}
