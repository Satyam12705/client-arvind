# Anand Techno-Fab LLP — Corporate Website

A premium industrial/infrastructure corporate website for Anand Techno-Fab
LLP (Ahmedabad, Gujarat), with a built-in admin panel so every section — text,
images, videos, the logo, contact details, and the arrival animation — can be
edited without touching code or redeploying.

Built with React + TypeScript + Vite + Tailwind CSS v4 on the frontend, and
Cloudflare Pages Functions + D1 (database) on the backend, with Cloudinary's
free tier for media storage (uploaded images/videos/logo) — all on free
tiers. All launch content (projects,
certifications, equipment, team, financials, awards, and every page's copy)
is sourced from the company's official Company Profile document; the
original static file, `src/data/company.ts`, is kept as the real-content
reference and as the seed source for the database (see `scripts/generate-seed.mjs`).

## Local development

```bash
npm install
npm run dev       # starts the Vite dev server
npm run build      # type-checks and builds to dist/
npm run preview    # serves the production build locally
```

## Deploying to Cloudflare Pages

This project builds to a static `dist/` folder, which deploys directly to
[Cloudflare Pages](https://developers.cloudflare.com/pages/). Client-side
routing (React Router) is handled by `public/_redirects`, which is copied
into `dist/` on build.

### Option A — Connect the repo in the Cloudflare dashboard (recommended)

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages →
   Connect to Git** and select this repository.
2. Framework preset: **Vite**.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Save and deploy. Every push to the connected branch redeploys
   automatically; PRs get their own preview URL.

No further configuration is required — `wrangler.toml` and
`public/_redirects` in this repo are already set up for this.

### Option B — Deploy from the command line with Wrangler

```bash
npx wrangler login          # one-time browser auth
npm run deploy               # builds, then runs: wrangler pages deploy dist
```

`npm run deploy` passes `--project-name=client-arvind` (the actual live
Cloudflare Pages project — Cloudflare names Git-connected projects after the
repo, not after `wrangler.toml`'s `name` field) so it needs no extra flags.

### Option C — Automatic deploys via GitHub Actions

`.github/workflows/deploy.yml` builds and deploys on every push to `main`
(and can be run manually from the Actions tab). It needs two repository
secrets, set under **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN` — create one in the Cloudflare dashboard under
  **My Profile → API Tokens**, using the "Edit Cloudflare Workers" (or a
  custom Pages: Edit) template.
- `CLOUDFLARE_ACCOUNT_ID` — found on the right-hand sidebar of any page in
  the Cloudflare dashboard.

Until those secrets are added, the workflow's build step still runs (and
passes); only the deploy step is skipped.

## Admin Panel Setup (one-time)

The admin panel needs a Cloudflare D1 database (content), a free Cloudinary
account (media uploads), and four secrets. None of this can be provisioned
from this repo alone; run these once, in order, from your own machine with
`npx wrangler login` already done:

```bash
# 1. Create the D1 database, then copy the printed database_id into
#    wrangler.toml (replace REPLACE_WITH_YOUR_D1_DATABASE_ID).
npx wrangler d1 create anand-techno-fab-content

# 2. Apply the schema + seed the real launch content (from company.ts +
#    page copy) into the remote database.
npm run db:migrate:remote

# 3. Sign up for a free Cloudinary account at https://cloudinary.com and
#    copy your Cloud Name, API Key, and API Secret from the dashboard
#    (Console → Settings → API Keys). The free tier's storage/bandwidth
#    is more than enough for this site's media.

# 4. Set the admin login password, the session-signing secret, and the
#    Cloudinary credentials. Pick your own values — these are never
#    committed to the repo.
npx wrangler pages secret put ADMIN_PASSWORD --project-name=client-arvind
npx wrangler pages secret put SESSION_SECRET --project-name=client-arvind
npx wrangler pages secret put CLOUDINARY_CLOUD_NAME --project-name=client-arvind
npx wrangler pages secret put CLOUDINARY_API_KEY --project-name=client-arvind
npx wrangler pages secret put CLOUDINARY_API_SECRET --project-name=client-arvind
```

Then deploy as usual (`npm run deploy`, or push to the Git-connected branch —
see "Deploying to Cloudflare Pages" above). The admin panel is at `/admin` on
your deployed site; sign in with the `ADMIN_PASSWORD` you set in step 4.

**Local development against the admin panel** (optional — the public site
works fine without this, using the bundled default content):

```bash
# One-time local setup — creates a local SQLite DB under .wrangler/, not
# your real Cloudflare account.
npm run db:migrate:local

# Local secrets, read automatically by `wrangler pages dev` (gitignored):
cat > .dev.vars <<'EOF'
ADMIN_PASSWORD=whatever-you-want-locally
SESSION_SECRET=any-long-random-string
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EOF

npm run cf:preview   # builds, then serves the site + admin API on :8788
```

**What's editable from `/admin`:** every page's hero text, headings and
intros; the logo, hero video and hero poster image; the arrival
(logo-intro) animation on/off; the WhatsApp number and default message;
phone numbers, emails and the registered address; the nav menu; the
footer; and every data collection the site is built from — specializations,
projects, the project filters, concurrent commitments, the equipment list,
team headcounts, financials, ISO certifications, statutory registrations,
awards, the completion certificate, and every gallery photo. Editors are
generated generically from the content's shape (text field, textarea for
longer copy, image/video picker, or a repeatable list), so a field added to
the content model shows up in the admin UI automatically — no admin-UI code
changes needed for new fields within an existing section.

**If the admin panel isn't configured yet** (no D1 bound, or the secrets
aren't set), the public site is unaffected — it falls back to the bundled
default content (`src/data/defaultContent.json`, generated from
`company.ts` + the page copy) and simply doesn't serve `/admin` correctly
until the steps above are done.

## Contact Form Email Setup (one-time)

Every submission on `/contact` is saved to D1 (the `enquiries` table,
`migrations/0005_enquiries.sql`) no matter what — that part needs nothing
beyond the D1 setup above. To also have it emailed to
`mail@anandtechnofab.com`, set up [Resend](https://resend.com) (free tier
covers a contact form many times over):

```bash
# 1. Sign up at resend.com, add anandtechnofab.com as a sending domain, and
#    add the SPF + DKIM DNS records it gives you at your domain registrar —
#    without this the emails will either fail to send or land in spam.

# 2. Copy an API key from the Resend dashboard, then:
npx wrangler pages secret put RESEND_API_KEY --project-name=client-arvind
```

Until `RESEND_API_KEY` is set, enquiries still save to D1 — they just won't
be emailed yet, and the enquiry endpoint logs why (visible via
`wrangler pages deployment tail`). No code changes needed once the secret
is added; it takes effect on the next request.

## Project structure

```
src/
  data/company.ts        Real launch content (source for the DB seed + fallback)
  data/defaultContent.json  Generated bundle the site falls back to before/without the DB
  lib/content.tsx         ContentProvider/useContent — reads live content from /api/content
  lib/adminApi.ts          Admin panel's fetch wrapper (auth, content, media)
  components/              Shared UI (Navbar, Footer, Lightbox, ContactDock, ...)
  components/admin/        Generic schema-driven editors (Object/List/MediaPicker), auth guard
  pages/                   One file per public route (Home, About, Services, Projects, ...)
  pages/admin/             Admin login + dashboard
functions/
  api/content.ts           Public: GET the full site content JSON
  api/media/[id].ts        Public: serve an uploaded file by id
  api/admin/               Login/logout/session-check, content writes, media upload/list/delete
  _lib/                    Auth (signed cookie sessions), D1 helpers, shared types
migrations/
  0001_init.sql            content + media tables
  0002_seed.sql             Generated — real launch content (regenerate via `npm run seed:generate`)
scripts/generate-seed.mjs  Regenerates 0002_seed.sql + defaultContent.json from company.ts
public/
  images/                   Real project photography, certificates & awards
  videos/                   Hero background video
  _redirects                SPA fallback for Cloudflare Pages
```
