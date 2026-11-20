import { guard } from "../guard";
import { saveSeoAction } from "../content/actions";
import RecordForm from "@/components/admin/RecordForm";
import { Card, Page } from "@/components/admin/ui";
import { previewToken } from "@/lib/admin-auth";
import { getTaxonomy, loadKindWithState } from "@/lib/content";
import { SEO_FIELDS, SEO_PAGES, formValues } from "@/lib/content/forms";
import { legacyRedirects } from "@/lib/redirects";
import { previewSlugFor } from "@/lib/preview-pages";

export const dynamic = "force-dynamic";

export default async function Seo() {
  const user = await guard();
  const recs = await loadKindWithState("page_seo");
  const tax = await getTaxonomy({ draft: true });
  const token = previewToken();
  return (
    <Page title="SEO" sub="Title, description and link-preview image for each page. Empty fields use the built-in defaults.">
      {SEO_PAGES.map((p) => (
        <Card key={p.path} title={`${p.label} · ${p.path}`}>
          <RecordForm action={saveSeoAction} fields={SEO_FIELDS} values={formValues(SEO_FIELDS, (recs.find((r) => r.key === p.path)?.data as unknown as Record<string, unknown>) ?? {})} tax={tax} hidden={{ path: p.path }} previewHref={`/preview/${previewSlugFor(p.path)}?t=${token}`} />
        </Card>
      ))}
      <Card title="Old-site redirects (read-only)">
        <p className="mb-3 text-xs text-ash">{legacyRedirects.length} permanent redirects from the old WordPress site live in code (src/lib/redirects.ts) and apply at launch.{user.role !== "owner" && " Ask the Owner to change them."}</p>
        <details><summary className="cursor-pointer text-sm text-mist">Show all</summary>
          <ul className="mt-3 max-h-80 divide-y divide-border overflow-y-auto font-mono text-xs text-mist">
            {legacyRedirects.map((r) => <li key={r.source} className="flex justify-between gap-3 py-1.5"><span>{r.source}</span><span className="text-ash">→ {r.destination}</span></li>)}
          </ul>
        </details>
      </Card>
    </Page>
  );
}
