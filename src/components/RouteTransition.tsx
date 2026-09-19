import { useEffect, type ReactNode } from "react";
import { useLocation, Routes } from "react-router-dom";

/**
 * Scrolls to top on every route change and renders the matched route with a
 * short entrance.
 *
 * The entrance is transform-only, on purpose. The previous attempt here
 * crossfaded the outgoing and incoming pages, and every page opens on a dark
 * (bg-charcoal) hero while the shared Layout wrapper behind it is light
 * (bg-paper) — so every low-opacity frame let that light background show
 * through the semi-transparent hero and flashed white on each navigation.
 * Sliding the incoming page at full opacity has nothing to show through, so
 * the artifact cannot occur. There is also no exit animation: the outgoing
 * page is never made transparent.
 *
 * `key` on the wrapper restarts the animation per navigation.
 */
export default function RouteTransition({ children }: { children: ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="animate-page-enter">
      <Routes location={location}>{children}</Routes>
    </div>
  );
}
