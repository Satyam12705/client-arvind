// Sends the contact-form notification email via Resend (https://resend.com)
// — a plain fetch call, no SDK, matching the same pattern cloudinary.ts uses
// for the same reason: the Workers runtime Pages Functions run on doesn't
// have Node's `crypto`/`http` modules most provider SDKs assume.
//
// One-time setup (see wrangler.toml for the full checklist):
//   1. Sign up at resend.com and verify the anandtechnofab.com sending domain.
//   2. wrangler pages secret put RESEND_API_KEY
import type { Env } from "./env";

export interface EnquiryFields {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  requirement: string;
}

const NOTIFY_TO = "mail@anandtechnofab.com";
const FROM = "Anand Techno-Fab Website <enquiries@anandtechnofab.com>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fieldRow(label: string, value: string): string {
  const safe = value.trim()
    ? escapeHtml(value)
    : '<span style="color:#9a9da3;">Not provided</span>';
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #e7e3d8;font:600 12px/1.4 -apple-system,Segoe UI,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#6b6e74;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e7e3d8;font:400 14px/1.5 -apple-system,Segoe UI,sans-serif;color:#17181a;">${safe}</td>
    </tr>`;
}

export function buildEnquiryEmailHtml(fields: EnquiryFields): string {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#faf8f3;font-family:-apple-system,Segoe UI,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f3;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e7e3d8;">
            <tr>
              <td style="background:#17181a;padding:24px 28px;">
                <p style="margin:0;color:#f3efe6;font:700 11px/1;letter-spacing:.1em;text-transform:uppercase;">Anand Techno-Fab LLP</p>
                <p style="margin:8px 0 0;color:#ffffff;font:600 20px/1.3;">New Project Enquiry</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${fieldRow("Full Name", fields.name)}
                  ${fieldRow("Company", fields.companyName)}
                  ${fieldRow("Phone", fields.phone)}
                  ${fieldRow("Email", fields.email)}
                  ${fieldRow("Project Location", fields.location)}
                  ${fieldRow("Service Required", fields.service)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 28px;">
                <p style="margin:0 0 8px;font:600 12px/1.4 -apple-system,Segoe UI,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#6b6e74;">Project Requirement</p>
                <p style="margin:0;font:400 14px/1.6 -apple-system,Segoe UI,sans-serif;color:#17181a;white-space:pre-wrap;">${escapeHtml(fields.requirement)}</p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font:400 11px/1.5 -apple-system,Segoe UI,sans-serif;color:#9a9da3;">Submitted via the enquiry form on anandtechnofab.com</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendEnquiryEmail(env: Env, fields: EnquiryFields): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [NOTIFY_TO],
      reply_to: fields.email || undefined,
      subject: `New Project Enquiry — ${fields.name}${fields.companyName ? ` (${fields.companyName})` : ""}`,
      html: buildEnquiryEmailHtml(fields),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend send failed (${res.status}): ${detail}`);
  }
}
