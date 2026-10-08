import type { Metadata } from "next";
import "@flu-wop/design-system/core.css";
import "@flu-wop/design-system/compat.css";
import "./globals.css";
import { Archivo } from "next/font/google";
import { site } from "@/lib/site";
import SmoothScroll from "@/components/effects/SmoothScroll";
import GrainOverlay from "@/components/effects/GrainOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * Root layout
 * -----------
 * Order of wrappers matters:
 *   SmoothScroll (Lenis)  ->  global texture (grain/vignette)  ->  chrome (nav/footer)
 * Archivo is self-hosted via next/font (variable width + weight axes).
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: ["/images/og-image.jpg"],
  },
  twitter: { card: "summary_large_image" },
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="studio" lang="en" className={`dark ${archivo.variable}`}>
      <body className="bg-ink text-cream antialiased">
        <SmoothScroll>
          <GrainOverlay />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
