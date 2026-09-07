import { useState } from "react";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import StatBlock from "../components/StatBlock";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { useContent } from "../lib/content";

export default function Capabilities() {
  const { team, equipment, equipmentHighlights, financials, financialNote, pageHeroes, capabilitiesContent } = useContent();
  const [showEquipment, setShowEquipment] = useState(false);
  const maxLakh = Math.max(...financials.map((f) => f.lakh));

  return (
    <>
      <Seo path="/capabilities" breadcrumbs={[{ name: "Home", path: "/" }, { name: "Capabilities", path: "/capabilities" }]} />
      <PageHero index="04" eyebrow={pageHeroes.capabilities.eyebrow} title={pageHeroes.capabilities.title} intro={pageHeroes.capabilities.intro} />

      {/* Team */}
      <section className="container-edge py-16 md:py-24">
        <Reveal>
          <SectionLabel index={capabilitiesContent.team.eyebrowIndex} label={capabilitiesContent.team.eyebrowLabel} />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
            {capabilitiesContent.team.heading}
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10">
          {team.map((t, i) => (
            <StatBlock key={t.label} delay={i * 70} value={String(t.count)} label={t.label} />
          ))}
        </div>
        <p className="mt-8 text-sm text-steel max-w-2xl">{capabilitiesContent.team.note}</p>
      </section>

      {/* Equipment */}
      <section className="bg-charcoal text-ivory">
        <div className="container-edge py-16 md:py-24">
          <Reveal>
            <SectionLabel index={capabilitiesContent.equipment.eyebrowIndex} label={capabilitiesContent.equipment.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl text-white">
              {capabilitiesContent.equipment.heading}
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8">
            {equipmentHighlights.map((e, i) => (
              <StatBlock key={e.label} dark delay={i * 70} value={String(e.count)} label={e.label} />
            ))}
          </div>

          <button
            onClick={() => setShowEquipment(true)}
            className="group mt-10 inline-flex items-center gap-2.5 bg-rust text-white px-6 py-3 label-eyebrow hover:bg-rust-dark hover:shadow-[0_6px_24px_rgba(184,83,31,0.4)] transition-all duration-300"
          >
            {capabilitiesContent.equipment.ctaLabel}
            <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Financial track record */}
      {capabilitiesContent.financials.show && (
        <section className="container-edge py-16 md:py-24">
          <Reveal>
            <SectionLabel index={capabilitiesContent.financials.eyebrowIndex} label={capabilitiesContent.financials.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-2xl">
              {capabilitiesContent.financials.heading}
            </h2>
          </Reveal>

          <Reveal delay={150} className="mt-12 flex items-end gap-4 md:gap-10 h-56 border-b border-charcoal/20">
            {financials.map((f, i) => (
              <FinancialBar key={f.year} lakh={f.lakh} maxLakh={maxLakh} delay={i * 120} />
            ))}
          </Reveal>
          <div className="flex gap-4 md:gap-10 mt-3">
            {financials.map((f) => (
              <div key={f.year} className="flex-1 text-center label-eyebrow text-steel whitespace-nowrap mx-auto">
                {f.year.replace("FY ", "")}
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-steel max-w-xl">{financialNote}</p>
        </section>
      )}

      {showEquipment && <EquipmentDrawer equipment={equipment} onClose={() => setShowEquipment(false)} />}
    </>
  );
}

function FinancialBar({ lakh, maxLakh, delay }: { lakh: number; maxLakh: number; delay: number }) {
  const [grown, setGrown] = useState(false);
  return (
    <Reveal
      delay={delay}
      className="flex-1 flex flex-col items-center justify-end h-full"
      onTransitionEnd={() => setGrown(true)}
    >
      <span className="font-mono text-sm mb-2">₹{lakh.toFixed(2)}L</span>
      <div
        className="w-full max-w-16 bg-rust/80 transition-[height] duration-700 ease-out"
        style={{ height: grown ? `${(lakh / maxLakh) * 100}%` : "0%" }}
      />
    </Reveal>
  );
}

function EquipmentDrawer({
  equipment,
  onClose,
}: {
  equipment: ReturnType<typeof useContent>["equipment"];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button aria-label="Close equipment table" onClick={onClose} className="absolute inset-0 bg-charcoal/70 animate-scrim-in" />
      <div className="relative w-full max-w-2xl h-full bg-paper overflow-y-auto shadow-2xl animate-slide-in-right">
        <div className="sticky top-0 bg-paper border-b border-concrete flex items-center justify-between px-6 py-5">
          <p className="font-semibold uppercase tracking-tight">Technical Machinery / Equipment</p>
          <button onClick={onClose} aria-label="Close" className="group p-2 border border-concrete hover:border-charcoal">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-90">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-12 gap-2 py-3 label-eyebrow text-steel border-b border-charcoal/15">
            <span className="col-span-6">Equipment</span>
            <span className="col-span-2 text-right">Qty</span>
            <span className="col-span-2">Make</span>
            <span className="col-span-2">Condition</span>
          </div>
          {equipment.map((e, i) => (
            <Reveal
              key={e.name}
              delay={(i % 10) * 30}
              className="grid grid-cols-12 gap-2 py-3.5 border-b border-charcoal/10 text-sm items-center hover:bg-ivory/60 transition-colors"
            >
              <span className="col-span-6">{e.name}</span>
              <span className="col-span-2 text-right font-mono">{e.qty}</span>
              <span className="col-span-2 text-steel">{e.make}</span>
              <span className="col-span-2 text-steel">{e.condition}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
