"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";

/**
 * AudioQuotePlayer — a compact, on-brand play button that plays a pre-generated
 * TTS audio clip of the author's "Inversion Model" quote. Shows a loading
 * state while the audio buffers, a pause toggle while playing, and a subtle
 * animated waveform indicator. Accessible (aria-label + keyboard-friendly).
 */
export function AudioQuotePlayer({
  src = "/audio/inversion-quote.wav",
  label = "Listen to the quote",
}: {
  src?: string;
  label?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const [progress, setProgress] = useState(0); // 0..1

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.preload = "none";

    const onCanPlay = () => setState((s) => (s === "loading" ? "idle" : s));
    const onPlay = () => setState("playing");
    const onPause = () => setState((s) => (s === "playing" ? "paused" : s));
    const onEnded = () => {
      setState("idle");
      setProgress(0);
    };
    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const onWaiting = () => setState("loading");

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("waiting", onWaiting);

    return () => {
      audio.pause();
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("waiting", onWaiting);
    };
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (state === "idle" || state === "paused") {
      setState("loading");
      audio.play().catch(() => setState("idle"));
    } else {
      audio.pause();
    }
  };

  const isPlaying = state === "playing";
  const isLoading = state === "loading";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? `Pause: ${label}` : `${label}`}
      className="group inline-flex items-center gap-2.5 rounded-full border border-cyan-glow/25 bg-cosmos-surface/50 py-1.5 pl-1.5 pr-4 backdrop-blur-sm transition-all hover:border-cyan-glow/50 hover:bg-cyan-glow/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
    >
      {/* play/pause circle */}
      <span
        className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
          isPlaying
            ? "bg-gold-glow text-cosmos-deep"
            : "bg-gradient-to-br from-cyan-glow to-gold-glow text-cosmos-deep"
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="ml-0.5 h-4 w-4" />
        )}
        {isPlaying ? (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold-glow/40" />
        ) : null}
      </span>

      {/* waveform / label */}
      <span className="flex items-center gap-2">
        {isPlaying || state === "paused" ? (
          <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-0.5 rounded-full bg-cyan-glow"
                animate={
                  isPlaying
                    ? { height: ["30%", "100%", "50%", "80%", "30%"] }
                    : { height: "40%" }
                }
                transition={
                  isPlaying
                    ? { duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
                style={{ height: isPlaying ? undefined : "40%" }}
              />
            ))}
          </span>
        ) : (
          <Volume2 className="h-3.5 w-3.5 text-cyan-glow" />
        )}
        <span className="font-mono-proto text-[10px] uppercase tracking-[0.2em] text-stardust-dim group-hover:text-cyan-glow">
          {isLoading ? "Loading…" : isPlaying ? "Playing" : state === "paused" ? "Paused" : "Listen"}
        </span>
      </span>

      {/* progress bar (subtle, only when active) */}
      <span className="relative hidden h-0.5 w-12 overflow-hidden rounded-full bg-cyan-glow/15 sm:block">
        <AnimatePresence>
          {(isPlaying || state === "paused") ? (
            <motion.span
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-glow to-gold-glow"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ ease: "linear" }}
            />
          ) : null}
        </AnimatePresence>
      </span>
    </button>
  );
}
