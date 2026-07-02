"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser Supabase client using the public ANON key. Safe to expose — it is
// gated by Row Level Security. Use for direct reads (e.g. Storage public URLs)
// and any future realtime features. NEVER put the service role key here.

let cached: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  cached = createClient(url, anonKey);
  return cached;
}
