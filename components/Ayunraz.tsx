"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import FoodDecor from "./FoodDecor";

export default function Ayunraz() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 65%" } });
    tl.from(q(".ay-family"), { clipPath: "circle(0% at 50% 50%)", duration: 1.4, ease: "expo.inOut" })
      .from(q(".ay-logo"), { y: 80, rotate: 4, autoAlpha: 0, duration: 1.1, ease: "power4.out" }, "-=0.8")
      .from(q(".ay-copy > *"), { y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: "power3.out" }, "-=0.8")
      .from(q(".ay-tree i"), { scaleY: 0, transformOrigin: "top", duration: 0.6, ease: "power2.out" }, "-=0.4")
      .from(q(".ay-tree .node"), { scale: 0, stagger: 0.12, ease: "back.out(2)", duration: 0.6 }, "-=0.3");

    gsap.to(q(".ay-family"), {
      rotate: 8, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
    });
  }, { scope: root });

  return (
    <section ref={root} className="ayunraz" id="ayunraz">
      <FoodDecor items={[
        { photo: "greenChilli", kind: "cut", x: "84%", y: "6%", w: "clamp(130px, 14vw, 220px)", rot: -40, depth: 0.6 },
        { photo: "redChilli", kind: "cut", x: "40%", y: "80%", w: "clamp(120px, 12vw, 200px)", rot: 12, depth: -0.5, hideMobile: true },
      ]} />
      <div className="container ay-grid">
        <div className="ay-visual">
          <div className="ay-family"><Image src="/img/ayunraz-family.jpg" alt="Ayunraz — a mother feeding her child at the dinner table" width={410} height={420} /></div>
          <div className="ay-logo"><Image src="/img/ayunraz-logo.jpg" alt="Ayunraz — Authentic Food Of New India" width={1015} height={380} /></div>
        </div>
        <div className="ay-copy">
          <p className="eyebrow">the family behind the plate</p>
          <h2>Mo Chakhna is a proud brand of <span className="red">Ayunraz</span>.</h2>
          <p>
            Ayunraz exists to put <b>authentic food of New India</b> on every table — honest ingredients, recipes that taste like home,
            and prices that respect your wallet. Mo Chakhna is its evening avatar: the snack plate for every adda, house party and
            late-night match.
          </p>
          <div className="ay-tree" aria-label="Brand family">
            <span className="node node--parent">Ayunraz</span>
            <i />
            <span className="node node--child">Mo Chakhna <small>ମୋ ଚଖଣା</small></span>
          </div>
        </div>
      </div>
    </section>
  );
}
