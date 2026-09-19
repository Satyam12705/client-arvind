import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll-triggered entrance animation.
 *
 * Only transform / opacity / clip-path are animated — never a layout or paint
 * property — so each reveal stays on the compositor. `transition-all` was
 * previously used, which makes the browser watch *every* animatable property
 * on the element (including width, height and colours it has no intention of
 * animating); the transition list is now explicit.
 *
 * `will-change` is applied only while a reveal is actually pending and is
 * dropped as soon as it finishes, so long pages don't hold dozens of
 * permanently promoted layers.
 */
export type RevealVariant = "up" | "left" | "right" | "scale" | "clip" | "none";

const HIDDEN: Record<RevealVariant, string> = {
  up: "opacity-0 translate-y-6",
  left: "opacity-0 -translate-x-8",
  right: "opacity-0 translate-x-8",
  scale: "opacity-0 scale-[0.96]",
  // Directional "birth" wipe — the element is clipped to nothing from the
  // bottom edge and unrolls upward. clip-path is GPU-composited.
  clip: "opacity-0 [clip-path:inset(0_0_100%_0)]",
  none: "opacity-0",
};

const SHOWN: Record<RevealVariant, string> = {
  up: "opacity-100 translate-y-0",
  left: "opacity-100 translate-x-0",
  right: "opacity-100 translate-x-0",
  scale: "opacity-100 scale-100",
  clip: "opacity-100 [clip-path:inset(0_0_0_0)]",
  none: "opacity-100",
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  variant = "up",
  duration = 700,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  variant?: RevealVariant;
  duration?: number;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Every variant starts fully transparent, so anything that stops the
    // observer from firing leaves real content permanently invisible — a blank
    // gap where an image or a whole section should be. Three guards:

    // 1. No IntersectionObserver at all: show it.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      setSettled(true);
      return;
    }

    // 2. Already on screen at mount: show it now rather than waiting for the
    //    observer's first delivery, which does not happen until the tab is
    //    actually rendering (a backgrounded or occluded tab never runs the
    //    rendering steps that drive IntersectionObserver callbacks).
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    // 3. threshold 0, not 0.15. A fraction-based threshold is unreachable for
    //    any element taller than viewportHeight / 0.15 — 15% of it can never
    //    be on screen at once — so tall sections could never reveal on short
    //    viewports. Any sliver now counts.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Drop the compositor hint once the entrance has played out. Keyed off a
  // timer rather than transitionend because the element animates several
  // properties and would otherwise fire once per property.
  useEffect(() => {
    if (!visible || settled) return;
    const t = window.setTimeout(() => setSettled(true), delay + duration + 60);
    return () => window.clearTimeout(t);
  }, [visible, settled, delay, duration]);

  const Component = as;

  return (
    <Component
      ref={ref}
      className={`${className} transition-[opacity,transform,clip-path] ease-out ${
        visible ? SHOWN[variant] : HIDDEN[variant]
      }`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: visible ? `${delay}ms` : "0ms",
        // Only while the entrance is actually playing. Hinting before the
        // element has been triggered would promote every still-hidden Reveal
        // on the page to its own compositor layer — on a long page that is
        // dozens of permanent layers, which costs more than it saves.
        willChange: visible && !settled ? "transform, opacity" : undefined,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
