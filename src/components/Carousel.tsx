import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal snap carousel.
 *
 * Scrolling is native (CSS scroll-snap via .snap-rail) rather than a
 * transform-driven JS track: that keeps real touch momentum, trackpad
 * gestures, keyboard scrolling and screen-reader focus scrolling working for
 * free, and means the rail degrades into a plain scrollable row if JS or the
 * animation is unavailable. The arrows are progressive enhancement on top.
 */
export default function Carousel({
  children,
  ariaLabel,
  dark = false,
  className = "",
}: {
  children: ReactNode;
  ariaLabel: string;
  dark?: boolean;
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    // 2px tolerance: sub-pixel layout means scrollLeft rarely hits the exact
    // maximum, which would otherwise leave the "next" arrow permanently live.
    const max = el.scrollWidth - el.clientWidth;
    setOverflowing(max > 2);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync, children]);

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // Advance by whole items where possible so the snap points stay aligned.
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const btn = `p-2.5 border transition-all duration-300 disabled:opacity-25 disabled:pointer-events-none ${
    dark
      ? "border-ivory/25 text-ivory hover:border-ivory/60 hover:bg-white/5"
      : "border-concrete text-charcoal hover:border-charcoal hover:bg-ivory"
  }`;

  return (
    <div className={className}>
      <div ref={railRef} className="snap-rail flex gap-6 overflow-x-auto pb-2" aria-label={ariaLabel} tabIndex={0}>
        {children}
      </div>

      {overflowing && (
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={() => nudge(-1)} disabled={atStart} aria-label="Previous" className={btn}>
            <Chevron dir="left" />
          </button>
          <button type="button" onClick={() => nudge(1)} disabled={atEnd} aria-label="Next" className={btn}>
            <Chevron dir="right" />
          </button>
        </div>
      )}
    </div>
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
