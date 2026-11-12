"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import { CartProvider } from "./Cart";
import Preloader from "../Preloader";
import Nav from "../Nav";
import CartDrawer from "../CartDrawer";
import { ContentProvider } from "./Content";
import type { Content } from "@/lib/content";

export default function Providers({ children, content }: { children: React.ReactNode; content: Content | null }) {
  const admin = usePathname()?.startsWith("/admin");
  if (admin) return <ContentProvider initial={content}>{children}</ContentProvider>;
  return (
    <ContentProvider initial={content}>
    <SmoothScroll>
      <CartProvider>
        <Preloader />
        <Nav />
        {children}
        <CartDrawer />
      </CartProvider>
    </SmoothScroll>
    </ContentProvider>
  );
}
