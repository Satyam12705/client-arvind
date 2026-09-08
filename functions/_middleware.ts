// Injects the correct per-page <title>/<meta description>/canonical/OG tags
// directly into the HTML response, so search engines and social-preview bots
// that don't execute JavaScript see the right tags immediately — instead of
// only after the React bundle hydrates and the <Seo> component
// (src/components/Seo.tsx) hoists them client-side.
//
// Covers two kinds of routes:
//   - The fixed route list in STATIC_SEO (src/data/seoRoutes.ts).
//   - The programmatic /services/:slug and /locations/:state pages, whose
//     title/description depend on specialization/project data that can be
//     edited live via the admin panel (stored in D1). Title/description text
//     is computed with computeServiceSeo/computeLocationSeo — the exact same
//     functions ServiceDetail.tsx/LocationDetail.tsx call client-side — so
//     the edge-rendered tags and the hydrated page can't drift apart.
//
// Every other request (static assets, /api/*) passes through untouched —
// this only ever touches a text/html response body.
import {
  STATIC_SEO,
  SITE_URL,
  SITE_NAME,
  slugify,
  computeServiceSeo,
  computeLocationSeo,
  type SeoServiceLike,
  type SeoProjectLike,
} from "../src/data/seoRoutes";
import defaultContentJson from "../src/data/defaultContent.json";
import { getAllContent } from "./_lib/content";
import type { Env } from "./_lib/env";

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function rewriteMeta(response: Response, pathname: string, title: string, description: string, image?: string): Response {
  const canonicalUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
  const ogImage = image ? `${SITE_URL}${image}` : `${SITE_URL}/images/logo.png`;
  const safeTitle = escapeAttr(title);
  const safeDescription = escapeAttr(description);

  return new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute("content", description);
      },
    })
    .on("head", {
      element(el) {
        el.append(
          [
            `<link rel="canonical" href="${canonicalUrl}">`,
            `<meta property="og:site_name" content="${SITE_NAME}">`,
            `<meta property="og:type" content="website">`,
            `<meta property="og:title" content="${safeTitle}">`,
            `<meta property="og:description" content="${safeDescription}">`,
            `<meta property="og:url" content="${canonicalUrl}">`,
            `<meta property="og:image" content="${ogImage}">`,
            `<meta name="twitter:card" content="summary_large_image">`,
            `<meta name="twitter:title" content="${safeTitle}">`,
            `<meta name="twitter:description" content="${safeDescription}">`,
          ].join("\n"),
          { html: true },
        );
      },
    })
    .transform(response);
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const response = await context.next();

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const url = new URL(context.request.url);
  const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");

  if (pathname.startsWith("/admin")) {
    return new HTMLRewriter()
      .on("head", {
        element(el) {
          el.append(`<meta name="robots" content="noindex, nofollow">`, { html: true });
        },
      })
      .transform(response);
  }

  const staticEntry = STATIC_SEO[pathname];
  if (staticEntry) {
    return rewriteMeta(response, pathname, staticEntry.title, staticEntry.description);
  }

  const serviceMatch = pathname.match(/^\/services\/([^/]+)$/);
  const locationMatch = pathname.match(/^\/locations\/([^/]+)$/);
  if (!serviceMatch && !locationMatch) {
    return response;
  }

  // Same defaults-then-live-overrides merge the browser's ContentProvider
  // does (src/lib/content.tsx), so a page an admin hasn't touched still gets
  // correct tags even if D1 is briefly unreachable.
  let specializations = defaultContentJson.specializations as SeoServiceLike[];
  let projects = defaultContentJson.projects as unknown as SeoProjectLike[];
  try {
    const live = await getAllContent(context.env);
    if (Array.isArray(live.specializations)) specializations = live.specializations as SeoServiceLike[];
    if (Array.isArray(live.projects)) projects = live.projects as unknown as SeoProjectLike[];
  } catch {
    // D1 unreachable — fall back to the bundled defaults rather than fail the request.
  }

  if (serviceMatch) {
    const slug = serviceMatch[1];
    const service = specializations.find((s) => slugify(s.title) === slug);
    if (!service) return response;
    const { title, description } = computeServiceSeo(service, projects);
    const image = (service as { image?: string }).image;
    return rewriteMeta(response, pathname, title, description, image);
  }

  const slug = locationMatch![1];
  const result = computeLocationSeo(slug, projects);
  if (!result) return response;
  return rewriteMeta(response, pathname, result.title, result.description);
};
