import AnimatedText from "./AnimatedText";
import TechTag from "./TechTag";

/**
 * Splits a hero title into two balanced lines.
 *
 * Page heroes used to sit on one or two lines purely by accident of title
 * length: short ones ("Field Photography", 10em) fitted the box, long ones
 * ("Quality, Safety & Environment", 16em) wrapped. No single max-width fixes
 * that — the titles span 7em to 16em, so any box narrow enough to wrap
 * "Quarry Plant" (7.06em) forces the longest title onto three lines, and any
 * box wide enough to keep that one at two leaves the short ones at one. The
 * bounds genuinely cross (8em needed vs 7.06em allowed), so the break point
 * is chosen here instead of left to the wrap algorithm.
 *
 * The split lands on the word boundary that most evenly divides the title,
 * which means:
 *   - exactly two lines, never three, because the count is fixed here;
 *   - never mid-word, because it only ever splits on an existing space;
 *   - single-word titles ("Earthwork", "Mining") stay on one line, which is
 *     the only correct result for them.
 *
 * An explicit newline in the title always wins, so a title can still be
 * hand-broken from the admin panel.
 */
export function splitHeroTitle(title: string): string[] {
  if (title.includes("\n")) return title.split("\n");

  const words = title.trim().split(/\s+/);
  if (words.length < 2) return [title];

  // Balance on character count — a good proxy for width, and it keeps this a
  // pure function with no DOM measurement during render.
  const total = words.join(" ").length;
  let best = 1;
  let bestDelta = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(" ").length;
    const delta = Math.abs(total - left - left);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

export default function PageHero({
  eyebrow,
  title,
  intro,
  index,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  index?: string;
}) {
  return (
    <section className="relative bg-charcoal overflow-hidden">
      {index && (
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute -top-6 right-0 text-bg-numeral font-semibold text-ivory/[0.05]"
        >
          {index}
        </span>
      )}
      <div className="relative container-edge py-16 md:py-24">
        {index && (
          <div className="animate-hero-in mb-5" style={{ animationDelay: "20ms" }}>
            <TechTag dark>SECTION {index}</TechTag>
          </div>
        )}
        <p className="animate-hero-in label-eyebrow text-rust-light mb-4" style={{ animationDelay: "80ms" }}>
          {eyebrow}
        </p>
        <AnimatedText
          as="h1"
          trigger="mount"
          baseDelay={160}
          wordDelay={50}
          lines={splitHeroTitle(title)}
          className="text-editorial-display measure-display-wide font-semibold tracking-tight uppercase text-white"
        />
        {intro && (
          <p
            className="animate-hero-in mt-6 max-w-2xl text-ivory/70 text-base md:text-lg leading-relaxed"
            style={{ animationDelay: "440ms" }}
          >
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
