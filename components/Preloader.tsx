"use client";

import { useEffect } from "react";
import { markLoaded } from "@/lib/loaded";

/**
 * No loading screen any more — the page shows straight away.
 * This just fires the "loaded" signal so the hero / nav intro animations start immediately.
 */
export default function Preloader() {
  useEffect(() => {
    document.documentElement.classList.remove("is-loading");
    const id = requestAnimationFrame(() => markLoaded());
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}
