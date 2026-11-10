"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Photo from "../Photo";
import ProductCard from "./ProductCard";
import DealCard from "./DealCard";
import Rail from "./Rail";
import { BESTSELLERS, DEALS, MENU } from "@/lib/menu";
import { SITE } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const root = useRef<HTMLDivElement>(null);


  return (
    <div ref={root} className="kh">
      {/* Browse categories */}
      <section className="ks">
        <div className="kwrap">
          <header className="ks-head">
            <h2 className="kh2">Browse categories</h2>
            <Link href="/menu" className="ks-more">View full menu →</Link>
          </header>
          <div className="cat-grid">
            {MENU.map((c) => (
              <Link key={c.id} href={`/menu#cat-${c.id}`} className="cat-tile rv">
                <span className="cat-img"><Photo photo={c.photo} alt="" fill sizes="(max-width: 700px) 45vw, 220px" /></span>
                <span className="cat-name">{c.title}</span>
                <span className="cat-n">{c.items.length} items</span>
              </Link>
            ))}
            <Link href="/deals" className="cat-tile cat-tile--deal rv">
              <span className="cat-img"><Photo photo="seafoodSpread" alt="" fill sizes="(max-width: 700px) 45vw, 220px" /></span>
              <span className="cat-name">Deals &amp; Combos</span>
              <span className="cat-n">From ₹{Math.min(...DEALS.map((d) => d.price))}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Top deals */}
      <section className="ks ks--deals">
        <div className="kwrap">
          <header className="ks-head">
            <h2 className="kh2 kh2--light">Top deals for you</h2>
            <Link href="/deals" className="ks-more ks-more--light">All deals →</Link>
          </header>
          <div className="deal-grid">
            {DEALS.map((d) => <div className="rv" key={d.id}><DealCard deal={d} /></div>)}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="ks">
        <div className="kwrap">
          <header className="ks-head">
            <h2 className="kh2">Bestsellers &amp; new</h2>
            <Link href="/menu" className="ks-more">See everything →</Link>
          </header>
        </div>
        <Rail>
          {BESTSELLERS.map((it) => <div className="rail-cell" key={it.id}><ProductCard item={it} /></div>)}
        </Rail>
      </section>

      {/* Promise strip */}
      <section className="ks ks--strip">
        <div className="kwrap strip">
          {[
            ["Cooked to order", "Nothing waits under a heat lamp."],
            ["Open every day", SITE.hours.replace("Every day · ", "")],
            ["Order on WhatsApp", "No app, no login. Just send your cart."],
            ["We never sell alcohol", "Food, soft drinks & table essentials only."],
          ].map(([t, d]) => (
            <div className="strip-i rv" key={t}><b>{t}</b><span>{d}</span></div>
          ))}
        </div>
      </section>
    </div>
  );
}
