import Image from "next/image";
import Link from "next/link";
import { SITE, tel, waLink } from "@/lib/site";
import { MENU } from "@/lib/menu";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="kf">
      <div className="kwrap kf-top">
        <div className="kf-brand">
          <Image src="/img/mochakhna-logo-red.jpg" alt={SITE.name} width={1080} height={700} />
          <p>{SITE.tagline}<br />A brand of <b>{SITE.parent.name}</b> — {SITE.parent.tagline}.</p>
          <a className="btn btn--red" href={waLink(`Hi ${SITE.name}! I'd like to place an order.`)} target="_blank" rel="noreferrer">Order on WhatsApp</a>
        </div>
        <div className="kf-col">
          <h4>Menu</h4>
          {MENU.slice(0, 6).map((c) => <Link key={c.id} href={`/menu#cat-${c.id}`}>{c.title}</Link>)}
          <Link href="/deals">Deals &amp; Combos</Link>
        </div>
        <div className="kf-col">
          <h4>Call to order</h4>
          {SITE.phones.map((p) => <a key={p} href={tel(p)}>{p}</a>)}
          <a href={waLink(`Hi ${SITE.name}! I'd like to place an order.`)} target="_blank" rel="noreferrer" className="kf-wa">WhatsApp: +91 97776 89321</a>
          <span>{SITE.hours}</span>
        </div>
        <div className="kf-col">
          <h4>Our location</h4>
          {SITE.address.map((a) => <span key={a}>{a}</span>)}
          <div className="kf-mapbox">
            <iframe src={SITE.mapEmbed} title={`${SITE.name} on Google Maps`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
          <a href={SITE.maps} target="_blank" rel="noreferrer" className="kf-map">Get directions →</a>
        </div>
      </div>
      <div className="kf-bottom">
        <div className="kwrap kf-bottom-in">
          <span>© {year} {SITE.name}. All rights reserved.</span>
          <span><b>{SITE.promise}</b> Please enjoy responsibly and never drink and drive.</span>
          <span>{SITE.domain}</span>
        </div>
      </div>
    </footer>
  );
}
