// ─────────────────────────────────────────────────────────────
//  Mo Chakhna — site-wide config. Edit these before going live.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  name: "Mo Chakhna",
  odia: "ମୋ ଚଖଣା",
  tagline: "Daru Ka Dost",
  promise: "We Never Sell Alcohol",
  domain: "mochakhna.com",
  url: "https://mochakhna.com",
  parent: {
    name: "Ayunraz",
    tagline: "Authentic Food Of New India",
  },
  // TODO: replace with the real WhatsApp number (country code, no +, no spaces)
  whatsapp: "919999999999",
  // TODO: replace with real contact details
  phone: "+91 99999 99999",
  email: "hello@mochakhna.com",
  address: "Bhubaneswar, Odisha",
  instagram: "https://instagram.com/mochakhna",
};

// Odia must be split by grapheme cluster, never by code point (vowel signs would detach)
export const ODIA_CLUSTERS = ["ମୋ", " ", "ଚ", "ଖ", "ଣା"];

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
