"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ALL_ITEMS, COMBOS, MIN_PRICE } from "@/lib/menu";
import FoodDecor from "./FoodDecor";

const stats = [
  { n: Math.floor(ALL_ITEMS.length / 5) * 5, suf: "+", l: "things on the menu" },
  { n: MIN_PRICE, pre: "₹", l: "is where it starts" },
  { n: COMBOS.length, l: "combos, zero thinking" },
  { n: 0, l: "drops of alcohol sold. Ever." },
];

const promises = [
  { t: "Cooked to order", d: "Nothing sits under a heat lamp. Your kasha starts when you order it." },
  { t: "Odia masala, our way", d: "Recipes from home kitchens, spice blends ground in-house." },
  { t: "We never sell alcohol", d: "We're the dost, not the daru. Food, soft drinks and the essentials only." },
];

export default function Promise() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    q(".stat b").forEach((el: HTMLElement) => {
      const end = Number(el.dataset.n);
      const o = { v: 0 };
      gsap.to(o, {
        v: end, duration: 1.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
        onUpdate: () => { el.textContent = String(Math.round(o.v)); },
      });
    });
    gsap.from(q(".stat"), { y: 50, autoAlpha: 0, stagger: 0.1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: q(".stats"), start: "top 85%" } });
    gsap.from(q(".promise"), { y: 60, rotate: (i) => [-3, 2, -2][i], autoAlpha: 0, stagger: 0.15, duration: 1.1, ease: "back.out(1.4)", scrollTrigger: { trigger: q(".promises"), start: "top 80%" } });
    gsap.fromTo(q(".circle-draw path"), { strokeDashoffset: 900 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", scrollTrigger: { trigger: q(".circle-draw"), start: "top 80%" } });
  }, { scope: root });

  return (
    <section ref={root} className="promise-sec">
      <FoodDecor items={[
        { photo: "redChilli", kind: "cut", x: "74%", y: "40%", w: "clamp(150px, 17vw, 280px)", rot: -18, depth: 0.7 },
        { photo: "greenChilli", kind: "cut", x: "-5%", y: "48%", w: "clamp(130px, 14vw, 230px)", rot: 35, depth: -0.5, hideMobile: true },
        { photo: "samosa", kind: "round", x: "88%", y: "4%", w: "clamp(90px, 10vw, 160px)", depth: 0.4, hideMobile: true },
      ]} />
      <div className="container">
        <div className="stats">
          {stats.map((s) => (
            <div className="stat" key={s.l}>
              <span className="stat-n">{s.pre}<b data-n={s.n}>0</b>{s.suf}</span>
              <span className="stat-l">{s.l}</span>
            </div>
          ))}
        </div>

        <h2 className="promise-title">
          Our three{" "}
          <span className="circled">
            promises
            <svg className="circle-draw" viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden>
              <path d="M150 8C70 6 10 26 12 58c2 34 80 48 150 44 70-4 130-22 128-52-2-28-60-44-150-42-30 1-60 6-80 14" fill="none" stroke="#e30a0a" strokeWidth="5" strokeLinecap="round" strokeDasharray="900" />
            </svg>
          </span>
        </h2>

        <div className="promises">
          {promises.map((p, i) => (
            <div className="promise" key={p.t}>
              <span className="promise-n hand">{i + 1}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
