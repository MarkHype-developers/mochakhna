// ─────────────────────────────────────────────────────────────
//  Ayunraz Chakhna — site-wide config (from the printed menu card)
// ─────────────────────────────────────────────────────────────
export const SITE = {
  name: "Ayunraz Chakhna",
  short: "Chakhna",
  odia: "ମୋ ଚଖଣା",
  tagline: "Big Flavours. Good Company.",
  promise: "We never sell alcohol.",
  domain: "ayunrazchakhna.com",
  url: "https://www.ayunrazchakhna.com",
  parent: { name: "Ayunraz", tagline: "Authentic Food Of New India" },
  phones: ["+91 97776 89321", "+91 76060 02139"],
  whatsapp: "919777689321", // orders go to the first number
  hours: "Every day · 9 AM – 11 PM",
  address: ["Ayunraz Residence, InfoValley II, Durgapur", "Near DN Fairytale, Bhubaneswar, Odisha"],
  maps: "https://www.google.com/maps/search/?api=1&query=Ayunraz+Residence+InfoValley+II+Durgapur+Bhubaneswar",
  email: "hello@ayunrazchakhna.com",
  instagram: "https://instagram.com/ayunrazchakhna",
};

export const ODIA_CLUSTERS = ["ମୋ", " ", "ଚ", "ଖ", "ଣା"];

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const tel = (p: string) => `tel:${p.replace(/\s/g, "")}`;
