import { useEffect, useRef } from "react";

/**
 * Attaches a subtle scroll-tied translateY to the returned ref, GPU-friendly
 * (transform only, rAF-throttled, direct DOM mutation — no React re-renders
 * per scroll tick). Intended for a background layer sized slightly larger
 * than its container (e.g. inset: -6%) so the shift never exposes an edge.
 */
export function useParallax<T extends HTMLElement>(strength = 0.15, maxOffset = 40) {
  const ref = useRef<T>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Coarse pointer == touch. Mobile browsers drive scroll off the compositor
    // thread, so a scroll-linked transform lands a frame late and reads as
    // judder; the static background looks better than a stuttering one.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const update = () => {
      raf.current = null;
      const rect = el.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift = Math.max(-maxOffset, Math.min(maxOffset, -centerOffset * strength));
      el.style.transform = `translateY(${shift}px)`;
    };

    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [strength, maxOffset]);

  return ref;
}
