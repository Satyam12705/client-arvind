/**
 * One scroll listener and one rAF loop for the whole site.
 *
 * The per-element approach (a listener + rAF inside every hook instance) does
 * not scale: applying parallax to a dozen images means a dozen scroll
 * listeners all waking on the same event and a dozen independent rAF chains.
 * Subscribers register here instead and are driven from a single tick.
 *
 * Subscribers are also gated by IntersectionObserver, so elements scrolled far
 * off-screen cost nothing — no layout reads, no style writes.
 */

type Subscriber = {
  el: HTMLElement;
  /** Called with -1..1, where 0 means the element is centred in the viewport. */
  apply: (progress: number, el: HTMLElement) => void;
  visible: boolean;
};

const subs = new Set<Subscriber>();
let frame: number | null = null;
let io: IntersectionObserver | null = null;
let listening = false;

/** Scroll-linked motion is opt-out on touch and under reduced motion. */
export function scrollFxEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // Mobile scroll runs on the compositor thread; a JS-driven transform lands a
  // frame late and reads as judder rather than depth.
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  return true;
}

function tick() {
  frame = null;
  const vh = window.innerHeight;
  for (const s of subs) {
    if (!s.visible) continue;
    const r = s.el.getBoundingClientRect();
    const centre = r.top + r.height / 2;
    // -1 when the element's centre sits at the bottom edge, +1 at the top.
    const progress = Math.max(-1, Math.min(1, (vh / 2 - centre) / (vh / 2 + r.height / 2)));
    s.apply(progress, s.el);
  }
}

function schedule() {
  if (frame === null) frame = requestAnimationFrame(tick);
}

function ensureObserver() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const s of subs) {
          if (s.el === entry.target) s.visible = entry.isIntersecting;
        }
      }
      schedule();
    },
    // Start updating slightly before the element scrolls in, so it is already
    // at the right offset by the time it becomes visible.
    { rootMargin: "15% 0px" }
  );
  return io;
}

export function subscribe(el: HTMLElement, apply: Subscriber["apply"]): () => void {
  if (!scrollFxEnabled()) return () => {};

  const sub: Subscriber = { el, apply, visible: false };
  subs.add(sub);
  ensureObserver().observe(el);

  if (!listening) {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  schedule();

  return () => {
    subs.delete(sub);
    io?.unobserve(el);
    if (subs.size === 0 && listening) {
      listening = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      io?.disconnect();
      io = null;
    }
  };
}
