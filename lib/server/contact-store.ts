import "server-only";

import { supabaseAdmin } from "@/lib/supabase/server";

// Contact submissions are stored in Supabase Postgres (table
// `public.contact_messages`). All access runs server-side with the service role
// key, so RLS is bypassed and the public anon key can never touch the table.
// See supabase/migrations/0002_contact_and_moderation.sql for the schema.

const TABLE = "contact_messages";

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export interface ContactMessage extends ContactInput {
  id: string;
  status: string;
  createdAt: string;
}

function sanitize(value: string): string {
  return value.replace(/[<>]/g, "");
}

export async function addContactMessage(input: ContactInput): Promise<ContactMessage> {
  const name = sanitize(input.name.trim());
  const email = input.email.trim().toLowerCase();
  const message = sanitize(input.message.trim());

  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .insert({ name, email, message })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id as string,
    name: data.name as string,
    email: data.email as string,
    message: data.message as string,
    status: data.status as string,
    createdAt: data.created_at as string,
  };
}
