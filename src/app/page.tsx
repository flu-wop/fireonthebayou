/**
 * Home (/) — one screen: the reel, the tagline, the client logo banner and a
 * single call to action. Parallax + smooth scroll live on Work and inner pages.
 */
import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import LogoBanner from "@/components/sections/LogoBanner";
import { catalogClients, clientLogoPath, publicFileExists } from "@/lib/media-manifest";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const logos = catalogClients().map((name) => {
    const src = clientLogoPath(name);
    return { name, src: publicFileExists(src) ? src : null };
  });
  const mp4 = publicFileExists("/video/hero-reel.mp4") ? "/video/hero-reel.mp4" : undefined;
  return <Hero mp4={mp4} banner={<LogoBanner logos={logos} />} />;
}
