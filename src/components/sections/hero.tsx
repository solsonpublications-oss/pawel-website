"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ShoppingBag, BookOpen, ArrowDown, Eye, Star } from "lucide-react";
import { BUY_URL, HERO_STATS } from "@/lib/site-data";
import { useFineWidePointer } from "@/hooks/use-fine-pointer";
import { CountUp } from "@/components/cosmic/count-up";
import { LookInsideModal } from "@/components/sections/look-inside-modal";

const SUBTITLE =
  "Algorithm for Acquiring Properties of Matter and Life Processes — a bold neo-evolutionary manifesto by Pawel Kozycz.";

/** Lightweight typewriter — reveals the subtitle char-by-char on mount. */
function Typewriter({ text, ms = 22 }: { text: string; ms?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, ms);
    return () => clearInterval(id);
  }, [text, ms]);
  const done = n >= text.length;
  const head = text.slice(0, n);
  return (
    <span aria-label={text}>
      {head}
      <span
        aria-hidden="true"
        className={`ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[1px] bg-cyan-glow align-middle ${
          done ? "caret-blink" : ""
        }`}
      />
    </span>
  );
}

export function Hero() {
  // Parallax tilt (desktop only — fine pointer + >=1024px)
  const px = useMotionValue(0); // -0.5..0.5
  const py = useMotionValue(0);
  const tiltEnabled = useFineWidePointer();
  const [lookInsideOpen, setLookInsideOpen] = useState(false);

  // Listen for the global "look-inside:open" event (fired by the "L" keyboard shortcut)
  useEffect(() => {
    const onOpen = () => setLookInsideOpen(true);
    window.addEventListener("look-inside:open", onOpen);
    return () => window.removeEventListener("look-inside:open", onOpen);
  }, []);

  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-16 sm:px-6 lg:px-8"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* === Left: copy === */}
        <div className="flex flex-col items-start gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 rounded-full border border-cyan-glow/25 bg-cyan-glow/5 px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-glow/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-glow" />
            </span>
            <span className="font-mono-proto text-[11px] uppercase tracking-[0.3em] text-stardust-dim">
              Solson Publications · 2026
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="space-y-2"
          >
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-stardust sm:text-6xl lg:text-7xl">
              <span className="block text-gradient-cyan-gold">
                Algorithm
              </span>
              <span className="block">of the Future</span>
            </h1>
            <p className="font-sans text-sm leading-relaxed text-stardust-dim sm:text-base lg:text-lg max-w-xl">
              <Typewriter text={SUBTITLE} ms={20} />
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="max-w-xl text-base leading-relaxed text-stardust/85 sm:text-lg"
          >
            Humanity is no longer destined to passively observe the universe. The
            central equation redraws the map of the possible:{" "}
            <span className="font-mono-proto text-cyan-glow text-glow-cyan">
              EvmDNA &lt; Eskm1DAA
            </span>
            . From smartphone-controlled moonbots to the total administration of
            life and the cosmos.
          </motion.p>

          {/* social proof microcopy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-3.5 w-3.5 fill-gold-glow/80 text-gold-glow" />
              ))}
            </div>
            <span className="font-mono-proto text-[10px] uppercase tracking-[0.2em] text-stardust-dim">
              A Solson Publications manifesto · 2026
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy Algorithm of the Future on Amazon (opens in new tab)"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold text-cosmos-deep transition-transform duration-300 hover:scale-[1.03] sm:text-base"
              style={{
                background:
                  "linear-gradient(100deg, oklch(0.78 0.15 200) 0%, oklch(0.82 0.14 85) 100%)",
                boxShadow:
                  "0 0 0 1px oklch(0.82 0.14 85 / 0.4), 0 18px 40px -16px oklch(0.78 0.15 200 / 0.7)",
              }}
            >
              <ShoppingBag className="h-5 w-5" />
              Buy on Amazon
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
            <button
              type="button"
              onClick={() => setLookInsideOpen(true)}
              aria-label="Look inside the book — view table of contents"
              className="inline-flex items-center gap-2 rounded-full border border-gold-glow/30 bg-gold-glow/5 px-6 py-3.5 text-sm font-semibold text-stardust backdrop-blur-sm transition-colors duration-300 hover:bg-gold-glow/10 hover:text-gold-glow sm:text-base"
            >
              <Eye className="h-5 w-5" />
              Look Inside
            </button>
            <a
              href="#equation"
              aria-label="Explore the book — scroll to the equation"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-glow/30 bg-cyan-glow/5 px-6 py-3.5 text-sm font-semibold text-stardust backdrop-blur-sm transition-colors duration-300 hover:bg-cyan-glow/10 hover:text-cyan-glow sm:text-base"
            >
              <BookOpen className="h-5 w-5" />
              Explore
            </a>
          </motion.div>

          {/* Stats */}
          <motion.dl
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-2 grid w-full max-w-xl grid-cols-4 gap-2 sm:gap-4"
          >
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-cyan-glow/10 bg-cosmos-surface/40 px-3 py-3 text-center backdrop-blur-sm transition-colors hover:border-cyan-glow/25"
              >
                <dt className="font-display text-xl font-bold text-gradient-cyan-gold sm:text-2xl">
                  <CountUp value={s.value} />
                </dt>
                <dd className="font-mono-proto text-[9px] uppercase tracking-[0.2em] text-stardust-dim sm:text-[10px]">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* === Right: book cover with orbital rings + parallax tilt === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative mx-auto flex aspect-[3/4] w-full max-w-md items-center justify-center"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={tiltEnabled ? { perspective: 1000 } : undefined}
        >
          {/* outer orbital ring */}
          <div className="pointer-events-none absolute inset-[-8%] rounded-full border border-cyan-glow/15 animate-spin-slower" />
          <div className="pointer-events-none absolute inset-[-2%] rounded-full border border-gold-glow/10 animate-spin-reverse-slow" />
          {/* dotted ring */}
          <div
            className="pointer-events-none absolute inset-[-14%] rounded-full border border-dashed border-cyan-glow/10 animate-spin-slow"
            style={{ maskImage: "radial-gradient(circle, #000 60%, transparent 70%)", WebkitMaskImage: "radial-gradient(circle, #000 60%, transparent 70%)" }}
          />

          {/* glow behind book */}
          <div
            className="absolute inset-[12%] rounded-full opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, oklch(0.78 0.15 200 / 0.55), oklch(0.82 0.14 85 / 0.35) 50%, transparent 72%)",
            }}
          />

          {/* Book cover — tilts on mouse move (desktop only); click opens Look Inside */}
          <motion.button
            type="button"
            onClick={() => setLookInsideOpen(true)}
            aria-label="Look inside the book — open table of contents"
            className="group relative w-[78%] animate-float cursor-pointer [animation-delay:-1.5s]"
            style={
              tiltEnabled
                ? { rotateX, rotateY, transformStyle: "preserve-3d" }
                : undefined
            }
          >
            <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-cyan-glow/20 via-transparent to-gold-glow/20 opacity-70 blur-md transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-2xl">
              <img
                src="/images/book-cover.jpg"
                alt="Algorithm of the Future by Pawel Kozycz — book cover"
                className="h-full w-full object-cover"
                loading="eager"
              />
              {/* sheen */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-60" />
              {/* hover hint */}
              <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-glow/40 bg-cosmos-deep/70 px-3 py-1.5 text-[11px] font-medium text-cyan-glow backdrop-blur-md">
                  <Eye className="h-3.5 w-3.5" />
                  Look Inside
                </span>
              </div>
            </div>
          </motion.button>

          {/* Floating math glyph */}
          <motion.div
            initial={{ opacity: 0, x: -20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute left-0 top-6 hidden rounded-xl border border-cyan-glow/20 bg-cosmos-surface/70 px-3 py-2 backdrop-blur-md sm:block"
          >
            <span className="font-mono-proto text-xs text-cyan-glow">
              m → m₁
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute bottom-10 right-0 hidden rounded-xl border border-gold-glow/20 bg-cosmos-surface/70 px-3 py-2 backdrop-blur-md sm:block"
          >
            <span className="font-mono-proto text-xs text-gold-glow">
              DAA &gt; DNA
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#equation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stardust-dim transition-colors hover:text-cyan-glow"
        aria-label="Scroll to explore"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono-proto text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </motion.a>

      {/* Look Inside modal */}
      <LookInsideModal open={lookInsideOpen} onOpenChange={setLookInsideOpen} />
    </section>
  );
}
