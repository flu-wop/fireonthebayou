import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactView from "@/components/pages/ContactView";
import HomeView from "@/components/pages/HomeView";
import ProcessView from "@/components/pages/ProcessView";
import ProjectView from "@/components/pages/ProjectView";
import ServicesView from "@/components/pages/ServicesView";
import StudioView from "@/components/pages/StudioView";
import TestimonialsView from "@/components/pages/TestimonialsView";
import WorkView from "@/components/pages/WorkView";
import { getSession, validPreviewToken } from "@/lib/admin-auth";

/**
 * /preview/<page>?t=<token> — the real page rendered with unpublished drafts.
 * Needs an admin session or a signed preview token (7 days). Never indexed.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

type Props = { params: Promise<{ page: string[] }>; searchParams: Promise<{ t?: string }> };

export default async function Preview({ params, searchParams }: Props) {
  const [{ page }, { t }] = await Promise.all([params, searchParams]);
  if (!validPreviewToken(t) && !(await getSession())) notFound();
  const draft = true;
  const [head, slug] = page;

  let view: React.ReactNode;
  if (head === "work" && slug) view = <ProjectView slug={slug} draft={draft} />;
  else {
    const views: Record<string, React.ReactNode> = {
      home: <HomeView draft={draft} />,
      work: <WorkView draft={draft} />,
      services: <ServicesView draft={draft} />,
      process: <ProcessView draft={draft} />,
      about: <StudioView draft={draft} />,
      testimonials: <TestimonialsView draft={draft} />,
      contact: <ContactView draft={draft} />,
    };
    view = views[head];
  }
  if (!view) notFound();

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[90] flex items-center justify-center gap-3 bg-flame px-4 py-2 text-center text-xs font-semibold text-white">
        PREVIEW — shows unpublished changes. Visitors don&rsquo;t see this.
      </div>
      {view}
    </>
  );
}
