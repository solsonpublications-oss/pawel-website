"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/site-data";
import { SectionHeading } from "./section-heading";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative section-pad px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Questions from the Leap"
          description="Distilled from the book's Appendix C — the questions every reader asks before stepping through the Inversion Point."
        />

        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-300 ${
                  isOpen
                    ? "border-cyan-glow/40 bg-cyan-glow/8"
                    : "border-cyan-glow/10 bg-cosmos-surface/30 hover:border-cyan-glow/20 hover:bg-cosmos-surface/50"
                }`}
                style={
                  isOpen
                    ? { boxShadow: "0 0 30px -12px oklch(0.78 0.15 200 / 0.45)" }
                    : undefined
                }
              >
                {/* faint inner scan that fades in when open */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-500 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.78 0.15 200 / 0.7), transparent)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-cyan-glow/5 sm:px-6 sm:py-5"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                >
                  <span
                    className={`font-display text-base font-semibold transition-colors sm:text-lg ${
                      isOpen ? "text-cyan-glow" : "text-stardust"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                      isOpen
                        ? "border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow"
                        : "border-cyan-glow/20 text-stardust-dim"
                    }`}
                  >
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mx-5 mb-3 h-px bg-gradient-to-r from-cyan-glow/40 via-cyan-glow/10 to-transparent sm:mx-6"
                        aria-hidden="true"
                      />
                      <p className="px-5 pb-5 text-sm leading-relaxed text-stardust-dim sm:px-6 sm:pb-6 sm:text-base">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
