"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onLoaded } from "@/lib/loaded";
import Photo from "./Photo";
import { useContent } from "./providers/Content";

gsap.registerPlugin(SplitText);

const Steam = dynamic(() => import("./hero/Steam"), { ssr: false });

const cravings = ["chicken kasha", "chicken tikka", "french fries", "masala fish fry", "chilli paneer", "lollipops"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [q, setQ] = useState("");
  const router = useRouter();
  const { home } = useContent();

  useGSAP((_, contextSafe) => {
    const qs = gsap.utils.selector(root);
    const split = new SplitText(qs(".hero-title"), { type: "chars,words", charsClass: "ch" });

    // initial states inside the context → StrictMode-safe; intro uses .to only
    gsap.set(qs(".hero-reveal"), { autoAlpha: 0, y: 40 });
    gsap.set(split.chars, { yPercent: 120, rotate: 12 });
    gsap.set(qs(".hero-logo"), { scale: 0.6, autoAlpha: 0, rotate: -6 });

    const intro = contextSafe!(() => {
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .to(qs(".hero-logo"), { scale: 1, autoAlpha: 1, rotate: 0, duration: 1.4, ease: "elastic.out(1,0.6)" }, 0)
        .to(split.chars, { yPercent: 0, rotate: 0, stagger: 0.025, duration: 1.1 }, 0.25)
        .to(qs(".hero-reveal"), { autoAlpha: 1, y: 0, stagger: 0.1, duration: 1 }, 0.6);
    });
    const off = onLoaded(intro);

    // rotating search placeholder, Zomato-style
    const ph = qs(".hero-ph b")[0] as HTMLElement | undefined;
    if (ph) {
      let i = 0;
      const cycle = gsap.timeline({ repeat: -1, delay: 3.5 });
      cravings.forEach(() => {
        cycle.to(ph, { yPercent: -100, autoAlpha: 0, duration: 0.35, ease: "power2.in", onComplete: () => { i = (i + 1) % cravings.length; ph.textContent = `"${cravings[i]}"`; } })
          .fromTo(ph, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" })
          .to({}, { duration: 1.6 });
      });
    }

    gsap.fromTo(qs(".hero-fish"), { scale: 1.12 }, { scale: 1, duration: 8, ease: "power1.out" });
    return () => { off(); split.revert(); };
  }, { scope: root });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/menu?q=${encodeURIComponent(q.trim())}` : "/menu");
  };

  return (
    <section ref={root} className="hero" id="top">
      <div className="hero-fish" aria-hidden>
        <Photo photo={home.heroPhoto} alt="" fill priority sizes="100vw" quality={70} />
      </div>
      <Steam className="hero-steam" />
      <div className="hero-vignette" />

      <div className="hero-content">

        <div className="hero-logo">
          <Image src="/img/mochakhna-logo.png" alt="Mo Chakhna — Daru Ka Dost. We never sell alcohol." width={1043} height={581} priority />
        </div>

        <h1 className="hero-title">Peg aapka. Chakhna humara.</h1>

        <form className="hero-reveal hero-search" onSubmit={submit} role="search">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          <label className="sr-only" htmlFor="hero-q">Search the menu</label>
          <input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
          {!q && <span className="hero-ph" aria-hidden>Search for <b>&quot;{cravings[0]}&quot;</b></span>}
          <button type="submit" className="btn btn--red">Find it</button>
        </form>

        <div className="hero-reveal hero-ctas">
          <Link href="/menu" className="btn btn--yellow btn--lg">View Menu</Link>
          <Link href="/deals" className="btn btn--ghost btn--lg">Today&apos;s Deals</Link>
        </div>
      </div>

      <svg className="hero-edge" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0 60c120 30 240 40 360 30s240-50 360-50 240 40 360 50 240-10 360-30v60H0z" fill="#ffe81a" />
      </svg>
    </section>
  );
}
