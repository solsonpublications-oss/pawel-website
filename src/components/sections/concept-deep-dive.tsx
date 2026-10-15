"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ExternalLink, BookMarked, ArrowRight, Link2, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BUY_URL, KEY_CONCEPTS, RELATED_CONCEPTS, chapterNumToPartIndex, parseChapterNum } from "@/lib/site-data";
import { BookmarkButton } from "@/components/cosmic/bookmark-button";
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
  type LucideIcon,
} from "lucide-react";

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

/** Look up a concept by title (for related-concept navigation). */
function findConcept(title: string): Concept | undefined {
  return KEY_CONCEPTS.find((c) => c.title === title);
}

/**
 * ConceptDeepDive — a premium Dialog that opens when a Key Concept card is
 * clicked. Shows the concept's icon, title, a one-line "appears in" chapter
 * reference, the short description, a longer "detail" paragraph, and a row
 * of clickable "Related concepts" chips that swap the modal content.
 * Footer has a "Read more in the book" Amazon CTA + a "Jump to chapters" link.
 *
 * Controlled by the parent (KeyConcepts) which passes the selected concept
 * + open state. The parent's onConceptChange callback lets related-concept
 * clicks propagate up so the parent stays in sync.
 */
export function ConceptDeepDive({
  concept,
  open,
  onOpenChange,
  onConceptChange,
  onNext,
  currentIndex = 0,
}: {
  concept: Concept | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConceptChange?: (c: Concept) => void;
  onNext?: () => void;
  currentIndex?: number;
}) {
  const Icon = concept ? (ICONS[concept.icon] ?? Sparkles) : Sparkles;
  const related = concept ? RELATED_CONCEPTS[concept.title] ?? [] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="!block !gap-0 !rounded-2xl !border-cyan-glow/25 !bg-cosmos-deep/95 !p-0 backdrop-blur-xl sm:max-w-lg"
      >
        <DialogTitle className="sr-only">
          {concept ? concept.title : "Concept"} — deep dive
        </DialogTitle>
        <DialogDescription className="sr-only">
          An expanded explanation of {concept?.title ?? "this concept"}, where it appears in the book, and related concepts.
        </DialogDescription>

        <AnimatePresence mode="wait">
          {concept ? (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-hidden"
            >
              {/* glow header background */}
              <div
                className="pointer-events-none absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.78 0.15 200 / 0.4), transparent 70%)",
                }}
              />

              {/* header */}
              <div className="relative px-6 pb-4 pt-6">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-glow/25 bg-cosmos-deep/60 text-gold-glow">
                    <Icon className="h-5 w-5" />
                    <span className="absolute inset-0 -z-10 rounded-xl bg-gold-glow/15 blur-md" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-proto text-[10px] uppercase tracking-[0.3em] text-cyan-glow">
                        Key Concept
                      </span>
                    </div>
                    <h2 className="mt-0.5 font-display text-2xl font-bold text-stardust">
                      {concept.title}
                    </h2>
                  </div>
                  {/* bookmark button */}
                  <BookmarkButton
                    id={`concept:${concept.title}`}
                    type="concept"
                    title={concept.title}
                    source={concept.appearsIn}
                  />
                </div>

                {/* "appears in" chip — clickable to deep-link to chapters */}
                <button
                  type="button"
                  onClick={() => {
                    if (concept) {
                      const chNum = parseChapterNum(concept.appearsIn);
                      if (chNum !== null) {
                        const partIndex = chapterNumToPartIndex(chNum);
                        onOpenChange(false);
                        // small delay so the modal closes before scrolling
                        setTimeout(() => {
                          window.dispatchEvent(
                            new CustomEvent("chapters:select-part", {
                              detail: { partIndex },
                            }),
                          );
                          document
                            .getElementById("chapters")
                            ?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 150);
                      }
                    }
                  }}
                  className="group mt-4 inline-flex items-center gap-1.5 rounded-full border border-gold-glow/25 bg-gold-glow/5 px-3 py-1 transition-all hover:border-gold-glow/50 hover:bg-gold-glow/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
                  aria-label={`Jump to ${concept?.appearsIn ?? "chapter"} in the Chapters section`}
                >
                  <BookMarked className="h-3 w-3 text-gold-glow" />
                  <span className="font-mono-proto text-[10px] uppercase tracking-[0.2em] text-gold-glow group-hover:text-gold-glow">
                    {concept.appearsIn}
                  </span>
                  <ArrowRight className="h-3 w-3 text-gold-glow/50 transition-all group-hover:translate-x-0.5 group-hover:text-gold-glow" />
                </button>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-cyan-glow/20 via-transparent to-transparent" />

              {/* body */}
              <div className="cosmic-scroll max-h-[46vh] overflow-y-auto px-6 py-5">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm font-medium leading-relaxed text-stardust"
                >
                  {concept.desc}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                  className="mt-4 text-sm leading-relaxed text-stardust-dim"
                >
                  {concept.detail}
                </motion.p>

                {/* Related concepts */}
                {related.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.16 }}
                    className="mt-5 border-t border-cyan-glow/10 pt-4"
                  >
                    <div className="mb-2 flex items-center gap-1.5">
                      <Link2 className="h-3 w-3 text-cyan-glow" />
                      <span className="font-mono-proto text-[10px] uppercase tracking-[0.25em] text-cyan-glow">
                        Related concepts
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {related.map((title) => {
                        const relConcept = findConcept(title);
                        const RelIcon = relConcept
                          ? (ICONS[relConcept.icon] ?? Sparkles)
                          : Sparkles;
                        return (
                          <button
                            key={title}
                            type="button"
                            onClick={() => {
                              if (relConcept) {
                                onConceptChange?.(relConcept);
                              }
                            }}
                            disabled={!relConcept}
                            className="group inline-flex items-center gap-1.5 rounded-full border border-cyan-glow/20 bg-cosmos-surface/50 px-3 py-1.5 text-xs font-medium text-stardust-dim backdrop-blur-sm transition-all hover:border-cyan-glow/50 hover:bg-cyan-glow/10 hover:text-cyan-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60 disabled:opacity-40"
                          >
                            <RelIcon className="h-3 w-3" />
                            {title}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}

                {/* Next concept navigation */}
                {onNext ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-4 flex items-center justify-between border-t border-cyan-glow/10 pt-4"
                  >
                    <span className="font-mono-proto text-[10px] uppercase tracking-[0.2em] text-stardust-dim">
                      {String(currentIndex + 1).padStart(2, "0")} / {String(KEY_CONCEPTS.length).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={onNext}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-cyan-glow/25 bg-cyan-glow/5 px-4 py-1.5 text-xs font-semibold text-stardust transition-all hover:border-cyan-glow/50 hover:bg-cyan-glow/10 hover:text-cyan-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
                    >
                      Next concept
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </motion.div>
                ) : null}
              </div>

              {/* footer */}
              <div className="flex flex-col gap-2 border-t border-cyan-glow/10 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href="#chapters"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-cyan-glow/25 bg-cyan-glow/5 px-4 py-2 text-xs font-semibold text-stardust transition-colors hover:bg-cyan-glow/10 hover:text-cyan-glow"
                >
                  Jump to chapters
                  <ArrowRight className="h-3 w-3" />
                </a>
                <a
                  href={BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-semibold text-cosmos-deep transition-transform hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(100deg, oklch(0.78 0.15 200) 0%, oklch(0.82 0.14 85) 100%)",
                  }}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Read more in the book
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
