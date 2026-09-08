import { useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import Lightbox from "../components/Lightbox";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { useContent } from "../lib/content";

type GalleryItem = ReturnType<typeof useContent>["galleryItems"][number];

const categories = ["All", "Water Pipeline", "Earthwork", "Mining", "Safety & People"] as const;

const OPENER_ID = "kalisindh-aerial";

export default function Gallery() {
  const { galleryItems, pageHeroes } = useContent();
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return galleryItems;
    return galleryItems.filter((g) => g.category === filter);
  }, [filter, galleryItems]);

  const showOpener = filter === "All";
  const opener = showOpener ? filtered.find((g) => g.id === OPENER_ID) : undefined;
  const rest = opener ? filtered.filter((g) => g.id !== opener.id) : filtered;

  const lightboxItems = filtered.map((g) => ({
    image: g.image,
    title: g.caption,
    subtitle: g.location,
  }));
  const indexOf = (item: GalleryItem) => filtered.findIndex((g) => g.id === item.id);

  return (
    <>
      <Seo path="/gallery" breadcrumbs={[{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }]} />
      <PageHero index="07" eyebrow={pageHeroes.gallery.eyebrow} title={pageHeroes.gallery.title} intro={pageHeroes.gallery.intro} />

      <section className="container-edge py-16 md:py-24">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`label-eyebrow px-4 py-2 border transition-all duration-300 ${
                filter === c
                  ? "bg-charcoal text-paper border-charcoal scale-[1.03]"
                  : "border-concrete text-steel hover:border-charcoal hover:text-charcoal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {opener && (
            <Reveal>
              <GalleryFrame
                item={opener}
                onClick={() => setOpenIndex(indexOf(opener))}
                className="aspect-[16/7] w-full"
              />
            </Reveal>
          )}

          {chunk(rest, 3).map((group, gi) => {
            const reversed = gi % 2 === 1;
            return (
              <Reveal key={gi} delay={(gi % 3) * 90} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group[0] && (
                  <GalleryFrame
                    item={group[0]}
                    onClick={() => setOpenIndex(indexOf(group[0]))}
                    className={`md:row-span-2 aspect-[4/3] md:aspect-auto ${reversed ? "md:order-2" : ""}`}
                  />
                )}
                <div className={`grid grid-rows-2 gap-3 ${reversed ? "md:order-1" : ""}`}>
                  {[group[1], group[2]].map(
                    (item) =>
                      item && (
                        <GalleryFrame
                          key={item.id}
                          item={item}
                          onClick={() => setOpenIndex(indexOf(item))}
                          className="aspect-[4/3]"
                        />
                      )
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Lightbox items={lightboxItems} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
    </>
  );
}

function GalleryFrame({
  item,
  onClick,
  className = "",
}: {
  item: GalleryItem;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button onClick={onClick} className={`relative overflow-hidden group block w-full ${className}`}>
      <img
        src={item.image}
        alt={item.caption}
        width={800}
        height={600}
        className="w-full h-full object-cover grayscale-[35%] contrast-[1.02] transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/0 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Corner accents — reveal on hover, engineering-drawing callback */}
      <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-rust-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-rust-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute inset-x-0 bottom-0 p-4 text-left">
        <p className="text-white text-sm font-medium transition-transform duration-300 group-hover:-translate-y-0.5">
          {item.caption}
        </p>
        <p className="text-ivory/60 text-xs mt-0.5">{item.location}</p>
      </div>
    </button>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
