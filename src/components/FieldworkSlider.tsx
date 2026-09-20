import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SafeImage from "./SafeImage";
import BlueprintFrame from "./BlueprintFrame";
import { optimizedImage } from "../lib/cloudinaryUrl";
import { useParallax } from "../lib/useParallax";

export interface FieldworkItem {
  image: string;
  caption: string;
}

/**
 * Fieldwork slider — the cinematic project-photography moment on the home page.
 *
 * Replaces a layout that showed one full-bleed photograph with two small
 * frames floated over its right edge. That arrangement had a real problem
 * underneath the styling: the two supporting frames were `hidden lg:flex`, so
 * on anything narrower than 1024px two of the three photographs never rendered
 * at all. Here every slide gets the same stage at every width.
 *
 * Built on the depth model rather than as a flat rail — the layers are, back
 * to front:
 *
 *   0  a blurred oversized copy of the live slide, on slow parallax, filling
 *      the full-bleed width so a wide panel never shows bare charcoal
 *   1  a rust glow keyed to the brand accent
 *   2  the blueprint frame and the thumbnail rail
 *   3  the photograph itself — the hero of the section
 *   4  eyebrow, heading, caption, counter and controls
 *   5  a vignette seating the photograph in the dark section
 *
 * Slides cross-wipe with clip-path and drift slowly while they are on screen,
 * so only clip-path, opacity and transform are ever animated and the whole
 * thing stays on the compositor. Under prefers-reduced-motion the wipe, the
 * drift and the autoplay all stop and it becomes a plain manual slider.
 */
export default function FieldworkSlider({
  items,
  eyebrow,
  heading,
  linkLabel,
  linkTo,
  autoAdvanceMs = 6500,
}: {
  items: FieldworkItem[];
  eyebrow: string;
  heading: string;
  linkLabel: string;
  linkTo: string;
  autoAdvanceMs?: number;
}) {
  const [index, setIndex] = useState(0);
  // Which way the last move went, so the incoming slide wipes in from the
  // side the viewer just came from rather than always from the right.
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useParallax<HTMLDivElement>(0.08, 42);
  const touchX = useRef<number | null>(null);

  const count = items.length;

  const go = useCallback(
    (next: number, direction: 1 | -1) => {
      if (count === 0) return;
      setDir(direction);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Autoplay, but only while it is worth running: never under reduced motion,
  // never while the viewer is interacting, and never while the section is off
  // screen — an unseen timer just burns wakeups on a phone.
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver((entries) => setOnScreen(entries[0].isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = !reduceMotion && !paused && onScreen && count > 1;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(next, autoAdvanceMs);
    return () => window.clearTimeout(id);
  }, [playing, next, index, autoAdvanceMs]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  if (count === 0) return null;
  const active = items[index];

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* depth 0 — blurred backdrop of the live slide, on slow parallax. */}
      <div ref={backdropRef} className="absolute inset-0 overflow-hidden layer-isolate" aria-hidden="true">
        {items.map((item, i) => (
          <img
            key={item.image}
            src={optimizedImage(item.image, 320)}
            alt=""
            className={`fw-backdrop absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      {/* depth 1 — brand glow. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none layer-isolate bg-[radial-gradient(ellipse_at_30%_40%,rgba(184,83,31,0.18),transparent_60%)]"
      />

      <div className="relative container-edge py-16 sm:py-20 md:py-28 lg:py-32">
        {/* Text column is 5/12 rather than 4/12 so the display face has room:
            at 4/12 the column is ~395px on a 1440 screen, narrower than the
            word "FIELDWORK." set in the 100px editorial size, and the global
            overflow-wrap safety net then split it mid-word. The heading is
            also stepped to the column it sits in rather than to the viewport,
            for the same reason. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* depth 4 — the written half. */}
          <div className="lg:col-span-5 order-1">
            <p className="label-eyebrow text-rust-light mb-4 sm:mb-5">{eyebrow}</p>
            <h2 className="font-semibold uppercase tracking-tight leading-[1.02] text-white whitespace-pre-line text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
              {heading}
            </h2>

            {/* Caption belongs to the live slide, so it is announced politely
                rather than silently swapped under a screen reader. The floor
                keeps a two-line caption from shifting the controls as slides
                change. */}
            <p
              aria-live="polite"
              className="mt-5 sm:mt-7 text-ivory/80 text-sm md:text-base leading-relaxed sm:min-h-[3.5rem]"
            >
              {active.caption}
            </p>

            {/* On a phone these sit under the picture, where a thumb can
                reach them; from lg they belong with the copy. */}
            <div className="hidden lg:flex mt-8 items-center gap-5">
              <Controls onPrev={prev} onNext={next} index={index} count={count} />
            </div>

            <Link
              to={linkTo}
              className="group mt-6 sm:mt-8 inline-flex items-center gap-2 label-eyebrow text-rust-light hover:text-white"
            >
              {linkLabel}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                <Chevron dir="right" />
              </span>
            </Link>
          </div>

          {/* depth 3 — the stage. */}
          <div className="lg:col-span-7 order-2">
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Fieldwork photography"
              tabIndex={0}
              onKeyDown={onKeyDown}
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();
                touchX.current = null;
              }}
              className="outline-none focus-visible:ring-2 focus-visible:ring-rust-light/70"
            >
              {/* Nearly square on a phone would crop these wide site
                  photographs to nothing, so the frame only shortens as the
                  screen widens. */}
              <BlueprintFrame
                dark
                className="block relative aspect-[3/2] sm:aspect-[16/10] overflow-hidden shadow-2xl"
              >
                {/* A slide that is not showing is clipped away to the edge
                    the move came from, so the live one appears to wipe across
                    in the direction the viewer asked for. */}
                {items.map((item, i) => {
                  const isActive = i === index;
                  const hiddenClip = dir === 1 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
                  return (
                    <div
                      key={item.image}
                      className="fw-slide absolute inset-0"
                      aria-hidden={!isActive}
                      style={{
                        clipPath: isActive ? "inset(0 0 0 0)" : hiddenClip,
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scale(1.06)" : "scale(1)",
                      }}
                    >
                      <SafeImage
                        src={item.image}
                        alt={item.caption}
                        width={1600}
                        height={1000}
                        className="w-full h-full object-cover"
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </div>
                  );
                })}
                {/* depth 5 — vignette. */}
                <div aria-hidden="true" className="fw-vignette absolute inset-0 pointer-events-none" />
              </BlueprintFrame>
            </div>

            {/* Autoplay progress. Decorative — the counter already states
                position in text — so it is hidden from assistive tech. */}
            {count > 1 && (
              <div aria-hidden="true" className="mt-3 h-px w-full bg-ivory/15 overflow-hidden">
                {/* Remounted per slide (key) so the fill restarts from zero
                    each time, and simply absent while paused. */}
                <div
                  key={index}
                  className="h-full w-full bg-rust-light origin-left"
                  style={{
                    transform: "scaleX(0)",
                    animation: playing ? `fw-progress ${autoAdvanceMs}ms linear forwards` : undefined,
                  }}
                />
              </div>
            )}

            {/* depth 2 — thumbnail rail.
                Scrolls rather than wrapping so an editor adding a tenth
                photograph does not push the section taller on a phone. */}
            {count > 1 && (
              <div className="mt-4 sm:mt-5 snap-rail flex gap-2.5 sm:gap-3 overflow-x-auto pb-1">
                {items.map((item, i) => (
                  <button
                    key={item.image}
                    type="button"
                    onClick={() => go(i, i > index ? 1 : -1)}
                    aria-label={`Show photograph ${i + 1}: ${item.caption}`}
                    aria-current={i === index}
                    className={`relative shrink-0 h-12 w-[4.5rem] sm:h-16 sm:w-24 overflow-hidden transition-all duration-500 ${
                      i === index ? "opacity-100 ring-1 ring-rust-light" : "opacity-45 hover:opacity-80"
                    }`}
                  >
                    <SafeImage
                      src={item.image}
                      alt=""
                      width={240}
                      height={160}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* The phone/tablet home for the controls. */}
            <div className="flex lg:hidden mt-6 items-center gap-5">
              <Controls onPrev={prev} onNext={next} index={index} count={count} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Controls({
  onPrev,
  onNext,
  index,
  count,
}: {
  onPrev: () => void;
  onNext: () => void;
  index: number;
  count: number;
}) {
  // p-3.5 rather than p-3 so the hit area clears the 44px touch minimum.
  const btn =
    "p-3.5 border border-ivory/25 text-ivory hover:border-ivory/60 hover:bg-white/5 transition-all duration-300";
  return (
    <>
      <div className="flex gap-2">
        <button type="button" onClick={onPrev} aria-label="Previous photograph" className={btn}>
          <Chevron dir="left" />
        </button>
        <button type="button" onClick={onNext} aria-label="Next photograph" className={btn}>
          <Chevron dir="right" />
        </button>
      </div>
      <p className="label-eyebrow text-ivory/50 tabular-nums">
        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </p>
    </>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M12 4l-6 6 6 6" : "M8 4l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
