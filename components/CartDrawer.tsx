"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useCart } from "./providers/Cart";
import { useLenis } from "./providers/SmoothScroll";
import { useContent } from "./providers/Content";

export default function CartDrawer() {
  const cart = useCart();
  const { site: SITE, waLink } = useContent();
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (cart.open) {
      lenis?.stop();
      gsap.to(shade.current, { autoAlpha: 1, duration: 0.3 });
      gsap.set(panel.current, { visibility: "visible" });
      gsap.fromTo(panel.current, { x: 0, xPercent: 105 }, { x: 0, xPercent: 0, duration: 0.7, ease: "expo.out" });
      gsap.from(panel.current!.querySelectorAll(".cd-line"), { x: 40, autoAlpha: 0, stagger: 0.05, delay: 0.15, duration: 0.5 });
    } else {
      lenis?.start();
      gsap.to(shade.current, { autoAlpha: 0, duration: 0.3 });
      gsap.to(panel.current, { x: 0, xPercent: 105, duration: 0.5, ease: "power3.in", onComplete: () => { if (panel.current) panel.current.style.visibility = "hidden"; } });
    }
  }, [cart.open, lenis]);

  // Zomato-style sticky "view cart" bar — hidden while the hero is on screen
  const [pastHero, setPastHero] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const on = () => setPastHero(path !== "/" || window.scrollY > window.innerHeight * 0.75);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [path]);
  const showBar = cart.count > 0 && pastHero && !cart.open;
  useEffect(() => {
    gsap.to(bar.current, { y: 0, yPercent: showBar ? 0 : 160, duration: 0.6, ease: showBar ? "back.out(1.6)" : "power3.in", overwrite: "auto" });
  }, [showBar]);
  useEffect(() => {
    if (cart.lastAdded) gsap.fromTo(bar.current, { scale: 1.06 }, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.4)" });
  }, [cart.lastAdded]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && cart.setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [cart]);

  const message = () => {
    const lines = cart.lines.map((l) => `• ${l.name} × ${l.qty}${l.price !== null ? ` — ₹${l.price * l.qty}` : " — (price on request)"}`);
    return [
      `Hi ${SITE.name}! I'd like to order:`,
      "",
      ...lines,
      "",
      `Total: ₹${cart.total}${cart.hasOnRequest ? " + items on request" : ""}`,
      "",
      "Name:",
      "Address / pickup:",
    ].join("\n");
  };

  return (
    <>
      <button ref={bar} className="cart-bar" onClick={() => cart.setOpen(true)} style={{ transform: "translateY(160%)" }}>
        <span>{cart.count} item{cart.count === 1 ? "" : "s"} · ₹{cart.total}{cart.hasOnRequest ? "+" : ""}</span>
        <b>View plate →</b>
      </button>

      <div ref={shade} className="cd-shade" onClick={() => cart.setOpen(false)} style={{ visibility: "hidden", opacity: 0 }} />
      <aside ref={panel} className="cd" aria-label="Your plate" aria-hidden={!cart.open} style={{ transform: "translateX(105%)", visibility: "hidden" }} data-lenis-prevent>
        <header>
          <h3>Your plate <span className="hand">ମୋ ଥାଳି</span></h3>
          <button onClick={() => cart.setOpen(false)} aria-label="Close">×</button>
        </header>

        {cart.lines.length === 0 ? (
          <div className="cd-empty">
            <p className="hand">Plate khaali hai!</p>
            <p>Add something from the menu — the peanuts are calling.</p>
          </div>
        ) : (
          <ul className="cd-lines">
            {cart.lines.map((l) => (
              <li className="cd-line" key={l.id}>
                <div>
                  <b>{l.name}</b>
                  <small>{l.price === null ? "Price on request" : `₹${l.price} each`}</small>
                </div>
                <div className="stepper">
                  <button onClick={() => cart.remove(l.id)} aria-label="Remove one">−</button>
                  <b>{l.qty}</b>
                  <button onClick={() => cart.add(l.id)} aria-label="Add one">+</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <footer>
          <div className="cd-total">
            <span>Total</span>
            <b>₹{cart.total}{cart.hasOnRequest && <small> + on request</small>}</b>
          </div>
          <a
            className={`btn btn--red btn--block ${cart.count ? "" : "is-disabled"}`}
            href={cart.count ? waLink(message()) : undefined}
            target="_blank" rel="noreferrer"
            aria-disabled={!cart.count}
          >
            Send order on WhatsApp
          </a>
          {cart.count > 0 && <button className="cd-clear" onClick={cart.clear}>Clear plate</button>}
        </footer>
      </aside>
    </>
  );
}
