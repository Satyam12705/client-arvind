// Single source of truth for the site's crawlable URLs and their static SEO
// metadata. Consumed by:
//   - src/components/Seo.tsx (per-page <title>/<meta> tags)
//   - scripts/generate-sitemap.mjs (public/sitemap.xml, bundled via esbuild
//     the same way scripts/generate-seed.mjs bundles company.ts)
//   - functions/_middleware.ts (edge meta-tag rewrite for the fixed routes
//     listed in STATIC_SEO — the /services/:slug and /locations/:state pages
//     are excluded there because their titles depend on live D1 content that
//     only the browser fetches; see that file for why)
import { specializations, projects, type ProjectCategory } from "./company";

export const SITE_URL = "https://www.anandtechnofab.com";
export const SITE_NAME = "Anand Techno-Fab LLP";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface StaticSeoEntry {
  title: string;
  description: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}

// Fixed public routes with content that doesn't depend on admin-edited data
// shape (only wording, which the descriptions below already mirror at time
// of writing). Path is the react-router path.
export const STATIC_SEO: Record<string, StaticSeoEntry> = {
  "/": {
    title: "Anand Techno-Fab LLP | Infrastructure Development & Solutions",
    description:
      "Anand Techno-Fab LLP — infrastructure execution across water, oil & gas pipeline laying, structural fabrication & erection, earthwork and mining. Ahmedabad, Gujarat. ISO 9001, 14001 & 18001 certified.",
    changefreq: "weekly",
    priority: 1,
  },
  "/about": {
    title: "About Us | Anand Techno-Fab LLP",
    description:
      "Anand Techno-Fab LLP traces back to 2004 as Anand Construction — 20+ years of infrastructure execution, now an LLP led by Amit Singh Rajput and Suneel Kumar Singh, headquartered in Ahmedabad, Gujarat.",
    changefreq: "monthly",
    priority: 0.8,
  },
  "/services": {
    title: "Services | Pipeline, Structural Fabrication, Earthwork & Mining Contractor",
    description:
      "Turnkey infrastructure services: oil, gas & water pipeline laying, structural fabrication & erection, earthwork in hard/soil strata, mining, and quarry plant operations — executed to ISO 9001:2015 standards.",
    changefreq: "monthly",
    priority: 0.9,
  },
  "/projects": {
    title: "Project Experience | L&T, Adani-LCC JV, SCC Infrastructure | Anand Techno-Fab LLP",
    description:
      "Project references executed for Adani-LCC JV, L&T, LCC Projects Limited, SCC Infrastructure, Kalpataru, JMC and ESSAR across Gujarat, Rajasthan, Madhya Pradesh and Maharashtra — MS water pipeline, irrigation, structural and earthwork contracts.",
    changefreq: "weekly",
    priority: 0.9,
  },
  "/capabilities": {
    title: "Execution Capacity | Team & Equipment | Anand Techno-Fab LLP",
    description:
      "A dedicated technical team of engineers, supervisors and skilled operators, backed by an owned fleet of excavators, welding sets, drilling rigs and dewatering pumps, deployed across concurrent project sites.",
    changefreq: "monthly",
    priority: 0.7,
  },
  "/quality-safety": {
    title: "Quality, Safety & Environment Policy | Anand Techno-Fab LLP",
    description:
      "Our HSE and Quality Management policies, applied consistently across every project site — the operating standard behind ISO 9001:2015, ISO 14001:2015 and ISO 18001:2007 certification.",
    changefreq: "monthly",
    priority: 0.6,
  },
  "/certifications": {
    title: "Certifications & Registrations | ISO 9001, 14001, 18001 | Anand Techno-Fab LLP",
    description:
      "ISO 9001:2015, ISO 14001:2015 and ISO 18001:2007 certification, LLP/GST/Udyam registration, and safety recognitions from L&T, Essar and JMC Projects — presented as issued.",
    changefreq: "monthly",
    priority: 0.6,
  },
  "/gallery": {
    title: "Field Photography | Project Gallery | Anand Techno-Fab LLP",
    description:
      "Real project photography from active and completed sites — pipeline laying, earthwork, mining operations and the site workforce behind the work.",
    changefreq: "monthly",
    priority: 0.5,
  },
  "/contact": {
    title: "Contact Us | Anand Techno-Fab LLP, Ahmedabad",
    description:
      "Reach Anand Techno-Fab LLP by phone, email or WhatsApp, or send a project enquiry directly. Registered office: Ganesh Glory 11, S.G. Highway, Gota, Ahmedabad, Gujarat.",
    changefreq: "yearly",
    priority: 0.7,
  },
  "/locations": {
    title: "Where We Work | Project Locations Across Gujarat, Rajasthan, MP & Maharashtra",
    description:
      "Anand Techno-Fab LLP's infrastructure project locations across Gujarat, Rajasthan, Madhya Pradesh and Maharashtra, with real project references for clients including Adani-LCC JV, L&T and SCC Infrastructure.",
    changefreq: "monthly",
    priority: 0.8,
  },
};

// --- Derived, programmatic route data (the pSEO layer) ---
// Generated from the same company.ts records the live site renders from, so
// the page count and content are bounded by real project/specialization
// history rather than an arbitrary keyword list.

export interface ServiceRouteInfo {
  slug: string;
  title: string;
  number: string;
}

export function getServiceRoutes(): ServiceRouteInfo[] {
  return specializations.map((s) => ({ slug: slugify(s.title), title: s.title, number: s.number }));
}

// Maps a specialization's stable `number` field to the ProjectCategory
// values whose real project records should surface on that service's page.
// Keyed by number (not title) because title is admin-editable free text;
// number is a structural ordinal that isn't meant to be rewritten.
export const SERVICE_NUMBER_TO_CATEGORIES: Record<string, ProjectCategory[]> = {
  "01": ["Water Pipeline", "Irrigation"],
  "02": ["Structural"],
  "03": ["Earthwork"],
  "04": [],
  "05": [],
};

const GENERIC_LOCATIONS = new Set(["india"]);

export interface StateRouteInfo {
  slug: string;
  name: string;
}

export function getStateRoutes(): StateRouteInfo[] {
  const seen = new Map<string, string>();
  for (const p of projects) {
    const parts = p.location.split(",").map((s) => s.trim());
    const name = parts[parts.length - 1];
    const key = name.toLowerCase();
    if (!name || GENERIC_LOCATIONS.has(key)) continue;
    if (!seen.has(key)) seen.set(key, name);
  }
  return Array.from(seen.entries()).map(([key, name]) => ({ slug: slugify(key), name }));
}

// --- Shared title/description logic for the pSEO detail pages ---
// Used by both ServiceDetail.tsx/LocationDetail.tsx (client render, live
// admin-edited content via useContent()) and functions/_middleware.ts (edge
// meta-tag rewrite for bots/social crawlers, D1 content read directly) so
// the two can never drift out of sync with each other.
//
// Typed loosely (string[] categories, not ProjectCategory[]) because the
// admin-editable content arrives as parsed JSON with widened types.
export interface SeoServiceLike {
  number: string;
  title: string;
  body: string;
}

export interface SeoProjectLike {
  location: string;
  client: string;
  workDoneCr: number;
  categories: string[];
}

export function computeServiceSeo<P extends SeoProjectLike>(service: SeoServiceLike, projects: P[]) {
  const categories: string[] = SERVICE_NUMBER_TO_CATEGORIES[service.number] ?? [];
  const relatedProjects = projects.filter((p) => p.categories.some((c) => categories.includes(c)));
  const states = Array.from(
    new Set(
      relatedProjects
        .map((p) => p.location.split(",").map((s) => s.trim()).pop()!)
        .filter((s) => s.toLowerCase() !== "india"),
    ),
  );
  const totalCr = relatedProjects.reduce((sum, p) => sum + p.workDoneCr, 0);
  const title = `${service.title} Contractor | Anand Techno-Fab LLP`;
  const description = relatedProjects.length
    ? `${service.body} ${relatedProjects.length} project reference${relatedProjects.length === 1 ? "" : "s"} worth ₹${totalCr.toFixed(2)} Cr across ${states.join(", ")}.`
    : service.body;
  return { title, description, relatedProjects, states, totalCr };
}

export function computeLocationSeo<P extends SeoProjectLike>(stateSlug: string, projects: P[]) {
  const matches = projects.filter((p) => {
    const parts = p.location.split(",").map((s) => s.trim());
    const name = parts[parts.length - 1];
    return name && slugify(name) === stateSlug;
  });
  if (matches.length === 0) return null;

  const stateName = matches[0].location.split(",").map((s) => s.trim()).pop()!;
  const totalCr = matches.reduce((sum, p) => sum + p.workDoneCr, 0);
  const categories = Array.from(new Set(matches.flatMap((p) => p.categories)));
  const clients = Array.from(new Set(matches.map((p) => p.client)));
  const title = `${stateName} Infrastructure Contractor | Anand Techno-Fab LLP`;
  const description = `${matches.length} project${matches.length === 1 ? "" : "s"} worth ₹${totalCr.toFixed(2)} Cr executed in ${stateName} for ${clients.join(", ")} — ${categories.join(", ").toLowerCase()} work by Anand Techno-Fab LLP.`;
  return { title, description, stateName, matches, totalCr, categories, clients };
}
