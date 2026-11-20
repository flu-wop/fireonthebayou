import { redirect } from "next/navigation";
import { getSession, type AdminUser, type Role } from "@/lib/admin-auth";

/** Call at the top of every admin page: redirects to login, or home if the role isn't enough. */
export async function guard(...roles: Role[]): Promise<AdminUser> {
  const u = await getSession();
  if (!u) redirect("/admin/login");
  if (roles.length && !roles.includes(u.role)) redirect("/admin");
  return u;
}
