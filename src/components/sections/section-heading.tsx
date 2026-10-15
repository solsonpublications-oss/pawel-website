"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  return (
    <div
      className={`flex flex-col gap-4 ${isCenter ? "items-center text-center" : "items-start text-left"} max-w-3xl ${isCenter ? "mx-auto" : ""}`}
    >
      {eyebrow ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-glow/70" />
          <span className="font-mono-proto text-[11px] uppercase tracking-[0.35em] text-cyan-glow/90">
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-glow/70" />
        </motion.div>
      ) : null}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-display text-3xl font-semibold leading-tight tracking-tight text-stardust sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="max-w-2xl text-base leading-relaxed text-stardust-dim sm:text-lg"
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}

export function Divider() {
  return (
    <div className="mx-auto flex w-full max-w-xs items-center gap-3">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-glow/40" />
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-glow/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-glow" />
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-glow/40" />
    </div>
  );
}

/**
 * Richer constellation divider: a horizontal line of small star-dots that
 * sequentially light up as the divider scrolls into view. Center pulse +
 * tapered gradients on each side give the line depth. Use between major
 * sections to add cosmic rhythm.
 */
export function ConstellationDivider({
  dots = 11,
  className = "",
  tone = "cyan",
}: {
  dots?: number;
  className?: string;
  tone?: "cyan" | "gold";
}) {
  const dotArray = Array.from({ length: dots });
  const accent = tone === "gold" ? "oklch(0.82 0.14 85)" : "oklch(0.78 0.15 200)";
  const accentDim = tone === "gold" ? "0.82 0.14 85" : "0.78 0.15 200";

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className={`mx-auto flex w-full max-w-2xl items-center justify-center gap-1.5 ${className}`}
    >
      {/* left taper */}
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(to right, transparent, oklch(${accentDim} / 0.45))`,
        }}
      />
      {/* dot constellation */}
      {dotArray.map((_, i) => {
        const isCenter = i === Math.floor(dots / 2);
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0.12, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: isCenter ? 1.35 : 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.4,
              delay: i * 0.05,
              ease: "easeOut",
            }}
            className="relative rounded-full"
            style={{
              width: isCenter ? 7 : 4,
              height: isCenter ? 7 : 4,
              background: accent,
              boxShadow: isCenter
                ? `0 0 10px ${accent}, 0 0 22px oklch(${accentDim} / 0.55)`
                : `0 0 6px oklch(${accentDim} / 0.55)`,
            }}
          >
            {isCenter ? (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: accent }}
                animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.4, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : null}
          </motion.span>
        );
      })}
      {/* right taper */}
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(to left, transparent, oklch(${accentDim} / 0.45))`,
        }}
      />
    </motion.div>
  );
}
