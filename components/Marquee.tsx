"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const rowA = ["Chicken Kasha", "ଚଖଣା", "Masala Peanuts", "Koni Fish Fry", "ମୋ ଚଖଣା", "Chilli Chicken", "Masala Papad"];
const rowB = ["We never sell alcohol", "Garam garam", "Steamed Masala Chana", "Cheers!", "Paneer Pakoda", "Daru ka dost", "Chicken 65"];

function Row({ words, cls }: { words: string[]; cls: string }) {
  const list = [...words, ...words];
  return (
    <div className={`mq-row ${cls}`}>
      <div className="mq-track">
        {list.map((w, i) => (
          <span key={i} className={/[଀-୿]/.test(w) ? "odia" : ""}>
            {w}
            <svg viewBox="0 0 40 40" aria-hidden><path d="M20 2l4 12 14 2-11 8 4 14-11-8-11 8 4-14L2 16l14-2z" /></svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tracks = gsap.utils.toArray<HTMLElement>(".mq-track", root.current);
    const loops = tracks.map((t, i) =>
      gsap.fromTo(t, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 28, ease: "none", repeat: -1 })
    );
    const skew = gsap.quickSetter(tracks, "skewX", "deg");
    const state = { target: 1, speed: 1, skew: 0 };
    ScrollTrigger.create({
      trigger: root.current, start: "top bottom", end: "bottom top",
      onUpdate: (s) => {
        const v = s.getVelocity();
        state.target = s.direction * (1 + Math.min(Math.abs(v) / 400, 4));
        state.skew = gsap.utils.clamp(-10, 10, v / -250);
      },
    });
    const tick = () => {
      state.speed += (state.target - state.speed) * 0.08;
      state.target += (Math.sign(state.target || 1) - state.target) * 0.04; // relax to cruising speed
      state.skew *= 0.9;
      loops.forEach((l) => l.timeScale(state.speed));
      skew(state.skew);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, { scope: root });

  return (
    <div ref={root} className="marquee" aria-hidden>
      <Row words={rowA} cls="mq-a" />
      <Row words={rowB} cls="mq-b" />
    </div>
  );
}
