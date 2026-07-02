import { NextResponse } from "next/server";
import { like } from "@/lib/server/comment-store";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  try {
    return NextResponse.json(await like(id));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Comment not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
