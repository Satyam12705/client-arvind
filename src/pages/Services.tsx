import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { slugify } from "../data/seoRoutes";
import { useContent } from "../lib/content";

export default function Services() {
  const { specializations, pageHeroes } = useContent();
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: specializations.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      item: { "@type": "Service", name: s.title, description: s.body },
    })),
  };
  return (
    <>
      <Seo
        path="/services"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]}
        jsonLd={servicesJsonLd}
      />
      <PageHero index="02" eyebrow={pageHeroes.services.eyebrow} title={pageHeroes.services.title} intro={pageHeroes.services.intro} />

      <section className="container-edge py-16 md:py-24">
        {specializations.map((s, i) => (
          <div
            key={s.number}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-14 items-center ${
              i !== 0 ? "border-t border-concrete" : ""
            }`}
          >
            <Reveal
              as="div"
              className={`group lg:col-span-5 aspect-[4/3] overflow-hidden ${
                i % 2 === 1 ? "lg:order-2" : ""
              }`}
            >
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </Reveal>
            <Reveal as="div" delay={120} className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <span className="label-eyebrow text-rust">{s.number}</span>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight uppercase">
                {s.title}
              </h2>
              <p className="text-steel">{s.subtitle}</p>
              <p className="mt-5 text-charcoal/80 leading-relaxed max-w-xl">{s.body}</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                <Link
                  to={`/services/${slugify(s.title)}`}
                  className="group/link inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark"
                >
                  Full capability & project record
                  <ArrowIcon className="transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
                <Link
                  to="/projects"
                  className="group/link inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark"
                >
                  Related project experience
                  <ArrowIcon className="transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        ))}
      </section>
    </>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
