"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_CONTENT, derive, fetchContent, type Content, type Derived } from "@/lib/content";

const Ctx = createContext<Derived>(derive(DEFAULT_CONTENT));

/**
 * Site content (menu, deals, site details, home images).
 * The server renders the page with the copy it fetched (refreshed every minute);
 * the browser then checks once for anything newer, so a Publish shows up right away.
 */
export function ContentProvider({ initial, children }: { initial: Content | null; children: React.ReactNode }) {
  const [content, setContent] = useState<Content>(initial ?? DEFAULT_CONTENT);
  useEffect(() => {
    let live = true;
    fetchContent({ cache: "no-store" }).then((c) => {
      if (live && c && c.updatedAt !== content.updatedAt) setContent(c);
    });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const value = useMemo(() => derive(content), [content]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
