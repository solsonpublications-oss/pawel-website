"use client";

import { Globe, Mail, BookOpen, ArrowUp } from "lucide-react";
import {
  BUY_URL,
  BLOG_URL,
  PUBLISHER,
  PUBLICATION_YEAR,
  NAV_LINKS,
} from "@/lib/site-data";
import { NewsletterSignup } from "./newsletter-signup";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-cyan-glow/15 bg-cosmos-deep/80 backdrop-blur-sm">
      {/* Animated transmission scan line along the top border */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden"
      >
        <span
          className="animate-transmission absolute left-0 top-0 h-px w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.78 0.15 200) 30%, oklch(0.96 0.08 85) 50%, oklch(0.82 0.14 85) 70%, transparent)",
            boxShadow:
              "0 0 8px oklch(0.78 0.15 200 / 0.85), 0 0 18px oklch(0.82 0.14 85 / 0.6)",
          }}
        />
      </span>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Brand block */}
          <div className="space-y-4">
            <a href="#top" className="group flex items-center gap-3" aria-label="Back to top">
              <span className="relative flex h-9 w-9 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-cyan-glow/40 transition-transform duration-500 group-hover:rotate-45" />
                <span className="absolute inset-1 rounded-full border border-gold-glow/40" />
                <span className="relative h-2 w-2 rounded-full bg-cyan-glow" />
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
            <p className="max-w-sm text-sm leading-relaxed text-stardust-dim">
              Algorithm for Acquiring Properties of Matter and Life Processes.
              A neo-evolutionary manifesto by Pawel Kozycz.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={BUY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan-glow/25 bg-cyan-glow/5 px-3 py-1.5 text-xs font-medium text-cyan-glow transition-colors hover:bg-cyan-glow/10"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Amazon
              </a>
              <a
                href={BLOG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold-glow/25 bg-gold-glow/5 px-3 py-1.5 text-xs font-medium text-gold-glow transition-colors hover:bg-gold-glow/10"
              >
                <Globe className="h-3.5 w-3.5" />
                MoonNow Blog
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div className="space-y-4">
            <h4 className="font-mono-proto text-[10px] uppercase tracking-[0.3em] text-stardust-dim">
              Navigate
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-stardust-dim transition-colors hover:text-cyan-glow"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Publisher */}
          <div className="space-y-4">
            <h4 className="font-mono-proto text-[10px] uppercase tracking-[0.3em] text-stardust-dim">
              Imprint
            </h4>
            <ul className="space-y-2 text-sm text-stardust-dim">
              <li>
                <span className="text-stardust-dim/70">Author: </span>
                <span className="text-stardust">Pawel Kozycz</span>
              </li>
              <li>
                <span className="text-stardust-dim/70">Publisher: </span>
                <span className="text-stardust">{PUBLISHER}</span>
              </li>
              <li>
                <span className="text-stardust-dim/70">Year: </span>
                <span className="text-stardust">{PUBLICATION_YEAR}</span>
              </li>
              <li>
                <span className="text-stardust-dim/70">Edition: </span>
                <span className="text-stardust">Expanded</span>
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="md:col-span-2 lg:col-span-1">
            <NewsletterSignup />
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cyan-glow/10 pt-6 sm:flex-row">
          <p className="text-center text-xs text-stardust-dim sm:text-left">
            © {PUBLICATION_YEAR} Pawel Kozycz. All rights reserved. Published by{" "}
            {PUBLISHER}. Join the administration — the cosmos is waiting.
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/20 px-3 py-1.5 text-xs font-medium text-stardust-dim transition-colors hover:border-cyan-glow/40 hover:text-cyan-glow"
          >
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
