"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles, Download } from "lucide-react";
import { BUY_URL, PUBLISHER, PUBLICATION_YEAR } from "@/lib/site-data";
import { ShareButtons } from "@/components/sections/share-buttons";

export function FinalCTA() {
  return (
    <section id="buy" className="relative section-pad px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-cyan-glow/20 glass-panel px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          {/* portal glow background */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, oklch(0.78 0.15 200 / 0.35), oklch(0.82 0.14 85 / 0.22) 45%, transparent 70%)",
            }}
          />
          {/* orbital ring */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-glow/15 animate-spin-slower" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold-glow/10 animate-spin-reverse-slow" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-glow/40 bg-cosmos-deep/60 text-gold-glow"
          >
            <Sparkles className="h-6 w-6" />
            <span className="absolute -z-10 h-14 w-14 rounded-2xl bg-gold-glow/30 blur-xl" />
          </motion.div>

          <p className="font-mono-proto text-[11px] uppercase tracking-[0.3em] text-cyan-glow">
            The window is open. The algorithm is available.
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-stardust sm:text-5xl">
            Step through the{" "}
            <span className="text-gradient-cyan-gold">
              Inversion Point
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stardust-dim sm:text-lg">
            The Algorithm of the Future is not a prediction. It is an
            invitation. Your survival, and the survival of the cosmos, depends
            on your answer.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-base font-semibold text-cosmos-deep transition-transform duration-300 hover:scale-[1.03] sm:w-auto"
              style={{
                background:
                  "linear-gradient(100deg, oklch(0.78 0.15 200) 0%, oklch(0.82 0.14 85) 100%)",
                boxShadow:
                  "0 0 0 1px oklch(0.82 0.14 85 / 0.45), 0 22px 50px -18px oklch(0.78 0.15 200 / 0.75)",
              }}
            >
              <ShoppingBag className="h-5 w-5" />
              Buy on Amazon
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
            <a
              href="#book"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-glow/25 bg-cyan-glow/5 px-6 py-4 text-base font-semibold text-stardust backdrop-blur-sm transition-colors hover:bg-cyan-glow/10 hover:text-cyan-glow sm:w-auto"
            >
              Re-read the manifesto
            </a>
          </div>

          {/* PDF summary download */}
          <div className="mt-4 flex justify-center">
            <a
              href="/download/algorithm-of-the-future-at-a-glance.pdf"
              download="algorithm-of-the-future-at-a-glance.pdf"
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-glow/15 px-4 py-2 text-xs font-medium text-stardust-dim transition-colors hover:border-cyan-glow/40 hover:bg-cyan-glow/5 hover:text-cyan-glow"
            >
              <Download className="h-3.5 w-3.5" />
              Download "At a glance" PDF
            </a>
          </div>

          <p className="mt-8 font-mono-proto text-[11px] uppercase tracking-[0.25em] text-stardust-dim">
            {PUBLISHER} · {PUBLICATION_YEAR} · Available in English, Polish, German, Spanish
          </p>

          {/* Share row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex justify-center"
          >
            <ShareButtons />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
