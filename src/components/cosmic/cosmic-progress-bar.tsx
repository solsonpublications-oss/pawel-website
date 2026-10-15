"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useScroll, useTransform } from "framer-motion";

/**
 * Fixed, thin cyan→gold gradient bar at the very top of the viewport.
 * Sits ABOVE the navbar (z-[60] vs navbar z-50). Uses requestAnimationFrame
 * via framer-motion's useScroll + a smoothed spring for a premium feel.
 */
export function CosmicProgressBar() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });
  // Comet head tracks scroll progress (NOT scaled) so it stays circular.
  const cometLeft = useTransform(smooth, (v) => `${v * 100}%`);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVisible(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      {/* base track (always present, very faint) */}
      <div className="absolute inset-0 bg-cyan-glow/5" />
      {/* gradient fill, scaled horizontally */}
      <motion.div
        className="absolute inset-y-0 left-0 origin-left"
        style={{
          scaleX: smooth,
          opacity: visible ? 1 : 0,
          width: "100%",
          background:
            "linear-gradient(90deg, oklch(0.78 0.15 200) 0%, oklch(0.88 0.06 200) 45%, oklch(0.82 0.14 85) 100%)",
          boxShadow:
            "0 0 12px oklch(0.78 0.15 200 / 0.7), 0 0 24px oklch(0.82 0.14 85 / 0.45)",
        }}
        transition={{ opacity: { duration: 0.4 } }}
      />
      {/* leading comet head — unscaled, positioned via progress */}
      <motion.div
        className="absolute top-1/2 h-2 w-2 -translate-y-1/2 -translate-x-1/2 rounded-full"
        style={{
          left: cometLeft,
          background: "oklch(0.96 0.06 85)",
          boxShadow:
            "0 0 10px oklch(0.82 0.14 85 / 0.9), 0 0 22px oklch(0.78 0.15 200 / 0.5)",
          opacity: visible ? 1 : 0,
        }}
        transition={{ opacity: { duration: 0.4 } }}
      />
    </div>
  );
}
