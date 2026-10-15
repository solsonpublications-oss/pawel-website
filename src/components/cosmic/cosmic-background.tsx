"use client";

import { useEffect, useRef } from "react";

/**
 * CosmicBackground
 * A fixed, GPU-light animated starfield rendered on a canvas.
 * - Stars drift slowly and twinkle.
 * - A few "shooting" meteors cross occasionally.
 * - Deep-space radial nebula veils are painted behind via CSS gradients.
 * Pointer-events disabled so it never blocks UI.
 */
export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    type Star = {
      x: number;
      y: number;
      z: number; // depth for parallax twinkle
      r: number;
      tw: number; // twinkle phase
      hue: "cyan" | "gold" | "white";
    };
    type Meteor = {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      life: number;
      maxLife: number;
    };

    let stars: Star[] = [];
    let meteors: Meteor[] = [];

    const HUES: Record<Star["hue"], string> = {
      cyan: "rgba(125, 211, 252, ", // sky-300
      gold: "rgba(251, 191, 36, ", // amber-400
      white: "rgba(226, 232, 240, ", // slate-200
    };

    function pickHue(): Star["hue"] {
      const r = Math.random();
      if (r < 0.7) return "white";
      if (r < 0.88) return "cyan";
      return "gold";
    }

    function buildStars() {
      const count = Math.min(220, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: Math.random() * 1.4 + 0.2,
        tw: Math.random() * Math.PI * 2,
        hue: pickHue(),
      }));
    }

    function maybeSpawnMeteor() {
      if (meteors.length > 2) return;
      if (Math.random() > 0.004) return;
      const fromLeft = Math.random() > 0.5;
      meteors.push({
        x: fromLeft ? -50 : w + 50,
        y: Math.random() * h * 0.6,
        len: 90 + Math.random() * 120,
        speed: 6 + Math.random() * 6,
        angle: fromLeft ? Math.PI / 6 : (Math.PI * 5) / 6,
        life: 0,
        maxLife: 120 + Math.random() * 60,
      });
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildStars();
    }

    let t = 0;
    function draw() {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);

      // stars
      for (const s of stars) {
        const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * (1.2 + s.z) + s.tw));
        const alpha = twinkle * (0.5 + s.z * 0.5);
        ctx.beginPath();
        ctx.fillStyle = `${HUES[s.hue]}${alpha})`;
        ctx.arc(s.x, s.y, s.r * (0.7 + s.z * 0.6), 0, Math.PI * 2);
        ctx.fill();

        // subtle glow on bigger stars
        if (s.r > 1) {
          ctx.beginPath();
          ctx.fillStyle = `${HUES[s.hue]}${alpha * 0.18})`;
          ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // slow drift
        s.y += 0.03 + s.z * 0.04;
        if (s.y > h + 4) {
          s.y = -4;
          s.x = Math.random() * w;
        }
      }

      // meteors
      maybeSpawnMeteor();
      meteors = meteors.filter((m) => m.life < m.maxLife);
      for (const m of meteors) {
        m.life += 1;
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        const tailX = m.x - Math.cos(m.angle) * m.len;
        const tailY = m.y - Math.sin(m.angle) * m.len;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        const fade = Math.min(1, m.life / 12) * (1 - m.life / m.maxLife);
        grad.addColorStop(0, `rgba(125, 211, 252, ${0.9 * fade})`);
        grad.addColorStop(0.4, `rgba(251, 191, 36, ${0.4 * fade})`);
        grad.addColorStop(1, "rgba(125, 211, 252, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* deep-space base gradient (theme-aware via CSS var) */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--bg-base)" }}
      />
      {/* cyan nebula veil top-left */}
      <div
        className="absolute -top-40 -left-32 h-[55vh] w-[55vh] rounded-full opacity-50 blur-[120px] animate-pulse-glow"
        style={{ background: "var(--bg-nebula-cyan)" }}
      />
      {/* gold nebula veil bottom-right */}
      <div
        className="absolute top-[30%] -right-40 h-[60vh] w-[60vh] rounded-full opacity-40 blur-[130px] animate-pulse-glow"
        style={{
          background: "var(--bg-nebula-gold)",
          animationDelay: "1.6s",
        }}
      />
      {/* plasma veil center-bottom */}
      <div
        className="absolute bottom-[-20%] left-1/2 h-[55vh] w-[80vw] -translate-x-1/2 rounded-full opacity-30 blur-[140px]"
        style={{ background: "var(--bg-nebula-plasma)" }}
      />
      {/* canvas stars — opacity reduced in light theme via CSS var */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ opacity: "var(--star-opacity, 1)" }}
      />
      {/* faint coordinate grid */}
      <div
        className="absolute inset-0 bg-cosmic-grid mask-radial-fade opacity-60"
        style={{ ["--grid-line-color" as string]: "var(--grid-line)" }}
      />
      {/* vignette (theme-aware) */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--bg-vignette)" }}
      />
    </div>
  );
}
