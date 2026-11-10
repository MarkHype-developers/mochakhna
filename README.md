# Mo Chakhna — mochakhna.com

Brand site for **Mo Chakhna (ମୋ ଚଖଣା) — Daru Ka Dost**, a brand of **Ayunraz — Authentic Food Of New India**.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Node 18.18+ required. Deploy on Vercel as-is (zero config), then point `mochakhna.com` at it.

## Before going live — edit `lib/site.ts`

| Field | What to put |
|---|---|
| `whatsapp` | Real WhatsApp number, e.g. `919876543210` (orders are sent here) |
| `phone`, `email`, `address`, `instagram` | Real contact details |

Menu items, prices and combos live in `lib/menu.ts`. `price: null` shows "Price on request".
`SHOW_TOBACCO` is `false` — cigarettes are hidden from the menu and Combo 3 because COTPA 2003 restricts tobacco advertising in India.

## What's inside

| Section | File | Tech |
|---|---|---|
| Preloader (counter, peanuts drop, panel wipe) | `components/Preloader.tsx` | GSAP timeline |
| 3D hero — falling peanuts, chana, kaju, chillies, lemon, onion rings, corn, coriander; click to "toss" | `components/three/*` | three.js + React Three Fiber + drei; procedurally modelled food (noise-displaced geometry, vertex colours, physical materials, canvas textures) |
| Zomato-style search w/ rotating cravings → filters the menu | `components/Hero.tsx` | GSAP SplitText |
| Velocity-reactive marquee | `components/Marquee.tsx` | ScrollTrigger velocity + skew |
| Scroll-lit story text + parallax food | `components/Story.tsx` | SplitText + scrub |
| Pinned "build a plate" sequence | `components/PlateAssembly.tsx` | Pinned scrubbed timeline |
| Menu with category chips, veg toggle, search, ADD steppers | `components/MenuSection.tsx` | GSAP Flip layout animation, ScrollTrigger.batch, 3D tilt |
| Horizontal pinned combos | `components/Combos.tsx` | containerAnimation |
| Stats + hand-drawn promise circle | `components/Promise.tsx` | counters, stroke draw |
| Ayunraz parent-brand section | `components/Ayunraz.tsx` | |
| Cart bar + drawer → WhatsApp order message | `components/CartDrawer.tsx` | |
| Zomato-style draggable "Tonight's cravings" rail with custom slider | `components/Cravings.tsx` | GSAP Draggable + Inertia |
| Floating real-photo food decor | `components/FoodDecor.tsx` | scrubbed parallax + idle float |
| Smooth scroll | `components/providers/SmoothScroll.tsx` | Lenis synced to GSAP ticker |

Fonts are self-hosted via Fontsource (Bricolage Grotesque, Caveat, Noto Sans Oriya) — no Google Fonts request at runtime.
Food photography is real stock photography from Unsplash (free under the Unsplash License, no attribution needed), served from Unsplash's CDN at exactly the size each screen needs — the ids live in `lib/photos.ts`. When you have your own shoot, put the files in `public/img/` and replace an id with its path, e.g. `kasha: "/img/kasha.jpg"`.
