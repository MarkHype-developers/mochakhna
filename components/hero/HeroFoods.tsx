"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Photo from "../Photo";
import { onLoaded } from "@/lib/loaded";
import type { PhotoKey } from "@/lib/photos";

type Dish = { photo: PhotoKey; x: number; y: number; s: number; depth: number; rot: number; mobile?: boolean };

// x / y are % of the hero, s = diameter in px at 1440w (scaled with viewport)
const DISHES: Dish[] = [
  { photo: "kadaiKasha", x: 3, y: 16, s: 190, depth: 1.0, rot: -8, mobile: true },
  { photo: "pomfretFry", x: 80, y: 13, s: 200, depth: 0.9, rot: 10, mobile: true },
  { photo: "chilliChickenShoot", x: 86, y: 52, s: 170, depth: 1.2, rot: -6 },
  { photo: "prawnBowl", x: 6, y: 58, s: 160, depth: 1.1, rot: 12 },
  { photo: "masalaChana", x: 17, y: 82, s: 110, depth: 0.6, rot: 0, mobile: true },
  { photo: "peanutsShell", x: 74, y: 80, s: 120, depth: 0.7, rot: 0, mobile: true },
  { photo: "kaju", x: 24, y: 6, s: 80, depth: 0.4, rot: 0 },
  { photo: "chickenPakoda", x: 69, y: 4, s: 90, depth: 0.5, rot: 0 },
  { photo: "lemon", x: 93, y: 84, s: 70, depth: 0.35, rot: 0 },
  { photo: "samosa", x: 1, y: 86, s: 80, depth: 0.45, rot: 0 },
];

/**
 * Real dishes floating around the logo like plates on a table:
 * pop in after the preloader, drift with the mouse (each at its own depth),
 * bob gently, parallax on scroll, and get "tossed" when you tap the hero.
 */
export default function HeroFoods() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP((_, contextSafe) => {
    const items = gsap.utils.toArray<HTMLElement>(".hf", root.current);
    const inners = items.map((el) => el.querySelector<HTMLElement>(".hf-in")!);
    gsap.set(inners, { scale: 0, rotate: -90 });

    const off = onLoaded(contextSafe!(() => {
      gsap.to(inners, {
        scale: 1, rotate: (i) => DISHES[i].rot, duration: 1.4, ease: "elastic.out(1, 0.6)",
        stagger: { each: 0.07, from: "random" }, delay: 0.15,
      });
      // gentle idle float on the wrapper so it never fights the mouse tween
      items.forEach((el, i) => {
        gsap.to(el.querySelector(".hf-bob"), {
          y: gsap.utils.random(-12, 12), rotate: gsap.utils.random(-5, 5),
          duration: gsap.utils.random(2.6, 4), repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.15,
        });
      });
    }));

    // mouse parallax, depth-weighted
    const movers = items.map((el) => ({
      x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3" }),
      d: Number(el.dataset.depth),
    }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => { m.x(-nx * 60 * m.d); m.y(-ny * 40 * m.d); });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // tap anywhere in the hero → dishes get tossed away from the tap and spring back
    const hero = root.current!.closest("section")!;
    const onDown = contextSafe!((e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a,button,input,label,form")) return;
      inners.forEach((el) => {
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - e.clientX, dy = r.top + r.height / 2 - e.clientY;
        const dist = Math.max(80, Math.hypot(dx, dy));
        const f = Math.min(1, 380 / dist);
        gsap.timeline()
          .to(el, { x: (dx / dist) * 120 * f, y: (dy / dist) * 120 * f - 40 * f, rotate: `+=${gsap.utils.random(-120, 120) * f}`, duration: 0.35, ease: "power2.out" })
          .to(el, { x: 0, y: 0, duration: 1.4, ease: "elastic.out(1, 0.4)" });
      });
    });
    hero.addEventListener("pointerdown", onDown);

    // scroll parallax
    items.forEach((el) => {
      gsap.to(el.querySelector(".hf-scroll"), {
        yPercent: -120 * Number(el.dataset.depth), ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
    });

    return () => {
      off();
      window.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerdown", onDown);
    };
  }, { scope: root });

  return (
    <div ref={root} className="hero-foods" aria-hidden>
      {DISHES.map((d, i) => (
        <div
          key={i}
          className={`hf${d.mobile ? "" : " hf--desk"}`}
          data-depth={d.depth}
          style={{ left: `${d.x}%`, top: `${d.y}%`, ["--s" as string]: d.s }}
        >
          <div className="hf-scroll">
            <div className="hf-bob">
              <div className="hf-in">
                <Photo photo={d.photo} alt="" fill sizes="220px" quality={78} priority={i < 4} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
