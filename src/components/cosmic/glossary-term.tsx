"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { GLOSSARY } from "@/lib/site-data";

/**
 * GlossaryTerm — renders an inline term with a hover/focus/tap tooltip
 * showing its definition from the book's glossary. Used in the equation,
 * concepts, and synopsis copy to make dense terminology approachable.
 *
 * On desktop: hover/focus reveals a Radix tooltip.
 * On touch: tap reveals the same tooltip (Radix supports long-press / click).
 *
 * The term is visually marked with a dotted underline + a tiny help glyph
 * so users know it's interactive.
 */
export function GlossaryTerm({
  k,
  children,
}: {
  k: keyof typeof GLOSSARY;
  children?: React.ReactNode;
}) {
  const entry = GLOSSARY[k];
  if (!entry) return <>{children ?? k}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-baseline gap-0.5 align-baseline font-mono-proto text-cyan-glow outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60 rounded-sm"
          style={{ textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: "3px", textDecorationColor: "oklch(0.78 0.15 200 / 0.4)" }}
          aria-label={`Definition of ${entry.term}`}
        >
          <span>{children ?? entry.term}</span>
          <HelpCircle
            className="h-3 w-3 -translate-y-px opacity-50 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </button>
      </TooltipTrigger>
      <TooltipContent
        sideOffset={6}
        className="!max-w-xs !rounded-xl !border-cyan-glow/30 !bg-cosmos-deep/95 !px-4 !py-3 !text-xs !leading-relaxed !text-stardust backdrop-blur-xl"
      >
        <span className="mb-1 block font-mono-proto text-[10px] uppercase tracking-[0.2em] text-gold-glow">
          {entry.term}
        </span>
        <span className="text-stardust/85">{entry.def}</span>
      </TooltipContent>
    </Tooltip>
  );
}
