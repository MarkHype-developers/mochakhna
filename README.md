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

## Admin panel (`/admin`)

Edit the whole website without touching code: every dish (name, price, quantity, serves, veg/non-veg,
badge, description, photo, sold-out), categories (add, rename, reorder, hide, photo), combo deals,
offer coupons, home-page images and site details (phones, WhatsApp number for orders, hours, address, map).

Changes are saved as a draft in the panel; **Publish** makes them live. The website shows the new
content immediately on refresh (the server copy refreshes within a minute).

Photos: click or drop a photo on any image. It is shrunk to WebP in the browser and saved in Firestore
(collection `images`, no Firebase Storage or billing plan needed); the site shows it via `/api/img/<id>`,
cached for a year, so a big phone photo won't slow the site down. Upload a **PNG with no background** for a dish and it is shown on
plain white like the other menu cards (toggle “Photo has no background” if needed).

### One-time setup (≈10 minutes)

1. https://console.firebase.google.com → **Add project** (Google Analytics not needed).
2. **Build → Authentication → Get started → Email/Password → Enable → Save.**
   Then **Users → Add user**: the email + password you will log in to `/admin` with.
3. **Build → Firestore Database → Create database** → pick a location close to you (e.g. `asia-south1` Mumbai) → *production mode*.
4. **Project settings (⚙) → Your apps → `</>` Web** → register the app → copy the `firebaseConfig` values.
5. Already done: the keys for the `mochakhna` Firebase project are in `lib/content.ts`. (A `.env.local` with the variables in `firebase.env.example` overrides them, if you ever switch projects.)
6. Open `firestore.rules`, replace `owner@example.com` with your admin email(s), and paste it into
   **Firestore → Rules** → **Publish**.
7. Go to `http://localhost:3000/admin`, sign in, press **Publish** once. From now on the website reads from the panel.

Notes
- Without `.env.local` the site simply uses the menu in `lib/menu.ts` (as before) and `/admin` shows these steps.
- “⋯ → Download backup” saves the whole menu as a JSON file. “Load original menu” brings back the menu from the code (publish to apply).
- The public pages don't load the Firebase SDK at all (they read one document over HTTPS), so the site stays as fast as before.
