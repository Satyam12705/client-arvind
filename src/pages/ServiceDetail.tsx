import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { SERVICE_NUMBER_TO_CATEGORIES, slugify } from "../data/seoRoutes";
import { useContent } from "../lib/content";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { specializations, projects, methodology } = useContent();

  const service = useMemo(
    () => specializations.find((s) => slugify(s.title) === slug),
    [specializations, slug],
  );

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const categories: string[] = SERVICE_NUMBER_TO_CATEGORIES[service.number] ?? [];
  const relatedProjects = projects.filter((p) => p.categories.some((c) => categories.includes(c)));
  const states = Array.from(
    new Set(relatedProjects.map((p) => p.location.split(",").map((s) => s.trim()).pop()!).filter((s) => s.toLowerCase() !== "india")),
  );
  const totalCr = relatedProjects.reduce((sum, p) => sum + p.workDoneCr, 0);

  const title = `${service.title} Contractor | Anand Techno-Fab LLP`;
  const description = relatedProjects.length
    ? `${service.body} ${relatedProjects.length} project reference${relatedProjects.length === 1 ? "" : "s"} worth ₹${totalCr.toFixed(2)} Cr across ${states.join(", ")}.`
    : service.body;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    provider: { "@type": "GeneralContractor", name: "Anand Techno-Fab LLP" },
    description: service.body,
    areaServed: states.map((name) => ({ "@type": "State", name })),
  };

  return (
    <>
      <Seo
        path={`/services/${slug}`}
        title={title}
        description={description}
        image={service.image}
        jsonLd={serviceJsonLd}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${slug}` },
        ]}
      />
      <PageHero eyebrow="Services" title={service.title} intro={service.subtitle} index={service.number} />

      <section className="container-edge py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-7">
          <p className="text-charcoal/80 leading-relaxed max-w-xl">{service.body}</p>

          <div className="mt-10">
            <p className="label-eyebrow text-steel mb-4">Our approach</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-concrete border border-concrete">
              {methodology.map((m) => (
                <div key={m.number} className="bg-paper p-5">
                  <span className="label-eyebrow text-rust">{m.number}</span>
                  <p className="mt-2 font-semibold leading-snug text-sm">{m.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/capabilities"
              className="label-eyebrow px-5 py-3 bg-charcoal text-paper hover:bg-rust transition-colors duration-300"
            >
              Team & equipment
            </Link>
            <Link
              to="/contact"
              className="label-eyebrow px-5 py-3 border border-charcoal hover:border-rust hover:text-rust transition-colors duration-300"
            >
              Discuss a project
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <img src={service.image} alt={service.title} className="w-full aspect-[4/3] object-cover" loading="lazy" decoding="async" />
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="bg-ivory border-y border-concrete">
          <div className="container-edge py-16 md:py-24">
            <p className="label-eyebrow text-steel mb-4">
              Project record — {relatedProjects.length} reference{relatedProjects.length === 1 ? "" : "s"}, ₹{totalCr.toFixed(2)} Cr
            </p>
            <div className="border-t border-charcoal/15">
              {relatedProjects.map((p, i) => (
                <Reveal
                  key={p.id}
                  delay={(i % 8) * 40}
                  className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 py-5 border-b border-charcoal/15 items-center"
                >
                  <span className="label-eyebrow text-rust md:col-span-1">{p.year}</span>
                  <span className="col-span-2 md:col-span-5 font-medium">{p.title}</span>
                  <span className="text-sm text-steel md:col-span-3">{p.location}</span>
                  <span className="text-sm font-mono md:col-span-3 md:text-right">₹{p.workDoneCr} Cr</span>
                </Reveal>
              ))}
            </div>
            {states.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {states.map((name) => (
                  <Link
                    key={name}
                    to={`/locations/${slugify(name)}`}
                    className="label-eyebrow px-4 py-2 border border-concrete hover:border-charcoal hover:text-charcoal text-steel transition-all duration-300"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="container-edge py-10">
        <Link to="/services" className="label-eyebrow text-rust hover:text-rust-dark">
          ← All services
        </Link>
      </section>
    </>
  );
}
