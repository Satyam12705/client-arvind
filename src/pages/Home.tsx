import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import AnimatedText from "../components/AnimatedText";
import AnimatedNumber from "../components/AnimatedNumber";
import MagneticButton from "../components/MagneticButton";
import VideoHero from "../components/VideoHero";
import BlueprintFrame from "../components/BlueprintFrame";
import TechTag from "../components/TechTag";
import ProjectExplorer from "../components/ProjectExplorer";
import Seo from "../components/Seo";
import { useContent } from "../lib/content";
import { whatsappLink } from "../lib/whatsapp";
import { useParallax } from "../lib/useParallax";

function StackedHeading({
  text,
  className = "",
  dark = false,
}: {
  text: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <AnimatedText
      as="h2"
      lines={text.split("\n")}
      className={`font-semibold uppercase tracking-tight leading-[0.98] ${dark ? "text-white" : "text-charcoal"} ${className}`}
    />
  );
}

function BgNumeral({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none absolute -top-4 md:-top-10 right-0 text-bg-numeral font-semibold ${
        dark ? "text-ivory/[0.04]" : "text-charcoal/[0.045]"
      }`}
    >
      {children}
    </span>
  );
}

export default function Home() {
  const {
    company,
    siteSettings,
    home,
    timeline,
    specializations,
    projects,
    equipmentHighlights,
    certifications,
    awards,
    contactContent,
  } = useContent();
  const heroBgRef = useParallax<HTMLDivElement>(0.06, 36);
  const featuredProjects = projects.slice(0, 5);
  const { sections } = home;
  const [heroStat, ...supportingStats] = home.stats;

  return (
    <>
      <Seo path="/" />
      {/* 1. HERO — cinematic, dark. min-height (not a capped max-height) so the
          giant display type can never be clipped by overflow-hidden at any
          viewport width — the section grows to fit its content instead. */}
      <section className="relative min-h-[94vh] md:min-h-screen flex items-end overflow-hidden bg-charcoal">
        <div ref={heroBgRef} className="absolute left-0 right-0 layer-isolate" style={{ top: "-6%", bottom: "-6%" }}>
          <VideoHero
            src={siteSettings.heroVideo}
            poster={siteSettings.heroPoster}
            alt={siteSettings.heroVideoAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/25 to-transparent" />

        <div className="container-edge relative z-10 pb-10 md:pb-16 pt-24 layer-isolate">
          <div className="animate-hero-in mb-5" style={{ animationDelay: "60ms" }}>
            <TechTag dark onImage>{home.heroTechTag}</TechTag>
          </div>
          <p className="animate-hero-in label-eyebrow text-rust-light mb-4" style={{ animationDelay: "160ms" }}>
            {home.heroEyebrow}
          </p>
          <AnimatedText
            as="h1"
            trigger="mount"
            baseDelay={260}
            wordDelay={55}
            lines={[home.heroHeadlineLine1, home.heroHeadlineLine2]}
            className="text-white font-semibold uppercase leading-[0.98] tracking-tight text-cinema-display break-words"
          />
          <p
            className="animate-hero-in mt-6 max-w-xl text-ivory/80 text-base md:text-lg leading-relaxed"
            style={{ animationDelay: "480ms" }}
          >
            {home.heroIntro}
          </p>
          <div className="animate-hero-in mt-7 flex flex-wrap gap-4" style={{ animationDelay: "600ms" }}>
            <MagneticButton>
              <Link
                to={home.heroCtaPrimaryTo}
                className="group inline-flex items-center gap-2.5 bg-rust text-white px-7 py-3.5 label-eyebrow hover:bg-rust-dark hover:shadow-[0_6px_24px_rgba(184,83,31,0.4)] transition-all duration-300"
              >
                {home.heroCtaPrimaryLabel}
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to={home.heroCtaSecondaryTo}
                className="group inline-flex items-center gap-2.5 border border-ivory/40 text-white px-7 py-3.5 label-eyebrow hover:border-ivory hover:bg-white/5 transition-all duration-300"
              >
                {home.heroCtaSecondaryLabel}
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
          </div>
        </div>

        <div
          className="hidden md:flex animate-hero-in absolute bottom-8 right-6 xl:right-10 items-center gap-2 text-ivory/50 label-eyebrow layer-isolate"
          style={{ animationDelay: "760ms" }}
        >
          <span className="w-6 h-px bg-ivory/30 layer-isolate" />
          {home.scrollLabel}
        </div>
      </section>

      {/* 2. STATS — one giant number, dark, continues the hero */}
      <section className="relative bg-charcoal text-ivory border-t border-ivory/10 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 top-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-[radial-gradient(circle,rgba(184,83,31,0.16),transparent_65%)]"
        />
        <div className="relative container-edge py-16 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end">
          <Reveal className="lg:col-span-7">
            <BlueprintFrame dark className="inline-block">
              <AnimatedNumber value={heroStat.value} className="block text-stat-giant font-semibold tracking-tight text-white leading-[0.85] px-2 py-1" />
            </BlueprintFrame>
            <p className="mt-4 label-eyebrow text-rust-light">{heroStat.label}</p>
          </Reveal>
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 lg:border-l lg:border-ivory/15 lg:pl-8">
            {supportingStats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="min-w-0 border-t border-ivory/15 pt-4">
                <AnimatedNumber value={s.value} className="block text-3xl md:text-4xl font-semibold tracking-tight text-white" />
                <p className="mt-2 label-eyebrow text-ivory/50">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT / JOURNEY — light, giant full-width stacked headline, asymmetric body below */}
      <section className="relative container-edge py-24 md:py-32 overflow-hidden">
        <BgNumeral>{sections.about.eyebrowIndex}</BgNumeral>
        <div className="relative">
          <TechTag className="mb-6">{sections.about.eyebrowLabel}</TechTag>
          <StackedHeading text={sections.about.heading} className="text-editorial-display whitespace-pre-line" />

          <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Reveal delay={150}>
                <p className="text-steel leading-relaxed max-w-md">{sections.about.body}</p>
                <Link to="/about" className="group mt-7 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
                  {sections.about.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
            <div className="lg:col-span-7 space-y-0 border-t border-concrete">
              {timeline.map((t, i) => (
                <Reveal key={t.year} delay={200 + i * 100} className="flex gap-6 py-5 border-b border-concrete">
                  <span className="tech-tag text-rust shrink-0 w-20 whitespace-nowrap">{t.year}</span>
                  <div>
                    <p className="font-semibold text-charcoal">{t.title}</p>
                    <p className="mt-1 text-sm text-steel leading-relaxed">{t.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES — light/image-forward, featured item + technical list */}
      <section className="relative bg-ivory border-y border-concrete overflow-hidden">
        <BgNumeral>{sections.services.eyebrowIndex}</BgNumeral>
        <div className="relative container-edge py-24 md:py-32">
          <TechTag className="mb-6">{sections.services.eyebrowLabel}</TechTag>
          <StackedHeading text={sections.services.heading} className="text-editorial-display whitespace-pre-line mb-14 md:mb-20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {specializations[0] && (
              <Reveal className="lg:col-span-7">
                <BlueprintFrame className="block aspect-[16/10] overflow-hidden">
                  <img
                    src={specializations[0].image}
                    alt={specializations[0].title}
                    width={1600}
                    height={1000}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </BlueprintFrame>
                <div className="mt-6 flex items-start gap-4">
                  <span className="tech-tag text-rust">{specializations[0].number}</span>
                  <div>
                    <p className="text-xl md:text-2xl font-semibold uppercase tracking-tight">{specializations[0].title}</p>
                    <p className="text-steel text-sm">{specializations[0].subtitle}</p>
                    <p className="mt-2 text-sm text-charcoal/80 leading-relaxed max-w-lg">{specializations[0].body}</p>
                  </div>
                </div>
              </Reveal>
            )}

            <div className="lg:col-span-5 border-t border-charcoal/15 lg:border-t-0">
              {specializations.slice(1).map((s, i) => (
                <Reveal
                  key={s.number}
                  delay={i * 90}
                  className="flex items-baseline gap-4 py-5 border-b border-charcoal/15 group"
                >
                  <span className="tech-tag text-rust shrink-0">{s.number}</span>
                  <div>
                    <p className="font-semibold leading-snug group-hover:text-rust transition-colors">
                      {s.title} <span className="text-steel font-normal">{s.subtitle}</span>
                    </p>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={300}>
                <Link to="/services" className="group mt-7 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
                  {sections.services.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROJECT EXPLORER — dark, signature interaction */}
      <section className="bg-charcoal text-ivory">
        <div className="container-edge py-24 md:py-32">
          <Reveal>
            <TechTag dark className="mb-6">{sections.projects.eyebrowLabel}</TechTag>
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12 md:mb-16">
              <h2 className="text-editorial-display font-semibold uppercase tracking-tight leading-[0.98] text-white whitespace-pre-line max-w-xl">
                {sections.projects.heading}
              </h2>
              <Link to="/projects" className="group label-eyebrow text-rust-light hover:text-white inline-flex items-center gap-2">
                {sections.projects.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <ProjectExplorer projects={featuredProjects} detailHref={() => "/projects"} />
          </Reveal>
        </div>
      </section>

      {/* 6. EXECUTION CAPABILITY — light */}
      <section className="relative container-edge py-24 md:py-32 overflow-hidden">
        <BgNumeral>{sections.capability.eyebrowIndex}</BgNumeral>
        <div className="relative">
          <Reveal>
            <TechTag className="mb-6">{sections.capability.eyebrowLabel}</TechTag>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="text-editorial-display font-semibold uppercase tracking-tight leading-[0.98] whitespace-pre-line max-w-xl">
                {sections.capability.heading}
              </h2>
              <Link to="/capabilities" className="group label-eyebrow text-rust hover:text-rust-dark inline-flex items-center gap-2">
                {sections.capability.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10 border-t border-concrete pt-10">
            {equipmentHighlights.map((e, i) => (
              <Reveal key={e.label} delay={i * 70}>
                <AnimatedNumber value={String(e.count)} className="block text-4xl md:text-5xl font-semibold tracking-tight text-charcoal" />
                <p className="mt-2 label-eyebrow text-steel">{e.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FIELDWORK — full-bleed cinematic image with floating supporting frames */}
      <section className="relative bg-charcoal">
        <div className="relative h-[80vh] min-h-[520px] max-h-[820px] overflow-hidden">
          {sections.photography.items[0] && (
            <img
              src={sections.photography.items[0].image}
              alt={sections.photography.items[0].caption}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-transparent to-transparent" />

          <div className="relative h-full container-edge flex items-end pb-16 md:pb-20">
            <Reveal>
              <TechTag dark onImage className="mb-6">{sections.photography.eyebrowLabel}</TechTag>
              <h2 className="text-editorial-display font-semibold uppercase tracking-tight leading-[0.98] text-white whitespace-pre-line">
                {sections.photography.heading}
              </h2>
              <Link
                to="/gallery"
                className="group mt-7 inline-flex items-center gap-2 label-eyebrow text-rust-light hover:text-white"
              >
                {sections.photography.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          {/* Floating offset supporting frames */}
          <div className="hidden lg:flex absolute right-10 xl:right-16 top-1/2 -translate-y-1/2 flex-col gap-6">
            {sections.photography.items.slice(1).map((item, i) => (
              <Reveal key={item.image} delay={i * 150} className={i === 1 ? "translate-x-10" : ""}>
                <BlueprintFrame dark className="block w-56 aspect-[4/3] overflow-hidden shadow-2xl">
                  <img src={item.image} alt={item.caption} width={800} height={600} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </BlueprintFrame>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. QUALITY / TRUST MOMENT — light */}
      <section className="relative container-edge py-24 md:py-32 overflow-hidden">
        <BgNumeral>{sections.quality.eyebrowIndex}</BgNumeral>
        <div className="relative">
          <Reveal>
            <TechTag className="mb-6">{sections.quality.eyebrowLabel}</TechTag>
            <h2 className="text-editorial-display font-semibold uppercase tracking-tight leading-[0.98] whitespace-pre-line">
              {sections.quality.heading}
            </h2>
          </Reveal>

          <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-concrete border border-concrete">
            {certifications.map((c, i) => (
              <Reveal key={c.id} delay={i * 100} className="group relative bg-paper overflow-hidden">
                <Link to="/certifications" className="block">
                  <div className="aspect-[4/3] overflow-hidden bg-ivory">
                    <img
                      src={c.image}
                      alt={c.standard}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover object-top transition-all duration-500 grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                    <span className="label-eyebrow text-rust-light">{c.pillar}</span>
                    <p className="mt-1 text-white font-semibold text-sm">{c.name}</p>
                  </div>
                  <div className="p-5 group-hover:opacity-0 transition-opacity duration-300">
                    <span className="label-eyebrow text-rust">{c.pillar}</span>
                    <p className="mt-2 font-semibold">{c.standard}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 md:mt-20">
            <TechTag className="mb-6">{sections.recognition.eyebrowLabel}</TechTag>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {awards.map((a, i) => (
                <Reveal key={a.id} delay={i * 100} className="border-t border-charcoal/15 pt-5">
                  <p className="tech-tag text-rust">{a.period}</p>
                  <p className="mt-2 font-semibold">{a.title}</p>
                  <p className="mt-1 text-sm text-steel">{a.issuer}</p>
                </Reveal>
              ))}
            </div>
            <Link to="/certifications" className="group mt-8 inline-flex items-center gap-2 label-eyebrow text-rust hover:text-rust-dark">
              {sections.recognition.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA — full-bleed cinematic */}
      <section className="relative bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={sections.finalCta.backgroundImage}
            alt="Structural fabrication and welding work"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-45"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40" />
        </div>
        <Reveal className="relative container-edge py-28 md:py-40 text-center">
          <h2 className="text-white text-editorial-display font-semibold uppercase tracking-tight leading-[0.98] whitespace-pre-line max-w-4xl mx-auto">
            {sections.finalCta.heading}
          </h2>
          <p className="mt-6 text-ivory/70 max-w-lg mx-auto text-lg">{sections.finalCta.body}</p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <MagneticButton>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 bg-rust text-white px-8 py-4 label-eyebrow hover:bg-rust-dark hover:shadow-[0_6px_24px_rgba(184,83,31,0.4)] transition-all duration-300"
              >
                {sections.finalCta.ctaPrimaryLabel}
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href={whatsappLink(contactContent.whatsappDefaultMessage, company.whatsappNumber)}
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-ivory/40 text-white px-8 py-4 label-eyebrow hover:border-ivory hover:bg-white/5 transition-all duration-300"
              >
                {sections.finalCta.ctaSecondaryLabel}
              </a>
            </MagneticButton>
          </div>
        </Reveal>
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
