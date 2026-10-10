import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Providers from "@/components/Providers";

// Inter auto-hébergée (aucun appel à Google Fonts, ni au build ni chez le visiteur).
const inter = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
});

const description =
  "Ben & Gilles sont ravis de vous accueillir à l'Atelier de l'Echarpe, nouveau lieu de fiesta à Toulouse, 8 rue de l'écharpe 31000 Toulouse, tout près de la place Esquirol, de l'hotel d'Assezat et du Pont-Neuf.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.latelierdelecharpe.fr"),
  title: {
    default: "L'Atelier de l'Écharpe – bar, bistrot et fiesta à Toulouse",
    template: "%s | L'Atelier de l'Écharpe",
  },
  description,
  keywords: [
    "Bar",
    "Bar à cocktails",
    "Cocktails",
    "Vin",
    "Bar à vin",
    "Restaurant Toulouse",
    "Restaurant",
    "Toulouse",
    "Cocktails Toulouse",
    "Bar à cocktails Toulouse",
    "Bar à vin Toulouse",
  ],
  icons: "/img/logo/logo-red.png",
  openGraph: {
    title: "L'atelier de l'écharpe",
    description,
    url: "/",
    images: ["/img/info/resume-page-cream.jpg"],
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
