"use client";

import { useEffect, useRef } from "react";

/**
 * Hot-oil sparks: tiny glowing embers that spit up from the pan, flicker and die.
 * Plain 2D canvas with additive blending — cheap, and paused when off-screen.
 */
export default function Sizzle({ density = 46 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; hue: number };
    const n = window.innerWidth < 768 ? Math.round(density / 2) : density;
    const spawn = (p?: P): P => {
      const o = p ?? ({} as P);
      o.x = w * (0.15 + Math.random() * 0.75);
      o.y = h * (0.82 + Math.random() * 0.2);
      o.vx = (Math.random() - 0.5) * 0.6;
      o.vy = -(0.6 + Math.random() * 1.8);
      o.max = 60 + Math.random() * 120;
      o.life = p ? 0 : Math.random() * o.max;
      o.r = 0.6 + Math.random() * 1.6;
      o.hue = 22 + Math.random() * 22;
      return o;
    };
    const ps = Array.from({ length: n }, () => spawn());

    // one pre-rendered glow sprite, tinted by drawing with alpha — no per-frame gradients
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const sg = sprite.getContext("2d")!;
    const g0 = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
    g0.addColorStop(0, "rgba(255,230,150,1)"); g0.addColorStop(0.3, "rgba(255,150,40,0.5)"); g0.addColorStop(1, "rgba(255,80,0,0)");
    sg.fillStyle = g0; sg.fillRect(0, 0, 32, 32);

    let raf = 0, visible = true, last = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) tick(); });
    io.observe(c);

    const tick = (now = 0) => {
      cancelAnimationFrame(raf);
      if (!visible || document.hidden) return;
      if (now - last < 33) { raf = requestAnimationFrame(tick); return; }
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of ps) {
        p.life++;
        p.vx += (Math.random() - 0.5) * 0.08;
        p.vy *= 0.992;
        p.x += p.vx; p.y += p.vy;
        const k = p.life / p.max;
        if (k >= 1 || p.y < -10) { spawn(p); continue; }
        const flicker = 0.6 + Math.random() * 0.4;
        const a = Math.sin(Math.PI * k) * flicker;
        const size = p.r * 12;
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [density]);

  return <canvas ref={ref} className="sizzle" aria-hidden />;
}
