"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./providers/Cart";
import { SITE, tel } from "@/lib/site";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/deals", label: "Deals" },
];

/** KFC-style header: white bar (logo · Menu · Deals … call · cart) + dark "start order" strip. */
export default function Nav() {
  const cart = useCart();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [menuOpen]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`kn${scrolled ? " is-scrolled" : ""}`}>
      <div className="kn-bar">
        <div className="kn-in">
          <button className="kn-burger" onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu" aria-expanded={menuOpen}>
            <i /><i /><i />
          </button>
          <Link href="/" className="kn-logo" aria-label={`${SITE.name} home`}>
            <Image src="/img/ayunraz-chakhna-logo.jpg" alt={SITE.name} width={1129} height={665} priority />
          </Link>
          <nav className="kn-links" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={path?.startsWith(l.href) ? "on" : ""}>{l.label}</Link>
            ))}
          </nav>
          <div className="kn-right">
            <a className="kn-call" href={tel(SITE.phones[0])}>
              <span className="kn-call-ic" aria-hidden>
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" fill="currentColor" /></svg>
              </span>
              <span className="kn-call-t">Call to order</span>
            </a>
            <span className="kn-div" aria-hidden />
            <button className="kn-bucket" onClick={() => cart.setOpen(true)} aria-label={`Cart, ${cart.count} items`}>
              <svg viewBox="0 0 40 44" width="34" height="38" aria-hidden>
                <path d="M5 11h30l-3.2 28.5a3 3 0 0 1-3 2.5H11.2a3 3 0 0 1-3-2.5z" fill="#fff" stroke="#202124" strokeWidth="2.2" strokeLinejoin="round" />
                <path d="M9 11 11.5 41M31 11 28.5 41" stroke="#e4002b" strokeWidth="5" />
                <path d="M20 11v31" stroke="#e4002b" strokeWidth="5" />
                <rect x="3" y="7" width="34" height="6" rx="2" fill="#e4002b" />
                <circle cx="20" cy="27" r="8.5" fill="#fff" stroke="#202124" strokeWidth="1.6" />
              </svg>
              <b key={cart.count} className={cart.count ? "pop" : ""}>{cart.count}</b>
            </button>
          </div>
        </div>
      </div>
      <div className={`kn-shade${menuOpen ? " on" : ""}`} onClick={() => setMenuOpen(false)} aria-hidden />
      <nav className={`kn-drawer${menuOpen ? " on" : ""}`} aria-label="Mobile" aria-hidden={!menuOpen}>
        <div className="kn-drawer-top">
          <Image src="/img/ayunraz-chakhna-logo.jpg" alt={SITE.name} width={1129} height={665} />
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
        </div>
        <Link href="/" className={path === "/" ? "on" : ""}>Home</Link>
        {links.map((l) => <Link key={l.href} href={l.href} className={path?.startsWith(l.href) ? "on" : ""}>{l.label}</Link>)}
        <a href={tel(SITE.phones[0])}>Call to order · {SITE.phones[0]}</a>
        <p className="kn-drawer-note">{SITE.hours}<br />{SITE.promise}</p>
      </nav>
      <div className="kn-strip">
        <span className="kn-strip-l">Let&apos;s order for delivery, pick up, or dine-in</span>
        <span className="kn-strip-s">Delivery · Pick up · Dine-in</span>
        <Link href="/menu" className="kn-start">Start Order</Link>
      </div>
    </header>
  );
}
