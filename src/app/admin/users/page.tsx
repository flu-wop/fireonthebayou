import { guard } from "../guard";
import AddUserForm from "./AddUserForm";
import { updateUserAction } from "./actions";
import { Card, Page, btnGhost, inputCls } from "@/components/admin/ui";
import { getDB } from "@/lib/db";
import { ensureTables } from "@/lib/content/schema";

export const dynamic = "force-dynamic";

export default async function Users() {
  const me = await guard("owner");
  await ensureTables();
  const rows = (await getDB()!.execute("SELECT id, email, name, role, disabled, created_at FROM fotb_users ORDER BY id")).rows;
  return (
    <Page title="Users" sub="Each person has their own login. Owners can do everything; Editors manage content, media and the inbox.">
      <Card title="Add a person"><AddUserForm /></Card>
      <Card title="People">
        <ul className="divide-y divide-border">
          {rows.map((u) => {
            const id = Number(u.id);
            const off = Number(u.disabled) === 1;
            return (
              <li key={id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div><p className="text-cream">{String(u.name || u.email)} <span className="text-xs text-mist">· {String(u.role)}{off && " · disabled"}</span></p><p className="text-xs text-ash">{String(u.email)}</p></div>
                {id !== me.id && (
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={updateUserAction}><input type="hidden" name="id" value={id} /><button name="intent" value={u.role === "owner" ? "editor" : "owner"} className={btnGhost}>Make {u.role === "owner" ? "Editor" : "Owner"}</button></form>
                    <form action={updateUserAction}><input type="hidden" name="id" value={id} /><button name="intent" value={off ? "enable" : "disable"} className={btnGhost}>{off ? "Enable" : "Disable"}</button></form>
                    <form action={updateUserAction} className="flex gap-2"><input type="hidden" name="id" value={id} /><input name="password" type="password" minLength={10} placeholder="New password" autoComplete="new-password" className={`${inputCls} w-40`} /><button name="intent" value="reset" className={btnGhost}>Reset</button></form>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </Page>
  );
}
