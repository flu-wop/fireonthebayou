import { guard } from "../guard";
import TaxonomyForm from "./TaxonomyForm";
import { Page, Card } from "@/components/admin/ui";
import { getTaxonomy } from "@/lib/content";
import { taxonomyToText } from "@/lib/content/forms";

export const dynamic = "force-dynamic";

export default async function Taxonomy() {
  await guard("owner");
  const tax = await getTaxonomy({ draft: true });
  return (
    <Page title="Formats & industries" sub="The filter chips on Work. One per line as key | Label. The key is used in the URL (/work?format=tv); changing a key un-tags projects that used the old one.">
      <Card><TaxonomyForm formats={taxonomyToText(tax.formats)} industries={taxonomyToText(tax.industries)} /></Card>
    </Page>
  );
}
