import { NextResponse } from "next/server";

import { add, getByPost } from "@/lib/server/comment-store";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const post = searchParams.get("post");

    if (!post) {
      return NextResponse.json(
        { error: "Missing required query parameter: post" },
        { status: 400 },
      );
    }

    const comments = await getByPost(post);
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json(
      { error: "Failed to load comments." },
      { status: 500 },
    );
  }
}

interface CommentRequestBody {
  postSlug?: unknown;
  name?: unknown;
  body?: unknown;
  parentId?: unknown;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload = (await request.json()) as CommentRequestBody;

    const postSlug =
      typeof payload.postSlug === "string" ? payload.postSlug.trim() : "";
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const body = typeof payload.body === "string" ? payload.body.trim() : "";
    const parentId =
      typeof payload.parentId === "string" && payload.parentId.length > 0
        ? payload.parentId
        : null;

    if (
      !postSlug ||
      !name ||
      !body ||
      name.length < 1 ||
      name.length > 80 ||
      body.length < 1 ||
      body.length > 2000
    ) {
      return NextResponse.json(
        { error: "Invalid comment payload." },
        { status: 400 },
      );
    }

    const comment = await add({ postSlug, name, body, parentId });
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create comment." },
      { status: 500 },
    );
  }
}
