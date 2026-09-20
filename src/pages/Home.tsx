import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import AnimatedText from "../components/AnimatedText";
import AnimatedNumber from "../components/AnimatedNumber";
import MagneticButton from "../components/MagneticButton";
import VideoHero from "../components/VideoHero";
import BlueprintFrame from "../components/BlueprintFrame";
import TechTag from "../components/TechTag";
import ProjectExplorer from "../components/ProjectExplorer";
import ClientMarquee from "../components/ClientMarquee";
import FieldworkSlider from "../components/FieldworkSlider";
import Carousel from "../components/Carousel";
import Seo from "../components/Seo";
import { useContent, useContentReady } from "../lib/content";
import { whatsappLink } from "../lib/whatsapp";
import { useParallax } from "../lib/useParallax";
import SafeImage from "../components/SafeImage";
import Rule from "../components/Rule";

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
    clients,
  } = useContent();
  const heroBgRef = useParallax<HTMLDivElement>(0.06, 36);
  // The hero media is not painted until the real settings have arrived. The
  // bundled defaults exist only so the page still works if /api/content fails;
  // painting them first meant every visit briefly showed whatever video shipped
  // in the repo before swapping to the configured one — seconds of it on a
  // phone. The hero is dark either way, so the wait reads as the section
  // loading rather than as the wrong clip playing.
  const contentReady = useContentReady();
  // /api/content replaces siteSettings wholesale rather than merging field by
  // field, so a setting added after the site was seeded is simply absent from
  // saved content until someone opens the admin panel and saves it. Falling
  // back to the cut that ships in the repo means phones get an upright hero
  // now; setting the field to an empty string in the panel is still a
  // deliberate "use the main hero video on phones too".
  const heroVideoMobile = siteSettings.heroVideoMobile ?? "/videos/hero-mobile.mp4";
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
        {/* With an upright cut configured the film already matches a phone's
            shape, so the band fills the hero as it does on desktop. Without
            one, .hero-media shortens it instead — see index.css for why. */}
        <div
          ref={heroBgRef}
          className={`hero-media layer-isolate ${heroVideoMobile ? "hero-media--fills" : ""}`}
        >
          {contentReady && (
            <VideoHero
              src={siteSettings.heroVideo}
              mobileSrc={heroVideoMobile}
              poster={siteSettings.heroPoster}
              alt={siteSettings.heroVideoAlt}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {/* Scrims are deliberately light and short. The previous pair ended on
            `from-charcoal` (alpha 1.0) at the bottom and stacked a second wash
            over it, so the footage was fully black behind the headline — the
            "video is hidden by the text" report. Legibility now comes from
            .on-media text-shadow on the type itself, so these only need to
            take the edge off the highlights, and both fade out well before
            the top/right of the frame. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(23,24,26,0.78)_0%,rgba(23,24,26,0.40)_22%,rgba(23,24,26,0.08)_50%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(23,24,26,0.45)_0%,rgba(23,24,26,0.10)_42%,transparent_62%)]" />

        <div className="container-edge relative z-10 pb-8 sm:pb-10 md:pb-16 pt-20 sm:pt-24 layer-isolate">
          {/* Decorative only ("ATF / 001 — ENGINEERING"), so it is the first
              thing to go when vertical space is scarce. */}
          <div className="hidden sm:block animate-hero-in mb-5" style={{ animationDelay: "60ms" }}>
            <TechTag dark onImage>{home.heroTechTag}</TechTag>
          </div>
          <p
            // `!` is required: .label-eyebrow sets font-size and letter-spacing
            // and is defined after Tailwind's utilities in index.css, so at equal
            // specificity it wins on source order. Without it the eyebrow keeps
            // its 0.14em tracking and wraps to two lines on a phone.
            className="on-media animate-hero-in label-eyebrow text-rust-light mb-2 sm:mb-3 text-[0.6875rem]! sm:text-xs! tracking-[0.07em]! sm:tracking-[0.14em]!"
            style={{ animationDelay: "160ms" }}
          >
            {home.heroEyebrow}
          </p>
          <AnimatedText
            as="h1"
            trigger="mount"
            baseDelay={260}
            wordDelay={55}
            lines={[home.heroHeadlineLine1, home.heroHeadlineLine2]}
            className="on-media text-white font-semibold uppercase leading-[0.92] sm:leading-[0.98] tracking-tight text-cinema-display break-words"
          />
          <p
            className="on-media animate-hero-in mt-3 sm:mt-5 max-w-lg text-ivory/85 text-[0.8125rem] sm:text-sm md:text-base leading-snug sm:leading-relaxed"
            style={{ animationDelay: "480ms" }}
          >
            {home.heroIntro}
          </p>
          <div className="animate-hero-in mt-5 sm:mt-7 flex flex-wrap gap-3 sm:gap-4" style={{ animationDelay: "600ms" }}>
            <MagneticButton>
              <Link
                to={home.heroCtaPrimaryTo}
                className="group inline-flex items-center gap-2 sm:gap-2.5 bg-rust text-white px-4 sm:px-7 py-3 sm:py-3.5 label-eyebrow text-[0.65rem] sm:text-xs hover:bg-rust-dark hover:shadow-[0_6px_24px_rgba(184,83,31,0.4)] transition-all duration-300"
              >
                {home.heroCtaPrimaryLabel}
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to={home.heroCtaSecondaryTo}
                className="group inline-flex items-center gap-2 sm:gap-2.5 border border-ivory/40 text-white px-4 sm:px-7 py-3 sm:py-3.5 label-eyebrow text-[0.65rem] sm:text-xs hover:border-ivory hover:bg-white/5 transition-all duration-300"
              >
                {home.heroCtaSecondaryLabel}
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
          </div>
        </div>

        <div
          className="hidden md:flex animate-hero-in animate-float-soft absolute bottom-8 right-6 xl:right-10 items-center gap-2 text-ivory/50 label-eyebrow layer-isolate"
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
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3 gap-6 lg:gap-8 lg:border-l lg:border-ivory/15 lg:pl-8">
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
              <Reveal variant="clip" className="lg:col-span-7">
                <BlueprintFrame className="block aspect-[16/10] overflow-hidden">
                  <SafeImage
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
              <h2 className="text-editorial-display measure-display font-semibold uppercase tracking-tight leading-[0.98] text-white whitespace-pre-line">
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
              <h2 className="text-editorial-display measure-display font-semibold uppercase tracking-tight leading-[0.98] whitespace-pre-line">
                {sections.capability.heading}
              </h2>
              <Link to="/capabilities" className="group label-eyebrow text-rust hover:text-rust-dark inline-flex items-center gap-2">
                {sections.capability.linkLabel} <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120} className="mt-12 md:mt-16">
            <Rule />
            <div className="pt-10">
            <Carousel ariaLabel="Equipment fleet highlights">
              {equipmentHighlights.map((e) => (
                <div
                  key={e.label}
                  className="card-lift group shrink-0 w-44 sm:w-52 border border-concrete bg-paper p-6 hover:border-rust"
                >
                  <AnimatedNumber
                    value={String(e.count)}
                    className="block text-4xl md:text-5xl font-semibold tracking-tight text-charcoal group-hover:text-rust transition-colors duration-300"
                  />
                  <p className="mt-2 label-eyebrow text-steel">{e.label}</p>
                </div>
              ))}
              </Carousel>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6b. CLIENTS — logo marquee. Content (and the logo list) is fully
          admin-editable under the "Clients" group in the dashboard. */}
      {clients?.items?.length > 0 && (
        <section className="bg-ivory border-y border-concrete overflow-hidden">
          <div className="container-edge py-16 md:py-20">
            <Reveal>
              <TechTag className="mb-6">{clients.eyebrowLabel}</TechTag>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <AnimatedText
              as="h2"
              lines={[clients.heading]}
              wordDelay={38}
              className="text-3xl md:text-4xl text-balance font-semibold tracking-tight uppercase max-w-xl"
            />
                {clients.intro && (
                  <p className="text-sm text-steel leading-relaxed max-w-md">{clients.intro}</p>
                )}
              </div>
            </Reveal>
          </div>
          <Reveal delay={150} variant="scale" className="pb-14 md:pb-16">
            <ClientMarquee items={clients.items} />
          </Reveal>
        </section>
      )}

      {/* 7. FIELDWORK — cinematic photography slider.
          Was a single full-bleed photograph with two small frames floated over
          its right edge. Those frames were `hidden lg:flex`, so two of the
          three photographs simply did not render below 1024px; the slider puts
          every one of them on the same stage at every width. */}
      <section className="relative bg-charcoal overflow-hidden">
        <FieldworkSlider
          items={sections.photography.items}
          eyebrow={sections.photography.eyebrowLabel}
          heading={sections.photography.heading}
          linkLabel={sections.photography.linkLabel}
          linkTo="/gallery"
          // `home` is replaced wholesale by /api/content the same way
          // siteSettings is, so a field added after the site was seeded reads
          // as undefined until an editor saves the section. Falling back here
          // keeps the pace sensible until then.
          autoAdvanceMs={(sections.photography.slideSeconds ?? 6.5) * 1000}
        />
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
                  <div className="aspect-[4/3] overflow-hidden bg-white p-3">
                    <SafeImage
                      src={c.image}
                      alt={`${c.standard} certificate`}
                      width={800}
                      height={1100}
                      className="w-full h-full object-contain transition-all duration-500 ease-out grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.04]"
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
                <Reveal key={a.id} delay={i * 100} className="border-t border-charcoal/15 pt-5 hover:-translate-y-1 transition-transform duration-500 ease-out">
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
          <SafeImage
            src={sections.finalCta.backgroundImage}
            alt="Structural fabrication and welding work"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-80"
            loading="lazy"
            decoding="async"
          />
          {/* Was from-charcoal / via-70% / to-40% over a 45%-opacity image — a
              combined ~13% of the photo made it through. Now ~45%. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(23,24,26,0.80)_0%,rgba(23,24,26,0.45)_45%,rgba(23,24,26,0.30)_100%)]" />
        </div>
        <Reveal className="relative container-edge py-28 md:py-40 text-center">
          <h2 className="on-media text-white text-cta-display measure-display font-semibold uppercase tracking-tight leading-[1.02] whitespace-pre-line mx-auto">
            {sections.finalCta.heading}
          </h2>
          <p className="on-media mt-5 text-ivory/85 max-w-lg mx-auto text-sm md:text-base leading-relaxed">{sections.finalCta.body}</p>
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
