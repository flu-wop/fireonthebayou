import type { Metadata } from "next";
import ProcessView from "@/components/pages/ProcessView";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = (): Promise<Metadata> =>
  pageMetadata("/process", {
    title: "Process",
    description:
      "How Fire on the Bayou works — discovery, treatment, production, sound, finish and post-production — plus answers to common questions about working with us.",
  });

export default function ProcessPage() {
  return <ProcessView />;
}
