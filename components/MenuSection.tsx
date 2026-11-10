"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MENU, type MenuItem } from "@/lib/menu";
import { useCart } from "./providers/Cart";
import { useLenis } from "./providers/SmoothScroll";
import Photo from "./Photo";
import type { PhotoKey } from "@/lib/photos";
import Doodle from "./Doodle";
import FoodDecor from "./FoodDecor";

gsap.registerPlugin(ScrollTrigger);

// if a photo ever fails to load, show this one instead
const FALLBACK: Record<string, string> = {
  prawn: "1559742811-822873691df8",
  kasha: "1545247181-516773cae754",
  "chilli-chk": "1572363644253-3daacc7acd0d",
  pamfret: "1765265432611-17d3f2da2d5d",
  "fish-masala": "1765265432607-cdc1060294ba",
};

const CAT_PHOTO: Record<string, PhotoKey> = {
  all: "seafoodSpread", authentic: "kadaiKasha", egg: "eggFry", seafood: "pomfretFry",
  snacks: "peanutsShell", steamed: "masalaChana", beverages: "coldDrink",
};

const tints = ["#ffe81a", "#ffd6c2", "#fff1b8", "#ffe0e0", "#f9f3dd", "#ffe9a8"];

function DietMark({ diet }: { diet: MenuItem["diet"] }) {
  const label = diet === "veg" ? "Veg" : diet === "egg" ? "Contains egg" : "Non-veg";
  return <span className={`diet diet--${diet}`} title={label} aria-label={label}><i /></span>;
}

function Card({ item, idx }: { item: MenuItem; idx: number }) {
  const cart = useCart();
  const n = cart.qty(item.id);
  const ref = useRef<HTMLElement>(null);

  // subtle 3D tilt toward the pointer
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, { rotateY: x * 10, rotateX: -y * 10, duration: 0.5, ease: "power3" });
    gsap.to(ref.current!.querySelector(".card-media > *"), { x: x * 16, y: y * 16, duration: 0.6, ease: "power3" });
  };
  const onLeave = () => {
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
    gsap.to(ref.current!.querySelector(".card-media > *"), { x: 0, y: 0, duration: 0.8 });
  };

  const add = (e: React.MouseEvent) => {
    cart.add(item.id);
    // fly a little chip to the cart icon
    const target = document.querySelector(".nav-cart");
    if (!target) return;
    const chip = document.createElement("span");
    chip.className = "fly-chip";
    chip.textContent = "+1";
    document.body.appendChild(chip);
    const t = target.getBoundingClientRect();
    gsap.set(chip, { x: e.clientX, y: e.clientY });
    gsap.to(chip, {
      x: t.left + t.width / 2, y: t.top + t.height / 2, scale: 0.4, duration: 0.8, ease: "power2.in",
      onComplete: () => chip.remove(),
    });
    gsap.fromTo(chip, { rotate: -20 }, { rotate: 360, duration: 0.8, ease: "none" });
  };

  return (
    <article
      ref={ref}
      className="card"
      data-flip-id={item.id}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ ["--tint" as string]: tints[idx % tints.length] }}
    >
      {item.hot && <span className="card-ribbon">Bestseller</span>}
      <div className="card-media">
        {item.photo ? (
          <Photo photo={item.photo} alt={item.name} fill loading="eager" fallback={FALLBACK[item.id]} sizes="(max-width: 860px) 50vw, 300px" />
        ) : (
          <Doodle name={item.doodle ?? "bowl"} />
        )}
      </div>
      <div className="card-body">
        <div className="card-top">
          <DietMark diet={item.diet} />
          {item.note && <span className="card-note">{item.note}</span>}
        </div>
        <h3>{item.name}</h3>
        <div className="card-foot">
          <span className="price">{item.price === null ? <em>Price on request</em> : <>₹{item.price}</>}</span>
          {n === 0 ? (
            <button className="add" onClick={add}>ADD<sup>+</sup></button>
          ) : (
            <div className="stepper" role="group" aria-label={`${item.name} quantity`}>
              <button onClick={() => cart.remove(item.id)} aria-label="Remove one">−</button>
              <b key={n}>{n}</b>
              <button onClick={add} aria-label="Add one">+</button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MenuSection() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [cat, setCat] = useState<string>("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [query, setQuery] = useState("");
  const changed = useRef(false);
  const fromHero = useRef(false);
  const lenis = useLenis();

  // listen to the hero search box
  useEffect(() => {
    const on = (e: Event) => { fromHero.current = true; capture(); setQuery((e as CustomEvent<string>).detail ?? ""); setCat("all"); };
    window.addEventListener("mc:search", on);
    return () => window.removeEventListener("mc:search", on);
  }, []);

  const capture = () => { changed.current = true; };

  // "All" shows a compact 3-row preview; "Show full menu" expands it
  const [expanded, setExpanded] = useState(false);
  const [perRow, setPerRow] = useState(4);
  useEffect(() => {
    const calc = () => setPerRow(window.innerWidth >= 1100 ? 4 : window.innerWidth >= 860 ? 3 : 2);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  const compact = cat === "all" && !query.trim() && !expanded;
  const totalAll = useMemo(() => MENU.reduce((a, c) => a + c.items.filter((i) => !vegOnly || i.diet === "veg").length, 0), [vegOnly]);
  const preview = useMemo(() => {
    if (!compact) return [];
    const all = MENU.flatMap((c) => c.items).filter((i) => (!vegOnly || i.diet === "veg") && i.photo);
    const hot = all.filter((i) => i.hot), rest = all.filter((i) => !i.hot);
    return [...hot, ...rest].slice(0, perRow * 3);
  }, [compact, vegOnly, perRow]);

  const groups = useMemo(() => {
    const ql = query.trim().toLowerCase();
    return MENU.filter((c) => cat === "all" || c.id === cat)
      .map((c) => ({
        ...c,
        items: c.items.filter((i) =>
          (!vegOnly || i.diet === "veg") &&
          (!ql || i.name.toLowerCase().includes(ql) || c.title.toLowerCase().includes(ql))
        ),
      }))
      .filter((c) => c.items.length);
  }, [cat, vegOnly, query]);

  // filter / search changed → bring the results into view and deal the cards in.
  // (No layout-morphing here: headings used to fly across the title mid-animation.)
  useLayoutEffect(() => {
    if (!changed.current || !grid.current) return;
    changed.current = false;
    const g = grid.current;
    const cards = g.querySelectorAll<HTMLElement>(".card");
    cards.forEach((c) => c.classList.add("is-in"));
    gsap.fromTo(g.querySelectorAll(".cat-head"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", overwrite: true });
    gsap.fromTo(cards, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.035, ease: "power3.out", overwrite: true });
    const top = g.getBoundingClientRect().top;
    if (fromHero.current) { fromHero.current = false; }
    else if (top < 0 || top > window.innerHeight * 0.6) {
      const y = window.scrollY + top - 190;
      lenis ? lenis.scrollTo(y, { duration: 0.9 }) : window.scrollTo({ top: y, behavior: "smooth" });
    }
    ScrollTrigger.refresh();
  }, [groups, lenis, compact]);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    gsap.from(q(".menu-title .ln > span"), {
      yPercent: 110, stagger: 0.12, duration: 1.1, ease: "expo.out",
      scrollTrigger: { trigger: q(".menu-title"), start: "top 80%" },
    });
  }, { scope: root });

  // Reveal cards as they come into view. IntersectionObserver (not scroll math) so it can't
  // miss a card after filtering / resizing, and opacity only (never visibility:hidden) so the
  // browser still lazy-loads each card's photo.
  useEffect(() => {
    const cards = Array.from(grid.current?.querySelectorAll<HTMLElement>(".card:not(.is-in)") ?? []);
    if (!cards.length) return;
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      if (!vis.length) return;
      vis.forEach((v) => { v.classList.add("is-in"); io.unobserve(v); });
      gsap.fromTo(vis, { y: 40, opacity: 0.001, rotate: () => gsap.utils.random(-3, 3) }, {
        y: 0, opacity: 1, rotate: 0, stagger: 0.07, duration: 0.9, ease: "power3.out", overwrite: true,
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    cards.forEach((c) => io.observe(c));
    // belt-and-braces: if a card is on screen but somehow wasn't revealed, show it
    const check = () => {
      cards.forEach((c) => {
        if (c.classList.contains("is-in")) return;
        const r = c.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { c.classList.add("is-in"); io.unobserve(c); gsap.to(c, { opacity: 1, y: 0, rotate: 0, duration: 0.6 }); }
      });
    };
    const t = setInterval(check, 1200);
    return () => { io.disconnect(); clearInterval(t); };
  }, [groups]);

  // sliding red pill behind the active category
  const chipsRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const place = (instant = false) => {
      const btn = chipsRef.current?.querySelector<HTMLElement>(`[data-cat="${cat}"]`);
      if (!btn || !indRef.current) return;
      gsap.to(indRef.current, {
        x: btn.offsetLeft, width: btn.offsetWidth, height: btn.offsetHeight, y: btn.offsetTop,
        duration: instant ? 0 : 0.55, ease: "power3.out",
      });
      const c = chipsRef.current!;
      const target = btn.offsetLeft - c.clientWidth / 2 + btn.offsetWidth / 2;
      if (!instant) c.scrollTo({ left: target, behavior: "smooth" });
    };
    place(!indRef.current?.style.width);
    const onR = () => place(true);
    window.addEventListener("resize", onR);
    document.fonts?.ready.then(() => place(true));
    return () => window.removeEventListener("resize", onR);
  }, [cat]);

  // add .is-stuck while the filter bar is pinned to the top
  const sentinel = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const check = () => {
      const bar = filtersRef.current, mark = sentinel.current;
      if (!bar || !mark) return;
      // the sentinel sits right above the bar; once the bar sticks they separate
      const stuck = bar.getBoundingClientRect().top - mark.getBoundingClientRect().top > 2;
      bar.classList.toggle("is-stuck", stuck);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  const pick = (id: string) => { capture(); setCat(id); setQuery(""); setExpanded(false); };
  const toggleVeg = () => { capture(); setVegOnly((v) => !v); };

  let idx = 0;
  return (
    <section ref={root} className="menu" id="menu">
      <FoodDecor items={[
        { photo: "greenChilli", kind: "cut", x: "-4%", y: "2%", w: "clamp(140px, 16vw, 260px)", rot: -28, depth: 0.8, hideMobile: true },
        { photo: "redChilli", kind: "cut", x: "82%", y: "1%", w: "clamp(140px, 15vw, 240px)", rot: 22, depth: -0.6 },
        { photo: "peanutsShell", kind: "round", x: "-3.5%", y: "34%", w: "clamp(80px, 8vw, 130px)", rot: 0, depth: 0.5, hideMobile: true },
        { photo: "lemon", kind: "round", x: "96%", y: "52%", w: "clamp(70px, 7vw, 120px)", rot: 0, depth: -0.4, hideMobile: true },
        { photo: "greenChilli", kind: "cut", x: "90%", y: "78%", w: "clamp(120px, 13vw, 200px)", rot: 140, depth: 0.7, hideMobile: true },
        { photo: "kaju", kind: "round", x: "-3%", y: "82%", w: "clamp(70px, 7vw, 120px)", depth: -0.5, hideMobile: true },
      ]} />
      <div className="container">
        <header className="menu-head">
          <h2 className="menu-title">
            <span className="ln"><span>The menu</span></span>
            <span className="ln"><span className="odia">ମେନୁ</span> <span className="hand red">fresh tonight</span></span>
          </h2>
          <p className="menu-lede">Everything below is cooked to order. Tap <b>ADD</b>, build your plate, and send it to us on WhatsApp — no app, no login, no fuss.</p>
        </header>

        <div className="menu-filters-sentinel" ref={sentinel} aria-hidden />
        <div className="menu-filters" ref={filtersRef}>
          <div className="chips" role="tablist" aria-label="Menu categories" ref={chipsRef}>
            <span className="chip-ind" ref={indRef} aria-hidden />
            {[{ id: "all", title: "All", n: MENU.reduce((a, c) => a + c.items.length, 0) }, ...MENU.map((c) => ({ id: c.id, title: c.title, n: c.items.length }))].map((c) => (
              <button
                key={c.id}
                role="tab"
                data-cat={c.id}
                aria-selected={cat === c.id}
                className={cat === c.id ? "on" : ""}
                onClick={() => pick(c.id)}
              >
                <span className="chip-img"><Photo photo={CAT_PHOTO[c.id]} alt="" fill loading="eager" sizes="44px" /></span>
                <span className="chip-t">{c.title}</span>
                <em>{c.n}</em>
              </button>
            ))}
          </div>
          <div className="menu-tools">
            <label className="veg-toggle">
              <input type="checkbox" checked={vegOnly} onChange={toggleVeg} />
              <span className="sw"><i /></span> Veg only
            </label>
            <div className="menu-search">
              <input
                placeholder="Search dishes…"
                value={query}
                onChange={(e) => { capture(); setQuery(e.target.value); }}
                aria-label="Search dishes"
              />
              {query && <button onClick={() => { capture(); setQuery(""); }} aria-label="Clear search">×</button>}
            </div>
          </div>
        </div>

        <div ref={grid} className="menu-grid" id="menu-results">
          {compact && (
            <div className="cat">
              <div className="cat-head">
                <h3>Tonight&apos;s picks <span className="odia">ଆଜି ରାତି</span></h3>
                <p>Bestsellers first — the full menu is one tap away.</p>
              </div>
              <div className="cards">
                {preview.map((it) => <Card key={it.id} item={it} idx={idx++} />)}
              </div>
              <div className="menu-more">
                <button className="btn btn--red btn--lg" onClick={() => { capture(); setExpanded(true); }}>
                  Show full menu · {totalAll} dishes ↓
                </button>
              </div>
            </div>
          )}
          {!compact && groups.length === 0 && (
            <p className="menu-empty hand">Hmm, that one&apos;s not on the menu yet. Try &quot;chicken&quot; or &quot;chana&quot;?</p>
          )}
          {!compact && groups.map((g) => (
            <div className="cat" key={g.id}>
              <div className="cat-head" data-flip-id={`h-${g.id}`}>
                <h3>{g.title} <span className="odia">{g.odia}</span></h3>
                <p>{g.blurb}</p>
              </div>
              <div className="cards">
                {g.items.map((it) => <Card key={it.id} item={it} idx={idx++} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
