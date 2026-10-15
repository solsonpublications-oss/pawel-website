"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Moon,
  Scale,
  HandHeart,
  Orbit,
  Sprout,
  Feather,
  Layers,
  Atom,
  Eye,
  Sparkles,
  Search,
  Infinity as InfinityIcon,
  ArrowUpRight,
  X,
  type LucideIcon,
} from "lucide-react";
import { KEY_CONCEPTS, GLOSSARY } from "@/lib/site-data";
import { SectionHeading } from "./section-heading";
import { useFineWidePointer } from "@/hooks/use-fine-pointer";
import { GlossaryTerm } from "@/components/cosmic/glossary-term";
import { ConceptDeepDive } from "./concept-deep-dive";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { RecentlyViewedRow } from "./recently-viewed-row";

const ICONS: Record<string, LucideIcon> = {
  Moon,
  Scale,
  HandHeart,
  Orbit,
  Sprout,
  Feather,
  Layers,
  Atom,
  Eye,
  Sparkles,
  Search,
  Infinity: InfinityIcon,
};

type Concept = (typeof KEY_CONCEPTS)[number];

function ConceptCard({
  c,
  index,
  tilt,
  onOpen,
}: {
  c: Concept;
  index: number;
  tilt: boolean;
  onOpen: () => void;
}) {
  const Icon = ICONS[c.icon] ?? Sparkles;
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [9, -9]), {
    stiffness: 180,
    damping: 16,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [-9, 9]), {
    stiffness: 180,
    damping: 16,
  });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      style={tilt ? { perspective: 900 } : undefined}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={tilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
      >
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Deep dive: ${c.title}`}
          className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-cyan-glow/12 bg-cosmos-surface/40 p-6 text-left backdrop-blur-sm transition-colors duration-300 hover:border-cyan-glow/30 hover:bg-cosmos-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
        >
          {/* hover glow */}
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle, oklch(0.78 0.15 200 / 0.4), transparent 70%)",
            }}
          />
          {/* index number — brightens + glows on hover */}
          <span className="pointer-events-none absolute right-4 top-3 font-mono-proto text-2xl font-bold text-stardust-dim opacity-25 transition-all duration-500 group-hover:opacity-100 group-hover:text-gold-glow">
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* halo behind the index number */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-1 top-1 h-12 w-12 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle, oklch(0.82 0.14 85 / 0.55), transparent 70%)",
            }}
          />

          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-glow/25 bg-cosmos-deep/60 text-cyan-glow transition-colors duration-300 group-hover:border-gold-glow/40 group-hover:text-gold-glow">
            <Icon className="h-5 w-5" />
            <span className="absolute inset-0 -z-10 rounded-xl bg-cyan-glow/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
          </div>

          <h3 className="mt-4 font-display text-lg font-semibold text-stardust">
            {c.title in GLOSSARY ? (
              <GlossaryTerm k={c.title as keyof typeof GLOSSARY}>{c.title}</GlossaryTerm>
            ) : (
              c.title
            )}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-stardust-dim">
            {c.desc}
          </p>

          {/* "Deep dive" affordance — appears on hover, keyboard-focusable via the button */}
          <span className="mt-4 inline-flex items-center gap-1.5 font-mono-proto text-[10px] uppercase tracking-[0.2em] text-cyan-glow/0 transition-colors duration-300 group-hover:text-cyan-glow">
            Deep dive
            <ArrowUpRight className="h-3 w-3" />
          </span>

          {/* bottom hairline that lights up */}
          <span className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan-glow/60 to-gold-glow/60 transition-transform duration-500 group-hover:scale-x-100" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export function KeyConcepts() {
  const tilt = useFineWidePointer();
  const [active, setActive] = useState<Concept | null>(null);
  const [query, setQuery] = useState("");
  const { list: recent, track, clear } = useRecentlyViewed();

  const openConcept = (c: Concept) => {
    setActive(c);
    track({ id: `concept:${c.title}`, title: c.title, icon: c.icon });
  };

  const pickRecent = (title: string) => {
    const c = KEY_CONCEPTS.find((k) => k.title === title);
    if (c) openConcept(c);
  };

  // Filter concepts by search query (title + desc + appearsIn, case-insensitive)
  const q = query.trim().toLowerCase();
  const filtered = q
    ? KEY_CONCEPTS.filter((c) =>
        [c.title, c.desc, c.appearsIn].some((field) =>
          field.toLowerCase().includes(q),
        ),
      )
    : KEY_CONCEPTS;

  return (
    <section id="concepts" className="relative section-pad px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The Vocabulary of the Algorithm"
          description="From the first moonbot touching the lunar dust to the end of entropy — the conceptual scaffolding that turns a manifesto into an operating system. Tap any concept for a deep dive."
        />

        {/* Recently viewed concepts row */}
        <div className="mt-10">
          <RecentlyViewedRow list={recent} onPick={pickRecent} onClear={clear} />
        </div>

        {/* Search / filter */}
        <div className="mt-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stardust-dim" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts…"
              aria-label="Filter concepts by keyword"
              className="w-full rounded-full border border-cyan-glow/20 bg-cosmos-surface/40 py-2 pl-10 pr-9 text-sm text-stardust placeholder:text-stardust-dim/60 backdrop-blur-sm transition-colors focus:border-cyan-glow/50 focus:outline-none focus:ring-2 focus:ring-cyan-glow/30"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-stardust-dim transition-colors hover:bg-cyan-glow/10 hover:text-cyan-glow"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
          <span className="font-mono-proto text-[10px] uppercase tracking-[0.2em] text-stardust-dim">
            {filtered.length} / {KEY_CONCEPTS.length}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <ConceptCard
              key={c.title}
              c={c}
              index={KEY_CONCEPTS.indexOf(c)}
              tilt={tilt}
              onOpen={() => openConcept(c)}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-display text-lg text-stardust-dim">
              No concepts match &ldquo;{query}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-cyan-glow/25 bg-cyan-glow/5 px-4 py-2 text-sm font-medium text-cyan-glow transition-colors hover:bg-cyan-glow/10"
            >
              <X className="h-4 w-4" />
              Clear search
            </button>
          </div>
        ) : null}
      </div>

      <ConceptDeepDive
        concept={active}
        open={active !== null}
        onOpenChange={(v) => {
          if (!v) setActive(null);
        }}
        onConceptChange={(c) => openConcept(c)}
        currentIndex={active ? KEY_CONCEPTS.findIndex((c) => c.title === active.title) : 0}
        onNext={() => {
          if (!active) return;
          const i = KEY_CONCEPTS.findIndex((c) => c.title === active.title);
          const nextI = (i + 1) % KEY_CONCEPTS.length;
          openConcept(KEY_CONCEPTS[nextI]);
        }}
      />
    </section>
  );
}
