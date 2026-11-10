"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type GoTo = (target: string, opts?: { offset?: number }) => void;
const LenisCtx = createContext<Lenis | null>(null);
const GoToCtx = createContext<GoTo>(() => {});
export const useLenis = () => useContext(LenisCtx);
/** Jump to a section with a quick brand-coloured wipe — skips the long pinned scroll scenes in between. */
export const useGoTo = () => useContext(GoToCtx);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  // Native browser scrolling (no smooth-scroll hijacking). `lenis` stays null, so every
  // caller falls back to the browser's own scrollTo / scrollIntoView.
  useEffect(() => { setLenis(null); }, []);

  const goTo = useCallback<GoTo>((target, opts) => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el || busy.current) return;
    const offset = opts?.offset ?? -20;
    const dist = Math.abs(el.getBoundingClientRect().top);
    // close by → just glide there
    if (dist < window.innerHeight * 1.2 || !wipe.current) {
      lenis ? lenis.scrollTo(el, { offset, duration: 1.1 }) : el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    busy.current = true;
    const w = wipe.current;
    gsap.timeline({ onComplete: () => { busy.current = false; } })
      .set(w, { display: "grid", y: 0, yPercent: 100 })
      .to(w, { yPercent: 0, duration: 0.45, ease: "expo.in" })
      .add(() => {
        const y = el.getBoundingClientRect().top + window.scrollY + offset;
        lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y);
        ScrollTrigger.update();
      })
      .fromTo(w.querySelector(".wipe-logo"), { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25 }, "<")
      .to(w, { yPercent: -100, duration: 0.6, ease: "expo.out", delay: 0.12 })
      .set(w, { display: "none" });
  }, [lenis]);

  return (
    <LenisCtx.Provider value={lenis}>
      <GoToCtx.Provider value={goTo}>
        {children}
        <div ref={wipe} className="page-wipe" aria-hidden>
          <span className="wipe-logo odia">ମୋ ଚଖଣା</span>
        </div>
      </GoToCtx.Provider>
    </LenisCtx.Provider>
  );
}
