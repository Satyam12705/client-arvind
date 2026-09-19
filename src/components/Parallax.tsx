import { useEffect, useRef, type ReactNode } from "react";
import { subscribe } from "../lib/scrollFx";

/**
 * Scroll-linked depth for imagery.
 *
 * The frame clips; the inner plate is deliberately taller than the frame and
 * slides inside it. Sizing the plate at 100% and translating it would drag its
 * edge into view — the overscan is what makes the movement invisible at the
 * boundaries. `--overscan` and `strength` are kept in step so the plate can
 * never travel further than the slack it has.
 *
 * Transform only, driven from the shared scroll ticker, and skipped entirely
 * on touch and under reduced motion (see scrollFxEnabled).
 */
export default function Parallax({
  children,
  strength = 28,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Peak travel in px, each way. Keep below the overscan the plate allows. */
  strength?: number;
  className?: string;
  as?: "div" | "figure";
}) {
  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plate = plateRef.current;
    if (!plate) return;
    return subscribe(plate, (progress, el) => {
      el.style.transform = `translate3d(0, ${(progress * strength).toFixed(2)}px, 0)`;
    });
  }, [strength]);

  // Overscan needs to cover travel in both directions, plus a little slack for
  // sub-pixel rounding at the edges.
  const overscan = strength * 2 + 8;

  return (
    <Tag className={`relative overflow-hidden ${className}`}>
      {/* translate3d already promotes this to its own compositor layer, so no
          will-change is needed — and a standing will-change would keep the
          layer alive even while the section is far off-screen. */}
      <div
        ref={plateRef}
        className="absolute left-0 right-0"
        style={{ top: `-${overscan}px`, bottom: `-${overscan}px` }}
      >
        {children}
      </div>
    </Tag>
  );
}
