"use client";

import Photo from "../Photo";
import { useCart } from "../providers/Cart";
import type { MenuItem } from "@/lib/menu";

export function DietTag({ diet }: { diet: MenuItem["diet"] }) {
  const label = diet === "veg" ? "Veg" : diet === "egg" ? "Egg" : "Non veg";
  return (
    <span className={`pc-diet pc-diet--${diet}`}>
      <i aria-hidden /> {label}
    </span>
  );
}

export function AddButton({ id, label = "Add to Cart" }: { id: string; label?: string }) {
  const cart = useCart();
  const n = cart.qty(id);
  if (n > 0) {
    return (
      <div className="pc-stepper" role="group" aria-label="Quantity">
        <button onClick={() => cart.remove(id)} aria-label="Remove one">−</button>
        <b key={n}>{n}</b>
        <button onClick={() => cart.add(id)} aria-label="Add one">+</button>
      </div>
    );
  }
  return (
    <button className="pc-add" onClick={() => cart.add(id)}>
      {label}
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path d="M4 9h16l-1.5 10.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5zM8 9V7a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export default function ProductCard({ item, priority = false }: { item: MenuItem; priority?: boolean }) {
  return (
    <article className="pc" id={`dish-${item.id}`}>
      <div className="pc-img">
        <Photo photo={item.photo} alt={item.name} fill loading={priority ? "eager" : "lazy"} priority={priority} sizes="(max-width: 700px) 50vw, (max-width: 1200px) 33vw, 300px" />
        {item.tag && <span className={`pc-tag pc-tag--${item.tag === "New" ? "new" : "hot"}`}>{item.tag}</span>}
      </div>
      <div className="pc-body">
        <h3 className="pc-name">{item.name}</h3>
        <div className="pc-meta">
          <DietTag diet={item.diet} />
          {item.qty && <span className="pc-qty">• {item.qty}</span>}
        </div>
        <div className="pc-price">{item.priceLabel ? <span className="pc-call">{item.priceLabel}</span> : item.price === null ? <span className="pc-call">MRP</span> : <>₹{item.price}</>}</div>
        {item.desc && <p className="pc-desc">{item.desc}</p>}
        <div className="pc-cta"><AddButton id={item.id} /></div>
      </div>
    </article>
  );
}
