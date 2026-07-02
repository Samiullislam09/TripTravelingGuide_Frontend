import "server-only";

// Email notifications via Resend's HTTP API (no SDK dependency needed).
// Fully env-gated: if RESEND_API_KEY is not set, these functions silently no-op
// so a submission still succeeds even before email is wired up.
//
// Env vars (set in the frontend project's .env.local / Vercel):
//   RESEND_API_KEY      — from https://resend.com (required to actually send)
//   CONTACT_NOTIFY_EMAIL — where notifications land (defaults to the site inbox)
//   CONTACT_FROM_EMAIL   — verified sender; falls back to Resend's shared sender
//
// Note: on Resend's free tier without a verified domain you can only send TO the
// email that owns the Resend account — which is fine here, since notifications
// go to your own inbox.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_TO = "triptravelingguide@gmail.com";
const DEFAULT_FROM = "TripTravelingGuide <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface ContactNotice {
  name: string;
  email: string;
  message: string;
}

export async function notifyNewContact(msg: ContactNotice): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Email not configured yet — skip silently.

  const to = process.env.CONTACT_NOTIFY_EMAIL || DEFAULT_TO;
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;

  const safeName = escapeHtml(msg.name);
  const safeEmail = escapeHtml(msg.email);
  const safeMessage = escapeHtml(msg.message).replace(/\n/g, "<br />");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
      <h2 style="margin:0 0 4px;font-size:18px;color:#ea580c">New contact message</h2>
      <p style="margin:0 0 16px;color:#6b7280;font-size:13px">Someone reached out through TripTravelingGuide.com</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#6b7280;width:80px">Name</td><td style="padding:6px 0;font-weight:600">${safeName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${safeEmail}" style="color:#ea580c">${safeEmail}</a></td></tr>
      </table>
      <div style="margin-top:14px;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;font-size:14px;line-height:1.6;color:#374151">${safeMessage}</div>
      <p style="margin-top:18px;font-size:12px;color:#9ca3af">Reply directly to this email to respond to ${safeName}.</p>
    </div>`;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: msg.email,
        subject: `New contact message from ${msg.name}`,
        text: `Name: ${msg.name}\nEmail: ${msg.email}\n\n${msg.message}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error("Contact notify email failed:", res.status, await res.text());
    }
  } catch (error) {
    // Never let a mail failure break the submission — it's already saved.
    console.error("Contact notify email error:", error);
  }
}
