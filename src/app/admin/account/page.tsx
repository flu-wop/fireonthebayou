import { guard } from "../guard";
import PasswordForm from "./PasswordForm";
import { Card, Page } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function Account() {
  const me = await guard();
  return (
    <Page title="My account" sub={`Signed in as ${me.email} (${me.role}).`}>
      <Card title="Change password"><PasswordForm /></Card>
    </Page>
  );
}
