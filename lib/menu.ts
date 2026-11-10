// Menu — transcribed from "Ayunraz-Chakhna-Menu.pdf" (names, pieces and prices exactly as printed).
// Descriptions are short helper lines for the cards — edit freely.
import type { PhotoKey } from "./photos";

export type Diet = "veg" | "nonveg" | "egg";

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  qty?: string;
  price: number | null;      // null → priceLabel is shown (MRP / Free*)
  priceLabel?: string;
  diet: Diet;
  photo: PhotoKey;
  tag?: "Bestseller" | "Chef's special" | "New";
  serves?: number;
  tobacco?: boolean;
};

export type Category = { id: string; group: string; title: string; photo: PhotoKey; items: MenuItem[] };

// COTPA 2003 restricts tobacco advertising in India. Cigarettes stay off the site
// unless the owner has checked. Flip to true to show them.
export const SHOW_TOBACCO = false;

const raw: Category[] = [
  {
    id: "fries", group: "Snacks & Sides", title: "Fries & Crispy Bites", photo: "friesPdf",
    items: [
      { id: "fries", name: "Classic Golden French Fries", desc: "Crisp outside, fluffy inside, tossed in house seasoning.", price: 99, diet: "veg", photo: "friesPdf", tag: "Bestseller" },
      { id: "garlic-fries", name: "Velvet Garlic French Fries", desc: "Golden fries in a silky garlic butter.", price: 129, diet: "veg", photo: "garlicFries" },
      { id: "herb-fries", name: "Italian Herb Fries", desc: "Oregano, basil and chilli flakes.", price: 129, diet: "veg", photo: "herbFries" },
      { id: "truffle-fries", name: "Truffled Italian Garlic Fries", desc: "Truffle oil, roasted garlic, Italian herbs.", price: 149, diet: "veg", photo: "truffleFries", tag: "New" },
      { id: "momo-fries-butter", name: "Crispy Momo Fries with Butter", desc: "Crunchy fried momos glazed with butter.", price: 149, diet: "veg", photo: "momoFries" },
      { id: "popcorn", name: "Crispy Chicken Popcorn Bites", desc: "Bite-sized chicken, double-coated and fried golden.", price: 129, diet: "nonveg", photo: "popcorn" },
      { id: "fish-strips", name: "Golden Crispy Fish Strips", desc: "Boneless fish fingers with a crunchy crumb.", price: 149, diet: "nonveg", photo: "fishStrips" },
      { id: "malai-fish-strips", name: "Butter Garlic Malai Fish Strips", desc: "Fish strips in a creamy butter-garlic malai.", price: 199, diet: "nonveg", photo: "fishPakora" },
      { id: "momo-frites", name: "Chef's Special Crispy Chicken Momo Frites", desc: "Chicken momos fried crisp, chef's seasoning.", price: 179, diet: "nonveg", photo: "momoFries", tag: "Chef's special" },
      { id: "butter-chicken-momo", name: "Butter Chicken Momo Fries", desc: "Fried chicken momos tossed in butter-chicken masala.", price: 219, diet: "nonveg", photo: "momoFries" },
      { id: "tender-strips", name: "Premium Crispy Chicken Tender Strips", desc: "Juicy whole-muscle chicken strips, extra crunch.", price: 199, diet: "nonveg", photo: "tenders" },
      { id: "malai-tenders", name: "Rich Butter Garlic Malai Chicken Tenders", desc: "Chicken tenders in a rich malai, butter & garlic coat.", price: 249, diet: "nonveg", photo: "malaiChickenPakora" },
    ],
  },
  {
    id: "steamed", group: "Snacks & Sides", title: "Steamed, Salad & Papad", photo: "sprouts",
    items: [
      { id: "salad", name: "Artisan Garden Green Salad", desc: "Fresh cucumber, onion, tomato, lemon & chilli.", price: 49, diet: "veg", photo: "salad" },
      { id: "papad", name: "Masala Papad", desc: "Roasted papad loaded with onion, tomato & chaat masala.", price: 59, diet: "veg", photo: "papad" },
      { id: "kala-chana", name: "Seasoned Steamed Kala Chana", desc: "Steamed black chana with onion, lemon & spices.", price: 69, diet: "veg", photo: "kalaChana" },
      { id: "masala-kala-chana", name: "Spiced Masala Kala Chana", desc: "Kala chana tossed in a tangy masala.", price: 99, diet: "veg", photo: "masalaKalaChana" },
      { id: "sprout-blend", name: "Vitality Steamed Sprout Blend", desc: "Light, steamed sprouts with a squeeze of lemon.", price: 79, diet: "veg", photo: "sproutBlend" },
      { id: "mixed-sprout", name: "Nutrient-Rich Mixed Sprout", desc: "Mixed sprouts, onion, tomato and spices.", price: 129, diet: "veg", photo: "sprouts" },
    ],
  },
  {
    id: "chicken", group: "Fresh Cooked", title: "Chicken", photo: "kashaBowl",
    items: [
      { id: "kasha", name: "Traditional Spiced Chicken Kasha", qty: "7 pcs", desc: "Slow-cooked Odia kasha in a dark, spicy gravy.", price: 149, diet: "nonveg", photo: "kashaBowl", tag: "Bestseller" },
      { id: "chk-pakora", name: "Crispy Spiced Chicken Pakora", qty: "10 pcs", desc: "Masala-marinated chicken fried crisp.", price: 159, diet: "nonveg", photo: "chickenPakora", tag: "Bestseller" },
      { id: "c65", name: "Signature South Indian Chicken 65", qty: "10 pcs", desc: "Fiery red, curry-leaf tempered, deep-fried.", price: 149, diet: "nonveg", photo: "chicken65" },
      { id: "pepper", name: "Black Pepper Infused Chicken", qty: "10 pcs", desc: "Cracked black pepper, onion and garlic.", price: 149, diet: "nonveg", photo: "pepperChicken" },
      { id: "liver", name: "Pan-Seared Spiced Chicken Liver", qty: "5 pcs", desc: "Tender liver seared in a spicy masala.", price: 199, diet: "nonveg", photo: "liver" },
      { id: "lollipop", name: "Crispy Frenched Chicken Lollipops", qty: "6 pcs", desc: "Frenched wings, fried crunchy, with spicy dip.", price: 199, diet: "nonveg", photo: "lollipop" },
      { id: "tikka", name: "Charcoal-Grilled Chicken Tikka", qty: "10 pcs", desc: "Yoghurt-marinated, char-grilled boneless chicken.", price: 249, diet: "nonveg", photo: "tikkaPdf", tag: "Bestseller" },
      { id: "achari", name: "Tangy Achari Chicken", qty: "10 pcs", desc: "Pickling spices, mustard oil and a sour kick.", price: 249, diet: "nonveg", photo: "achari" },
      { id: "lemon-garlic", name: "Lemon Garlic Chicken", qty: "10 pcs", desc: "Tangy lemon, toasted garlic, black pepper.", price: 249, diet: "nonveg", photo: "lemonGarlic" },
      { id: "kebab", name: "Chef's Special Chicken Kebab", desc: "Smoky, spiced chicken kebabs off the grill.", price: 249, diet: "nonveg", photo: "kebab", tag: "Chef's special" },
      { id: "bhuna", name: "Slow-Cooked Chicken Bhuna", desc: "Chicken roasted down in onion-tomato masala.", price: 199, diet: "nonveg", photo: "bhuna" },
      { id: "cutlet", name: "Golden Crispy Chicken Cutlet", qty: "4 pcs", desc: "Crumbed, spiced chicken cutlets.", price: 149, diet: "nonveg", photo: "cutlet" },
      { id: "curry-leaf", name: "Curry Leaf Infused Chicken Fry", qty: "10 pcs", desc: "Crisp chicken fried with fresh curry leaves.", price: 149, diet: "nonveg", photo: "curryLeaf" },
      { id: "smoky", name: "Flame Smoky Chicken", qty: "7 pcs", desc: "Grilled over open flame for a deep smoky char.", price: 199, diet: "nonveg", photo: "flameSmoky" },
      { id: "sukka", name: "Coastal Style Chicken Sukka", qty: "7 pcs", desc: "Dry coastal masala with roasted coconut.", price: 199, diet: "nonveg", photo: "kadaiKasha" },
      { id: "chilli-chk", name: "Dry Chilli Chicken", qty: "Boneless", desc: "Wok-tossed boneless chicken, peppers & onion.", price: 199, diet: "nonveg", photo: "chilliChickenShoot" },
      { id: "wings", name: "Roasted Chicken Wings", qty: "6 pcs", desc: "Oven-roasted, sticky, spicy wings.", price: 199, diet: "nonveg", photo: "wings" },
    ],
  },
  {
    id: "tandoori", group: "Fresh Cooked", title: "Tandoori", photo: "tandooriLegs",
    items: [
      { id: "tandoori-legs", name: "Tandoori Chicken", qty: "2 full legs", desc: "Classic red tandoori marinade, roasted till smoky.", price: 349, diet: "nonveg", photo: "tandooriLegs", serves: 2 },
      { id: "tandoori-whole", name: "Tandoori Chicken", qty: "1 whole chicken", desc: "A whole bird for the whole gang. Onion, lemon & chutney.", price: 799, diet: "nonveg", photo: "tandooriWhole", serves: 4, tag: "Bestseller" },
    ],
  },
  {
    id: "fish", group: "Fresh Cooked", title: "Fish & Prawn", photo: "fishFryPdf",
    items: [
      { id: "katla-kasha", name: "Katla Fish Kasha", qty: "4 pcs", desc: "Katla simmered in a thick, home-style kasha.", price: 149, diet: "nonveg", photo: "katlaKasha" },
      { id: "fish-fry", name: "Masala Fish Fry", qty: "4 pcs", desc: "Tawa-fried fish in a fiery Odia masala crust.", price: 149, diet: "nonveg", photo: "fishFryPdf", tag: "Bestseller" },
      { id: "prawn", name: "Steamed Prawn", qty: "5 pcs", desc: "Juicy prawns steamed with chilli and garlic.", price: 399, diet: "nonveg", photo: "prawnBowl" },
      { id: "koni", name: "Buttery Spicy Koni Fish Fry", qty: "5 pcs", desc: "Koni fish fried crisp, finished in butter.", price: 499, diet: "nonveg", photo: "koni" },
      { id: "pomfret", name: "Masala Pomfret Fry", qty: "1 pc", desc: "Whole pomfret in a spicy masala, tawa-fried.", price: 549, diet: "nonveg", photo: "pomfretFry", tag: "Chef's special" },
      { id: "chilli-fish", name: "Chilli Masala Fish", qty: "Koni fish", desc: "Koni fish tossed in a hot chilli masala.", price: 699, diet: "nonveg", photo: "chilliFish" },
      { id: "vetki", name: "Spicy Vetki Fish Fry", qty: "5 pcs", desc: "Boneless vetki, crumb-fried with green chilli & lemon.", price: 799, diet: "nonveg", photo: "vetki" },
    ],
  },
  {
    id: "egg", group: "Fresh Cooked", title: "Egg", photo: "omelet",
    items: [
      { id: "omelet", name: "Classic Spiced Masala Omelet", desc: "Onion, green chilli and coriander — off the tawa.", price: 99, diet: "egg", photo: "omelet" },
      { id: "egg-fry", name: "Pan-Seared Spicy Egg Fry", desc: "Boiled eggs seared in a spicy masala.", price: 129, diet: "egg", photo: "eggFry" },
      { id: "scrambled", name: "Homemade Spiced Scrambled Eggs", desc: "Soft, buttery desi bhurji.", price: 149, diet: "egg", photo: "scrambled" },
      { id: "steamed-egg", name: "Delicate Steamed Egg Dish", desc: "Gently steamed eggs, lightly spiced.", price: 99, diet: "egg", photo: "steamedEgg" },
    ],
  },
  {
    id: "veg", group: "Fresh Cooked", title: "Vegetarian", photo: "paneerPakora",
    items: [
      { id: "paneer-pakora", name: "Paneer Pakora", desc: "Soft paneer in crisp besan batter.", price: 149, diet: "veg", photo: "paneerPakora" },
      { id: "gobi-pakora", name: "Crunchy Spiced Cauliflower Pakora", desc: "Gobi florets in a spiced crunchy batter.", price: 149, diet: "veg", photo: "mushroomPakora" },
      { id: "dry-chilli-paneer", name: "Spicy Dry Chilli Paneer", desc: "Wok-tossed paneer, peppers and onion, dry.", price: 199, diet: "veg", photo: "chilliPaneer", tag: "Bestseller" },
      { id: "mushroom-pakora", name: "Crispy Seasoned Mushroom Pakora", desc: "Button mushrooms in a spiced crunchy coat.", price: 149, diet: "veg", photo: "mushroomPakora" },
      { id: "chilli-mushroom", name: "Spicy Chilli Mushrooms", desc: "Mushrooms in a fiery Indo-Chinese glaze.", price: 199, diet: "veg", photo: "chilliMushroom" },
      { id: "chilli-paneer", name: "Spicy Chilli Paneer", desc: "Paneer in a glossy chilli sauce.", price: 199, diet: "veg", photo: "paneerPakora" },
    ],
  },
  {
    id: "namkeen", group: "Snacks & Sides", title: "Namkeen", photo: "cashews",
    items: [
      { id: "cashews", name: "Masala Cashews", desc: "Roasted kaju with a chilli-salt dusting.", price: 99, diet: "veg", photo: "cashews" },
      { id: "chips", name: "Aloo Chips / Namkeen", desc: "Crunchy chips and classic namkeen.", price: 49, diet: "veg", photo: "chips" },
      { id: "tasty-nuts", name: "Tasty Nuts", desc: "Our house mix of roasted nuts.", price: 99, diet: "veg", photo: "tastyNuts" },
      { id: "peanuts", name: "Masala Peanuts", desc: "The original chakhna — spiced and roasted.", price: 49, diet: "veg", photo: "peanuts", tag: "Bestseller" },
    ],
  },
  {
    id: "essentials", group: "Essentials", title: "Essentials", photo: "coldDrink",
    items: [
      { id: "water", name: "Water", desc: "Packaged drinking water.", price: null, priceLabel: "MRP", diet: "veg", photo: "water" },
      { id: "ice", name: "Ice Cube", desc: "A bag of ice.", price: null, priceLabel: "MRP", diet: "veg", photo: "ice" },
      { id: "soda", name: "Soda", desc: "Chilled soda.", price: null, priceLabel: "MRP", diet: "veg", photo: "soda" },
      { id: "cold-drinks", name: "Cold Drinks", desc: "Chilled soft drinks.", price: null, priceLabel: "MRP", diet: "veg", photo: "coldDrink" },
      { id: "glass", name: "Glass", desc: "Disposable glasses. *Conditions apply.", price: 0, priceLabel: "Free*", diet: "veg", photo: "glass" },
      { id: "plate", name: "Paper Plate", desc: "Disposable paper plates. *Conditions apply.", price: 0, priceLabel: "Free*", diet: "veg", photo: "plates" },
      { id: "bowl", name: "Paper Bowl", desc: "Disposable paper bowls. *Conditions apply.", price: 0, priceLabel: "Free*", diet: "veg", photo: "plates" },
      { id: "cigarette", name: "Cigarette", desc: "", price: null, priceLabel: "MRP", diet: "veg", photo: "glass", tobacco: true },
    ],
  },
];

// show in the order of the printed menu: Fries, Chicken, Tandoori, Fish, Egg, Veg, Steamed, Namkeen, Essentials
const order = ["fries", "chicken", "tandoori", "fish", "egg", "veg", "steamed", "namkeen", "essentials"];
export const MENU: Category[] = order
  .map((id) => raw.find((c) => c.id === id)!)
  .map((c) => ({ ...c, items: c.items.filter((i) => SHOW_TOBACCO || !i.tobacco) }));

export const ALL_ITEMS = MENU.flatMap((c) => c.items.map((i) => ({ ...i, category: c.id })));
export const BESTSELLERS = ALL_ITEMS.filter((i) => i.tag);

export type Deal = {
  id: string; name: string; title: string; price: number;
  items: string[]; photo: PhotoKey; serves: string; badge?: string; worth?: number;
};

// Combos (from the previous menu card), re-priced against the new menu prices.
const worth = (ids: string[]) => ids.reduce((a, id) => a + (ALL_ITEMS.find((i) => i.id === id)?.price ?? 0), 0);
export const DEALS: Deal[] = [
  {
    id: "deal-1", name: "Combo 1", title: "The Do-Dost", price: 299, serves: "Serves 2", photo: "chickenPakora",
    items: ["Crispy Spiced Chicken Pakora (10 pcs)", "Spiced Masala Kala Chana", "Artisan Garden Green Salad", "Water · 2 Glasses · Paper Plate"],
    worth: worth(["chk-pakora", "masala-kala-chana", "salad"]),
  },
  {
    id: "deal-2", name: "Combo 2", title: "The Weekend Adda", price: 399, serves: "Serves 2–3", photo: "kadaiKasha", badge: "Most loved",
    items: ["Traditional Spiced Chicken Kasha (7 pcs)", "Classic Golden French Fries", "Nutrient-Rich Mixed Sprout", "Masala Papad", "Water · Glass · Paper Plate"],
    worth: worth(["kasha", "fries", "mixed-sprout", "papad"]),
  },
  {
    id: "deal-3", name: "Combo 3", title: "The Full Mehfil", price: 799, serves: "Serves 4", photo: "seafoodSpread", badge: "Party pack",
    items: ["Buttery Spicy Koni Fish Fry (5 pcs)", "Spiced Masala Kala Chana", "Paneer Pakora", "Masala Papad", "Ice Cube · Glasses · Paper Plates"],
    worth: worth(["koni", "masala-kala-chana", "paneer-pakora", "papad"]),
  },
];

/** Offers printed on the menu ("Free*, conditions apply") shown as KFC-style coupons. */
export const OFFERS = [
  { id: "glass", title: "Free Glasses", line: "With every order*", photo: "glass" as PhotoKey },
  { id: "plate", title: "Free Paper Plates", line: "With every order*", photo: "plates" as PhotoKey },
  { id: "bowl", title: "Free Paper Bowls", line: "With every order*", photo: "plates" as PhotoKey },
];

export const COMBOS = DEALS;
