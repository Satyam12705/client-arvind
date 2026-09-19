import { useEffect, useRef, useState } from "react";

/**
 * A hairline that draws itself left-to-right when it scrolls into view.
 *
 * Uses scaleX rather than width so the growth stays on the compositor and
 * never triggers layout on the surrounding section.
 */
export default function Rule({
  className = "",
  delay = 0,
  dark = false,
}: {
  className?: string;
  delay?: number;
  dark?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-shown={shown ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
      className={`rule-draw block h-px w-full ${dark ? "bg-ivory/20" : "bg-charcoal/15"} ${className}`}
    />
  );
}
