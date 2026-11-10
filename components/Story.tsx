"use client";

import Photo from "./Photo";
import type { PhotoKey } from "@/lib/photos";
import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

const floats: { src: PhotoKey; cls: string; speed: number; rot: number }[] = [
  { src: "masalaChana", cls: "f1", speed: -0.6, rot: -12 },
  { src: "chickenPakoda", cls: "f2", speed: 0.5, rot: 10 },
  { src: "pomfretFry", cls: "f3", speed: -0.35, rot: 6 },
  { src: "kaju", cls: "f4", speed: 0.8, rot: -8 },
];

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const split = new SplitText(q(".story-text"), { type: "words", wordsClass: "w" });
    gsap.fromTo(split.words, { opacity: 0.12 }, {
      opacity: 1, stagger: 0.08, ease: "none",
      scrollTrigger: { trigger: q(".story-text"), start: "top 80%", end: "bottom 45%", scrub: 0.6 },
    });

    floats.forEach((f) => {
      gsap.fromTo(q(`.${f.cls}`), { yPercent: 60 * f.speed * -1, rotate: 0 }, {
        yPercent: 60 * f.speed, rotate: f.rot, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    gsap.from(q(".story-eyebrow, .story-sign"), {
      y: 30, autoAlpha: 0, stagger: 0.2, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 70%" },
    });

    // hand-drawn underline draws itself
    gsap.fromTo(q(".story-underline path"), { strokeDashoffset: 600 }, {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: q(".story-text"), start: "top 60%", end: "bottom 50%", scrub: true },
    });
    gsap.fromTo(q(".story-photo"), { clipPath: "inset(18% 12% 18% 12% round 40px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none",
      scrollTrigger: { trigger: q(".story-photo"), start: "top 95%", end: "center 55%", scrub: true },
    });
    gsap.fromTo(q(".story-photo img"), { scale: 1.3 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: q(".story-photo"), start: "top bottom", end: "bottom top", scrub: true },
    });
    return () => split.revert();
  }, { scope: root });

  return (
    <section ref={root} className="story" id="story">
      {floats.map((f) => (
        <div key={f.cls} className={`story-float ${f.cls}`}>
          <Photo photo={f.src} alt="" fill sizes="240px" />
        </div>
      ))}

      <div className="container story-inner">
        <p className="story-eyebrow eyebrow">ଆମ କଥା · our story</p>
        <p className="story-text">
          Every great evening needs two things — good friends and great chakhna. We take care of the second one:
          slow-cooked kasha, crackling pakoda, coastal fish fry and masala chana, made fresh in Odisha&apos;s own style.
          The first one? That&apos;s on you.
        </p>
        <svg className="story-underline" viewBox="0 0 600 40" aria-hidden>
          <path d="M5 28c80-18 160-22 240-12s160 14 230-4c40-10 80-12 120-6" fill="none" stroke="#e30a0a" strokeWidth="6" strokeLinecap="round" strokeDasharray="600" />
        </svg>
        <p className="story-sign hand">— the Mo Chakhna kitchen, est. by Ayunraz</p>
        <figure className="story-photo">
          <Photo photo="friends" alt="Friends raising glasses of soft drinks over a table full of snacks" fill sizes="(max-width: 860px) 100vw, 1000px" />
          <figcaption className="hand">this is what we cook for ↑</figcaption>
        </figure>
      </div>
    </section>
  );
}
