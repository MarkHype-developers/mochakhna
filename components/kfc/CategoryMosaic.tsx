"use client";

import Link from "next/link";
import Photo from "../Photo";
import { MENU } from "@/lib/menu";
import type { PhotoKey } from "@/lib/photos";
import { SITE } from "@/lib/site";

/** KFC "Browse menu categories" mosaic: one big feature tile, then a grid of category tiles. */
export default function CategoryMosaic() {
  const tiles: { href: string; label: string; photo: PhotoKey }[] = MENU.map((c) => ({ href: `/menu#cat-${c.id}`, label: c.title, photo: c.photo }));
  const [a, b, c, d, ...rest] = tiles;

  return (
    <div className="mz">
      <Link href="/deals" className="mz-feature">
        <span className="mz-img"><Photo photo="seafoodSpread" alt="" fill sizes="(max-width: 700px) 100vw, 600px" /></span>
        <span className="mz-feature-copy">
          <em>Party combos</em>
          <b>From ₹299</b>
        </span>
        <span className="mz-label">Deals &amp; Combos</span>
      </Link>
      {[a, b, c, d].filter(Boolean).map((t) => (
        <Link key={t.label} href={t.href} className="mz-tile">
          <span className="mz-img"><Photo photo={t.photo} alt="" fill sizes="(max-width: 700px) 50vw, 280px" /></span>
          <span className="mz-label">{t.label}</span>
        </Link>
      ))}
      {rest.map((t) => (
        <Link key={t.label} href={t.href} className="mz-tile">
          <span className="mz-img"><Photo photo={t.photo} alt="" fill sizes="(max-width: 700px) 50vw, 280px" /></span>
          <span className="mz-label">{t.label}</span>
        </Link>
      ))}
      <Link href="/menu" className="mz-cta">
        <span className="mz-cta-script">{SITE.tagline}</span>
        <span className="mz-cta-link">View All Menu <i aria-hidden>⟶</i></span>
      </Link>
    </div>
  );
}
