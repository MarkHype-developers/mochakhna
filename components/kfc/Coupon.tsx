"use client";

import { useState } from "react";
import Photo from "../Photo";
import { useCart } from "../providers/Cart";

type Props = {
  title: string;
  line: string;
  photo: string;
  details?: string[];
  addId?: string;        // cart id to add on "Apply Offer"
  cta?: string;
  badge?: string;
};

/** KFC "Save more as you order" coupon: stamp-edged red top with the photo, details below. */
export default function Coupon({ title, line, photo, details, addId, cta = "Apply Offer", badge }: Props) {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const n = addId ? cart.qty(addId) : 0;

  return (
    <article className="cp">
      <div className="cp-top">
        <div className="cp-frame">
          <span className="cp-img"><Photo photo={photo} alt="" fill sizes="(max-width: 700px) 70vw, 260px" /></span>
          {badge && <span className="cp-badge">{badge}</span>}
        </div>
      </div>
      <div className="cp-body">
        <h3>{title}</h3>
        <p className="cp-line">{line}</p>
        {details?.length ? (
          <>
            <button className="cp-details" onClick={() => setOpen((v) => !v)} aria-expanded={open}>{open ? "Hide Details" : "View Details"}</button>
            {open && <ul className="cp-list">{details.map((d) => <li key={d}>{d}</li>)}</ul>}
          </>
        ) : <span className="cp-details cp-details--muted">*Conditions apply</span>}
        {addId ? (
          n === 0 ? (
            <button className="cp-btn" onClick={() => cart.add(addId)}>{cta}</button>
          ) : (
            <div className="cp-step"><button onClick={() => cart.remove(addId)} aria-label="Remove one">−</button><b>{n}</b><button onClick={() => cart.add(addId)} aria-label="Add one">+</button></div>
          )
        ) : (
          <span className="cp-btn cp-btn--static">Auto-applied</span>
        )}
      </div>
    </article>
  );
}
