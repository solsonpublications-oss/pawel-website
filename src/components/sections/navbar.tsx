"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { BUY_URL, NAV_LINKS } from "@/lib/site-data";
import { ThemeToggle } from "@/components/cosmic/theme-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive("#" + visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-cyan-glow/10 bg-cosmos-deep/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#top"
          className="group flex items-center gap-3"
          aria-label="Algorithm of the Future — home"
        >
          <span className="relative flex h-9 w-9 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-cyan-glow/40 transition-transform duration-500 group-hover:rotate-45" />
            <span className="absolute inset-1 rounded-full border border-gold-glow/40" />
            <span className="relative h-2 w-2 rounded-full bg-cyan-glow text-glow-cyan" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm font-semibold tracking-[0.18em] text-stardust">
              ALGORITHM
            </span>
            <span className="font-mono-proto text-[9px] uppercase tracking-[0.4em] text-cyan-glow/80">
              of the Future
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-cyan-glow"
                      : "text-stardust-dim hover:text-stardust"
                  }`}
                >
                  {link.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-cyan-glow/10 ring-1 ring-cyan-glow/30"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy Algorithm of the Future on Amazon (opens in new tab)"
            className="group relative hidden overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold text-cosmos-deep transition-all duration-300 sm:inline-flex items-center gap-2"
            style={{
              background:
                "linear-gradient(100deg, oklch(0.78 0.15 200) 0%, oklch(0.82 0.14 85) 100%)",
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Buy on Amazon</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-glow/20 text-stardust transition-colors hover:bg-cyan-glow/10 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-cyan-glow/10 bg-cosmos-deep/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-stardust transition-colors hover:bg-cyan-glow/10 hover:text-cyan-glow"
                  >
                    <span>{link.label}</span>
                    <span className="font-mono-proto text-xs text-stardust-dim">
                      {link.href.replace("#", "→ ")}
                    </span>
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <a
                  href={BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buy Algorithm of the Future on Amazon (opens in new tab)"
                  className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-cosmos-deep"
                  style={{
                    background:
                      "linear-gradient(100deg, oklch(0.78 0.15 200) 0%, oklch(0.82 0.14 85) 100%)",
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Buy on Amazon
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
