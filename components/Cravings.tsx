"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";
import Photo from "./Photo";
import { ALL_ITEMS } from "@/lib/menu";
import { useCart } from "./providers/Cart";
import { useLenis } from "./providers/SmoothScroll";

gsap.registerPlugin(Draggable, InertiaPlugin);

const PICKS = ["kasha", "chk-pakoda", "fish-masala", "masala-chana", "chilli-chk", "peanuts", "prawn", "paneer-pakoda", "kaju", "egg-fry"];
const items = PICKS.map((id) => ALL_ITEMS.find((i) => i.id === id)!).filter(Boolean);

/** Zomato-style "collections" rail: drag / swipe with inertia, arrows, and a branded progress slider. */
export default function Cravings() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const drag = useRef<Draggable | null>(null);
  const syncRef = useRef<() => void>(() => {});
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const cart = useCart();
  const lenis = useLenis();

  useGSAP(() => {
    const t = track.current!;
    const viewport = t.parentElement!;
    const maxX = () => Math.min(0, viewport.clientWidth - t.scrollWidth);

    const sync = () => {
      const x = Number(gsap.getProperty(t, "x"));
      const p = maxX() === 0 ? 0 : x / maxX();
      gsap.set(thumb.current, { xPercent: p * (100 / 0.28 - 100) });
      setAtStart(p < 0.02);
      setAtEnd(p > 0.98);
    };
    syncRef.current = sync;

    drag.current = Draggable.create(t, {
      type: "x",
      inertia: true,
      edgeResistance: 0.85,
      bounds: { minX: maxX(), maxX: 0 },
      dragClickables: false,
      cursor: "grab",
      activeCursor: "grabbing",
      onPress() { lenis?.stop(); },
      onRelease() { lenis?.start(); },
      onDrag: sync,
      onThrowUpdate: sync,
      zIndexBoost: false,
    })[0];

    // only run the steam/flame animations while this section is on screen
    const live = new IntersectionObserver(([e]) => root.current?.classList.toggle("is-live", e.isIntersecting));
    live.observe(root.current!);

    const onResize = () => { drag.current?.applyBounds({ minX: maxX(), maxX: 0 }); sync(); };
    window.addEventListener("resize", onResize);

    // trackpad two-finger swipe / shift + mouse-wheel slides the row too
    let wheelX = 0;
    const onWheel = (e: WheelEvent) => {
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
      if (Math.abs(dx) <= Math.abs(e.shiftKey ? 0 : e.deltaY)) return; // vertical intent → let the page scroll
      e.preventDefault();
      const cur = Number(gsap.getProperty(t, "x"));
      wheelX = gsap.utils.clamp(maxX(), 0, (gsap.isTweening(t) ? wheelX : cur) - dx * 1.2);
      gsap.to(t, { x: wheelX, duration: 0.6, ease: "power3.out", overwrite: true, onUpdate: () => { drag.current?.update(); sync(); } });
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });

    gsap.from(gsap.utils.toArray(".crave", t), {
      x: 120, opacity: 0, rotate: 4, stagger: 0.07, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 75%" },
    });
    return () => { live.disconnect(); window.removeEventListener("resize", onResize); viewport.removeEventListener("wheel", onWheel); drag.current?.kill(); };
  }, { scope: root });

  const step = (dir: 1 | -1) => {
    const t = track.current!;
    const card = t.querySelector<HTMLElement>(".crave");
    const by = (card?.offsetWidth ?? 300) * 2 + 40;
    const minX = Math.min(0, t.parentElement!.clientWidth - t.scrollWidth);
    const next = gsap.utils.clamp(minX, 0, Number(gsap.getProperty(t, "x")) - dir * by);
    gsap.to(t, {
      x: next, duration: 0.9, ease: "power3.out",
      onUpdate: () => { drag.current?.update(); syncRef.current(); },
    });
  };

  return (
    <section ref={root} className="cravings">
      <div className="container cravings-head">
        <div>
          <p className="eyebrow">tonight&apos;s cravings</p>
          <h2>What&apos;s sizzling <span className="hand red">right now</span></h2>
        </div>
        <div className="rail-arrows">
          <button onClick={() => step(-1)} disabled={atStart} aria-label="Previous">←</button>
          <button onClick={() => step(1)} disabled={atEnd} aria-label="Next">→</button>
        </div>
      </div>

      <div className="rail">
        <div ref={track} className="rail-track">
          {items.map((it) => (
            <article className="crave" key={it.id}>
              <div className="crave-img">
                {it.photo && <Photo photo={it.photo} alt={it.name} fill loading="eager" sizes="(max-width: 700px) 75vw, 320px" draggable={false} />}
                <div className="crave-steam" aria-hidden="true">
                  <span className="steam-wisp steam-wisp--one" />
                  <span className="steam-wisp steam-wisp--two" />
                  <span className="steam-wisp steam-wisp--three" />
                </div>
              </div>
              <div className="crave-meta">
                <div>
                  <h3>{it.name}</h3>
                  {it.note && <p>{it.note}</p>}
                </div>
                <button className="crave-add" onClick={() => cart.add(it.id)} aria-label={`Add ${it.name}`}>
                  ₹{it.price} <b>+</b>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="rail-foot">
          <div className="rail-slider" aria-hidden><div ref={thumb} className="rail-thumb" /></div>
          <span className="rail-hint hand">← drag or swipe →</span>
        </div>
      </div>
    </section>
  );
}
