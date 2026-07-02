import type { PostSummary } from "@/lib/types";

export interface Comment {
  id: string;
  postSlug: string;
  name: string;
  body: string;
  parentId: string | null;
  likes: number;
  createdAt: string;
}

const JSON_HEADERS = { "Content-Type": "application/json" } as const;

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string; message?: string };
      if (data && (data.error || data.message)) {
        message = data.error ?? data.message ?? message;
      }
    } catch {
      // body was not JSON; keep the default message
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export async function fetchComments(slug: string): Promise<Comment[]> {
  const res = await fetch(`/api/comments?post=${encodeURIComponent(slug)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return parseJson<Comment[]>(res);
}

export async function postComment(payload: {
  postSlug: string;
  name: string;
  body: string;
  parentId?: string | null;
}): Promise<Comment> {
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  return parseJson<Comment>(res);
}

export async function likeComment(id: string): Promise<{ likes: number }> {
  const res = await fetch(`/api/comments/${encodeURIComponent(id)}/like`, {
    method: "POST",
    headers: JSON_HEADERS,
  });
  return parseJson<{ likes: number }>(res);
}

export async function subscribeNewsletter(email: string): Promise<{ ok: boolean }> {
  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ email }),
  });
  return parseJson<{ ok: boolean }>(res);
}

export async function sendContact(p: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: boolean }> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(p),
  });
  return parseJson<{ ok: boolean }>(res);
}

export async function searchPosts(q: string): Promise<PostSummary[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return parseJson<PostSummary[]>(res);
}
