"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, Loader2, ArrowRight, Users } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

/**
 * NewsletterSignup — a "Join the administration" email-capture form for the
 * footer. Posts to /api/subscribe (Prisma SQLite). Shows inline states:
 * loading spinner → success checkmark with cosmic confirmation, or an
 * inline error message. Displays a live subscriber count ("Join N
 * administrators") fetched from the API on mount. Fully keyboard-accessible.
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState<number | null>(null);

  // Fetch the live subscriber count on mount. setState is inside .then()
  // (async) so it doesn't trigger the set-state-in-effect lint rule.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/subscribe")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Subscription failed.");
        return;
      }
      setStatus("success");
      setMessage(
        data.isNew
          ? "You're in. The Algorithm runs at the speed of its administrators."
          : "You're already on the list — the administration remembers you.",
      );
      setEmail("");
      // increment the displayed count for immediate feedback on new signups
      if (data.isNew) {
        setCount((c) => (c !== null ? c + 1 : 1));
      }
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-2">
        <Mail className="h-4 w-4 text-gold-glow" />
        <h4 className="font-mono-proto text-[10px] uppercase tracking-[0.3em] text-gold-glow">
          Join the administration
        </h4>
        {/* live subscriber count */}
        {count !== null && count > 0 ? (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-cyan-glow/15 bg-cosmos-deep/40 px-2 py-0.5 font-mono-proto text-[9px] uppercase tracking-[0.15em] text-stardust-dim">
            <Users className="h-2.5 w-2.5 text-cyan-glow" />
            {count} {count === 1 ? "admin" : "admins"}
          </span>
        ) : null}
      </div>
      <p className="mb-3 text-xs leading-relaxed text-stardust-dim">
        Subscribe for dispatches from the Inversion Model — new essays,
        translations, and the next volume.
      </p>

      <form onSubmit={onSubmit} className="relative" noValidate>
        <div className="flex overflow-hidden rounded-full border border-cyan-glow/20 bg-cosmos-surface/50 backdrop-blur-sm transition-colors focus-within:border-cyan-glow/50">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error" || status === "success") setStatus("idle");
            }}
            placeholder="you@cosmos.org"
            aria-label="Email address"
            aria-required="true"
            required
            disabled={status === "loading" || status === "success"}
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-stardust placeholder:text-stardust-dim/60 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success" || !email}
            aria-label="Subscribe"
            className="group relative flex shrink-0 items-center justify-center gap-1.5 px-4 text-cosmos-deep transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background:
                "linear-gradient(100deg, oklch(0.78 0.15 200) 0%, oklch(0.82 0.14 85) 100%)",
            }}
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {status === "success" || status === "error" ? (
            <motion.p
              key={status}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              role="status"
              aria-live="polite"
              className={`mt-2 flex items-center gap-1.5 text-xs leading-relaxed ${
                status === "success" ? "text-gold-glow" : "text-red-400"
              }`}
            >
              {status === "success" ? (
                <Check className="h-3 w-3 shrink-0" />
              ) : null}
              {message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </form>
    </div>
  );
}
