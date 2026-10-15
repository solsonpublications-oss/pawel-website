"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { PRAISE } from "@/lib/site-data";
import { SectionHeading } from "./section-heading";

export function Praise() {
  return (
    <section id="praise" className="relative section-pad px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="On the Work"
          title={
            <>
              A framework the future will{" "}
              <span className="text-gradient-cyan-gold">build itself upon</span>
            </>
          }
          description="Read against the grain of contemporary futurism, the Eskm1DAA framework demands to be measured not as prediction but as operating manual."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {PRAISE.map((p, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.1 }}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-cyan-glow/12 bg-cosmos-surface/40 p-6 backdrop-blur-sm transition-colors hover:border-gold-glow/30 sm:p-8"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.82 0.14 85 / 0.3), transparent 70%)",
                }}
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-gold-glow/70 text-gold-glow"
                  />
                ))}
              </div>
              <blockquote className="flex-1 font-display text-lg font-medium italic leading-relaxed text-stardust sm:text-xl">
                “{p.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-cyan-glow/60 to-transparent" />
                <span className="font-mono-proto text-[11px] uppercase tracking-[0.25em] text-stardust-dim">
                  {p.source}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
