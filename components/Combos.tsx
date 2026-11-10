"use client";

import Photo from "./Photo";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { COMBOS } from "@/lib/menu";
import { useCart } from "./providers/Cart";

export default function Combos() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cart = useCart();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth + 80;
      const tween = gsap.to(t, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      });
      gsap.utils.toArray<HTMLElement>(".combo", t).forEach((c) => {
        gsap.from(c.querySelectorAll(".combo-imgs > div"), {
          y: 120, rotate: (i) => (i % 2 ? 25 : -25), autoAlpha: 0, stagger: 0.1, ease: "back.out(1.6)",
          scrollTrigger: { trigger: c, containerAnimation: tween, start: "left 85%", end: "left 40%", scrub: 1 },
        });
        gsap.from(c.querySelectorAll("li"), {
          x: 40, autoAlpha: 0, stagger: 0.05,
          scrollTrigger: { trigger: c, containerAnimation: tween, start: "left 75%", end: "left 35%", scrub: 1 },
        });
      });
    });
    mm.add("(max-width: 899px)", () => {
      gsap.utils.toArray<HTMLElement>(".combo", track.current).forEach((c) =>
        gsap.from(c, { y: 80, autoAlpha: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: c, start: "top 85%" } })
      );
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="combos" id="combos">
      <div className="combos-bg" aria-hidden><Photo photo="spread" alt="" fill sizes="100vw" quality={60} /></div>
      <div ref={track} className="combos-track">
        <div className="combos-intro">
          <p className="eyebrow eyebrow--light">ready-made mehfil</p>
          <h2>Combos<br /><span className="hand">for every gang size</span></h2>
          <p>Plates, glasses, water — sorted. You just bring the people.</p>
          <span className="combos-arrow" aria-hidden>→</span>
        </div>
        {COMBOS.map((c, i) => (
          <article className={`combo combo--${i + 1}`} key={c.id}>
            <div className="combo-imgs">
              {c.imgs.map((src, k) => (
                <div key={src + k} style={{ ["--k" as string]: k }}><Photo photo={src} alt="" fill sizes="240px" /></div>
              ))}
            </div>
            <div className="combo-body">
              <span className="combo-tag">{c.name}</span>
              <h3>{c.mood}</h3>
              <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
              <div className="combo-foot">
                <span className="combo-price"><small>₹</small>{c.price}</span>
                {cart.qty(c.id) ? (
                  <div className="stepper stepper--light">
                    <button onClick={() => cart.remove(c.id)} aria-label="Remove one">−</button>
                    <b>{cart.qty(c.id)}</b>
                    <button onClick={() => cart.add(c.id)} aria-label="Add one">+</button>
                  </div>
                ) : (
                  <button className="btn btn--yellow" onClick={() => cart.add(c.id)}>Add combo</button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
