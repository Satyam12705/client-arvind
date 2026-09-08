import { useEffect, type ReactNode } from "react";
import { useLocation, Routes } from "react-router-dom";

/**
 * Scrolls to top on every route change and renders the matched route.
 *
 * Previously crossfaded the outgoing/incoming page via an opacity+translateY
 * animation. Every page's top section is a dark (bg-charcoal) hero
 * (PageHero, or Home's own hero), while the shared Layout wrapper behind the
 * transitioning content is light (bg-paper) — so the animation's low-opacity
 * frames let that light background show through beneath the semi-transparent
 * dark hero, producing a visible light "flash" on every single page change.
 * Fixing that without either changing Layout's background (which many
 * sections rely on by omitting their own bg-* class) or auditing every
 * section to set one explicitly wasn't worth it for a purely decorative
 * effect — an instant swap has no such artifact.
 */
export default function RouteTransition({ children }: { children: ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return <Routes location={location}>{children}</Routes>;
}
