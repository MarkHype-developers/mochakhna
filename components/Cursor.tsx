"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** Two-part cursor. Elements with data-cursor="Add" etc. morph the ring into a label. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const xd = gsap.quickTo(dot.current, "x", { duration: 0.08 });
    const yd = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const xr = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const yr = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });

    const move = (e: PointerEvent) => { xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY); };
    const over = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const text = t?.dataset.cursor ?? "";
      if (label.current) label.current.textContent = text;
      gsap.to(ring.current, { scale: t ? (text ? 2.6 : 1.7) : 1, duration: 0.35, ease: "power3" });
      ring.current?.classList.toggle("is-label", !!text);
    };
    const down = () => gsap.to(ring.current, { scale: "*=0.8", duration: 0.15, yoyo: true, repeat: 1 });

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring"><span ref={label} /></div>
      <div ref={dot} className="cursor-dot" />
    </>
  );
}
