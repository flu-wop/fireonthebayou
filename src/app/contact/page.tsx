import type { Metadata } from "next";
import ContactView from "@/components/pages/ContactView";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const generateMetadata = (): Promise<Metadata> =>
  pageMetadata("/contact", { title: "Let's Talk", description: `Start a project with Fire on the Bayou. Based in ${site.location}.` });

export default function ContactPage() {
  return <ContactView />;
}
