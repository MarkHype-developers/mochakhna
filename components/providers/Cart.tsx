"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ALL_ITEMS, DEALS } from "@/lib/menu";

type Line = { id: string; name: string; price: number | null; qty: number };
type CartCtx = {
  lines: Line[];
  count: number;
  total: number;
  hasOnRequest: boolean;
  qty: (id: string) => number;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  lastAdded: { id: string; at: number } | null;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ac-cart-v1";

const catalogue = new Map<string, { name: string; price: number | null }>([
  ...ALL_ITEMS.map((i) => [i.id, { name: i.qty ? `${i.name} (${i.qty})` : i.name, price: i.price }] as const),
  ...DEALS.map((d) => [d.id, { name: `${d.name} — ${d.title}`, price: d.price }] as const),
]);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [lastAdded, setLast] = useState<CartCtx["lastAdded"]>(null);

  // keep the plate across pages / reloads (per browser)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      const clean = Object.fromEntries(Object.entries(saved).filter(([id, n]) => catalogue.has(id) && typeof n === "number" && n > 0));
      setMap(clean as Record<string, number>);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(map)); } catch {}
  }, [map]);

  const add = useCallback((id: string) => {
    setMap((m) => ({ ...m, [id]: (m[id] ?? 0) + 1 }));
    setLast({ id, at: Date.now() });
  }, []);
  const remove = useCallback((id: string) => {
    setMap((m) => {
      const n = (m[id] ?? 0) - 1;
      const next = { ...m };
      if (n <= 0) delete next[id]; else next[id] = n;
      return next;
    });
  }, []);

  const value = useMemo<CartCtx>(() => {
    const lines = Object.entries(map).filter(([id]) => catalogue.has(id)).map(([id, qty]) => {
      const c = catalogue.get(id)!;
      return { id, qty, name: c.name, price: c.price };
    });
    return {
      lines,
      count: lines.reduce((a, l) => a + l.qty, 0),
      total: lines.reduce((a, l) => a + (l.price ?? 0) * l.qty, 0),
      hasOnRequest: lines.some((l) => l.price === null),
      qty: (id) => map[id] ?? 0,
      add, remove,
      clear: () => setMap({}),
      open, setOpen, lastAdded,
    };
  }, [map, open, add, remove, lastAdded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};
