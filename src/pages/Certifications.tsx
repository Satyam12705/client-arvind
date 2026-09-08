import { useState } from "react";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import Lightbox from "../components/Lightbox";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { useContent } from "../lib/content";

export default function Certifications() {
  const { certifications, statutoryRegistrations, awards, completionCertificate, pageHeroes, certificationsContent } =
    useContent();
  const certJsonLd = certifications.map((c) => ({
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: `${c.standard} — ${c.name}`,
    credentialCategory: c.standard,
    recognizedBy: { "@type": "Organization", name: "Anand Techno-Fab LLP" },
  }));
  const [certIndex, setCertIndex] = useState<number | null>(null);
  const [regIndex, setRegIndex] = useState<number | null>(null);
  const [awardIndex, setAwardIndex] = useState<number | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const certLightboxItems = certifications.map((c) => ({
    image: c.image,
    title: c.standard,
    subtitle: c.name,
  }));
  const regLightboxItems = statutoryRegistrations.map((r) => ({
    image: r.image,
    title: r.title,
  }));
  const awardLightboxItems = awards.map((a) => ({
    image: a.image,
    title: a.title,
    subtitle: a.issuer,
  }));

  return (
    <>
      <Seo
        path="/certifications"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Certifications", path: "/certifications" }]}
        jsonLd={certJsonLd}
      />
      <PageHero
        index="06"
        eyebrow={pageHeroes.certifications.eyebrow}
        title={pageHeroes.certifications.title}
        intro={pageHeroes.certifications.intro}
      />

      {/* ISO certifications */}
      <section className="container-edge py-16 md:py-24">
        <Reveal>
          <SectionLabel index={certificationsContent.iso.eyebrowIndex} label={certificationsContent.iso.eyebrowLabel} />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            {certificationsContent.iso.heading}
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map((c, i) => (
            <Reveal
              key={c.id}
              as="button"
              delay={i * 100}
              onClick={() => setCertIndex(i)}
              className="block text-left group border border-concrete hover:border-rust hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden border-b border-concrete bg-ivory">
                <img src={c.image} alt={c.standard} width={800} height={600} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-6">
                <span className="label-eyebrow text-rust">{c.pillar}</span>
                <p className="mt-2 font-semibold">{c.standard}</p>
                <p className="mt-1 text-sm text-steel">{c.name}</p>
                <p className="mt-3 text-xs text-steel leading-relaxed">{c.scope}</p>
                <p className="mt-4 label-eyebrow text-rust">View Certificate →</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Statutory registrations */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-16 md:py-24">
          <Reveal>
            <SectionLabel index={certificationsContent.statutory.eyebrowIndex} label={certificationsContent.statutory.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
              {certificationsContent.statutory.heading}
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {statutoryRegistrations.map((r, i) => (
              <Reveal
                key={r.id}
                as="button"
                delay={i * 100}
                onClick={() => setRegIndex(i)}
                className="block text-left border border-concrete hover:border-rust hover:shadow-lg transition-all duration-300 p-6 bg-paper"
              >
                <p className="font-semibold">{r.title}</p>
                <p className="mt-2 text-sm text-steel leading-relaxed">{r.detail}</p>
                <p className="mt-4 label-eyebrow text-rust">View Document →</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Completion certificate */}
      <section className="container-edge py-16 md:py-24">
        <Reveal>
          <SectionLabel index={certificationsContent.completion.eyebrowIndex} label={certificationsContent.completion.eyebrowLabel} />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            {certificationsContent.completion.heading}
          </h2>
        </Reveal>
        <Reveal
          as="button"
          onClick={() => setShowCompletion(true)}
          className="mt-10 block w-full text-left grid grid-cols-1 md:grid-cols-12 gap-6 border border-concrete hover:border-rust hover:shadow-lg transition-all duration-300 p-6 md:p-8"
        >
          <div className="md:col-span-8">
            <p className="font-semibold">{completionCertificate.title}</p>
            <p className="mt-1 text-sm text-steel">{completionCertificate.issuer}</p>
            <p className="mt-4 text-sm text-charcoal/80 leading-relaxed">{completionCertificate.detail}</p>
            <div className="mt-6 flex flex-wrap gap-8">
              <div>
                <p className="label-eyebrow text-steel">Work Order Value</p>
                <p className="mt-1 font-mono">{completionCertificate.workOrderValue}</p>
              </div>
              <div>
                <p className="label-eyebrow text-steel">Executed Value</p>
                <p className="mt-1 font-mono">{completionCertificate.executedValue}</p>
              </div>
              <div>
                <p className="label-eyebrow text-steel">Contract Period</p>
                <p className="mt-1">{completionCertificate.contractPeriod}</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 flex items-center">
            <span className="label-eyebrow text-rust">View Certificate →</span>
          </div>
        </Reveal>
      </section>

      {/* Awards */}
      <section className="bg-charcoal text-ivory">
        <div className="container-edge py-16 md:py-24">
          <Reveal>
            <SectionLabel index={certificationsContent.awardsSection.eyebrowIndex} label={certificationsContent.awardsSection.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl text-white">
              {certificationsContent.awardsSection.heading}
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((a, i) => (
              <Reveal
                key={a.id}
                as="button"
                delay={i * 100}
                onClick={() => setAwardIndex(i)}
                className="block text-left border border-ivory/15 hover:border-rust-light hover:bg-white/[0.03] transition-all duration-300 p-6"
              >
                <p className="label-eyebrow text-rust-light">{a.period}</p>
                <p className="mt-3 font-semibold">{a.title}</p>
                <p className="mt-1 text-sm text-ivory/60">{a.issuer}</p>
                <p className="mt-4 text-sm text-ivory/75 leading-relaxed">{a.detail}</p>
                <p className="mt-4 label-eyebrow text-rust-light">View Certificate →</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox items={certLightboxItems} index={certIndex} onClose={() => setCertIndex(null)} onNavigate={setCertIndex} />
      <Lightbox items={regLightboxItems} index={regIndex} onClose={() => setRegIndex(null)} onNavigate={setRegIndex} />
      <Lightbox items={awardLightboxItems} index={awardIndex} onClose={() => setAwardIndex(null)} onNavigate={setAwardIndex} />
      <Lightbox
        items={[{ image: completionCertificate.image, title: completionCertificate.title, subtitle: completionCertificate.issuer }]}
        index={showCompletion ? 0 : null}
        onClose={() => setShowCompletion(false)}
        onNavigate={() => {}}
      />
    </>
  );
}
