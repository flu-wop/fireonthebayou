import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** Full-screen overlay so the public Navbar/Footer don't show around admin pages. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 z-[200] overflow-y-auto bg-ink text-cream">{children}</div>;
}
