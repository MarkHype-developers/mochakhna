"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ODIA_CLUSTERS, SITE, waLink } from "@/lib/site";
import { useGoTo } from "./providers/SmoothScroll";
import Photo from "./Photo";
import type { PhotoKey } from "@/lib/photos";

const strip: PhotoKey[] = ["kasha", "masalaChana", "fishMasala", "chickenPakoda", "peanuts", "prawn", "chilliChicken", "salad", "kaju", "eggFry"];

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const goTo = useGoTo();
  const jump = (e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); goTo(e.currentTarget.getAttribute("href")!); };

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    gsap.from(q(".ft-big span"), {
      yPercent: 100, rotate: 8, stagger: 0.06, duration: 1.2, ease: "expo.out",
      scrollTrigger: { trigger: q(".ft-big"), start: "top 95%" },
    });
    gsap.fromTo(q(".ft-strip-track"), { xPercent: 0 }, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    gsap.from(q(".ft-col"), { y: 40, autoAlpha: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: root.current, start: "top 80%" } });
  }, { scope: root });

  const year = new Date().getFullYear();

  return (
    <footer ref={root} className="footer">
      <div className="ft-strip" aria-hidden>
        <div className="ft-strip-track">
          {[...strip, ...strip].map((p, i) => (
            <div className="ft-strip-item" key={i} style={{ ["--r" as string]: `${(i % 2 ? 1 : -1) * (2 + (i % 3))}deg` }}>
              <Photo photo={p} alt="" fill sizes="220px" />
            </div>
          ))}
        </div>
      </div>
      <div className="container">
        <div className="ft-cta">
          <h2>Bhook lagi? <span className="hand">Order abhi.</span></h2>
          <a className="btn btn--yellow btn--lg" href={waLink("Hi Mo Chakhna! I'd like to place an order.")} target="_blank" rel="noreferrer">
            Order on WhatsApp
          </a>
        </div>

        <div className="ft-cols">
          <div className="ft-col">
            <h4>Visit / Call</h4>
            <p>{SITE.address}</p>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
          <div className="ft-col">
            <h4>Explore</h4>
            <a href="#menu" onClick={jump}>Menu</a>
            <a href="#combos" onClick={jump}>Combos</a>
            <a href="#ayunraz" onClick={jump}>About Ayunraz</a>
          </div>
          <div className="ft-col">
            <h4>Follow</h4>
            <a href={SITE.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={waLink("Hi!")} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
          <div className="ft-col ft-note">
            <h4>Our promise</h4>
            <p><b>We never sell alcohol.</b> Mo Chakhna serves food, soft drinks and table essentials only. Please drink responsibly and never drink and drive.</p>
          </div>
        </div>
      </div>

      <div className="ft-big odia" aria-hidden>
        {ODIA_CLUSTERS.map((c, i) => <span key={i}>{c === " " ? " " : c}</span>)}
      </div>

      <div className="container ft-bottom">
        <span>© {year} Mo Chakhna · A brand of <b>Ayunraz</b> — Authentic Food Of New India</span>
        <span>{SITE.domain}</span>
      </div>
    </footer>
  );
}
