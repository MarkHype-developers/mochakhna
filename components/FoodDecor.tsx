"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Photo from "./Photo";
import type { PhotoKey } from "@/lib/photos";

export type DecorItem = {
  photo: PhotoKey;
  /** "cut" = product shot on white, blended into light backgrounds; "round" = photo sticker */
  kind: "cut" | "round";
  x: string;        // left, e.g. "-3%"
  y: string;        // top, e.g. "12%"
  w: string;        // width, e.g. "clamp(90px, 11vw, 170px)"
  rot?: number;
  depth?: number;   // parallax strength, -1..1 (negative moves up faster)
  hideMobile?: boolean;
};

/**
 * Real-photo food elements that float behind a section's content:
 * scroll parallax (scrubbed) + a slow idle bob so the page never feels static.
 */
export default function FoodDecor({ items }: { items: DecorItem[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const els = gsap.utils.toArray<HTMLElement>(".decor", root.current);
    els.forEach((el, i) => {
      const d = Number(el.dataset.depth ?? 0.5);
      gsap.fromTo(el, { yPercent: 70 * d }, {
        yPercent: -70 * d, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
      const inner = el.firstElementChild as HTMLElement;
      gsap.to(inner, {
        y: gsap.utils.random(-14, 14), rotate: `+=${gsap.utils.random(-10, 10)}`,
        duration: gsap.utils.random(2.8, 4.2), repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.2,
      });
    });
  }, { scope: root });

  return (
    <div ref={root} className="decor-layer" aria-hidden>
      {items.map((it, i) => (
        <div
          key={i}
          className={`decor decor--${it.kind}${it.hideMobile ? " hide-sm" : ""}`}
          data-depth={it.depth ?? 0.5}
          style={{ left: it.x, top: it.y, width: it.w }}
        >
          <div className="decor-in" style={{ transform: `rotate(${it.rot ?? 0}deg)` }}>
            <Photo photo={it.photo} alt="" fill sizes="200px" />
          </div>
        </div>
      ))}
    </div>
  );
}
