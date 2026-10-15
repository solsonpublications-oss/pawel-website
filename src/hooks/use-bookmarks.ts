"use client";

import { useSyncExternalStore, useCallback } from "react";

/**
 * useBookmarks — a localStorage-backed bookmarks store for concepts and
 * chapters. Uses useSyncExternalStore so all components that call it stay
 * in sync (e.g. a bookmark button on a concept card + a reading-list panel
 * both reflect the same state). Persists across page reloads.
 *
 * Bookmark shape: { id, type, title, source } where type is "concept" or
 * "chapter" and source is the concept's appearsIn or the chapter's part.
 */

export type BookmarkType = "concept" | "chapter";
export type Bookmark = {
  id: string;
  type: BookmarkType;
  title: string;
  source: string;
  createdAt: number;
};

const STORAGE_KEY = "aotf:bookmarks";

// In-memory store + listener set (module-level so all hook instances share)
let bookmarks: Bookmark[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) bookmarks = parsed;
    }
  } catch {
    // ignore corrupt storage
  }
}

function persist() {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
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
  // cross-tab sync
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

function getSnapshot(): Bookmark[] {
  return bookmarks;
}

function getServerSnapshot(): Bookmark[] {
  return [];
}

export function useBookmarks() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(
    (b: Omit<Bookmark, "createdAt">) => {
      load();
      const exists = bookmarks.some((x) => x.id === b.id);
      if (exists) {
        bookmarks = bookmarks.filter((x) => x.id !== b.id);
      } else {
        bookmarks = [...bookmarks, { ...b, createdAt: Date.now() }];
      }
      persist();
      emit();
    },
    [],
  );

  const remove = useCallback((id: string) => {
    load();
    bookmarks = bookmarks.filter((x) => x.id !== id);
    persist();
    emit();
  }, []);

  const clear = useCallback(() => {
    load();
    bookmarks = [];
    persist();
    emit();
  }, []);

  const has = useCallback(
    (id: string) => bookmarks.some((x) => x.id === id),
    [],
  );

  /**
   * Export bookmarks to a URL-safe hash string for sharing.
   * Format: #bookmarks=<base64-encoded JSON of [{id,type,title,source}]>
   */
  const exportHash = useCallback((): string => {
    load();
    const minimal = bookmarks.map(({ id, type, title, source }) => ({
      id,
      type,
      title,
      source,
    }));
    try {
      const json = JSON.stringify(minimal);
      const b64 = typeof window !== "undefined"
        ? btoa(unescape(encodeURIComponent(json)))
        : Buffer.from(json).toString("base64");
      return `#bookmarks=${b64}`;
    } catch {
      return "";
    }
  }, []);

  /**
   * Import bookmarks from a URL hash string (e.g. "#bookmarks=eyJ...").
   * Merges with existing bookmarks (deduped by id). Returns the number
   * of newly imported entries.
   */
  const importHash = useCallback((hash: string): number => {
    load();
    const match = hash.match(/#?bookmarks=([A-Za-z0-9+/=]+)/);
    if (!match) return 0;
    try {
      const b64 = match[1];
      const json = typeof window !== "undefined"
        ? decodeURIComponent(escape(atob(b64)))
        : Buffer.from(b64, "base64").toString("utf8");
      const imported = JSON.parse(json);
      if (!Array.isArray(imported)) return 0;
      let added = 0;
      for (const b of imported) {
        if (
          typeof b.id === "string" &&
          (b.type === "concept" || b.type === "chapter") &&
          typeof b.title === "string" &&
          typeof b.source === "string"
        ) {
          if (!bookmarks.some((x) => x.id === b.id)) {
            bookmarks = [...bookmarks, { ...b, createdAt: Date.now() }];
            added++;
          }
        }
      }
      if (added > 0) {
        persist();
        emit();
      }
      return added;
    } catch {
      return 0;
    }
  }, []);

  return { list, toggle, remove, clear, has, exportHash, importHash };
}
