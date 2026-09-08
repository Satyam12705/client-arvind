import type { Env } from "../_lib/env";
import { badRequest, json } from "../_lib/env";
import { sendEnquiryEmail, type EnquiryFields } from "../_lib/email";

interface EnquiryBody {
  name?: string;
  companyName?: string;
  phone?: string;
  email?: string;
  location?: string;
  service?: string;
  requirement?: string;
}

// Public (unauthenticated) endpoint — the contact form on /contact posts here.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: EnquiryBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const requirement = (body.requirement ?? "").trim();
  if (!name || !phone || !requirement) {
    return badRequest("Name, phone and project requirement are required");
  }

  const fields: EnquiryFields = {
    name,
    companyName: (body.companyName ?? "").trim(),
    phone,
    email: (body.email ?? "").trim(),
    location: (body.location ?? "").trim(),
    service: (body.service ?? "").trim(),
    requirement,
  };

  const id = crypto.randomUUID();

  let emailSent = false;
  let emailError: string | null = null;
  try {
    await sendEnquiryEmail(env, fields);
    emailSent = true;
  } catch (err) {
    // Best-effort: a Resend outage or a not-yet-configured RESEND_API_KEY
    // secret must never make a real enquiry disappear. It's still saved to
    // D1 below either way — logged here so it's visible in
    // `wrangler pages deployment tail` for whoever's watching.
    emailError = err instanceof Error ? err.message : String(err);
    console.error("Enquiry email failed:", emailError);
  }

  await env.DB.prepare(
    "INSERT INTO enquiries (id, name, company_name, phone, email, location, service, requirement, email_sent, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, datetime('now'))"
  )
    .bind(id, fields.name, fields.companyName, fields.phone, fields.email, fields.location, fields.service, fields.requirement, emailSent ? 1 : 0)
    .run();

  return json({ ok: true, id, emailSent });
};
