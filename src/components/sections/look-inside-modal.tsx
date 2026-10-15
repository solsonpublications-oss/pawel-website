"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ExternalLink, BookMarked, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BUY_URL, PARTS, PREFACE_EXCERPT } from "@/lib/site-data";

type Tab = "toc" | "preview";

/**
 * LookInsideModal — a premium "Look Inside the Book" dialog with two tabs:
 *  - Table of Contents (5 parts / 22 chapters)
 *  - First Page (a verbatim excerpt from the Preface so visitors can read a sample)
 *
 * Reuses the existing /public/images/book-cover-back.jpg asset on the left
 * (desktop only). Controlled component — parent owns the open state.
 */
export function LookInsideModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [tab, setTab] = useState<Tab>("toc");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="!block !gap-0 !rounded-2xl !border-cyan-glow/25 !bg-cosmos-deep/95 !p-0 backdrop-blur-xl sm:max-w-3xl"
      >
        <DialogTitle className="sr-only">
          Look Inside — Algorithm of the Future
        </DialogTitle>
        <DialogDescription className="sr-only">
          Book back cover, full table of contents, and a first-page excerpt from the Preface.
        </DialogDescription>

        <div className="grid max-h-[88vh] overflow-hidden md:grid-cols-[0.78fr_1.22fr]">
          {/* Back cover image (desktop only) */}
          <div className="relative hidden border-r border-cyan-glow/10 md:block">
            <img
              src="/images/book-cover-back.jpg"
              alt="Back cover of Algorithm of the Future by Pawel Kozycz"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cosmos-deep/70 via-transparent to-transparent" />
            {/* glowing edge */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-glow/40 to-transparent" />
          </div>

          {/* Right panel: tabs + content */}
          <div className="flex flex-col">
            {/* header */}
            <div className="border-b border-cyan-glow/10 px-6 py-4 pr-12">
              <div className="flex items-center gap-2">
                <BookMarked className="h-4 w-4 text-gold-glow" />
                <span className="font-mono-proto text-[10px] uppercase tracking-[0.3em] text-cyan-glow">
                  Look Inside
                </span>
              </div>
              <h2 className="mt-1 font-display text-xl font-bold text-stardust">
                Algorithm of the Future
              </h2>
              <p className="mt-1 text-xs text-stardust-dim">
                22 chapters · 5 parts · 246 pages · Expanded Edition
              </p>
            </div>

            {/* tab switcher */}
            <div className="flex gap-1 border-b border-cyan-glow/10 px-4 pt-2">
              <TabButton
                active={tab === "toc"}
                onClick={() => setTab("toc")}
                icon={<BookMarked className="h-3.5 w-3.5" />}
                label="Contents"
              />
              <TabButton
                active={tab === "preview"}
                onClick={() => setTab("preview")}
                icon={<FileText className="h-3.5 w-3.5" />}
                label="First Page"
              />
            </div>

            {/* scrollable content area */}
            <div className="cosmic-scroll max-h-[48vh] flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {tab === "toc" ? (
                  <motion.div
                    key="toc"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 py-4"
                  >
                    {PARTS.map((part, i) => {
                      const startNum = PARTS.slice(0, i).reduce(
                        (n, p) => n + p.chapters.length,
                        0,
                      );
                      return (
                        <div key={part.part} className="mb-5 last:mb-0">
                          <div className="mb-2 flex items-baseline gap-2">
                            <span className="font-display text-sm font-bold text-gold-glow">
                              {part.part}
                            </span>
                            <span className="text-xs text-stardust-dim">
                              · {part.title}
                            </span>
                          </div>
                          <ol className="ml-4 space-y-1">
                            {part.chapters.map((ch, j) => {
                              const num = startNum + j + 1;
                              return (
                                <li
                                  key={ch}
                                  className="flex gap-2.5 text-xs leading-relaxed text-stardust/75 transition-colors hover:text-stardust"
                                >
                                  <span className="w-5 shrink-0 font-mono-proto text-cyan-glow/60">
                                    {String(num).padStart(2, "0")}
                                  </span>
                                  <span>{ch}</span>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 py-4"
                  >
                    <div className="mb-4 flex items-center gap-2 border-b border-cyan-glow/10 pb-3">
                      <FileText className="h-4 w-4 text-cyan-glow" />
                      <span className="font-mono-proto text-[10px] uppercase tracking-[0.25em] text-cyan-glow">
                        Preface · Why This Book Exists
                      </span>
                    </div>
                    <div className="space-y-3">
                      {PREFACE_EXCERPT.map((para, i) => (
                        <p
                          key={i}
                          className={`text-sm leading-relaxed ${
                            i === PREFACE_EXCERPT.length - 1
                              ? "font-display text-base italic text-gold-glow"
                              : "text-stardust/80"
                          }`}
                        >
                          {i === 0 ? (
                            <>
                              <span className="float-left mr-2 font-display text-4xl font-bold leading-none text-gradient-cyan-gold">
                                {para.charAt(0)}
                              </span>
                              {para.slice(1)}
                            </>
                          ) : (
                            para
                          )}
                        </p>
                      ))}
                    </div>
                    <div className="mt-5 rounded-lg border border-cyan-glow/10 bg-cosmos-surface/30 p-3 text-center">
                      <p className="font-mono-proto text-[10px] uppercase tracking-[0.2em] text-stardust-dim">
                        — Continue reading in the book · 246 pages
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* footer CTA */}
            <div className="border-t border-cyan-glow/10 px-6 py-3">
              <a
                href={BUY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-cosmos-deep transition-transform hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(100deg, oklch(0.78 0.15 200) 0%, oklch(0.82 0.14 85) 100%)",
                }}
              >
                <ShoppingBag className="h-4 w-4" />
                Buy on Amazon
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
        active
          ? "text-cyan-glow"
          : "text-stardust-dim hover:text-stardust"
      }`}
    >
      {icon}
      {label}
      {active ? (
        <motion.span
          layoutId="lookinside-tab"
          className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-cyan-glow to-gold-glow"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      ) : null}
    </button>
  );
}
