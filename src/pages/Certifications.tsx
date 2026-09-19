import { useState } from "react";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import Lightbox from "../components/Lightbox";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { useContent } from "../lib/content";
import AnimatedText from "../components/AnimatedText";

/** Admin-cleared media comes back as "" (or missing) — treat both as absent. */
const hasImage = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

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

  // Indices must line up with what is actually rendered, so filter first and
  // drive both the cards and the lightbox off the same filtered lists.
  const shownCerts = certifications.filter((c) => hasImage(c.image));
  const shownRegs = statutoryRegistrations.filter((r) => hasImage(r.image));
  const shownAwards = awards.filter((a) => hasImage(a.image));

  const certLightboxItems = shownCerts.map((c) => ({
    image: c.image,
    title: c.standard,
    subtitle: c.name,
  }));
  const regLightboxItems = shownRegs.map((r) => ({
    image: r.image,
    title: r.title,
  }));
  const awardLightboxItems = shownAwards.map((a) => ({
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
          <AnimatedText
              as="h2"
              lines={[certificationsContent.iso.heading]}
              wordDelay={38}
              className="text-3xl md:text-4xl text-balance font-semibold tracking-tight uppercase max-w-2xl"
            />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map((c, i) => (
            <Reveal
              key={c.id}
              // Only a card with an image is a button — without one there is
              // nothing for the lightbox to show.
              as={hasImage(c.image) ? "button" : "div"}
              delay={i * 100}
              variant="scale"
              onClick={hasImage(c.image) ? () => setCertIndex(shownCerts.indexOf(c)) : undefined}
              className="card-lift block text-left group border border-concrete hover:border-rust"
            >
              {hasImage(c.image) && (
                <div className="aspect-[3/4] overflow-hidden border-b border-concrete bg-white p-3">
                  <img
                    src={c.image}
                    alt={`${c.standard} — ${c.name} certificate`}
                    width={800}
                    height={1100}
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="p-6">
                <span className="label-eyebrow text-rust">{c.pillar}</span>
                <p className="mt-2 font-semibold">{c.standard}</p>
                <p className="mt-1 text-sm text-steel">{c.name}</p>
                <p className="mt-3 text-xs text-steel leading-relaxed">{c.scope}</p>
                {hasImage(c.image) && <p className="mt-4 label-eyebrow text-rust">View Certificate →</p>}
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
            <AnimatedText
              as="h2"
              lines={[certificationsContent.statutory.heading]}
              wordDelay={38}
              className="text-3xl md:text-4xl text-balance font-semibold tracking-tight uppercase max-w-2xl"
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {statutoryRegistrations.map((r, i) => (
              <Reveal
                key={r.id}
                as={hasImage(r.image) ? "button" : "div"}
                delay={i * 100}
                onClick={hasImage(r.image) ? () => setRegIndex(shownRegs.indexOf(r)) : undefined}
                className="card-lift block text-left border border-concrete hover:border-rust p-6 bg-paper"
              >
                <p className="font-semibold">{r.title}</p>
                <p className="mt-2 text-sm text-steel leading-relaxed">{r.detail}</p>
                {hasImage(r.image) && <p className="mt-4 label-eyebrow text-rust">View Document →</p>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Completion certificate */}
      <section className="container-edge py-16 md:py-24">
        <Reveal>
          <SectionLabel index={certificationsContent.completion.eyebrowIndex} label={certificationsContent.completion.eyebrowLabel} />
          <AnimatedText
              as="h2"
              lines={[certificationsContent.completion.heading]}
              wordDelay={38}
              className="text-3xl md:text-4xl text-balance font-semibold tracking-tight uppercase max-w-2xl"
            />
        </Reveal>
        <Reveal
          as={hasImage(completionCertificate.image) ? "button" : "div"}
          onClick={hasImage(completionCertificate.image) ? () => setShowCompletion(true) : undefined}
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
          {hasImage(completionCertificate.image) && (
            <div className="md:col-span-4 flex items-center">
              <span className="label-eyebrow text-rust">View Certificate →</span>
            </div>
          )}
        </Reveal>
      </section>

      {/* Awards */}
      <section className="bg-charcoal text-ivory">
        <div className="container-edge py-16 md:py-24">
          <Reveal>
            <SectionLabel index={certificationsContent.awardsSection.eyebrowIndex} label={certificationsContent.awardsSection.eyebrowLabel} />
            <AnimatedText
              as="h2"
              lines={[certificationsContent.awardsSection.heading]}
              wordDelay={38}
              className="text-3xl md:text-4xl text-balance font-semibold tracking-tight uppercase max-w-2xl text-white"
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((a, i) => (
              <Reveal
                key={a.id}
                as={hasImage(a.image) ? "button" : "div"}
                delay={i * 100}
                variant="scale"
                onClick={hasImage(a.image) ? () => setAwardIndex(shownAwards.indexOf(a)) : undefined}
                className="card-lift group block text-left border border-ivory/15 hover:border-rust-light hover:bg-white/[0.03] p-6"
              >
                {hasImage(a.image) && (
                  <div className="aspect-[3/4] overflow-hidden bg-white p-3 mb-5">
                    <img
                      src={a.image}
                      alt={`${a.title} — awarded by ${a.issuer}`}
                      width={800}
                      height={1100}
                      className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <p className="label-eyebrow text-rust-light">{a.period}</p>
                <p className="mt-3 font-semibold">{a.title}</p>
                <p className="mt-1 text-sm text-ivory/60">{a.issuer}</p>
                <p className="mt-4 text-sm text-ivory/75 leading-relaxed">{a.detail}</p>
                {hasImage(a.image) && <p className="mt-4 label-eyebrow text-rust-light">View Certificate →</p>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox items={certLightboxItems} index={certIndex} onClose={() => setCertIndex(null)} onNavigate={setCertIndex} />
      <Lightbox items={regLightboxItems} index={regIndex} onClose={() => setRegIndex(null)} onNavigate={setRegIndex} />
      <Lightbox items={awardLightboxItems} index={awardIndex} onClose={() => setAwardIndex(null)} onNavigate={setAwardIndex} />
      <Lightbox
        items={
          hasImage(completionCertificate.image)
            ? [{ image: completionCertificate.image, title: completionCertificate.title, subtitle: completionCertificate.issuer }]
            : []
        }
        index={showCompletion && hasImage(completionCertificate.image) ? 0 : null}
        onClose={() => setShowCompletion(false)}
        onNavigate={() => {}}
      />
    </>
  );
}
