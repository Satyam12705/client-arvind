// Injects the correct per-page <title>/<meta description>/canonical/OG tags
// directly into the HTML response for the site's fixed routes (see
// STATIC_SEO in src/data/seoRoutes.ts), so search engines and social-preview
// bots that don't execute JavaScript see the right tags immediately —
// instead of only after the React bundle hydrates and the <Seo> component
// (src/components/Seo.tsx) hoists them client-side.
//
// Deliberately scoped to the fixed route list only. The programmatic
// /services/:slug and /locations/:state pages derive their title from live
// D1 content that only the browser fetches (see src/lib/content.tsx) —
// duplicating that fetch + slug-matching logic here would double the
// surface area for a mismatch bug, so those routes fall through unrewritten
// and rely on client-side hydration (fine for Google, which renders JS).
//
// Every other request (static assets, /api/*) passes through untouched —
// this only ever touches a text/html response body.
import { STATIC_SEO, SITE_URL } from "../src/data/seoRoutes";

export const onRequest: PagesFunction = async (context) => {
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

  const entry = STATIC_SEO[pathname];
  if (!entry) {
    return response;
  }

  const canonicalUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const title = escape(entry.title);
  const description = escape(entry.description);

  return new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(entry.title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute("content", entry.description);
      },
    })
    .on("head", {
      element(el) {
        el.append(
          [
            `<link rel="canonical" href="${canonicalUrl}">`,
            `<meta property="og:site_name" content="Anand Techno-Fab LLP">`,
            `<meta property="og:type" content="website">`,
            `<meta property="og:title" content="${title}">`,
            `<meta property="og:description" content="${description}">`,
            `<meta property="og:url" content="${canonicalUrl}">`,
            `<meta property="og:image" content="${SITE_URL}/images/logo.png">`,
            `<meta name="twitter:card" content="summary_large_image">`,
            `<meta name="twitter:title" content="${title}">`,
            `<meta name="twitter:description" content="${description}">`,
          ].join("\n"),
          { html: true },
        );
      },
    })
    .transform(response);
};
