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

  // Email and D1 are independent, both best-effort — either one succeeding
  // is enough to tell the visitor their enquiry went through. Previously the
  // D1 insert wasn't wrapped, so a missing "enquiries" table (e.g. migration
  // 0005 not yet applied to the live database) threw an unhandled error and
  // failed the whole request with a 500 — even on requests where the email
  // itself sent successfully via Resend.
  let emailSent = false;
  try {
    await sendEnquiryEmail(env, fields);
    emailSent = true;
  } catch (err) {
    console.error("Enquiry email failed:", err instanceof Error ? err.message : String(err));
  }

  let dbSaved = false;
  try {
    await env.DB.prepare(
      "INSERT INTO enquiries (id, name, company_name, phone, email, location, service, requirement, email_sent, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, datetime('now'))"
    )
      .bind(id, fields.name, fields.companyName, fields.phone, fields.email, fields.location, fields.service, fields.requirement, emailSent ? 1 : 0)
      .run();
    dbSaved = true;
  } catch (err) {
    console.error("Enquiry DB insert failed:", err instanceof Error ? err.message : String(err));
  }

  if (!emailSent && !dbSaved) {
    return json({ ok: false, error: "Failed to record enquiry" }, { status: 500 });
  }

  return json({ ok: true, id, emailSent, dbSaved });
};
