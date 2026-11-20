import type { Metadata } from "next";
import HomeView from "@/components/pages/HomeView";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const generateMetadata = async (): Promise<Metadata> => {
  const m = await pageMetadata("/", { title: `${site.name} — ${site.tagline}`, description: site.description });
  return m;
};

export default function HomePage() {
  return <HomeView />;
}
