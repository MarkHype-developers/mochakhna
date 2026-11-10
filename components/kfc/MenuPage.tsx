"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import MenuCard from "./MenuCard";
import { MENU } from "@/lib/menu";
import { useLenis } from "../providers/SmoothScroll";
import { SITE } from "@/lib/site";

const headerH = () => (document.querySelector<HTMLElement>(".kn")?.offsetHeight ?? 132);

export default function MenuPage() {
  const params = useSearchParams();
  const [q, setQ] = useState(params?.get("q") ?? "");
  const [vegOnly, setVegOnly] = useState(false);
  const [active, setActive] = useState(MENU[0].id);
  const [showTop, setShowTop] = useState(false);
  const lenis = useLenis();
  const sideRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQ(params?.get("q") ?? ""); }, [params]);

  const groups = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return MENU.map((c) => ({
      ...c,
      items: c.items.filter((i) => (!vegOnly || i.diet === "veg") && (!ql || `${i.name} ${c.title} ${i.desc}`.toLowerCase().includes(ql))),
    })).filter((c) => c.items.length);
  }, [q, vegOnly]);

  // scroll-spy + back-to-top
  useEffect(() => {
    const els = groups.map((g) => document.getElementById(`cat-${g.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id.replace("cat-", ""));
    }, { rootMargin: "-170px 0px -60% 0px" });
    els.forEach((e) => io.observe(e));
    const onS = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onS, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onS); };
  }, [groups]);

  // keep the active category visible in the phone scroller
  useEffect(() => {
    const box = sideRef.current;
    const a = box?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (a && box && box.scrollWidth > box.clientWidth + 4) box.scrollTo({ left: a.offsetLeft - box.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  const jump = (id: string) => {
    const el = document.getElementById(`cat-${id}`);
    if (!el) return;
    const phoneBar = window.innerWidth <= 900 ? (sideRef.current?.offsetHeight ?? 52) : 0;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH() - phoneBar - 18;
    lenis ? lenis.scrollTo(y, { duration: 0.9 }) : window.scrollTo({ top: y, behavior: "smooth" });
    setActive(id);
    history.replaceState(null, "", `#cat-${id}`);
  };

  // deep links like /menu#cat-fish
  useEffect(() => {
    const h = window.location.hash;
    if (h.startsWith("#cat-")) setTimeout(() => jump(h.slice(5)), 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 1 }) : window.scrollTo({ top: 0, behavior: "smooth" }));

  return (
    <div className="kmn">
      <div className="kwrap kmn-grid">
        <aside className="kmn-side" data-lenis-prevent>
          <div className="kmn-side-in">
            <span className="stripes" aria-hidden><i /><i /><i /></span>
            <h1 className="kmn-title">{SITE.name}<br />Menu</h1>
            <div className="kmn-list" ref={sideRef}>
              {groups.map((g) => (
                <button key={g.id} data-cat={g.id} className={active === g.id ? "on" : ""} onClick={() => jump(g.id)}>{g.title}</button>
              ))}
            </div>
            <div className="kmn-tools">
              <div className="kmn-search">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search menu" aria-label="Search menu" />
                {q && <button onClick={() => setQ("")} aria-label="Clear search">×</button>}
              </div>
              <label className="km-veg">
                <input type="checkbox" checked={vegOnly} onChange={() => setVegOnly((v) => !v)} />
                <span className="sw"><i /></span> Veg only
              </label>
            </div>
          </div>
        </aside>

        <div className="kmn-main">
          {groups.length === 0 && (
            <div className="km-empty">
              <b>No dishes found for “{q}”.</b>
              <button className="btn btn--red" onClick={() => { setQ(""); setVegOnly(false); }}>Show full menu</button>
            </div>
          )}
          {groups.map((g, gi) => (
            <section key={g.id} id={`cat-${g.id}`} className="kmn-sec">
              <h2 className="kmn-h">{g.title}</h2>
              <div className="mc-grid">
                {g.items.map((it, i) => <MenuCard key={it.id} item={it} eager={gi === 0 && i < 6} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
      <button className={`kmn-top${showTop ? " on" : ""}`} onClick={toTop} aria-label="Back to top">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}
