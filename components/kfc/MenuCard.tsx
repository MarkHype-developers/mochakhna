"use client";

import Photo from "../Photo";
import { CUTOUTS, cutSrc } from "@/lib/cutouts";
import { useCart } from "../providers/Cart";
import type { MenuItem } from "@/lib/menu";

const dietLabel = (d: MenuItem["diet"]) => (d === "veg" ? "Veg" : d === "egg" ? "Egg" : "Non Veg");

/** KFC menu-page card: image with red "+" in the corner, condensed title, details row. */
export default function MenuCard({ item, eager = false }: { item: MenuItem; eager?: boolean }) {
  const cart = useCart();
  const n = cart.qty(item.id);
  const price = item.priceLabel ?? (item.price === null ? "MRP" : `₹${item.price}`);

  return (
    <article className="mc" id={`dish-${item.id}`}>
      <div className={`mc-img${CUTOUTS.has(item.photo) ? " is-cut" : ""}`}>
        {CUTOUTS.has(item.photo) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cutSrc(item.photo)} alt={item.name} loading={eager ? "eager" : "lazy"} decoding="async" className="mc-cut" />
        ) : (
          <Photo photo={item.photo} alt={item.name} fill loading={eager ? "eager" : "lazy"} sizes="(max-width: 700px) 50vw, (max-width: 1200px) 33vw, 320px" />
        )}
        {item.tag && <span className="mc-tag">{item.tag}</span>}
        {n === 0 ? (
          <button className="mc-plus" onClick={() => cart.add(item.id)} aria-label={`Add ${item.name}`}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
          </button>
        ) : (
          <div className="mc-step" role="group" aria-label={`${item.name} quantity`}>
            <button onClick={() => cart.remove(item.id)} aria-label="Remove one">−</button>
            <b key={n}>{n}</b>
            <button onClick={() => cart.add(item.id)} aria-label="Add one">+</button>
          </div>
        )}
      </div>
      <div className="mc-head">
        <h3>{item.name}</h3>
        <span className="mc-price">{price}</span>
      </div>
      <div className="mc-body">
        {item.desc && <p>{item.desc}</p>}
        <div className="mc-meta">
          <span>Serves: {item.serves ?? 1}{item.qty ? ` | ${item.qty}` : ""}</span>
          <span className={`mc-diet mc-diet--${item.diet}`}><i aria-hidden /> {dietLabel(item.diet)}</span>
        </div>
      </div>
    </article>
  );
}
