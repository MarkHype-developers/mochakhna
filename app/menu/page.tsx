import { Suspense } from "react";
import type { Metadata } from "next";
import MenuPage from "@/components/kfc/MenuPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Menu | Ayunraz Chakhna — Fries, Chicken, Tandoor, Fish & Snacks",
  description: "Full Ayunraz Chakhna menu: french fries, chicken kasha, tikka, tandoori chicken, fish fry, eggs, paneer, steamed snacks and namkeen. Order on WhatsApp.",
};

export default function Page() {
  return (
    <>
      <main><Suspense><MenuPage /></Suspense></main>
      <Footer />
    </>
  );
}
