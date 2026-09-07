import { SITE_NAME, SITE_URL, STATIC_SEO } from "../data/seoRoutes";

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

/**
 * Per-page document metadata. React 19 hoists <title>/<meta>/<link> rendered
 * anywhere in the tree into <head> automatically (deduping as the route
 * changes), so this needs no portal/provider — it just needs to be rendered
 * on every page. JSON-LD <script> tags are valid anywhere in the document
 * and don't need hoisting.
 *
 * `path` is required and must match the route exactly (leading slash, no
 * trailing slash except "/") — it drives the canonical URL, OG url, and the
 * breadcrumb/JSON-LD @id values.
 */
export default function Seo({
  path,
  title,
  description,
  image,
  breadcrumbs,
  jsonLd,
  noindex,
}: {
  path: string;
  title?: string;
  description?: string;
  image?: string;
  breadcrumbs?: BreadcrumbEntry[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}) {
  const staticEntry = STATIC_SEO[path];
  const resolvedTitle = title ?? staticEntry?.title ?? SITE_NAME;
  const resolvedDescription = description ?? staticEntry?.description ?? "";
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const ogImage = image ? `${SITE_URL}${image}` : `${SITE_URL}/images/logo.png`;

  const breadcrumbJsonLd = breadcrumbs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${SITE_URL}${b.path === "/" ? "" : b.path}`,
        })),
      }
    : null;

  const jsonLdList = [
    breadcrumbJsonLd,
    ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []),
  ].filter(Boolean);

  return (
    <>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLdList.map((entry, i) => (
        // eslint-disable-next-line react/no-danger
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}
    </>
  );
}
