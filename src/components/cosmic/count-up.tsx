"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * CountUp — animates a numeric value from 0 → target when scrolled into view.
 * Parses a leading numeric portion (int or decimal) and preserves any suffix.
 * Examples:
 *   "22"     → 0..22
 *   "246"    → 0..246
 *   "2 yrs"  → 0..2 with " yrs" suffix
 *   "Expanded" → rendered as-is (no numeric prefix)
 *
 * Uses easeOutExpo for a snappy, premium deceleration.
 */
export function CountUp({
  value,
  duration = 1500,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : "";
  const isDecimal = match ? match[1].includes(".") : false;

  const [display, setDisplay] = useState<string>(
    target !== null ? "0" : value,
  );

  useEffect(() => {
    if (target === null) return;
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo — fast start, graceful settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = target * eased;
      setDisplay(
        isDecimal ? current.toFixed(1) : Math.round(current).toString(),
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, isDecimal]);

  return (
    <span ref={ref} className={className}>
      {target !== null ? display + suffix : display}
    </span>
  );
}
