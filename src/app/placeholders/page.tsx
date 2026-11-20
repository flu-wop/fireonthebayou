import { redirect } from "next/navigation";

/** The placeholders report now lives inside admin (with upload buttons). */
export default function PlaceholdersPage() {
  redirect("/admin/placeholders");
}
