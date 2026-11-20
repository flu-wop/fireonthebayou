import { NextResponse } from "next/server";
import { getSession } from "@/lib/admin-auth";
import { getDB } from "@/lib/db";
import { ensureInquiriesTable } from "@/lib/inquiries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

/** GET /api/admin/inbox.csv — every inquiry as CSV (signed-in admins only). */
export async function GET() {
  if (!(await getSession())) return new NextResponse("Sign in required", { status: 401 });
  await ensureInquiriesTable();
  const r = await getDB()!.execute("SELECT id, created_at, name, email, phone, budget, message, opt_in, status, mc_status, mc_error FROM fotb_inquiries ORDER BY id DESC");
  const cols = ["id", "created_at", "name", "email", "phone", "budget", "message", "opt_in", "status", "mc_status", "mc_error"];
  const csv = [cols.join(","), ...r.rows.map((row) => cols.map((c) => cell((row as Record<string, unknown>)[c])).join(","))].join("\r\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="fotb-inquiries-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
