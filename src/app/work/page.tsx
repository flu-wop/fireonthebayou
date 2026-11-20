import type { Metadata } from "next";
import WorkView from "@/components/pages/WorkView";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = (): Promise<Metadata> =>
  pageMetadata("/work", { title: "Work", description: "Commercials, brand films, social content and more from Fire on the Bayou — filter by format and industry." });

export default function WorkPage() {
  return <WorkView />;
}
