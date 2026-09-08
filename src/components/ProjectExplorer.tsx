import { useState } from "react";
import { Link } from "react-router-dom";
import BlueprintFrame from "./BlueprintFrame";
import TechTag from "./TechTag";

interface ExplorerProject {
  id: string;
  year: string;
  title: string;
  location: string;
  client: string;
  workDoneCr: number;
  image: string;
}

/**
 * Signature interaction — "Project Explorer": one large project image at a
 * time with a technical readout panel beside it. Selecting a numbered index
 * cross-fades to the next project instead of listing everything at equal
 * weight in a grid.
 */
export default function ProjectExplorer({
  projects,
  detailHref,
}: {
  projects: ExplorerProject[];
  detailHref?: (id: string) => string;
}) {
  const [active, setActive] = useState(0);
  const current = projects[active];
  if (!current) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-ivory/15">
      <div className="lg:col-span-8 relative h-[52vh] md:h-[68vh] overflow-hidden bg-charcoal-soft">
        {projects.map((p, i) => (
          <img
            key={p.id}
            src={p.image}
            alt={p.title}
            width={1600}
            height={900}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/0 to-transparent" />
        <BlueprintFrame dark className="absolute inset-5 md:inset-8 pointer-events-none" />
        <div className="absolute top-6 left-6 md:top-8 md:left-8">
          <TechTag dark onImage>
            PROJECT {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </TechTag>
        </div>
      </div>

      <div className="lg:col-span-4 bg-charcoal text-ivory p-8 md:p-10 flex flex-col justify-between">
        <div key={current.id} className="animate-fade-up">
          <p className="tech-tag text-rust-light mb-4">{current.year}</p>
          <h3 className="text-2xl md:text-3xl font-semibold uppercase tracking-tight leading-tight">
            {current.title}
          </h3>
          <dl className="mt-8 space-y-4 border-t border-ivory/15 pt-6">
            <Row label="Location" value={current.location} />
            <Row label="Client" value={current.client} />
            <Row label="Year" value={current.year} />
            <Row label="Value" value={`₹${current.workDoneCr} Cr`} />
          </dl>
          {detailHref && (
            <Link
              to={detailHref(current.id)}
              className="group mt-8 inline-flex items-center gap-2 label-eyebrow text-rust-light hover:text-white transition-colors"
            >
              View Project
              <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Horizontally scrolling, 2 rows tall — a flex-wrap grid of these
            grew taller (more rows) the more projects existed, at one point
            pushing well past this panel's fixed-height frame. Fixed at 2
            rows regardless of project count; scrolls sideways instead. */}
        <div className="explorer-index-scroll mt-10 grid grid-flow-col grid-rows-2 auto-cols-[2.5rem] gap-2 overflow-x-auto pb-2 -mx-8 md:-mx-10 px-8 md:px-10">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              aria-label={`Show project ${i + 1}: ${p.title}`}
              className={`tech-tag w-10 h-10 flex items-center justify-center border transition-all duration-300 shrink-0 ${
                i === active
                  ? "border-rust-light bg-rust-light/10 text-rust-light"
                  : "border-ivory/20 text-ivory/50 hover:border-ivory/50 hover:text-ivory"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="tech-tag text-ivory/40">{label}</dt>
      <dd className="text-sm text-right">{value}</dd>
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
