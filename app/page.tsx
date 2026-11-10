import SmoothScroll from "@/components/providers/SmoothScroll";
import { CartProvider } from "@/components/providers/Cart";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Cravings from "@/components/Cravings";
import Story from "@/components/Story";
import PlateAssembly from "@/components/PlateAssembly";
import MenuSection from "@/components/MenuSection";
import Combos from "@/components/Combos";
import PromiseSection from "@/components/Promise";
import Ayunraz from "@/components/Ayunraz";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  return (
    <SmoothScroll>
      <CartProvider>
        <Preloader />
        <div className="grain" aria-hidden />
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Cravings />
          <Story />
          <PlateAssembly />
          <MenuSection />
          <Combos />
          <PromiseSection />
          <Ayunraz />
        </main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </SmoothScroll>
  );
}
