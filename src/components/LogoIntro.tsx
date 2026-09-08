import { useEffect, useState } from "react";
import { useContent, useContentReady } from "../lib/content";

const SESSION_KEY = "atf-intro-seen";
const CONSTRUCT_MS = 650;
const REVEAL_MS = 550;
const HOLD_MS = 850;
const FADE_MS = 500;

// Decided once per page load via a module-level flag (not React state), so
// React 18 StrictMode's dev-only double-invoke of the mount effect can't
// cause the second pass to see its own first pass's sessionStorage write and
// wrongly conclude "already seen" — the decision itself is memoized outside
// React's render cycle. The decision is deferred until content is `ready` so
// the admin's introEnabled toggle is respected without a redeploy.
let introDecided = false;
let introShouldShow = false;

function decideIntro(introEnabled: boolean): boolean {
  if (introDecided) return introShouldShow;
  introDecided = true;

  if (typeof window === "undefined") {
    introShouldShow = false;
    return false;
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
  if (!introEnabled || reduceMotion || alreadySeen) {
    introShouldShow = false;
    return false;
  }
  sessionStorage.setItem(SESSION_KEY, "1");
  introShouldShow = true;
  return true;
}

// Cheap synchronous pre-check for the two conditions that don't need the
// content fetch (reduced motion, already seen this session) so the very
// first paint can decide whether to hold up a blocking cover — without it,
// the real site flashes underneath for as long as /api/content takes to
// resolve, and the intro then appears "late" and feels rushed once it does.
function mightShowIntro(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (sessionStorage.getItem(SESSION_KEY) === "1") return false;
  return true;
}

type Phase = "pending" | "construct" | "reveal" | "hold" | "fade" | "done";

/**
 * Signature interaction — "Logo Construction": the brand arrival plays once
 * per session. Technical guide-lines (a crosshair + four corner brackets)
 * draw themselves in first, like an engineering drawing being set up, then
 * the logo itself materializes into focus inside that frame. Skips entirely
 * under prefers-reduced-motion or when disabled from the admin panel.
 */
export default function LogoIntro() {
  const ready = useContentReady();
  const content = useContent();
  // Lazily seeded from the synchronous pre-check so the blocking cover (a
  // bare charcoal screen, same markup as "construct" at its resting state)
  // is present on the very first paint — before the content fetch resolves
  // — rather than appearing only once `ready` flips true.
  const [phase, setPhase] = useState<Phase>(() => (mightShowIntro() ? "pending" : "done"));

  useEffect(() => {
    if (phase !== "pending") return;
    if (!ready) return;
    const shouldShow = decideIntro(content.siteSettings.introEnabled !== false);
    if (!shouldShow) {
      setPhase("done");
      return;
    }

    setPhase("construct");
    const toReveal = window.setTimeout(() => setPhase("reveal"), CONSTRUCT_MS);
    const toHold = window.setTimeout(() => setPhase("hold"), CONSTRUCT_MS + REVEAL_MS);
    const toFade = window.setTimeout(() => setPhase("fade"), CONSTRUCT_MS + REVEAL_MS + HOLD_MS);
    const toDone = window.setTimeout(() => {
      setPhase("done");
    }, CONSTRUCT_MS + REVEAL_MS + HOLD_MS + FADE_MS);

    return () => {
      window.clearTimeout(toReveal);
      window.clearTimeout(toHold);
      window.clearTimeout(toFade);
      window.clearTimeout(toDone);
    };
    // Intentionally keyed on `ready` alone — `phase` is read for its
    // initial-mount value only. Including it would re-run this effect (and
    // its cleanup, cancelling the just-scheduled timers) on every phase
    // transition the timers themselves cause.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  const framed = phase === "reveal" || phase === "hold" || phase === "fade";
  const logoVisible = phase === "reveal" || phase === "hold" || phase === "fade";
  const arm = 26;
  const frameSize = 168;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-charcoal transition-opacity ease-in ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(184,83,31,0.14),transparent_60%)]" />

      <div className="relative" style={{ width: frameSize, height: frameSize }}>
        {/* Crosshair construction lines */}
        <span
          className="absolute left-1/2 top-1/2 h-px bg-rust-light/60 -translate-x-1/2 -translate-y-1/2 transition-transform ease-out"
          style={{
            width: frameSize * 1.6,
            transitionDuration: `${CONSTRUCT_MS}ms`,
            transform: `translate(-50%, -50%) scaleX(${framed ? 1 : 0})`,
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 w-px bg-rust-light/60 -translate-x-1/2 -translate-y-1/2 transition-transform ease-out"
          style={{
            height: frameSize * 1.6,
            transitionDuration: `${CONSTRUCT_MS}ms`,
            transform: `translate(-50%, -50%) scaleY(${framed ? 1 : 0})`,
          }}
        />

        {/* Corner brackets */}
        {(["tl", "tr", "bl", "br"] as const).map((pos) => {
          const posClass = {
            tl: "top-0 left-0",
            tr: "top-0 right-0 -scale-x-100",
            bl: "bottom-0 left-0 -scale-y-100",
            br: "bottom-0 right-0 -scale-x-100 -scale-y-100",
          }[pos];
          return (
            <svg
              key={pos}
              width={arm}
              height={arm}
              viewBox={`0 0 ${arm} ${arm}`}
              className={`absolute ${posClass}`}
              aria-hidden="true"
            >
              <path
                d={`M0 ${arm} V0 H${arm}`}
                fill="none"
                stroke="rgba(217,122,63,0.85)"
                strokeWidth={1.5}
                strokeDasharray={arm * 2}
                strokeDashoffset={framed ? 0 : arm * 2}
                style={{ transition: `stroke-dashoffset ${CONSTRUCT_MS}ms cubic-bezier(0.16,1,0.3,1)` }}
              />
            </svg>
          );
        })}

        {/* Logo, materializing into focus once the frame is constructed */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <img
              src={content.siteSettings.logo}
              alt=""
              width={455}
              height={238}
              className={`relative z-10 h-14 md:h-16 w-auto transition-all ease-out ${
                logoVisible ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-90 blur-md"
              }`}
              style={{ transitionDuration: `${REVEAL_MS}ms` }}
            />
            {logoVisible && (
              <span className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
                <span className="absolute inset-y-0 -left-1/2 w-1/2 animate-logo-sweep bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
