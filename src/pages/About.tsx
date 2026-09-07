import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { useContent } from "../lib/content";

export default function About() {
  const { company, timeline, specializations, methodology, commitment, pageHeroes, aboutContent } = useContent();
  const ceo = company.partners[0];

  return (
    <>
      <Seo path="/about" breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
      <PageHero index="01" eyebrow={pageHeroes.about.eyebrow} title={pageHeroes.about.title} intro={pageHeroes.about.intro} />

      {/* Journey */}
      <section className="container-edge py-20 md:py-28">
        <Reveal>
          <SectionLabel index={aboutContent.journey.eyebrowIndex} label={aboutContent.journey.eyebrowLabel} />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            {aboutContent.journey.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {timeline.map((t, i) => (
            <Reveal key={t.year} delay={i * 130} className="border-t-2 border-rust pt-5">
              <p className="text-3xl font-semibold tracking-tight">{t.year}</p>
              <p className="mt-2 font-semibold">{t.title}</p>
              <p className="mt-3 text-sm text-steel leading-relaxed">{t.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="container-edge py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
              {ceo?.photo && (
                <img
                  src={ceo.photo}
                  alt={`${ceo.name.replace(/^Mr\.\s*/, "")}, ${ceo.role}, Anand Techno-Fab LLP`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <p className="label-eyebrow text-rust-light">{ceo?.role}</p>
                <p className="mt-1.5 text-2xl md:text-3xl font-semibold text-white uppercase tracking-tight leading-tight">
                  {ceo?.name.replace(/^Mr\.\s*/, "")}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-7">
            <SectionLabel index={aboutContent.leadership.eyebrowIndex} label={aboutContent.leadership.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-lg">
              {aboutContent.leadership.heading}
            </h2>
            <p className="mt-6 text-charcoal/80 leading-relaxed max-w-lg">{aboutContent.leadership.body}</p>
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-concrete pt-6 max-w-md">
              {company.partners.map((p) => (
                <div key={p.name}>
                  <p className="label-eyebrow text-steel">{p.role}</p>
                  <p className="mt-1 font-medium">{p.name.replace(/^Mr\.\s*/, "")}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-20 md:py-28">
          <Reveal>
            <SectionLabel index={aboutContent.whatWeDo.eyebrowIndex} label={aboutContent.whatWeDo.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
              {aboutContent.whatWeDo.heading}
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specializations.map((s, i) => (
              <Reveal key={s.number} delay={i * 90} className="flex gap-4">
                <span className="label-eyebrow text-rust">{s.number}</span>
                <div>
                  <p className="font-semibold leading-snug">
                    {s.title} <span className="text-steel font-normal">{s.subtitle}</span>
                  </p>
                  <p className="mt-2 text-sm text-steel leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach / methodology */}
      <section className="container-edge py-20 md:py-28">
        <Reveal>
          <SectionLabel index={aboutContent.approach.eyebrowIndex} label={aboutContent.approach.eyebrowLabel} />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            {aboutContent.approach.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-steel">{aboutContent.approach.body}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-concrete border border-concrete">
          {methodology.map((m, i) => (
            <Reveal
              key={m.number}
              delay={(i % 4) * 90}
              className="bg-paper p-6 hover:bg-ivory transition-colors duration-300"
            >
              <span className="label-eyebrow text-rust">{m.number}</span>
              <p className="mt-3 font-semibold leading-snug">{m.title}</p>
              <p className="mt-2 text-sm text-steel leading-relaxed">{m.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-charcoal text-ivory">
        <div className="container-edge py-20 md:py-28 grid grid-cols-1 md:grid-cols-12 gap-10">
          <Reveal className="md:col-span-4">
            <SectionLabel index={aboutContent.commitmentSection.eyebrowIndex} label={aboutContent.commitmentSection.eyebrowLabel} />
            <h2 className="text-3xl font-semibold tracking-tight uppercase text-white">
              {aboutContent.commitmentSection.heading}
            </h2>
          </Reveal>
          <Reveal delay={150} className="md:col-span-8 md:pt-1">
            <p className="text-lg leading-relaxed text-ivory/80 max-w-2xl">{commitment}</p>
          </Reveal>
        </div>
      </section>

      {/* Corporate details */}
      <section className="container-edge py-20 md:py-28">
        <Reveal>
          <SectionLabel index={aboutContent.corporateDetails.eyebrowIndex} label={aboutContent.corporateDetails.eyebrowLabel} />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            {aboutContent.corporateDetails.heading}
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl">
          <InfoRow label="Legal Name" value={company.legalName} />
          <InfoRow label="Ownership" value={company.ownership} />
          <InfoRow
            label="Partners"
            value={company.partners.map((p) => `${p.name} (${p.role})`).join(", ")}
          />
          <InfoRow label="Registered / Operational Address" value={company.registeredAddress} />
          <InfoRow label="LLP Identity No." value={company.llpIdentityNo} />
          <InfoRow label="GST No." value={company.gstNo} />
          <InfoRow label="EPF Registration No." value={company.epfRegNo} />
          <InfoRow label="Udyam Registration No." value={company.udyamRegNo} />
        </div>
      </section>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-concrete pt-3">
      <p className="label-eyebrow text-steel">{label}</p>
      <p className="mt-1.5 text-sm md:text-base">{value}</p>
    </div>
  );
}
