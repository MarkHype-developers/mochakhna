import type { Metadata } from "next";
import DealsPage from "@/components/kfc/DealsPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Deals & Combos | Ayunraz Chakhna",
  description: "Party combos from ₹299 — chakhna, sides, water, glasses and plates sorted. Order on WhatsApp.",
};

export default function Page() {
  return (
    <>
      <main><DealsPage /></main>
      <Footer />
    </>
  );
}
