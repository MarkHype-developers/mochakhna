import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import "@fontsource/noto-sans-oriya/700.css";
import "@fontsource/noto-sans-oriya/900.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";
import "./globals.css";
import { SITE } from "@/lib/site";
import Providers from "@/components/providers/Providers";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Ayunraz Chakhna — Big Flavours. Good Company. | Order in Bhubaneswar",
  description:
    "Ayunraz Chakhna, Bhubaneswar: french fries, chicken kasha, tikka, tandoori, fish fry, paneer, steamed snacks and party combos. Open every day 9 AM–11 PM. We never sell alcohol.",
  keywords: ["Ayunraz Chakhna", "Mo Chakhna", "chakhna", "Odisha snacks", "chicken kasha", "Ayunraz", "party combos", "Bhubaneswar"],
  openGraph: {
    title: "Ayunraz Chakhna — Big Flavours. Good Company.",
    description: "Peg aapka. Chakhna humara. Fresh Odia-style chakhna by Ayunraz.",
    url: SITE.url,
    siteName: "Ayunraz Chakhna",
    images: [{ url: "/img/mochakhna-logo-red.jpg", width: 1080, height: 700 }],
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#e30a0a" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Ayunraz Chakhna",
  alternateName: ["Mo Chakhna", "ମୋ ଚଖଣା"],
  telephone: SITE.phones,
  address: SITE.address.join(", "),
  openingHours: "Mo-Su 09:00-23:00",
  slogan: "Daru Ka Dost — We Never Sell Alcohol",
  url: SITE.url,
  servesCuisine: ["Odia", "Indian", "Snacks", "Tandoor"],
  priceRange: "₹79 – ₹799",
  parentOrganization: { "@type": "Organization", name: "Ayunraz", slogan: "Authentic Food Of New India" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
