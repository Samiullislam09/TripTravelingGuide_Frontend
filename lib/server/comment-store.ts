import "server-only";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { Comment } from "@/lib/api";

// Comments are stored in Supabase Postgres (table `public.comments`). All access
// here runs server-side with the service role key, so RLS is bypassed and the
// public anon key can never touch the table directly. See
// supabase/migrations/0001_comments.sql for the schema + policies.

const TABLE = "comments";

interface Row {
  id: string;
  post_slug: string;
  name: string;
  body: string;
  parent_id: string | null;
  likes: number;
  created_at: string;
}

function toComment(r: Row): Comment {
  return {
    id: r.id,
    postSlug: r.post_slug,
    name: r.name,
    body: r.body,
    parentId: r.parent_id,
    likes: r.likes,
    createdAt: r.created_at,
  };
}

function sanitize(value: string): string {
  return value.replace(/[<>]/g, "");
}

export async function getByPost(slug: string): Promise<Comment[]> {
  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .select("*")
    .eq("post_slug", slug)
    .eq("approved", true)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as Row[] | null ?? []).map(toComment);
}

export async function add(input: {
  postSlug: string;
  name: string;
  body: string;
  parentId?: string | null;
}): Promise<Comment> {
  const name = sanitize(input.name.trim());
  const body = sanitize(input.body.trim());

  if (!name) throw new Error("Comment name is required.");
  if (!body) throw new Error("Comment body is required.");

  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .insert({
      post_slug: input.postSlug,
      name,
      body,
      parent_id: input.parentId ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return toComment(data as Row);
}

export async function like(id: string): Promise<{ likes: number }> {
  const { data, error } = await supabaseAdmin().rpc("increment_comment_likes", {
    comment_id: id,
  });

  if (error) throw new Error(error.message);
  if (data === null || data === undefined) {
    throw new Error(`Comment "${id}" not found.`);
  }
  return { likes: data as number };
}
