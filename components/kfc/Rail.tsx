"use client";

import { useEffect, useRef, useState } from "react";

/** Horizontal card carousel: native scroll-snap (smooth touch/trackpad/drag) + arrow buttons. */
export default function Rail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current!;
    const on = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    on();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    // mouse drag-to-scroll on desktop
    let down = false, sx = 0, sl = 0, moved = false;
    const md = (e: MouseEvent) => { down = true; moved = false; sx = e.pageX; sl = el.scrollLeft; el.classList.add("is-drag"); };
    const mm = (e: MouseEvent) => { if (!down) return; const dx = e.pageX - sx; if (Math.abs(dx) > 4) moved = true; el.scrollLeft = sl - dx; };
    const mu = () => { down = false; el.classList.remove("is-drag"); };
    const click = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    el.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("scroll", on); window.removeEventListener("resize", on);
      el.removeEventListener("mousedown", md); window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu); el.removeEventListener("click", click, true);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = ref.current!;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="krail">
      <button className="krail-btn krail-btn--l" onClick={() => go(-1)} disabled={edge.start} aria-label="Previous">‹</button>
      <div ref={ref} className="krail-track" data-lenis-prevent-wheel>{children}</div>
      <button className="krail-btn krail-btn--r" onClick={() => go(1)} disabled={edge.end} aria-label="Next">›</button>
    </div>
  );
}
