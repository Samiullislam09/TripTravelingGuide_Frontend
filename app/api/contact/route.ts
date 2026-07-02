import { NextResponse } from "next/server";
import { addContactMessage } from "@/lib/server/contact-store";
import { notifyNewContact } from "@/lib/server/notify";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const record =
    typeof body === "object" && body !== null
      ? (body as { name?: unknown; email?: unknown; message?: unknown })
      : {};

  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const message =
    typeof record.message === "string" ? record.message.trim() : "";

  if (
    !name ||
    name.length > 120 ||
    !email ||
    !EMAIL_REGEX.test(email) ||
    message.length < 1 ||
    message.length > 5000
  ) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid name, email, and message." },
      { status: 400 }
    );
  }

  // 1) Persist to Supabase. If this fails, the request fails — nothing is lost
  //    silently.
  try {
    await addContactMessage({ name, email, message });
  } catch (error) {
    console.error("Contact save failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }

  // 2) Fire the email notification. It's best-effort: a mail failure must not
  //    fail the request, because the message is already safely stored.
  await notifyNewContact({ name, email, message });

  return NextResponse.json({ ok: true });
}
