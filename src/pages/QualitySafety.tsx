import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { useContent } from "../lib/content";

export default function QualitySafety() {
  const { hsePolicy, qualityPolicy, pageHeroes, qualitySafetyContent } = useContent();

  return (
    <>
      <Seo
        path="/quality-safety"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Quality & Safety", path: "/quality-safety" }]}
      />
      <PageHero
        index="05"
        eyebrow={pageHeroes.qualitySafety.eyebrow}
        title={pageHeroes.qualitySafety.title}
        intro={pageHeroes.qualitySafety.intro}
      />

      {/* HSE */}
      <section className="container-edge py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        <Reveal className="lg:col-span-6 order-2 lg:order-1">
          <SectionLabel index={qualitySafetyContent.hse.eyebrowIndex} label={qualitySafetyContent.hse.eyebrowLabel} />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-lg">
            {qualitySafetyContent.hse.heading}
          </h2>
          <p className="mt-6 text-charcoal/80 leading-relaxed max-w-lg italic border-l-2 border-rust pl-4">
            &ldquo;{hsePolicy.motto}&rdquo;
          </p>
          <ul className="mt-8 space-y-3">
            {hsePolicy.points.map((p) => (
              <li key={p} className="flex gap-3 text-sm md:text-base">
                <span className="text-rust mt-0.5">—</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={150} className="lg:col-span-6 order-1 lg:order-2 aspect-[4/3] lg:aspect-auto overflow-hidden group">
          <img
            src={qualitySafetyContent.hse.image}
            alt="Field safety training session"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </Reveal>
      </section>

      {/* Quality */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <Reveal className="lg:col-span-6 aspect-[4/3] lg:aspect-auto overflow-hidden group">
            <img
              src={qualitySafetyContent.quality.image}
              alt="Employee health checkup camp at project site"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal delay={150} className="lg:col-span-6">
            <SectionLabel index={qualitySafetyContent.quality.eyebrowIndex} label={qualitySafetyContent.quality.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-lg">
              {qualitySafetyContent.quality.heading}
            </h2>
            <p className="mt-6 text-charcoal/80 leading-relaxed max-w-lg italic border-l-2 border-rust pl-4">
              &ldquo;{qualityPolicy.motto}&rdquo;
            </p>
            <ul className="mt-8 space-y-3">
              {qualityPolicy.points.map((p) => (
                <li key={p} className="flex gap-3 text-sm md:text-base">
                  <span className="text-rust mt-0.5">—</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* People & safety photography */}
      <section className="container-edge py-16 md:py-24">
        <Reveal>
          <SectionLabel index={qualitySafetyContent.people.eyebrowIndex} label={qualitySafetyContent.people.eyebrowLabel} />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            {qualitySafetyContent.people.heading}
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {qualitySafetyContent.people.items.map((item, i) => (
            <Reveal key={item.image} as="figure" delay={i * 100} className="overflow-hidden group">
              <img
                src={item.image}
                alt={item.caption}
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mt-3 text-sm text-steel">{item.caption}</figcaption>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
