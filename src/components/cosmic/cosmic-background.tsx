"use client";

import { useEffect, useRef } from "react";

/**
 * CosmicBackground
 * A fixed, GPU-light animated starfield and nebula system:
 * - Dynamic drifting starfield with twinkle and depth parallax.
 * - Dynamic constellation filaments connecting nearby stars.
 * - Floating micro-stardust particles.
 * - Shooting star / meteor streaks with dual-tone head and tail fades.
 * - Ambient floating CSS nebulae, breathing aurora veil, and orbital ring.
 * - Theme-reactive: seamlessly transitions between dark space and light starlight.
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

    let isLight = document.documentElement.classList.contains("light");

    // Observe theme class changes on <html>
    const observer = new MutationObserver(() => {
      isLight = document.documentElement.classList.contains("light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    type Star = {
      x: number;
      y: number;
      z: number; // depth
      r: number;
      tw: number; // twinkle phase
      speed: number;
      hue: "cyan" | "gold" | "white";
    };

    type Dust = {
      x: number;
      y: number;
      r: number;
      seed: number;
      speedY: number;
      alpha: number;
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
    let dustParticles: Dust[] = [];
    let meteors: Meteor[] = [];

    function pickHue(): Star["hue"] {
      const r = Math.random();
      if (r < 0.65) return "white";
      if (r < 0.85) return "cyan";
      return "gold";
    }

    function buildStars() {
      const count = Math.min(180, Math.floor((w * h) / 10500));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: Math.random() * 1.5 + 0.3,
        tw: Math.random() * Math.PI * 2,
        speed: 0.03 + Math.random() * 0.05,
        hue: pickHue(),
      }));

      // 40 micro-dust particles
      dustParticles = Array.from({ length: 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 0.8 + 0.2,
        seed: Math.random() * 100,
        speedY: 0.08 + Math.random() * 0.12,
        alpha: Math.random() * 0.35 + 0.15,
      }));
    }

    function maybeSpawnMeteor() {
      if (meteors.length > 2) return;
      if (Math.random() > 0.005) return;
      const fromLeft = Math.random() > 0.5;
      meteors.push({
        x: fromLeft ? -60 : w + 60,
        y: Math.random() * h * 0.65,
        len: 100 + Math.random() * 130,
        speed: 7 + Math.random() * 6,
        angle: fromLeft ? Math.PI / 6 : (Math.PI * 5) / 6,
        life: 0,
        maxLife: 100 + Math.random() * 50,
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
      t += 0.014;
      ctx.clearRect(0, 0, w, h);

      // Color maps based on theme
      const starColors = isLight
        ? {
            cyan: "rgba(2, 132, 199, ",
            gold: "rgba(217, 119, 6, ",
            white: "rgba(71, 85, 105, ",
          }
        : {
            cyan: "rgba(125, 211, 252, ",
            gold: "rgba(251, 191, 36, ",
            white: "rgba(226, 232, 240, ",
          };

      const lineBase = isLight ? "rgba(2, 132, 199, " : "rgba(125, 211, 252, ";

      // 1. Draw subtle constellation filaments connecting nearby stars
      const maxConnDist = 80;
      const maxDistSq = maxConnDist * maxConnDist;
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        let connections = 0;
        for (let j = i + 1; j < stars.length; j++) {
          if (connections >= 2) break;
          const s2 = stars[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxConnDist) * (isLight ? 0.12 : 0.16);
            ctx.beginPath();
            ctx.strokeStyle = `${lineBase}${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // 2. Draw stars
      for (const s of stars) {
        const twinkle = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * (1.2 + s.z) + s.tw));
        const alpha = twinkle * (0.45 + s.z * 0.55);
        ctx.beginPath();
        ctx.fillStyle = `${starColors[s.hue]}${alpha})`;
        ctx.arc(s.x, s.y, s.r * (0.7 + s.z * 0.5), 0, Math.PI * 2);
        ctx.fill();

        // subtle glow halo on larger stars
        if (s.r > 1.1) {
          ctx.beginPath();
          ctx.fillStyle = `${starColors[s.hue]}${alpha * 0.16})`;
          ctx.arc(s.x, s.y, s.r * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // slow drift downward
        s.y += s.speed + s.z * 0.04;
        if (s.y > h + 6) {
          s.y = -6;
          s.x = Math.random() * w;
        }
      }

      // 3. Draw micro-stardust particles
      for (const d of dustParticles) {
        d.y -= d.speedY;
        d.x += Math.sin(t * 0.8 + d.seed) * 0.25;
        if (d.y < -4) {
          d.y = h + 4;
          d.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.fillStyle = isLight
          ? `rgba(14, 116, 144, ${d.alpha * 0.5})`
          : `rgba(186, 230, 253, ${d.alpha * 0.6})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw meteors
      maybeSpawnMeteor();
      meteors = meteors.filter((m) => m.life < m.maxLife);
      for (const m of meteors) {
        m.life += 1;
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        const tailX = m.x - Math.cos(m.angle) * m.len;
        const tailY = m.y - Math.sin(m.angle) * m.len;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        const fade = Math.min(1, m.life / 10) * (1 - m.life / m.maxLife);
        grad.addColorStop(0, isLight ? `rgba(2, 132, 199, ${0.85 * fade})` : `rgba(125, 211, 252, ${0.9 * fade})`);
        grad.addColorStop(0.35, isLight ? `rgba(217, 119, 6, ${0.45 * fade})` : `rgba(251, 191, 36, ${0.45 * fade})`);
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
      observer.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* deep-space base gradient (theme-aware via CSS var) */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ background: "var(--bg-base)" }}
      />

      {/* Floating cyan nebula veil top-left */}
      <div
        className="animate-nebula-drift-1 absolute -top-40 -left-32 h-[58vh] w-[58vh] rounded-full opacity-50 blur-[130px]"
        style={{ background: "var(--bg-nebula-cyan)" }}
      />

      {/* Floating gold nebula veil center-right */}
      <div
        className="animate-nebula-drift-2 absolute top-[28%] -right-44 h-[64vh] w-[64vh] rounded-full opacity-40 blur-[140px]"
        style={{ background: "var(--bg-nebula-gold)" }}
      />

      {/* Breathing central aurora veil */}
      <div
        className="animate-aurora-glow absolute top-[20%] left-1/2 h-[45vh] w-[75vw] -translate-x-1/2 rounded-full blur-[150px]"
        style={{ background: "var(--bg-nebula-cyan)" }}
      />

      {/* Plasma veil center-bottom */}
      <div
        className="animate-nebula-drift-1 absolute bottom-[-18%] left-1/2 h-[55vh] w-[80vw] -translate-x-1/2 rounded-full opacity-35 blur-[140px]"
        style={{ background: "var(--bg-nebula-plasma)" }}
      />

      {/* Faint rotating celestial orbital ring */}
      <div
        className="animate-orbital-drift absolute left-1/2 top-1/2 aspect-square w-[115vw] max-w-[1500px] rounded-full border border-cyan-glow/5"
        style={{ opacity: "var(--star-opacity, 1)" }}
      />

      {/* Canvas stars & constellation lines — theme-reactive */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ opacity: "var(--star-opacity, 1)" }}
      />

      {/* Faint coordinate grid */}
      <div
        className="absolute inset-0 bg-cosmic-grid mask-radial-fade opacity-60"
        style={{ ["--grid-line-color" as string]: "var(--grid-line)" }}
      />

      {/* Vignette (theme-aware) */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--bg-vignette)" }}
      />
    </div>
  );
}
