import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { optimizedImage } from "../lib/cloudinaryUrl";

export interface ClientItem {
  name: string;
  logo?: string;
  url?: string;
}

/** Pixels travelled per second. Constant regardless of how many logos exist. */
const SPEED_PX_PER_SEC = 55;

/**
 * Continuously scrolling client logo strip.
 *
 * The track renders the logo list an even number of times and animates by
 * exactly -50%, so the loop lands on an identical frame and the seam is
 * invisible. The number of copies is *measured*, not fixed: the track has to
 * stay at least as wide as the viewport for the whole travel, otherwise the
 * tail of the strip scrolls away and leaves dead space. With a handful of
 * short logos on a wide desktop, two copies is not enough — five logos only
 * span ~420px against a 1400px container.
 *
 * Required copies for a copy of width C and a container of width V:
 *   at the end of the travel the covered width is (N / 2) * C,
 *   so N >= 2 * V / C, rounded up to the next even number.
 *
 * Logo lists are admin-editable, so this is recomputed whenever the container
 * resizes or the logos finish loading.
 */
export default function ClientMarquee({ items }: { items: ClientItem[] }) {
  const clean = useMemo(
    () => items.filter((c) => c && typeof c.name === "string" && c.name.trim().length > 0),
    [items]
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const [copyWidth, setCopyWidth] = useState(0);
  // An infinite animation keeps the compositor busy for as long as it runs,
  // even with the strip scrolled far out of view. Only let it run on screen.
  const [onScreen, setOnScreen] = useState(false);

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    const copy = copyRef.current;
    if (!vp || !copy) return;
    const c = copy.getBoundingClientRect().width;
    const v = vp.getBoundingClientRect().width;
    if (c < 1 || v < 1) return;
    setCopyWidth(c);
    const needed = Math.ceil((2 * v) / c);
    setCopies(Math.max(2, needed % 2 === 0 ? needed : needed + 1));
  }, []);

  useLayoutEffect(measure, [measure, clean.length]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    if (typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver((entries) => setOnScreen(entries[0].isIntersecting), {
      rootMargin: "200px 0px",
    });
    io.observe(vp);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const vp = viewportRef.current;
    const copy = copyRef.current;
    if (!vp || !copy) return;
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    ro.observe(copy);
    // Logos are lazy-loaded, so the first copy is narrower than its final
    // width until they decode — remeasure as each one arrives.
    const imgs = Array.from(copy.querySelectorAll("img"));
    for (const img of imgs) {
      if (!img.complete) img.addEventListener("load", measure, { once: true });
    }
    return () => {
      ro.disconnect();
      for (const img of imgs) img.removeEventListener("load", measure);
    };
  }, [measure, clean.length]);

  if (clean.length === 0) return null;

  // Travel distance is half the track; keep the speed constant across lists.
  const distance = (copies / 2) * copyWidth;
  const duration = distance > 0 ? Math.max(12, distance / SPEED_PX_PER_SEC) : 40;

  return (
    <div ref={viewportRef} className="marquee-viewport relative overflow-hidden">
      <div
        className="marquee-track flex w-max items-center"
        style={{
          ["--marquee-duration" as string]: `${duration.toFixed(1)}s`,
          animationPlayState: onScreen ? "running" : "paused",
        }}
      >
        {Array.from({ length: copies }, (_, copy) => (
          <div
            key={copy}
            ref={copy === 0 ? copyRef : undefined}
            className="flex items-center shrink-0"
            // Only the first copy is real content; the rest are visual filler
            // for the loop and must not be read out twice.
            aria-hidden={copy === 0 ? undefined : "true"}
            data-marquee-clone={copy === 0 ? undefined : "true"}
          >
            {clean.map((c, i) => (
              <ClientLogo key={`${copy}-${c.name}-${i}`} client={c} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientLogo({ client }: { client: ClientItem }) {
  const inner = client.logo ? (
    // Logos are admin-uploaded, so their intrinsic dimensions are unknown here
    // and no width/height attribute can be set. A fixed height plus a min/max
    // width is what reserves a real box before the file loads — with only
    // `w-auto` and a max-height the element measures 0x0 until then, which
    // both suppresses lazy-loading and starves the reveal observer.
    <img
      src={optimizedImage(client.logo, 400)}
      alt={client.name}
      loading="lazy"
      decoding="async"
      className="h-10 md:h-12 w-auto min-w-[4.5rem] max-w-[11rem] object-contain opacity-70 grayscale transition-all duration-500 ease-out group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
    />
  ) : (
    // No logo uploaded yet — a set wordmark reads as deliberate, a broken
    // image icon does not.
    <span className="label-eyebrow text-steel whitespace-nowrap transition-colors duration-300 group-hover/logo:text-charcoal">
      {client.name}
    </span>
  );

  const shell = (
    <div className="group/logo flex h-20 md:h-24 items-center justify-center px-8 md:px-12 shrink-0">
      {inner}
    </div>
  );

  if (!client.url) return shell;

  return (
    <a href={client.url} target="_blank" rel="noreferrer noopener" aria-label={client.name} className="shrink-0">
      {shell}
    </a>
  );
}
