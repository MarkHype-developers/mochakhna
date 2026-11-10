// Menu data — transcribed from the Mo Chakhna menu board.
// price: null  → "price on request"
import type { PhotoKey } from "./photos";

export type Diet = "veg" | "nonveg" | "egg";
export type Doodle =
  | "egg" | "corn" | "paneer" | "papad" | "chips" | "leaf" | "prawn"
  | "bottle" | "ice" | "glass" | "bowl" | "achar" | "peanut" | "sprout";

export type MenuItem = {
  id: string;
  name: string;
  odia?: string;
  note?: string;
  price: number | null;
  diet: Diet;
  photo?: PhotoKey;  // real photo (lib/photos.ts)
  doodle?: Doodle;   // hand-drawn fallback illustration
  hot?: boolean;     // "bestseller" ribbon
  tobacco?: boolean; // see SHOW_TOBACCO
};

export type Category = {
  id: string;
  title: string;
  odia: string;
  blurb: string;
  items: MenuItem[];
};

// Indian law (COTPA 2003) restricts advertising tobacco. Kept off the
// public site by default — flip to true only after checking with the owner.
export const SHOW_TOBACCO = false;

const raw: Category[] = [
  {
    id: "authentic",
    title: "Authentic Delights",
    odia: "ଆସଲ ସ୍ୱାଦ",
    blurb: "Slow-cooked, bone-in, unapologetically desi.",
    items: [
      { id: "kasha", name: "Authentic Chicken Kasha", note: "8 pc chicken & 3 pc aalu", price: 149, photo: "kasha", diet: "nonveg", hot: true },
      { id: "chk-pakoda", name: "Chicken Pakoda", note: "10 pc chicken", price: 149, photo: "chickenPakoda", diet: "nonveg", hot: true },
      { id: "chilli-chk", name: "Chilli Chicken", note: "10 pc chicken", price: 169, photo: "chilliChicken", diet: "nonveg" },
      { id: "chk-65", name: "Chicken 65", note: "5 pc chicken", price: 199, photo: "chicken65", diet: "nonveg" },
    ],
  },
  {
    id: "egg",
    title: "Egg Specials",
    odia: "ଅଣ୍ଡା",
    blurb: "Tawa-hot, pepper-loud.",
    items: [
      { id: "bhurji", name: "Egg Bhurji", price: 129, photo: "eggBhurji", diet: "egg" },
      { id: "omelette", name: "Egg Omelette", price: 99, photo: "omelette", diet: "egg" },
      { id: "egg-fry", name: "Boiled Egg Fry", price: 89, photo: "eggFry", diet: "egg" },
    ],
  },
  {
    id: "seafood",
    title: "Sea Food",
    odia: "ମାଛ",
    blurb: "Odisha's coastline, on a plate.",
    items: [
      { id: "fish-masala", name: "Desi Fish Masala", note: "4 pc", price: 149, photo: "fishMasala", diet: "nonveg", hot: true },
      { id: "pamfret", name: "Pamfret Fry", note: "1 pc", price: 499, photo: "pamfret", diet: "nonveg" },
      { id: "koni", name: "Koni Fish Fry", note: "5 pc", price: 499, photo: "koni", diet: "nonveg" },
      { id: "prawn", name: "Steamed Tiger Prawn", note: "7 pc", price: 399, photo: "prawn", diet: "nonveg" },
    ],
  },
  {
    id: "snacks",
    title: "Snacks & Starters",
    odia: "ଚଖଣା",
    blurb: "The crunch that keeps the conversation going.",
    items: [
      { id: "corn", name: "American Corn", price: 129, photo: "corn", diet: "veg" },
      { id: "paneer-pakoda", name: "Paneer Pakoda", note: "10 pc", price: 169, photo: "paneerPakoda", diet: "veg" },
      { id: "chilly-paneer", name: "Chilly Paneer Dry", note: "10 pc", price: 169, photo: "chillyPaneer", diet: "veg" },
      { id: "gobi-65", name: "Gobi 65", price: 149, photo: "gobi65", diet: "veg" },
      { id: "peanuts", name: "Masala Peanuts", price: 99, photo: "peanuts", diet: "veg", hot: true },
      { id: "salad", name: "Spicy Green Salad", price: 99, photo: "salad", diet: "veg" },
      { id: "chips", name: "Aalu Chips / Namkeen", price: 79, photo: "chips", diet: "veg" },
      { id: "kaju", name: "Salted Masala Kaju", price: 99, photo: "kaju", diet: "veg" },
      { id: "papad", name: "Masala Papad", price: 99, photo: "papad", diet: "veg" },
    ],
  },
  {
    id: "steamed",
    title: "Steamed Items",
    odia: "ସିଝା",
    blurb: "Light on the oil, heavy on the masala.",
    items: [
      { id: "chana", name: "Steamed Chana", price: 99, photo: "chana", diet: "veg" },
      { id: "masala-chana", name: "Steamed Masala Chana", price: 129, photo: "masalaChana", diet: "veg", hot: true },
      { id: "sprout", name: "Steamed Sprout", price: 149, photo: "sprout", diet: "veg" },
    ],
  },
  {
    id: "beverages",
    title: "Beverages & More",
    odia: "ଆଉ କିଛି",
    blurb: "Everything the table needs. Prices on request.",
    items: [
      { id: "cigarette", name: "Cigarette", price: null, diet: "veg", doodle: "glass", tobacco: true },
      { id: "cold-drinks", name: "Cold Drinks", price: null, photo: "coldDrink", diet: "veg" },
      { id: "soda", name: "Soda", price: null, photo: "soda", diet: "veg" },
      { id: "water", name: "Water Bottle", price: null, photo: "water", diet: "veg" },
      { id: "ice", name: "Ice Cube", price: null, photo: "ice", diet: "veg" },
      { id: "glass", name: "Glass", price: null, photo: "glass", diet: "veg" },
      { id: "bowl", name: "Paper Bowl", price: null, diet: "veg", doodle: "bowl" },
      { id: "plate", name: "Paper Plate", price: null, diet: "veg", doodle: "bowl" },
      { id: "achar", name: "Lemon / Mango Achar", price: null, photo: "achar", diet: "veg" },
    ],
  },
];

export const MENU: Category[] = raw.map((c) => ({
  ...c,
  items: c.items.filter((i) => SHOW_TOBACCO || !i.tobacco),
}));

export type Combo = {
  id: string;
  name: string;
  price: number;
  items: string[];
  imgs: PhotoKey[];
  mood: string;
};

const rawCombos: Combo[] = [
  {
    id: "combo-1",
    name: "Combo 1",
    price: 299,
    mood: "The Do-Dost",
    items: ["Chicken Pakoda", "Steamed Masala Chana", "Green Salad", "Water Bottle", "Glass × 2", "Paper Plate"],
    imgs: ["chickenPakoda", "masalaChana", "salad"],
  },
  {
    id: "combo-2",
    name: "Combo 2",
    price: 399,
    mood: "The Weekend Adda",
    items: ["Authentic Chicken Kasha", "American Corn", "Steamed Sprout", "Water Bottle", "Glass", "Paper Plate"],
    imgs: ["kasha", "corn", "sprout"],
  },
  {
    id: "combo-3",
    name: "Combo 3",
    price: 799,
    mood: "The Full Mehfil",
    items: ["Koni Fish Fry", "Steamed Masala Chana", "Paneer Pakoda", "Masala Papad", "Ice Cube", "Glass", "Paper Plate", "Cigarette"],
    imgs: ["koni", "paneerPakoda", "papad"],
  },
];

export const COMBOS: Combo[] = rawCombos.map((c) => ({
  ...c,
  items: c.items.filter((i) => SHOW_TOBACCO || !/cigarette/i.test(i)),
}));

export const ALL_ITEMS = MENU.flatMap((c) => c.items.map((i) => ({ ...i, category: c.id })));
export const priced = ALL_ITEMS.filter((i) => i.price !== null);
export const MIN_PRICE = Math.min(...priced.map((i) => i.price as number));
