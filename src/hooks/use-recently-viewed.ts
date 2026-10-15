"use client";

import { useSyncExternalStore, useCallback } from "react";

/**
 * useRecentlyViewed — a localStorage-backed tracker of the most recently
 * opened concept deep-dives. Keeps the last 6 (deduped, most-recent-first).
 * Uses useSyncExternalStore so the concepts section's "Continue exploring"
 * row stays in sync. Persists across page reloads.
 *
 * Entry shape: { id, title, icon } — minimal, just enough for the row chips.
 */

export type RecentEntry = {
  id: string;
  title: string;
  icon: string;
  viewedAt: number;
};

const STORAGE_KEY = "aotf:recently-viewed";
const MAX_ENTRIES = 6;

let entries: RecentEntry[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) entries = parsed;
    }
  } catch {
    // ignore corrupt storage
  }
}

function persist() {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  } catch {
    // storage full / disabled — non-fatal
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  if (typeof window !== "undefined") {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loaded = false;
        load();
        cb();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", onStorage);
    };
  }
  return () => listeners.delete(cb);
}

function getSnapshot(): RecentEntry[] {
  return entries;
}

function getServerSnapshot(): RecentEntry[] {
  return [];
}

export function useRecentlyViewed() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const track = useCallback((entry: Omit<RecentEntry, "viewedAt">) => {
    load();
    // dedupe: remove if already present, then prepend
    entries = entries.filter((x) => x.id !== entry.id);
    entries = [{ ...entry, viewedAt: Date.now() }, ...entries].slice(0, MAX_ENTRIES);
    persist();
    emit();
  }, []);

  const clear = useCallback(() => {
    load();
    entries = [];
    persist();
    emit();
  }, []);

  return { list, track, clear };
}
