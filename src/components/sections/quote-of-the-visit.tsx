"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote as QuoteIcon } from "lucide-react";
import { VISIT_QUOTES } from "@/lib/site-data";

/**
 * QuoteOfTheVisit — a contemplative band showing a randomly-selected quote
 * from the book. Changes on each page load (client-side random selection
 * after mount, with a stable server-rendered default to avoid hydration
 * mismatch). Placed between the Synopsis and Key Concepts sections as a
 * meditative beat.
 */
export function QuoteOfTheVisit() {
  // Start with index 0 for SSR/hydration consistency; pick a random one
  // after mount. Wrapped in setTimeout so the setState is async (not
  // synchronous in the effect body) — avoids the set-state-in-effect rule.
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setIdx(Math.floor(Math.random() * VISIT_QUOTES.length));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const q = VISIT_QUOTES[idx];

  return (
    <section
      aria-label="Quote from the book"
      className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl text-center"
      >
        {/* decorative quote mark */}
        <QuoteIcon className="mx-auto mb-4 h-8 w-8 text-gold-glow/30" />

        {/* glow behind text */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-40 w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.82 0.14 85 / 0.2), transparent 70%)",
          }}
        />

        <blockquote className="relative">
          <p className="font-display text-xl font-medium italic leading-relaxed text-stardust sm:text-2xl lg:text-[1.6rem]">
            <span className="text-gradient-cyan-gold">&ldquo;</span>
            {q.text}
            <span className="text-gradient-cyan-gold">&rdquo;</span>
          </p>
          <footer className="mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-cyan-glow/50" />
            <cite className="font-mono-proto text-[10px] uppercase not-italic tracking-[0.25em] text-stardust-dim">
              {q.source}
            </cite>
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-cyan-glow/50" />
          </footer>
        </blockquote>

        {/* "quote of the visit" label */}
        <p className="mt-6 font-mono-proto text-[9px] uppercase tracking-[0.35em] text-stardust-dim/50">
          Quote of the visit
        </p>
      </motion.div>
    </section>
  );
}
