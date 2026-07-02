import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contact.json");

interface ContactEntry {
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

async function readEntries(): Promise<ContactEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ContactEntry[]) : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
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

    const entries = await readEntries();
    entries.push({
      name,
      email: email.toLowerCase(),
      message,
      createdAt: new Date().toISOString(),
    });

    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
