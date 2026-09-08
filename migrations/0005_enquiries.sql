-- Persists every contact-form submission, independent of whether the
-- notification email to mail@anandtechnofab.com actually goes through — a
-- Resend outage or a not-yet-configured RESEND_API_KEY secret should never
-- turn a real lead into a lost one. See functions/api/enquiry.ts.
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  requirement TEXT NOT NULL,
  email_sent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
