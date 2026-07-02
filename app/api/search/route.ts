import { NextResponse } from "next/server";

import { getAllPosts } from "@/lib/content";
import type { PostSummary } from "@/lib/types";

export async function GET(request: Request): Promise<NextResponse<PostSummary[]>> {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();

    if (!q) return NextResponse.json([]);

    const posts = await getAllPosts();
    const matches = posts.filter((post) => {
      const haystack = [post.title, post.excerpt, post.category.name]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    return NextResponse.json(matches.slice(0, 20));
  } catch {
    return NextResponse.json([]);
  }
}
