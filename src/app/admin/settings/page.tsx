import { guard } from "../guard";
import { saveSettingsAction } from "../content/actions";
import RecordForm from "@/components/admin/RecordForm";
import { Card, Page } from "@/components/admin/ui";
import { previewToken } from "@/lib/admin-auth";
import { getTaxonomy, loadKindWithState } from "@/lib/content";
import { SETTINGS_FIELDS, formValues } from "@/lib/content/forms";
import { DEFAULT_SETTINGS } from "@/lib/content/seed-data";

export const dynamic = "force-dynamic";

export default async function Settings() {
  await guard("owner");
  const rec = (await loadKindWithState("setting")).find((r) => r.key === "site");
  const data = { ...DEFAULT_SETTINGS, ...(rec?.data as object) } as unknown as Record<string, unknown>;
  return (
    <Page title="Site settings" sub="Tagline, homepage headline, hero reel, contact details and socials. The hero MP4, poster, link-preview image and founder portrait are uploaded under Placeholders.">
      <Card>
        <RecordForm action={saveSettingsAction} fields={SETTINGS_FIELDS} values={formValues(SETTINGS_FIELDS, data)} tax={await getTaxonomy({ draft: true })} hidden={{}} existing={false} previewHref={`/preview/home?t=${previewToken()}`} />
      </Card>
    </Page>
  );
}
