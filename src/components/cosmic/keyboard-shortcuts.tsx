"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { KEYBOARD_SHORTCUTS, BUY_URL } from "@/lib/site-data";

/**
 * KeyboardShortcuts — a power-user help overlay.
 *
 * Global key bindings:
 *   ?        → toggle this help dialog
 *   B        → Buy on Amazon (new tab)
 *   1–6      → jump to the corresponding section
 *   T        → back to top
 *   L        → open "Look Inside" (dispatches a custom event the Hero listens for)
 *   Esc      → close the help dialog (handled by Radix Dialog)
 *
 * The section-jump + look-inside actions only fire when no input/textarea
 * is focused and no Radix dialog is already open.
 *
 * A small floating "?" hint button is rendered bottom-left on desktop
 * (hidden on mobile — touch users don't expect keyboard shortcuts).
 */
export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      // never intercept while typing in an input / textarea / contenteditable
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      // "?" toggles the help (Shift+/ on most layouts; also accept plain "?")
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      // skip section-jump shortcuts if a dialog is open (Radix sets aria-modal)
      const dialogOpen =
        document.querySelector('[role="dialog"][data-state="open"]') !== null;
      if (dialogOpen) return;

      if (key === "B") {
        e.preventDefault();
        window.open(BUY_URL, "_blank", "noopener,noreferrer");
        return;
      }
      if (key === "L") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("look-inside:open"));
        return;
      }
      if (key === "T") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 6) {
        const target = document.querySelectorAll("section[id]")[num - 1];
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <>
      {/* floating hint button — desktop only */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open keyboard shortcuts help"
        className="fixed bottom-4 left-4 z-40 hidden h-9 w-9 items-center justify-center rounded-full border border-cyan-glow/20 bg-cosmos-surface/50 text-stardust-dim backdrop-blur-sm transition-all duration-300 hover:border-cyan-glow/50 hover:bg-cyan-glow/10 hover:text-cyan-glow lg:inline-flex"
      >
        <Keyboard className="h-4 w-4" />
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-glow px-1 font-mono-proto text-[9px] font-bold text-cosmos-deep">
          ?
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="!gap-0 !rounded-2xl !border-cyan-glow/25 !bg-cosmos-deep/95 !p-0 backdrop-blur-xl sm:max-w-md"
        >
          <DialogTitle className="sr-only">
            Keyboard shortcuts
          </DialogTitle>
          <DialogDescription className="sr-only">
            Power-user keyboard shortcuts for navigating the site.
          </DialogDescription>

          {/* header */}
          <div className="flex items-center gap-3 border-b border-cyan-glow/10 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-glow/25 bg-cosmos-surface/50 text-cyan-glow">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-stardust">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-stardust-dim">
                Power-user navigation · press <Kbd>?</Kbd> anytime
              </p>
            </div>
          </div>

          {/* shortcut list */}
          <ul className="divide-y divide-cyan-glow/10">
            {KEYBOARD_SHORTCUTS.map((s) => (
              <li
                key={s.key}
                className="flex items-center justify-between gap-4 px-5 py-2.5"
              >
                <span className="text-sm text-stardust/85">{s.label}</span>
                <Kbd>{s.key}</Kbd>
              </li>
            ))}
          </ul>

          {/* footer */}
          <div className="border-t border-cyan-glow/10 px-5 py-3 text-center">
            <p className="font-mono-proto text-[10px] uppercase tracking-[0.2em] text-stardust-dim">
              Shortcuts disabled while typing
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-cyan-glow/30 bg-cosmos-surface/70 px-1.5 font-mono-proto text-xs font-semibold text-cyan-glow shadow-[0_2px_0_0_oklch(0.78_0.15_200/0.2)]">
      {children}
    </kbd>
  );
}
