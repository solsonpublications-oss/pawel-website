"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { EQUATION } from "@/lib/site-data";
import { SectionHeading } from "./section-heading";
import { GlossaryTerm } from "@/components/cosmic/glossary-term";

export function CoreEquation() {
  return (
    <section id="equation" className="relative section-pad px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The Core Equation"
          title={
            <>
              The inequality that redraws the{" "}
              <span className="text-gradient-cyan-gold">map of the possible</span>
            </>
          }
          description="Deceptively simple. Within this single line lies the blueprint for human survival — the moment passive evolution is mathematically superseded by conscious administration."
        />

        {/* Equation display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative mt-14 overflow-hidden rounded-3xl border border-cyan-glow/15 glass-panel p-6 sm:p-10 lg:p-14"
        >
          {/* aurora sheen */}
          <div
            className="pointer-events-none absolute -inset-1 -z-10 opacity-60 blur-2xl animate-aurora"
            style={{
              background:
                "linear-gradient(120deg, oklch(0.78 0.15 200 / 0.25), transparent 35%, oklch(0.82 0.14 85 / 0.25) 70%, transparent)",
            }}
          />

          <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-10">
            {/* Left operand */}
            <OperandCard
              tone="dim"
              symbol={EQUATION.left.symbol}
              name={EQUATION.left.name}
              desc={EQUATION.left.desc}
              delay={0.1}
            />

            {/* comparator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="font-display text-5xl font-bold text-gold-glow text-glow-gold sm:text-6xl lg:text-7xl">
                &lt;
              </span>
              <span className="font-mono-proto text-[10px] uppercase tracking-[0.3em] text-stardust-dim">
                inferior to
              </span>
            </motion.div>

            {/* Right operand */}
            <OperandCard
              tone="glow"
              symbol={EQUATION.right.symbol}
              name={EQUATION.right.name}
              desc={EQUATION.right.desc}
              delay={0.5}
            />
          </div>

          {/* foot caption */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 text-center font-mono-proto text-xs uppercase tracking-[0.25em] text-stardust-dim"
          >
            <GlossaryTerm k="EvmDNA">EvmDNA</GlossaryTerm> &nbsp;is mathematically, philosophically,
            and existentially superseded by &nbsp;<GlossaryTerm k="Eskm1DAA">Eskm1DAA</GlossaryTerm>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-3 text-center text-[11px] text-stardust-dim/70"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="h-px w-4 bg-gradient-to-r from-transparent to-cyan-glow/40" />
              Tap any dotted term for its definition
              <span className="h-px w-4 bg-gradient-to-l from-transparent to-cyan-glow/40" />
            </span>
          </motion.p>
        </motion.div>

        {/* Three pillar chips */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              k: "Esk",
              t: "Economic investment",
              d: "Selective flows of capital seed the infrastructure of the administered future.",
            },
            {
              k: "m₁",
              t: "Newly purposed matter",
              d: "Matter redesigned from within its matrice — process, not substance.",
            },
            {
              k: "DAA",
              t: "Dynamic Active Administration",
              d: "Conscious, directed management of cosmic and biological processes.",
            },
          ].map((p, i) => (
            <motion.div
              key={p.k}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group flex items-start gap-4 rounded-2xl border border-cyan-glow/12 bg-cosmos-surface/40 p-5 backdrop-blur-sm transition-colors hover:border-cyan-glow/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-glow/25 bg-cosmos-deep/60 font-mono-proto text-sm font-semibold text-cyan-glow">
                <GlossaryTerm k={p.k as "Esk" | "m₁" | "DAA"}>{p.k}</GlossaryTerm>
              </div>
              <div className="space-y-1">
                <p className="font-display text-base font-semibold text-stardust">
                  {p.t}
                </p>
                <p className="text-sm leading-relaxed text-stardust-dim">{p.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OperandCard({
  tone,
  symbol,
  name,
  desc,
  delay,
}: {
  tone: "dim" | "glow";
  symbol: string;
  name: string;
  desc: string;
  delay: number;
}) {
  const isGlow = tone === "glow";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
      className={`relative flex w-full max-w-sm flex-col gap-3 rounded-2xl border p-6 backdrop-blur-sm lg:w-[22rem] ${
        isGlow
          ? "border-gold-glow/30 bg-gradient-to-br from-gold-glow/10 to-cyan-glow/5 glow-gold"
          : "border-cyan-glow/15 bg-cosmos-surface/40"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-6 items-center rounded-full px-3 font-mono-proto text-[10px] uppercase tracking-[0.25em] ${
            isGlow
              ? "bg-gold-glow/15 text-gold-glow"
              : "bg-cyan-glow/10 text-cyan-glow"
          }`}
        >
          {isGlow ? "New paradigm" : "Old paradigm"}
        </span>
        {isGlow ? (
          <ChevronRight className="h-4 w-4 text-gold-glow" />
        ) : null}
      </div>
      <p
        className={`font-mono-proto text-3xl font-semibold sm:text-4xl ${
          isGlow
            ? "text-gradient-gold"
            : "text-stardust/70"
        }`}
      >
        {symbol}
      </p>
      <p className="font-display text-sm font-semibold text-stardust">{name}</p>
      <p className="text-sm leading-relaxed text-stardust-dim">{desc}</p>
    </motion.div>
  );
}
