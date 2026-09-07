// Regenerates public/sitemap.xml from src/data/seoRoutes.ts (which itself
// derives the programmatic service/location routes from src/data/company.ts).
//
// Run: node scripts/generate-sitemap.mjs
// (bundles seoRoutes.ts with esbuild first so this script has no ts-node dep —
// same technique as scripts/generate-seed.mjs)

import { execSync } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const tmpFile = join(mkdtempSync(join(tmpdir(), "sitemap-")), "seoRoutes.mjs");
execSync(`npx esbuild ${join(root, "src/data/seoRoutes.ts")} --bundle --format=esm --platform=node --outfile=${tmpFile}`, {
  stdio: "inherit",
});
const { SITE_URL, STATIC_SEO, getServiceRoutes, getStateRoutes } = await import(`file://${tmpFile}`);

const today = new Date().toISOString().slice(0, 10);

const urls = [];

for (const [path, entry] of Object.entries(STATIC_SEO)) {
  urls.push({ loc: `${SITE_URL}${path === "/" ? "" : path}`, changefreq: entry.changefreq, priority: entry.priority });
}

for (const s of getServiceRoutes()) {
  urls.push({ loc: `${SITE_URL}/services/${s.slug}`, changefreq: "monthly", priority: 0.7 });
}

for (const s of getStateRoutes()) {
  urls.push({ loc: `${SITE_URL}/locations/${s.slug}`, changefreq: "monthly", priority: 0.7 });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`Wrote public/sitemap.xml with ${urls.length} URLs.`);
