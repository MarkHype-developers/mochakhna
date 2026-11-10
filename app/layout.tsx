import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import "@fontsource/noto-sans-oriya/700.css";
import "@fontsource/noto-sans-oriya/900.css";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Mo Chakhna — Daru Ka Dost | Chakhna, Kasha & Snacks in Odisha",
  description:
    "Mo Chakhna (ମୋ ଚଖଣା) by Ayunraz — authentic chicken kasha, pakoda, fish fry, masala peanuts, steamed chana & party combos from ₹79. We never sell alcohol.",
  keywords: ["Mo Chakhna", "chakhna", "Odisha snacks", "chicken kasha", "Ayunraz", "party combos", "Bhubaneswar"],
  openGraph: {
    title: "Mo Chakhna — Daru Ka Dost",
    description: "Peg aapka. Chakhna humara. Fresh Odia-style chakhna by Ayunraz.",
    url: SITE.url,
    siteName: "Mo Chakhna",
    images: [{ url: "/img/mochakhna-logo-red.jpg", width: 1080, height: 700 }],
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#e30a0a" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Mo Chakhna",
  alternateName: "ମୋ ଚଖଣା",
  slogan: "Daru Ka Dost — We Never Sell Alcohol",
  url: SITE.url,
  servesCuisine: ["Odia", "Indian", "Snacks"],
  priceRange: "₹79 – ₹799",
  parentOrganization: { "@type": "Organization", name: "Ayunraz", slogan: "Authentic Food Of New India" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
