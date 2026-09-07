import { useMemo } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { slugify } from "../data/seoRoutes";
import { useContent } from "../lib/content";

export default function Locations() {
  const { projects } = useContent();

  const states = useMemo(() => {
    const byState = new Map<string, { name: string; slug: string; count: number; totalCr: number }>();
    for (const p of projects) {
      const parts = p.location.split(",").map((s) => s.trim());
      const name = parts[parts.length - 1];
      const key = name.toLowerCase();
      if (!name || key === "india") continue;
      const entry = byState.get(key) ?? { name, slug: slugify(key), count: 0, totalCr: 0 };
      entry.count += 1;
      entry.totalCr += p.workDoneCr;
      byState.set(key, entry);
    }
    return Array.from(byState.values()).sort((a, b) => b.totalCr - a.totalCr);
  }, [projects]);

  return (
    <>
      <Seo path="/locations" breadcrumbs={[{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }]} />
      <PageHero
        eyebrow="Where We Work"
        title="Project Locations"
        intro="Infrastructure work executed across Gujarat, Rajasthan and Madhya Pradesh — every region below is backed by real project references, not a target list."
      />

      <section className="container-edge py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-concrete border border-concrete">
          {states.map((s, i) => (
            <Reveal key={s.slug} delay={i * 100} className="bg-paper p-8 hover:bg-ivory transition-colors duration-300">
              <Link to={`/locations/${s.slug}`} className="block">
                <p className="text-2xl font-semibold tracking-tight uppercase">{s.name}</p>
                <p className="mt-3 label-eyebrow text-steel">
                  {s.count} project{s.count === 1 ? "" : "s"} · ₹{s.totalCr.toFixed(2)} Cr executed
                </p>
                <p className="mt-4 label-eyebrow text-rust">View projects →</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
