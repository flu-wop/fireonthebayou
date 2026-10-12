// src/app/admin/page.tsx
// Admin home. Signed-in launcher; signed-out visitors go to the login on /admin/system.
import Link from "next/link"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"

const PAGES = [
  { href: "/admin/insights", title: "Insights", desc: "Sales, visitors, top pages and the buying funnel." },
  { href: "/admin/system", title: "System", desc: "Env vars, Stripe and Resend health, last sale." },
]

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/system")
  return (
    <div className="min-h-screen bg-ink px-6 sm:px-10 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl text-cream mb-1">Fire on the Bayou Admin</h1>
        <p className="text-mist text-sm mb-8">Pick a page.</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="bg-bayou border border-border rounded-sm p-6 hover:border-flame/50 transition-colors"
            >
              <h3 className="font-display text-xl text-flame mb-2">{p.title}</h3>
              <p className="text-mist text-sm">{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
