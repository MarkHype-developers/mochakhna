"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCart } from "./providers/Cart";
import { useGoTo } from "./providers/SmoothScroll";
import { SITE, waLink } from "@/lib/site";
import { onLoaded } from "@/lib/loaded";

const links = [
  { href: "#story", label: "Story" },
  { href: "#menu", label: "Menu" },
  { href: "#combos", label: "Combos" },
  { href: "#ayunraz", label: "Ayunraz" },
];

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const cart = useCart();
  const goTo = useGoTo();

  useGSAP((_, contextSafe) => {
    const el = ref.current!;
    const items = el.querySelectorAll(".nav-logo, .nav-links a, .nav-cta > *");
    gsap.set(items, { y: -30, autoAlpha: 0 });
    const off = onLoaded(contextSafe!(() => {
      gsap.to(items, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.8, ease: "power3.out", delay: 0.2 });
    }));

    // hide on scroll down, show on scroll up
    const hide = gsap.fromTo(el, { yPercent: 0 }, { yPercent: -140, paused: true, duration: 0.45, ease: "power3.inOut" });
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (s) => {
        el.classList.toggle("is-scrolled", s.scroll() > 60);
        if (s.direction === 1 && s.scroll() > 500) { hide.play(); document.documentElement.classList.add("nav-hidden"); }
        else if (s.direction === -1) { hide.reverse(); document.documentElement.classList.remove("nav-hidden"); }
      },
    });

    // brand-coloured reading progress line
    gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
    return off;
  }, { scope: ref });

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    goTo(href, { offset: href === "#menu" ? 0 : -20 });
  };

  return (
    <>
      <div ref={bar} className="scroll-progress" aria-hidden />
      <header ref={ref} className="nav">
        <a href="#top" className="nav-logo" onClick={(e) => go(e, "#top")} aria-label={SITE.name}>
          <Image src="/img/mochakhna-logo.png" alt="Mo Chakhna" width={1043} height={581} priority />
        </a>
        <nav className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
              <span className="roll"><span data-text={l.label}>{l.label}</span></span>
            </a>
          ))}
        </nav>
        <div className="nav-cta">
          <a className="btn btn--ghost btn--sm hide-sm" href={waLink("Hi Mo Chakhna! I'd like to place an order.")} target="_blank" rel="noreferrer">
            Order on WhatsApp
          </a>
          <button className="nav-cart" onClick={() => cart.setOpen(true)} aria-label="Open cart">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M4 9h16l-1.5 10.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5zM8 9V7a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <b key={cart.count} className={cart.count ? "pop" : ""}>{cart.count}</b>
          </button>
        </div>
      </header>
    </>
  );
}
