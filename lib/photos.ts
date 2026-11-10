// Photos: Mo Chakhna's own shoot (public/img/real) + high-quality Unsplash stock
// (free under the Unsplash License). Swap any value for "/img/your-photo.jpg" later.

export const PHOTOS = {
  // own shoot
  kadaiKasha: "/img/real/kadai-kasha.jpg",
  kashaBowl: "/img/real/kasha-bowl.jpg",
  pomfretFry: "/img/real/pomfret-fry.jpg",
  prawnBowl: "/img/real/prawn-bowl.jpg",
  chilliChickenShoot: "/img/real/chilli-chicken.jpg",
  seafoodSpread: "/img/real/seafood-spread.jpg",

  // from the printed menu PDF
  friesPdf: "/img/real/fries-pdf.jpg",
  tikkaPdf: "/img/real/tikka-pdf.jpg",
  fishFryPdf: "/img/real/fishfry-pdf.jpg",
  // more stock
  wings: "1608039755401-742074f0548d",
  chicken65: "1786232461126-e27e970b003b",
  garlicFries: "1630431341973-02e1b662ec35",
  herbFries: "1518013431117-eb1465fa5752",
  truffleFries: "1541592106381-b31e9677c0e5",
  fishStrips: "1579208030886-b937da0925dc",
  tenders: "1619019187211-adf2f6119afd",
  pepperChicken: "1603496987351-f84a3ba5ec85",
  liver: "1704092591250-c78222dd72e1",
  achari: "1603894584373-5ac82b2ae398",
  kebab: "1605908580297-f3e1c02e64ff",
  bhuna: "1708782344490-9026aaa5eec7",
  cutlet: "1652690772758-45df96e11c50",
  curryLeaf: "1569058242253-92a9c755a0ec",
  koni: "1584182711222-2068e7eca683",
  chilliFish: "1710508774177-7ac2f3492675",
  steamedEgg: "1764315197254-94385571df22",
  salad: "1786042614364-98b9b2abbf2d",
  masalaKalaChana: "1736680056470-948527554276",
  sproutBlend: "1476005484258-bd38fa5bc155",
  chilliMushroom: "1652088063505-d6d4d390b295",
  // Fries & crispy bites
  fries: "1630384060421-cb20d0e0649d",
  popcorn: "1767469576675-0c02a8d66f4c",
  fishPakora: "1562967916-eb82221dfb92",
  momoFries: "1694923450868-b432a8ee52aa",
  malaiChickenPakora: "1586793783658-261cddf883ef",
  // Chicken
  chickenPakora: "1765360024331-25b63e85272e",
  lollipop: "1766589220977-143f5cba3f22",
  lemonGarlic: "1730900737724-5b752e1ed3dd",
  // Tandoor & grill
  tikka: "1696950171387-dc808171711e",
  flameSmoky: "1599487488170-d11ec9c172f0",
  tandooriLegs: "1610057099431-d73a1c9d2f2f",
  tandooriWhole: "1606728035253-49e8a23146de",
  grillSkewers: "1705359573325-f2006d5e459f",
  // Fish
  katlaKasha: "1626508035297-0cd27c397d67",
  vetki: "1786997089873-e4c02377bd3d",
  // Eggs
  omelet: "1510693206972-df098062cb71",
  eggFry: "1691480184494-d9f822edd4d1",
  scrambled: "1687630433865-f86f07be989a",
  // Veg
  paneerPakora: "1666001120694-3ebe8fd207be",
  chilliPaneer: "1567188040759-fb8a883dc6d8",
  mushroomPakora: "1765360024320-b2ab819c6f75",
  // Steamed
  papad: "1789993494863-437bee68f8e6",
  kalaChana: "1789990664839-8dbbb04521fc",
  sprouts: "1622732777601-e744c3401d44",
  steamedNuts: "1769255484233-94ece98f722d",
  // Namkeen
  cashews: "1726771517475-e7acdd34cd8a",
  chips: "1760997707695-f0b5527e5de9",
  tastyNuts: "1543158181-1274e5362710",
  peanuts: "1766997246116-d008d5354465",
  // Essentials
  water: "1616118132534-381148898bb4",
  ice: "1758001969632-c67b15c89f1f",
  soda: "1581636625402-29b2a704ef13",
  coldDrink: "1624552184280-9e9631bbeee9",
  glass: "1763619814029-fb9763f509c8",
  plates: "1727021024931-90c226e8448d",

  // aliases still used by older components
  kasha: "/img/real/kasha-bowl.jpg",
  peanutsShell: "1766997246116-d008d5354465",
  masalaChana: "1789990664839-8dbbb04521fc",
  chickenPakoda: "1765360024331-25b63e85272e",
  eggFryOld: "1764315197254-94385571df22",
} as const;

export type PhotoKey = keyof typeof PHOTOS;
