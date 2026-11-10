"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import Photo from "./Photo";
import type { PhotoKey } from "@/lib/photos";

const Steam = dynamic(() => import("./hero/Steam"), { ssr: false });

const steps = [
  { k: "01", t: "Pick your base", s: "Kasha, pakoda or koni fish — something with a bite." },
  { k: "02", t: "Add the crunch", s: "Masala peanuts, papad, kaju. Non-negotiable." },
  { k: "03", t: "Squeeze of nimbu", s: "Onion, hari mirch, a dusting of chaat masala." },
  { k: "04", t: "Cheers!", s: "Raise whatever you're raising. We'll keep the plate full." },
];

const pieces: { src: PhotoKey; cls: string; from: gsap.TweenVars }[] = [
  { src: "kadaiKasha", cls: "pc1", from: { x: "-70vw", y: "-30vh", rotate: -140 } },
  { src: "masalaChana", cls: "pc2", from: { x: "70vw", y: "-40vh", rotate: 160 } },
  { src: "pomfretFry", cls: "pc3", from: { x: "-60vw", y: "60vh", rotate: 120 } },
  { src: "chickenPakoda", cls: "pc4", from: { x: "65vw", y: "55vh", rotate: -110 } },
];

export default function PlateAssembly() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const plate = q(".plate"), wrap = q(".plate-wrap"), cheers = q(".plate-cheers"), stepsEl = q(".step"), steam = q(".plate-steam path");

    // explicit start states (fromTo everywhere) so the sequence is identical on every load,
    // after hot-reloads and when scrolling back up
    gsap.set(plate, { scale: 0.4, rotate: -90, autoAlpha: 0 });
    pieces.forEach((p) => gsap.set(q(`.${p.cls}`), { ...p.from, scale: 0.3, autoAlpha: 0, filter: "blur(10px)" }));
    gsap.set(q(".puff"), { autoAlpha: 0, scale: 0.4, y: 0 });
    gsap.set(q(".plate-steam-gl"), { opacity: 0 });
    gsap.set(cheers, { scale: 0, rotate: -30, autoAlpha: 0 });
    gsap.set(wrap, { rotate: 0, scale: 1 });
    gsap.set(stepsEl, { yPercent: 0 });
    gsap.set(steam, { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: root.current, start: "top top", end: "+=420%",
        pin: true, scrub: 1.2, anticipatePin: 1, invalidateOnRefresh: true,
      },
    });
    tl.to(plate, { scale: 1, rotate: 0, autoAlpha: 1, duration: 1 });
    pieces.forEach((p, i) => {
      tl.to(q(`.${p.cls}`), { x: 0, y: 0, rotate: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)", duration: 1.2, ease: "back.out(1.4)" }, i === 0 ? ">" : ">-0.15")
        // hot dish lands → a burst of steam rises off it, and the plate keeps steaming more
        .fromTo(q(`.puff--${i + 1}`), { autoAlpha: 0, scale: 0.4, y: 0 }, { keyframes: [
          { autoAlpha: 0.85, scale: 1.1, y: -30, duration: 0.45, ease: "power2.out" },
          { autoAlpha: 0, scale: 1.9, y: -130, duration: 0.9, ease: "power1.in" },
        ] }, "-=0.55")
        .to(q(".plate-steam-gl"), { opacity: Math.min(1, 0.3 + i * 0.25), duration: 0.6 }, "<")
        .to(stepsEl, { yPercent: -100 * i, duration: 0.5 }, "<")
        .to(steam, { autoAlpha: i >= 1 ? 1 : 0, duration: 0.4 }, "<")
        .to({}, { duration: 0.35 }); // a beat to look at each dish
    });
    tl.to(wrap, { rotate: 25, scale: 1.05, duration: 1 })
      .to(cheers, { scale: 1, rotate: -12, autoAlpha: 1, ease: "elastic.out(1,0.5)", duration: 1 }, "<")
      .to({}, { duration: 0.4 });

    gsap.to(steam, { y: -14, repeat: -1, yoyo: true, duration: 1.6, stagger: 0.3, ease: "sine.inOut" });
  }, { scope: root });

  return (
    <section ref={root} className="assembly">
      <div className="assembly-grid container">
        <div className="assembly-copy">
          <p className="eyebrow eyebrow--light">how a mehfil is built</p>
          <div className="steps-mask">
            {steps.map((s) => (
              <div className="step" key={s.k}>
                <span className="step-k">{s.k}</span>
                <h2>{s.t}</h2>
                <p>{s.s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="plate-stage">
          <svg className="plate-steam" viewBox="0 0 200 120" aria-hidden>
            <path d="M60 110c-20-30 20-40 0-70s10-30 0-40" />
            <path d="M100 110c-20-30 20-40 0-70s10-30 0-40" />
            <path d="M140 110c-20-30 20-40 0-70s10-30 0-40" />
          </svg>
          <div className="plate-wrap">
            <div className="plate"><div className="plate-rim" /></div>
            {pieces.map((p, i) => (
              <span key={`puff-${p.cls}`} className={`puff puff--${i + 1}`} aria-hidden><i /><i /><i /></span>
            ))}
            {pieces.map((p) => (
              <div key={p.cls} className={`plate-piece ${p.cls}`}>
                <Photo photo={p.src} alt="" fill loading="eager" sizes="240px" quality={80} />
              </div>
            ))}
          </div>
          <Steam className="plate-steam-gl" />
          <div className="plate-cheers hand">Cheers!</div>
        </div>
      </div>
    </section>
  );
}
