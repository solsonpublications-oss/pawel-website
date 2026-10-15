"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { BUY_URL } from "@/lib/site-data";

/**
 * StickyBuyButton — a floating, always-accessible "Buy on Amazon" bar that
 * slides up on mobile/tablet after the user scrolls past the hero, and
 * gracefully hides near the final CTA section (to avoid overlap).
 *
 * Hidden on desktop (lg:hidden) — desktop users always have the navbar CTA.
 */
export function StickyBuyButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const heroH = window.innerHeight;
      const scrolledPastHero = window.scrollY > heroH * 0.85;
      // hide when the final CTA (#buy) section is in view
      const buyEl = document.getElementById("buy");
      const nearBuy =
        buyEl &&
        buyEl.getBoundingClientRect().top < window.innerHeight * 0.6;
      setShow(scrolledPastHero && !nearBuy);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="sticky-buy"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="mx-3 mb-3 overflow-hidden rounded-2xl border border-cyan-glow/25 glass-panel p-2 shadow-2xl">
            {/* subtle top scan line */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.15 200 / 0.6), oklch(0.82 0.14 85 / 0.6), transparent)",
              }}
            />
            <a
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy Algorithm of the Future on Amazon (opens in new tab)"
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-cosmos-deep"
              style={{
                background:
                  "linear-gradient(100deg, oklch(0.78 0.15 200) 0%, oklch(0.82 0.14 85) 100%)",
                boxShadow: "0 8px 24px -10px oklch(0.78 0.15 200 / 0.6)",
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Buy on Amazon</span>
              <span className="font-mono-proto text-[10px] uppercase tracking-[0.2em] opacity-70">
                · 2026
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
