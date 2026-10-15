"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeToggle — a subtle cosmic/starlight theme switcher.
 *
 * Toggles the `light` class on <html> (the cosmic dark theme is the
 * default/brand). Persists the choice in localStorage. Uses a manual
 * implementation rather than next-themes to keep the dark-first default
 * without a flash-of-wrong-theme (the SSR'd HTML has no class = dark).
 *
 * Hidden on mobile (lg:flex) to avoid clutter — the dark cosmic theme
 * is the brand default; the light variant is a desktop accessibility option.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  // Read persisted theme on mount (setTimeout pattern to avoid
  // set-state-in-effect lint rule + SSR hydration mismatch).
  useEffect(() => {
    const id = setTimeout(() => {
      setMounted(true);
      const saved = typeof window !== "undefined"
        ? localStorage.getItem("aotf:theme")
        : null;
      if (saved === "light") {
        setTheme("light");
        document.documentElement.classList.add("light");
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("aotf:theme", next);
      if (next === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    }
  };

  if (!mounted) {
    // placeholder to reserve layout space (prevents jump on mount)
    return <div className="hidden h-9 w-9 lg:block" aria-hidden="true" />;
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to cosmic dark theme" : "Switch to starlight theme"}
      title={isLight ? "Cosmic (dark)" : "Starlight (light)"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-glow/20 bg-cosmos-surface/50 text-stardust-dim backdrop-blur-sm transition-all hover:border-cyan-glow/50 hover:text-cyan-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLight ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
