import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import SmoothScroll from "@/components/effects/SmoothScroll";
import GrainOverlay from "@/components/effects/GrainOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PreviewBadge from "@/components/layout/PreviewBadge";

/**
 * Root layout
 * -----------
 * Order of wrappers matters:
 *   SmoothScroll (Lenis)  ->  global texture (grain/vignette)  ->  chrome (nav/footer)
 * Fonts load via @import in globals.css (ecosystem convention), so no next/font here.
 */
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-ink text-cream antialiased">
        <SmoothScroll>
          <GrainOverlay />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SmoothScroll>
        <PreviewBadge />
      </body>
    </html>
  );
}
