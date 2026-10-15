import { useSyncExternalStore } from "react";

/**
 * Returns true when the user has a fine pointer (mouse) AND the viewport is
 * at least 1024px wide. Used to gate 3D-tilt micro-interactions so they are
 * disabled on touch devices / small screens.
 *
 * Uses `useSyncExternalStore` so the value is read synchronously on first
 * paint (no setState-in-effect render cascade) and stays subscribed to
 * media-query changes.
 */
const QUERY = "(pointer: fine) and (min-width: 1024px)";

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useFineWidePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
