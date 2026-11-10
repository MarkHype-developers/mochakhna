"use client";

import Photo from "../Photo";
import { AddButton } from "./ProductCard";
import type { Deal } from "@/lib/menu";

export default function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="dc">
      <div className="dc-img">
        <Photo photo={deal.photo} alt={deal.title} fill sizes="(max-width: 700px) 90vw, 400px" />
        {deal.badge && <span className="pc-tag pc-tag--hot">{deal.badge}</span>}
        <span className="dc-serves">{deal.serves}</span>
      </div>
      <div className="dc-body">
        <span className="dc-kicker">{deal.name}</span>
        <h3>{deal.title}</h3>
        <ul>{deal.items.map((i) => <li key={i}>{i}</li>)}</ul>
        <div className="dc-foot">
          <span className="dc-price">₹{deal.price}</span>
          <AddButton id={deal.id} label="Add Deal" />
        </div>
      </div>
    </article>
  );
}
