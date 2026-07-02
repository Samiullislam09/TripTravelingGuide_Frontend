import "server-only";

import { site } from "@/lib/site";

// IndexNow — instantly tells Bing, Yandex, and (experimentally) Google that URLs
// were added or updated, so rewritten posts get recrawled fast instead of
// waiting for the next scheduled crawl. The public key file lives at
// /<INDEXNOW_KEY>.txt (in /public); search engines fetch it to verify ownership.

const ENDPOINT = "https://api.indexnow.org/indexnow";

export interface IndexNowResult {
  ok: boolean;
  status?: number;
  submitted: number;
  error?: string;
}

export async function pingIndexNow(urls: string[]): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return { ok: false, submitted: 0, error: "INDEXNOW_KEY not set" };

  const clean = urls.filter((u) => /^https?:\/\//i.test(u));
  if (clean.length === 0) return { ok: true, submitted: 0 };

  const base = site.url.replace(/\/$/, "");
  let host: string;
  try {
    host = new URL(base).host;
  } catch {
    return { ok: false, submitted: 0, error: "invalid site.url" };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${base}/${key}.txt`,
        urlList: clean.slice(0, 10000),
      }),
    });
    // 200 and 202 both mean accepted.
    return { ok: res.ok, status: res.status, submitted: clean.length };
  } catch (e) {
    return { ok: false, submitted: 0, error: (e as Error).message };
  }
}
