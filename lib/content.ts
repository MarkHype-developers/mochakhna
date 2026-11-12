// ─────────────────────────────────────────────────────────────
//  Everything the admin panel can edit, in one object.
//  The files in lib/ (menu.ts, site.ts, photos.ts) are the defaults; once the owner
//  presses "Publish" in /admin, the saved copy in Firebase replaces them on the site.
// ─────────────────────────────────────────────────────────────
import { MENU, DEALS, OFFERS, SHOW_TOBACCO, type Category, type Deal, type MenuItem } from "./menu";
import { SITE } from "./site";

export type Site = typeof SITE;
export type Offer = { id: string; title: string; line: string; photo: string; hidden?: boolean };
export type HomeImages = {
  heroPhoto: string;        // faded photo behind the red hero
  dealsTile: string;        // "Deals & Combos" tile on the home page + deals page mosaic
};
export type Content = {
  v: 1;
  site: Site;
  categories: (Category & { hidden?: boolean })[];
  deals: Deal[];
  offers: Offer[];
  home: HomeImages;
  updatedAt?: string;
};

export const DEFAULT_CONTENT: Content = {
  v: 1,
  site: SITE,
  categories: MENU,
  deals: DEALS,
  offers: OFFERS,
  home: { heroPhoto: "pomfretFry", dealsTile: "seafoodSpread" },
};

/** Fill any fields missing from a saved copy with the defaults (so older saves keep working). */
export function normalize(raw: Partial<Content> | null | undefined): Content {
  if (!raw || typeof raw !== "object") return DEFAULT_CONTENT;
  return {
    v: 1,
    site: { ...DEFAULT_CONTENT.site, ...(raw.site ?? {}), parent: { ...DEFAULT_CONTENT.site.parent, ...(raw.site?.parent ?? {}) } },
    categories: Array.isArray(raw.categories) ? raw.categories : DEFAULT_CONTENT.categories,
    deals: Array.isArray(raw.deals) ? raw.deals : DEFAULT_CONTENT.deals,
    offers: Array.isArray(raw.offers) ? raw.offers : DEFAULT_CONTENT.offers,
    home: { ...DEFAULT_CONTENT.home, ...(raw.home ?? {}) },
    updatedAt: raw.updatedAt,
  };
}

/** What the public site shows: hidden things removed, plus handy derived lists. */
export function derive(c: Content) {
  const menu: Category[] = c.categories
    .filter((cat) => !cat.hidden)
    .map((cat) => ({ ...cat, items: cat.items.filter((i) => !i.hidden && (SHOW_TOBACCO || !i.tobacco)) }))
    .filter((cat) => cat.items.length > 0);
  const allItems: (MenuItem & { category: string })[] = menu.flatMap((cat) => cat.items.map((i) => ({ ...i, category: cat.id })));
  const deals = c.deals.filter((d) => !d.hidden);
  return {
    content: c,
    site: c.site,
    home: c.home,
    menu,
    allItems,
    bestsellers: allItems.filter((i) => i.tag),
    deals,
    offers: c.offers.filter((o) => !o.hidden),
    waLink: (text: string) => `https://wa.me/${c.site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`,
    tel: (p: string) => `tel:${p.replace(/\s/g, "")}`,
  };
}
export type Derived = ReturnType<typeof derive>;

// ── Firebase config (public web keys — safe in the browser; security comes from the rules) ──
// Values in .env.local (NEXT_PUBLIC_FIREBASE_*) override these if you ever switch projects.
export const FB = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAw297GdGM-Icy-FH4jLCGAyjtUp_aScnc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mochakhna.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mochakhna",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mochakhna.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "983675938099",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:983675938099:web:6f7a2025966a631cea0a46",
};
export const FIREBASE_READY = Boolean(FB.apiKey && FB.projectId);
export const CONTENT_DOC = ["site", "content"] as const;

/** Photos uploaded in /admin live in Firestore (collection "images") and are served by /api/img/<id>. */
export const isUpload = (p: string | undefined) => !!p && (/^https?:\/\//.test(p) || p.startsWith("/api/img/"));

/**
 * Read the published content straight from Firestore's REST API — no Firebase SDK needed
 * on the public site, so visitors download nothing extra. The content is stored as one JSON
 * string field ("json") in the document site/content.
 */
export async function fetchContent(init?: RequestInit & { next?: { revalidate?: number } }): Promise<Content | null> {
  if (!FIREBASE_READY) return null;
  const url = `https://firestore.googleapis.com/v1/projects/${FB.projectId}/databases/(default)/documents/${CONTENT_DOC.join("/")}?key=${FB.apiKey}`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const doc = await res.json();
    const json = doc?.fields?.json?.stringValue;
    return json ? normalize(JSON.parse(json)) : null;
  } catch {
    return null;
  }
}
