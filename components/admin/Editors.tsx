"use client";

import { useState } from "react";
import { isUpload, type Content, type Offer } from "@/lib/content";
import type { Category, Deal, MenuItem } from "@/lib/menu";
import ImageField from "./ImageField";
import { Area, Num, Pick, RowTools, Text, Toggle, move, setAt, uid, without } from "./fields";

type Set = (fn: (c: Content) => Content) => void;
type Cat = Content["categories"][number];

/* ───────────────────────── Menu ───────────────────────── */

export function MenuEditor({ c, set }: { c: Content; set: Set }) {
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState("");
  const cats = c.categories;
  const i = Math.min(sel, cats.length - 1);
  const cat = cats[i];

  const setCats = (fn: (cs: Cat[]) => Cat[]) => set((x) => ({ ...x, categories: fn(x.categories) }));
  const setCat = (patch: Partial<Cat>) => setCats((cs) => setAt(cs, i, { ...cs[i], ...patch }));
  const setItems = (fn: (it: MenuItem[]) => MenuItem[]) => setCats((cs) => setAt(cs, i, { ...cs[i], items: fn(cs[i].items) }));
  const setItem = (k: number, patch: Partial<MenuItem>) => setItems((it) => setAt(it, k, { ...it[k], ...patch }));

  const addCat = () => {
    const title = prompt("Name of the new category?", "New category");
    if (!title) return;
    setCats((cs) => [...cs, { id: uid(title), group: "", title, photo: "friesPdf", items: [] }]);
    setSel(cats.length);
  };
  const addItem = () => {
    setItems((it) => [{ id: uid("dish"), name: "New dish", desc: "", price: 0, diet: "veg", photo: cat.photo }, ...it]);
  };
  const moveItemTo = (k: number, target: number) => {
    if (target === i) return;
    setCats((cs) => {
      const item = cs[i].items[k];
      return cs.map((x, n) => (n === i ? { ...x, items: without(x.items, k) } : n === target ? { ...x, items: [item, ...x.items] } : x));
    });
  };

  // search across every category
  const ql = q.trim().toLowerCase();
  const hits = ql ? cats.flatMap((cc, ci) => cc.items.map((it, k) => ({ it, ci, k })).filter(({ it }) => it.name.toLowerCase().includes(ql))) : [];

  return (
    <div className="ad-menu">
      <aside className="ad-cats">
        <input className="ad-search" placeholder="Find a dish…" value={q} onChange={(e) => setQ(e.target.value)} />
        {ql ? (
          <div className="ad-hits">
            {hits.length === 0 && <p className="ad-muted">No dish matches.</p>}
            {hits.map(({ it, ci }) => (
              <button key={`${ci}-${it.id}`} onClick={() => { setSel(ci); setQ(""); setTimeout(() => document.getElementById(`ad-it-${it.id}`)?.scrollIntoView({ block: "center" }), 50); }}>
                {it.name}<em>{cats[ci].title}</em>
              </button>
            ))}
          </div>
        ) : (
          <>
            {cats.map((cc, n) => (
              <button key={cc.id} className={`ad-cat${n === i ? " on" : ""}${cc.hidden ? " is-off" : ""}`} onClick={() => setSel(n)}>
                <span>{cc.title}</span><em>{cc.items.length}</em>
              </button>
            ))}
            <button className="ad-cat ad-cat--add" onClick={addCat}>+ Add category</button>
          </>
        )}
      </aside>

      {cat ? (
        <section className="ad-main">
          <div className="ad-card ad-catcard">
            <ImageField label="Category photo (home page tile)" value={cat.photo} folder="categories" onChange={(p) => setCat({ photo: p })} />
            <div className="ad-grid">
              <Text label="Category name" value={cat.title} onChange={(v) => setCat({ title: v })} wide />
              <Text label="Group (small label)" value={cat.group} onChange={(v) => setCat({ group: v })} />
              <div className="ad-f ad-f--row">
                <Toggle label="Hide this whole category" value={cat.hidden} onChange={(v) => setCat({ hidden: v })} />
              </div>
              <div className="ad-f ad-f--row ad-f--wide">
                <RowTools
                  what={`the category “${cat.title}” and its ${cat.items.length} dishes`}
                  onUp={i > 0 ? () => { setCats((cs) => move(cs, i, -1)); setSel(i - 1); } : undefined}
                  onDown={i < cats.length - 1 ? () => { setCats((cs) => move(cs, i, 1)); setSel(i + 1); } : undefined}
                  onDelete={() => { setCats((cs) => without(cs, i)); setSel(Math.max(0, i - 1)); }}
                />
              </div>
            </div>
          </div>

          <div className="ad-sub">
            <h3>{cat.items.length} dishes</h3>
            <button className="ad-btn ad-btn--ghost" onClick={addItem}>+ Add dish</button>
          </div>

          {cat.items.map((it, k) => (
            <div className={`ad-card ad-item${it.hidden ? " is-off" : ""}`} key={it.id} id={`ad-it-${it.id}`}>
              <ImageField
                value={it.photo}
                folder="dishes"
                dish
                cutout={it.cutout}
                onChange={(p, transparent) => setItem(k, { photo: p, cutout: isUpload(p) ? transparent : undefined })}
              />
              <div className="ad-grid">
                <Text label="Dish name" value={it.name} onChange={(v) => setItem(k, { name: v })} wide />
                <Num label="Price ₹" value={it.price} placeholder="—" onChange={(v) => setItem(k, { price: v })} />
                <Text label="Price text (optional)" value={it.priceLabel} placeholder="e.g. MRP, Free*" onChange={(v) => setItem(k, { priceLabel: v || undefined })} />
                <Text label="Quantity" value={it.qty} placeholder="e.g. 6 pcs, 250 g" onChange={(v) => setItem(k, { qty: v || undefined })} />
                <Num label="Serves" value={it.serves ?? null} placeholder="1" onChange={(v) => setItem(k, { serves: v ?? undefined })} />
                <Pick label="Type" value={it.diet} options={[["veg", "Veg"], ["nonveg", "Non veg"], ["egg", "Egg"]]} onChange={(v) => setItem(k, { diet: v ?? "veg" })} />
                <Pick label="Badge" value={it.tag} options={[["", "None"], ["Bestseller", "Bestseller"], ["Chef's special", "Chef's special"], ["New", "New"]]} onChange={(v) => setItem(k, { tag: v })} />
                <Area label="Description" value={it.desc} onChange={(v) => setItem(k, { desc: v })} />
                <div className="ad-f ad-f--row ad-f--wide">
                  <Toggle label="Sold out / hide" value={it.hidden} onChange={(v) => setItem(k, { hidden: v })} />
                  {isUpload(it.photo) && <Toggle label="Photo has no background" value={it.cutout} onChange={(v) => setItem(k, { cutout: v })} />}
                  <label className="ad-f ad-f--inline">
                    <span className="ad-lbl">Move to</span>
                    <select value={i} onChange={(e) => moveItemTo(k, Number(e.target.value))}>
                      {cats.map((cc, n) => <option key={cc.id} value={n}>{cc.title}</option>)}
                    </select>
                  </label>
                  <RowTools
                    what={`“${it.name}”`}
                    onUp={k > 0 ? () => setItems((x) => move(x, k, -1)) : undefined}
                    onDown={k < cat.items.length - 1 ? () => setItems((x) => move(x, k, 1)) : undefined}
                    onDelete={() => setItems((x) => without(x, k))}
                  />
                </div>
              </div>
            </div>
          ))}
          {cat.items.length === 0 && <p className="ad-muted ad-pad">No dishes yet — press “+ Add dish”.</p>}
        </section>
      ) : (
        <section className="ad-main"><p className="ad-muted ad-pad">No categories. Press “+ Add category”.</p></section>
      )}
    </div>
  );
}

/* ───────────────────────── Deals & offers ───────────────────────── */

export function DealsEditor({ c, set }: { c: Content; set: Set }) {
  const setDeals = (fn: (d: Deal[]) => Deal[]) => set((x) => ({ ...x, deals: fn(x.deals) }));
  const setDeal = (k: number, p: Partial<Deal>) => setDeals((d) => setAt(d, k, { ...d[k], ...p }));
  const setOffers = (fn: (o: Offer[]) => Offer[]) => set((x) => ({ ...x, offers: fn(x.offers) }));
  const setOffer = (k: number, p: Partial<Offer>) => setOffers((o) => setAt(o, k, { ...o[k], ...p }));

  return (
    <div className="ad-main ad-main--solo">
      <div className="ad-sub">
        <h3>Combos &amp; deals</h3>
        <button className="ad-btn ad-btn--ghost" onClick={() => setDeals((d) => [...d, { id: uid("deal"), name: `Combo ${d.length + 1}`, title: "New combo", price: 0, items: [], photo: "seafoodSpread", serves: "Serves 2" }])}>+ Add deal</button>
      </div>
      {c.deals.map((d, k) => (
        <div className={`ad-card ad-item${d.hidden ? " is-off" : ""}`} key={d.id}>
          <ImageField value={d.photo} folder="deals" onChange={(p) => setDeal(k, { photo: p })} />
          <div className="ad-grid">
            <Text label="Small label" value={d.name} placeholder="Combo 1" onChange={(v) => setDeal(k, { name: v })} />
            <Text label="Deal name" value={d.title} onChange={(v) => setDeal(k, { title: v })} wide />
            <Num label="Price ₹" value={d.price} onChange={(v) => setDeal(k, { price: v ?? 0 })} />
            <Num label="Worth ₹ (optional)" value={d.worth ?? null} onChange={(v) => setDeal(k, { worth: v ?? undefined })} />
            <Text label="Serves" value={d.serves} placeholder="Serves 2" onChange={(v) => setDeal(k, { serves: v })} />
            <Text label="Badge (optional)" value={d.badge} placeholder="Most loved" onChange={(v) => setDeal(k, { badge: v || undefined })} />
            <Area label="What's inside" hint="one per line" rows={4} value={d.items.join("\n")} onChange={(v) => setDeal(k, { items: v.split("\n") })} />
            <div className="ad-f ad-f--row ad-f--wide">
              <Toggle label="Hide this deal" value={d.hidden} onChange={(v) => setDeal(k, { hidden: v })} />
              <RowTools
                what={`“${d.title}”`}
                onUp={k > 0 ? () => setDeals((x) => move(x, k, -1)) : undefined}
                onDown={k < c.deals.length - 1 ? () => setDeals((x) => move(x, k, 1)) : undefined}
                onDelete={() => setDeals((x) => without(x, k))}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="ad-sub ad-sub--gap">
        <h3>Offer coupons <em>(Deals page)</em></h3>
        <button className="ad-btn ad-btn--ghost" onClick={() => setOffers((o) => [...o, { id: uid("offer"), title: "New offer", line: "With every order*", photo: "glass" }])}>+ Add offer</button>
      </div>
      {c.offers.map((o, k) => (
        <div className={`ad-card ad-item${o.hidden ? " is-off" : ""}`} key={o.id}>
          <ImageField value={o.photo} folder="offers" onChange={(p) => setOffer(k, { photo: p })} />
          <div className="ad-grid">
            <Text label="Title" value={o.title} onChange={(v) => setOffer(k, { title: v })} wide />
            <Text label="Line" value={o.line} onChange={(v) => setOffer(k, { line: v })} wide />
            <div className="ad-f ad-f--row ad-f--wide">
              <Toggle label="Hide this offer" value={o.hidden} onChange={(v) => setOffer(k, { hidden: v })} />
              <RowTools
                what={`“${o.title}”`}
                onUp={k > 0 ? () => setOffers((x) => move(x, k, -1)) : undefined}
                onDown={k < c.offers.length - 1 ? () => setOffers((x) => move(x, k, 1)) : undefined}
                onDelete={() => setOffers((x) => without(x, k))}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Site details ───────────────────────── */

export function SiteEditor({ c, set }: { c: Content; set: Set }) {
  const s = c.site;
  const up = (p: Partial<Content["site"]>) => set((x) => ({ ...x, site: { ...x.site, ...p } }));
  return (
    <div className="ad-main ad-main--solo">
      <div className="ad-card">
        <h3 className="ad-h3">Brand</h3>
        <div className="ad-grid">
          <Text label="Restaurant name" value={s.name} onChange={(v) => up({ name: v })} wide />
          <Text label="Tagline" value={s.tagline} onChange={(v) => up({ tagline: v })} wide />
          <Text label="Promise line" value={s.promise} onChange={(v) => up({ promise: v })} wide />
          <Text label="Parent brand" value={s.parent.name} onChange={(v) => up({ parent: { ...s.parent, name: v } })} />
          <Text label="Parent brand tagline" value={s.parent.tagline} onChange={(v) => up({ parent: { ...s.parent, tagline: v } })} wide />
        </div>
      </div>
      <div className="ad-card">
        <h3 className="ad-h3">Ordering &amp; contact</h3>
        <div className="ad-grid">
          <Text label="WhatsApp number for orders" value={s.whatsapp} placeholder="919777689321 (country code, no +)" onChange={(v) => up({ whatsapp: v.replace(/[^\d]/g, "") })} wide />
          <Area label="Phone numbers" hint="one per line · the first is used for “Call to order”" value={s.phones.join("\n")} onChange={(v) => up({ phones: v.split("\n") })} />
          <Text label="Opening hours" value={s.hours} onChange={(v) => up({ hours: v })} wide />
          <Text label="Email" value={s.email} onChange={(v) => up({ email: v })} wide />
          <Text label="Instagram link" value={s.instagram} onChange={(v) => up({ instagram: v })} wide />
        </div>
      </div>
      <div className="ad-card">
        <h3 className="ad-h3">Location</h3>
        <div className="ad-grid">
          <Area label="Address" hint="one line per row" value={s.address.join("\n")} onChange={(v) => up({ address: v.split("\n") })} />
          <Text label="“Get directions” Google Maps link" value={s.maps} onChange={(v) => up({ maps: v })} wide />
          <Area label="Map shown in the footer" hint="Google Maps link ending in &output=embed" value={s.mapEmbed} onChange={(v) => up({ mapEmbed: v.trim() })} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Home images ───────────────────────── */

export function HomeEditor({ c, set }: { c: Content; set: Set }) {
  const up = (p: Partial<Content["home"]>) => set((x) => ({ ...x, home: { ...x.home, ...p } }));
  const setCat = (k: number, photo: string) => set((x) => ({ ...x, categories: setAt(x.categories, k, { ...x.categories[k], photo }) }));
  return (
    <div className="ad-main ad-main--solo">
      <div className="ad-card">
        <h3 className="ad-h3">Big images</h3>
        <div className="ad-tiles ad-tiles--big">
          <ImageField wide label="Hero background (faded behind the red top)" value={c.home.heroPhoto} folder="home" onChange={(p) => up({ heroPhoto: p })} />
          <ImageField wide label="“Deals & Combos” tile" value={c.home.dealsTile} folder="home" onChange={(p) => up({ dealsTile: p })} />
        </div>
      </div>
      <div className="ad-card">
        <h3 className="ad-h3">Category tiles <em>(Browse categories)</em></h3>
        <div className="ad-tiles">
          {c.categories.map((cat: Category, k) => (
            <ImageField key={cat.id} label={cat.title} value={cat.photo} folder="categories" onChange={(p) => setCat(k, p)} />
          ))}
        </div>
      </div>
    </div>
  );
}
