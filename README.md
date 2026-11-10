# Ayunraz Chakhna — website

KFC-style ordering site for **Ayunraz Chakhna** (Mo Chakhna · ମୋ ଚଖଣା), a brand of Ayunraz.

## Run

```bash
npm install          # also installs the Oswald heading font
npm run dev          # http://localhost:3000  (dev mode is slower than the real site)
npm run build && npm start   # real speed
```

## Pages

| URL | What |
|---|---|
| `/` | Red hero with search → Browse categories → Top deals → Bestsellers → promise strip |
| `/menu` | Full menu: sticky category sidebar (chips on phones), search, veg-only, product cards |
| `/deals` | Combo deal cards + add-ons carousel |

Cart (top right) works on every page and is remembered in the browser. "Send order on WhatsApp" sends the plate to the first phone number.

## Edit content

- `lib/site.ts` — name, phones, WhatsApp number, hours, address, Google Maps link
- `lib/menu.ts` — every dish (name, qty, description, price, veg/non-veg, photo, tag) and the combo deals.
  `price: null` shows "Price on call". `SHOW_TOBACCO` hides Cigarettes (COTPA 2003).
- `lib/photos.ts` — photo for each dish. Values are Unsplash photo ids (free licence) or a local path like `/img/real/kasha-bowl.jpg`.
  To use your own shoot, drop the file in `public/img/` and replace the id with its path.
