import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/admin-auth";
import { CONTENT_KINDS, KINDS } from "@/lib/content/forms";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const link = "block rounded px-3 py-1.5 text-sm text-mist transition-colors hover:bg-bayou hover:text-cream";

/** Full-screen overlay so the public Navbar/Footer don't show around admin pages. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-ink text-cream">
      {user ? (
        <div className="flex min-h-full flex-col md:flex-row">
          <aside className="shrink-0 border-b border-border bg-bayou-deep p-4 md:w-60 md:border-b-0 md:border-r">
            <Link href="/admin" className="mb-4 block font-display text-xl text-cream">FOTB Admin</Link>
            <nav aria-label="Admin" className="flex flex-wrap gap-x-2 md:block md:space-y-0.5">
              <Link href="/admin" className={link}>Overview</Link>
              <p className="mt-3 hidden px-3 text-[11px] uppercase tracking-wider text-ash md:block">Content</p>
              {CONTENT_KINDS.map((k) => (
                <Link key={k} href={`/admin/content/${k}`} className={link}>{KINDS[k]!.plural}</Link>
              ))}
              <Link href="/admin/seo" className={link}>SEO</Link>
              <p className="mt-3 hidden px-3 text-[11px] uppercase tracking-wider text-ash md:block">Assets</p>
              <Link href="/admin/placeholders" className={link}>Placeholders</Link>
              <Link href="/admin/media" className={link}>Media library</Link>
              <p className="mt-3 hidden px-3 text-[11px] uppercase tracking-wider text-ash md:block">Studio</p>
              <Link href="/admin/inbox" className={link}>Inbox</Link>
              <Link href="/admin/history" className={link}>History</Link>
              <Link href="/admin/insights" className={link}>Insights</Link>
              {user.role === "owner" && (
                <>
                  <p className="mt-3 hidden px-3 text-[11px] uppercase tracking-wider text-ash md:block">Owner</p>
                  <Link href="/admin/settings" className={link}>Settings</Link>
                  <Link href="/admin/taxonomy" className={link}>Formats &amp; industries</Link>
                  <Link href="/admin/users" className={link}>Users</Link>
                  <Link href="/admin/system" className={link}>System health</Link>
                </>
              )}
            </nav>
            <form action={logoutAction} className="mt-4 border-t border-border pt-3 text-xs text-ash">
              <Link href="/admin/account" className="mr-2 underline hover:text-cream">{user.email}</Link>· {user.role}
              <button className="ml-2 underline hover:text-cream">Sign out</button>
            </form>
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
