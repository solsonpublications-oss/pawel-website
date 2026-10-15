"use client";

import { useSyncExternalStore, useCallback } from "react";

/**
 * useViewedParts — a localStorage-backed tracker of which Parts the user
 * has viewed (selected) in the Chapters section. Used to show a checkmark
 * on viewed parts + a "X / 5 viewed" progress indicator. Persists across
 * page reloads.
 *
 * Shape: number[] (array of part indices 0–4).
 */

const STORAGE_KEY = "aotf:viewed-parts";

let viewed: number[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        viewed = parsed.filter((n) => typeof n === "number" && n >= 0 && n < 5);
      }
    }
  } catch {
    // ignore corrupt storage
  }
}

function persist() {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
    }
  } catch {
    // non-fatal
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

function getSnapshot(): number[] {
  return viewed;
}

function getServerSnapshot(): number[] {
  return [];
}

export function useViewedParts() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const markViewed = useCallback((partIndex: number) => {
    load();
    if (!viewed.includes(partIndex)) {
      viewed = [...viewed, partIndex].sort((a, b) => a - b);
      persist();
      emit();
    }
  }, []);

  const has = useCallback((partIndex: number) => viewed.includes(partIndex), []);

  const clear = useCallback(() => {
    load();
    viewed = [];
    persist();
    emit();
  }, []);

  return { list, markViewed, has, clear };
}
