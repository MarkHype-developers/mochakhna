// Real food photography from Unsplash (free to use under the Unsplash License,
// no attribution required). Served straight from Unsplash's CDN, which resizes
// and converts to WebP/AVIF on the fly — see components/Photo.tsx.
// To swap in your own shoot later, replace an id here with a path like "/img/kasha.jpg".

export const PHOTOS = {
  // Mo Chakhna's own shoot (public/img/real)
  kadaiKasha: "/img/real/kadai-kasha.jpg",
  kashaBowl: "/img/real/kasha-bowl.jpg",
  pomfretFry: "/img/real/pomfret-fry.jpg",
  prawnBowl: "/img/real/prawn-bowl.jpg",
  chilliChickenShoot: "/img/real/chilli-chicken.jpg",
  seafoodSpread: "/img/real/seafood-spread.jpg",
  // menu
  kasha: "/img/real/kasha-bowl.jpg",
  chickenPakoda: "1765360024331-25b63e85272e",
  chilliChicken: "/img/real/chilli-chicken.jpg",
  chicken65: "1786232461126-e27e970b003b",
  eggBhurji: "1510693206972-df098062cb71",
  omelette: "1630684789447-2484443c6c1b",
  eggFry: "1764315197254-94385571df22",
  fishMasala: "/img/real/seafood-spread.jpg",
  pamfret: "/img/real/pomfret-fry.jpg",
  koni: "1665401015549-712c0dc5ef85",
  prawn: "/img/real/prawn-bowl.jpg",
  corn: "1634467524884-897d0af5e104",
  paneerPakoda: "1666001120694-3ebe8fd207be",
  chillyPaneer: "1567188040759-fb8a883dc6d8",
  gobi65: "1676976197084-a7b35e0d2537",
  peanuts: "1549978113-29eb25c8177f",
  peanutsShell: "1766997246116-d008d5354465",
  salad: "1723476684266-012f2c163667",
  chips: "1760997707695-f0b5527e5de9",
  kaju: "1769255484239-2f2f7278e233",
  papad: "1789993494863-437bee68f8e6",
  chana: "1515543904379-3d757afe72e4",
  masalaChana: "1789990664839-8dbbb04521fc",
  sprout: "1622732777601-e744c3401d44",
  coldDrink: "1629654613528-5d0a2e4166de",
  soda: "1581636625402-29b2a704ef13",
  water: "1616118132534-381148898bb4",
  ice: "1758001969632-c67b15c89f1f",
  glass: "1534616042650-80f5c9b61f09",
  achar: "1617854307432-13950e24ba07",
  lemon: "1610126176343-3e1833a107e1",
  greenChilli: "1599987141071-f5810d32e21a",
  redChilli: "1583119022894-919a68a3d0e3",
  // mood / sections
  tawa: "1784137894042-78ad35e139dc",
  friends: "1723744909898-4a1ce8922699",
  spread: "1788618992931-a1289ef2da41",
  thali: "1717587052948-fb9825de50f8",
  samosa: "1601050690597-df0568f70950",
  bowls: "1631452180539-96aca7d48617",
} as const;

export type PhotoKey = keyof typeof PHOTOS;

export function photoUrl(key: PhotoKey | string, width = 800, height?: number, quality = 72) {
  const id = key in PHOTOS ? PHOTOS[key as PhotoKey] : key;
  if (id.startsWith("/")) return id; // local file
  const h = height ? `&h=${height}&fit=crop&crop=entropy` : "";
  return `https://images.unsplash.com/photo-${id}?w=${width}${h}&q=${quality}&auto=format`;
}
