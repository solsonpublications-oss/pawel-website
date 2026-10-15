"use client";

import { CosmicBackground } from "@/components/cosmic/cosmic-background";
import { CosmicProgressBar } from "@/components/cosmic/cosmic-progress-bar";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { BookSpecsStrip } from "@/components/sections/book-specs-strip";
import { CoreEquation } from "@/components/sections/core-equation";
import { QuoteOfTheVisit } from "@/components/sections/quote-of-the-visit";
import { Chapters } from "@/components/sections/chapters";
import { AuthorBio } from "@/components/sections/author-bio";
import { Praise } from "@/components/sections/praise";
import { FinalCTA } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { StickyBuyButton } from "@/components/sections/sticky-buy-button";
import { KeyboardShortcuts } from "@/components/cosmic/keyboard-shortcuts";
import { SectionProgressIndicator } from "@/components/cosmic/section-progress-indicator";
import { BookmarksPanel } from "@/components/cosmic/bookmarks-panel";
import { ConstellationDivider } from "@/components/sections/section-heading";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <CosmicBackground />
      <CosmicProgressBar />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div className="py-8 sm:py-10">
          <BookSpecsStrip />
        </div>
        <CoreEquation />
        <ConstellationDivider className="my-2" tone="gold" />
        <QuoteOfTheVisit />
        <ConstellationDivider className="my-2" />
        <Chapters />
        <ConstellationDivider className="my-2" tone="gold" />
        <AuthorBio />
        <ConstellationDivider className="my-2" />
        <Praise />
        <ConstellationDivider className="my-2" tone="gold" />
        <FinalCTA />
      </main>
      <Footer />
      <StickyBuyButton />
      <KeyboardShortcuts />
      <SectionProgressIndicator />
      <BookmarksPanel />
    </div>
  );
}
