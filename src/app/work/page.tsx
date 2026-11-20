import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import WorkBrowser from "@/components/work/WorkBrowser";
import type { WorkItem } from "@/components/work/types";
import { catalog } from "@/lib/catalog";
import { publicFileExists } from "@/lib/media-manifest";

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
  title: "Work",
  description: "Commercials, brand films, social content and more from Fire on the Bayou — filter by format and industry.",
};

export default function WorkPage() {
  // File checks happen at build time (static page); phase 4 reads them from the database.
  const items: WorkItem[] = catalog.map((p) => ({
    ...p,
    posterPresent: publicFileExists(`/images/work-${p.slug}.jpg`),
    previewPresent: publicFileExists(`/video/work-${p.slug}.mp4`),
  }));
  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title={<>The<br /><span className="text-flame">work.</span></>}
        lede="Every commercial, brand film and social spot, sorted by format and industry."
      />
      <section className="frame pb-28">
        <WorkBrowser items={items} />
      </section>
    </>
  );
}
