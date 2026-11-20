import type { Metadata } from "next";
import TestimonialsView from "@/components/pages/TestimonialsView";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = (): Promise<Metadata> =>
  pageMetadata("/testimonials", { title: "Client Testimonials", description: "Clients on working with Fire on the Bayou, in their own words." });

export default function TestimonialsPage() {
  return <TestimonialsView />;
}
