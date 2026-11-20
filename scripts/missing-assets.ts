// Writes a CSV of every empty (or fallback) media slot: npx tsx scripts/missing-assets.ts out.csv
import { writeFileSync } from "node:fs";
import { buildManifest } from "../src/lib/media-manifest";

const q = (v: string) => `"${v.replace(/"/g, '""')}"`;
buildManifest().then((slots) => {
  const rows = slots.filter((s) => s.status !== "filled");
  const out = ["group,item,status,size,format,where_it_goes", ...rows.map((s) => [s.group, s.label, s.status, s.size, s.format, s.where].map(q).join(","))].join("\n");
  writeFileSync(process.argv[2] ?? "missing-assets.csv", out + "\n");
  console.log(`${rows.length} rows (${rows.filter((r) => r.status === "empty").length} empty, ${rows.filter((r) => r.status === "fallback").length} fallback)`);
  process.exit(0);
});
