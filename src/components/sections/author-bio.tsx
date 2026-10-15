"use client";

import { motion } from "framer-motion";
import { PenTool, Globe, ExternalLink, Quote } from "lucide-react";
import {
  AUTHOR_BIO,
  AUTHOR_TRAITS,
  AUTHOR_LANGUAGES,
  AUTHOR_PUBLISHED_WORKS,
  BLOG_URL,
  BUY_URL,
} from "@/lib/site-data";
import { SectionHeading } from "./section-heading";
import { AuthorTimeline } from "./author-timeline";
import { AudioQuotePlayer } from "./audio-quote-player";

export function AuthorBio() {
  return (
    <section id="author" className="relative section-pad px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The Author"
          title={
            <>
              Pawel{" "}
              <span className="text-gradient-cyan-gold">Kozycz</span>
            </>
          }
          description="A native of Poland, resident of Denmark, and citizen of the administered future — one of the most original, provocative, and systematically courageous independent thinkers at the intersection of futurism, neo-evolutionary philosophy, and cosmic economics."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Author portrait */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-sm"
          >
            {/* orbital frame */}
            <div className="pointer-events-none absolute inset-[-6%] rounded-full border border-cyan-glow/15 animate-spin-slower" />
            <div className="pointer-events-none absolute inset-[-2%] rounded-full border border-gold-glow/10" />

            {/* glow */}
            <div
              className="absolute inset-[8%] rounded-full opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.82 0.1 230 / 0.5), transparent 70%)",
              }}
            />

            <div className="relative aspect-square overflow-hidden rounded-full border border-white/10 shadow-2xl">
              <img
                src="/images/author-photo.jpg"
                alt="Portrait of author Pawel Kozycz"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cosmos-deep/40 via-transparent to-transparent" />
            </div>

            {/* signature chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {AUTHOR_TRAITS.map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-cyan-glow/15 bg-cosmos-surface/50 px-3 py-1 backdrop-blur-sm"
                >
                  <span className="font-mono-proto text-[9px] uppercase tracking-[0.2em] text-stardust-dim">
                    {t.label}
                  </span>
                  <span className="text-xs font-medium text-stardust">
                    {t.value}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bio + meta */}
          <div className="space-y-6">
            {AUTHOR_BIO.map((p, i) => (
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

            {/* Inversion quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="relative rounded-2xl border border-gold-glow/20 bg-gradient-to-r from-gold-glow/8 to-transparent p-6"
            >
              <Quote className="absolute -left-2 -top-3 h-7 w-7 text-gold-glow/40" />
              <p className="font-display text-lg italic leading-relaxed text-stardust sm:text-xl">
                “Pawel Kozycz lives in the Inversion Model and extends a
                permanent, open invitation to every reader: Join the
                administration. The cosmos is waiting.”
              </p>
              {/* Audio player — TTS narration of the quote */}
              <div className="mt-4">
                <AudioQuotePlayer label="Listen to the Inversion quote" />
              </div>
            </motion.blockquote>

            {/* Published works */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="rounded-2xl border border-cyan-glow/12 bg-cosmos-surface/30 p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <PenTool className="h-4 w-4 text-cyan-glow" />
                <h4 className="font-mono-proto text-[11px] uppercase tracking-[0.25em] text-cyan-glow">
                  Published works
                </h4>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {AUTHOR_PUBLISHED_WORKS.map((w) => (
                  <li
                    key={w}
                    className="flex items-start gap-2 text-sm text-stardust-dim"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-glow" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-cyan-glow/10 pt-4">
                <span className="font-mono-proto text-[10px] uppercase tracking-[0.2em] text-stardust-dim">
                  Available in
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AUTHOR_LANGUAGES.map((l) => (
                    <span
                      key={l}
                      className="rounded-md bg-cyan-glow/10 px-2 py-0.5 text-xs font-medium text-cyan-glow"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Author timeline — the 2-year blog journey */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.13 }}
            >
              <AuthorTimeline />
            </motion.div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.14 }}
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
                Read on Amazon
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-glow/25 bg-cyan-glow/5 px-6 py-3 text-sm font-semibold text-stardust backdrop-blur-sm transition-colors hover:bg-cyan-glow/10 hover:text-cyan-glow"
              >
                <Globe className="h-4 w-4" />
                MoonNow Blog
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
