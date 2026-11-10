"use client";

import SmoothScroll from "./SmoothScroll";
import { CartProvider } from "./Cart";
import Preloader from "../Preloader";
import Nav from "../Nav";
import CartDrawer from "../CartDrawer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <CartProvider>
        <Preloader />
        <Nav />
        {children}
        <CartDrawer />
      </CartProvider>
    </SmoothScroll>
  );
}
