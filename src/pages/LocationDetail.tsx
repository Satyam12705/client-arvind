import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { SERVICE_NUMBER_TO_CATEGORIES, slugify } from "../data/seoRoutes";
import { useContent } from "../lib/content";

export default function LocationDetail() {
  const { state: stateSlug } = useParams<{ state: string }>();
  const { projects, specializations } = useContent();

  const matches = useMemo(
    () =>
      projects.filter((p) => {
        const parts = p.location.split(",").map((s) => s.trim());
        const name = parts[parts.length - 1];
        return name && slugify(name) === stateSlug;
      }),
    [projects, stateSlug],
  );

  if (matches.length === 0) {
    return <Navigate to="/locations" replace />;
  }

  const stateName = matches[0].location.split(",").map((s) => s.trim()).pop()!;
  const totalCr = matches.reduce((sum, p) => sum + p.workDoneCr, 0);
  const categories = Array.from(new Set(matches.flatMap((p) => p.categories)));
  const clients = Array.from(new Set(matches.map((p) => p.client)));

  const relatedServices = specializations.filter((s) => {
    const cats = SERVICE_NUMBER_TO_CATEGORIES[s.number] ?? [];
    return cats.some((c) => categories.includes(c));
  });

  const title = `${stateName} Infrastructure Contractor | Anand Techno-Fab LLP`;
  const description = `${matches.length} project${matches.length === 1 ? "" : "s"} worth ₹${totalCr.toFixed(2)} Cr executed in ${stateName} for ${clients.join(", ")} — ${categories.join(", ").toLowerCase()} work by Anand Techno-Fab LLP.`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: matches.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      item: { "@type": "CreativeWork", name: p.title, locationCreated: p.location },
    })),
  };

  return (
    <>
      <Seo
        path={`/locations/${stateSlug}`}
        title={title}
        description={description}
        jsonLd={itemListJsonLd}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: stateName, path: `/locations/${stateSlug}` },
        ]}
      />
      <PageHero
        eyebrow="Where We Work"
        title={`Projects in ${stateName}`}
        intro={`${matches.length} real project reference${matches.length === 1 ? "" : "s"} in ${stateName}, worth a combined ₹${totalCr.toFixed(2)} Cr, executed for ${clients.join(", ")}.`}
      />

      <section className="container-edge py-16 md:py-24">
        <div className="border-t border-charcoal/15">
          <div className="hidden md:grid grid-cols-12 gap-4 py-3 label-eyebrow text-steel border-b border-charcoal/15">
            <span className="col-span-1">Year</span>
            <span className="col-span-5">Project</span>
            <span className="col-span-3">Client</span>
            <span className="col-span-3 text-right">Value</span>
          </div>
          {matches.map((p, i) => (
            <Reveal
              key={p.id}
              delay={(i % 8) * 40}
              className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 py-5 border-b border-charcoal/15 items-center"
            >
              <span className="label-eyebrow text-rust md:col-span-1">{p.year}</span>
              <span className="col-span-2 md:col-span-5 font-medium">{p.title}</span>
              <span className="text-sm text-steel md:col-span-3">{p.client}</span>
              <span className="text-sm font-mono md:col-span-3 md:text-right">₹{p.workDoneCr} Cr</span>
            </Reveal>
          ))}
        </div>

        {relatedServices.length > 0 && (
          <div className="mt-12 pt-8 border-t border-concrete">
            <p className="label-eyebrow text-steel mb-4">Services delivered in {stateName}</p>
            <div className="flex flex-wrap gap-3">
              {relatedServices.map((s) => (
                <Link
                  key={s.number}
                  to={`/services/${slugify(s.title)}`}
                  className="label-eyebrow px-4 py-2 border border-concrete hover:border-charcoal hover:text-charcoal text-steel transition-all duration-300"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link to="/locations" className="label-eyebrow text-rust hover:text-rust-dark">
            ← All locations
          </Link>
        </div>
      </section>
    </>
  );
}
