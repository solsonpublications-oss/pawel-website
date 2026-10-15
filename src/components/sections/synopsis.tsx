"use client";

import { motion } from "framer-motion";
import { BookOpen, Quote } from "lucide-react";
import { SYNOPSIS_PARAGRAPHS, JOURNEY_STEPS, BUY_URL } from "@/lib/site-data";
import { SectionHeading } from "./section-heading";

export function Synopsis() {
  return (
    <section id="book" className="relative section-pad px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="About the Book"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Left: synopsis text */}
          <div className="space-y-6">
            {SYNOPSIS_PARAGRAPHS.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className={`leading-relaxed text-stardust/85 ${
                  i === 0 ? "text-lg sm:text-xl text-stardust" : "text-base sm:text-lg"
                }`}
              >
                {p}
              </motion.p>
            ))}

            {/* pull quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative rounded-2xl border-l-2 border-cyan-glow/60 bg-cosmos-surface/40 p-6 backdrop-blur-sm"
            >
              <Quote className="absolute -left-4 -top-4 h-8 w-8 text-cyan-glow/30" />
              <p className="font-display text-lg font-medium italic leading-relaxed text-stardust sm:text-xl">
                “The Algorithm of the Future is not a prediction. It is an
                invitation.”
              </p>
              <footer className="mt-3 font-mono-proto text-xs uppercase tracking-[0.2em] text-stardust-dim">
                — Pawel Kozycz, Preface
              </footer>
            </motion.blockquote>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href={BUY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-cosmos-deep transition-transform hover:scale-[1.03]"
                style={{
                  background:
                    "linear-gradient(100deg, oklch(0.78 0.15 200) 0%, oklch(0.82 0.14 85) 100%)",
                }}
              >
                <BookOpen className="h-4 w-4" />
                Read the manifesto
              </a>
            </motion.div>
          </div>

          {/* Right: journey timeline */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8 }}
              className="absolute left-[1.35rem] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-glow/50 via-gold-glow/40 to-transparent"
            />
            <ul className="space-y-5">
              {JOURNEY_STEPS.map((s, i) => (
                <motion.li
                  key={s.step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative flex gap-5 rounded-2xl border border-transparent p-3 transition-colors hover:border-cyan-glow/15 hover:bg-cosmos-surface/30"
                >
                  <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-glow/40 bg-cosmos-deep font-mono-proto text-sm font-semibold text-cyan-glow">
                    {s.step}
                    <span className="absolute inset-0 -z-10 rounded-full bg-cyan-glow/20 blur-md" />
                  </div>
                  <div className="space-y-1 pt-1">
                    <h3 className="font-display text-base font-semibold text-gold-glow">
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-stardust-dim">
                      {s.text}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
