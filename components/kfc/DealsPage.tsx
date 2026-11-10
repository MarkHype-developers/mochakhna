"use client";

import Coupon from "./Coupon";
import CategoryMosaic from "./CategoryMosaic";
import Rail from "./Rail";
import { DEALS, OFFERS } from "@/lib/menu";

export default function DealsPage() {
  return (
    <div className="kdl">
      <section className="kdl-sec">
        <div className="kwrap">
          <span className="stripes" aria-hidden><i /><i /><i /></span>
          <h2 className="kdl-h">Save more as you order</h2>
        </div>
        <Rail>
          {DEALS.map((d) => (
            <div className="rail-cell rail-cell--cp" key={d.id}>
              <Coupon
                title={`${d.name} · ${d.title}`}
                line={`₹${d.price} · ${d.serves}`}
                photo={d.photo}
                details={d.items}
                addId={d.id}
                cta="Add Deal"
                badge={d.badge}
              />
            </div>
          ))}
          {OFFERS.map((o) => (
            <div className="rail-cell rail-cell--cp" key={o.id}>
              <Coupon title={o.title} line={o.line} photo={o.photo} addId={o.id} cta="Apply Offer" />
            </div>
          ))}
        </Rail>
      </section>

      <section className="kdl-sec kdl-sec--cats">
        <div className="kwrap">
          <div className="kdl-cats-head">
            <h2 className="kdl-h">Browse menu categories</h2>
            <span className="kdl-rule" aria-hidden />
          </div>
          <CategoryMosaic />
        </div>
      </section>
    </div>
  );
}
