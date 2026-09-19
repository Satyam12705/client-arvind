import AnimatedText from "./AnimatedText";
import TechTag from "./TechTag";

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
          lines={[title]}
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
