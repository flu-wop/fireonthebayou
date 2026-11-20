// Loads data/fotb-catalog.json and the existing content files into Turso.
//   npm run seed            (keeps existing records)
//   npm run seed -- --overwrite
// Needs TURSO_URL / TURSO_TOKEN (read from .env.local).
import { seedAll } from "../src/lib/content/admin-store";
import { seedRecords } from "../src/lib/content/seed-data";

async function main() {
  if (!process.env.TURSO_URL) throw new Error("TURSO_URL is not set (add it to .env.local).");
  const overwrite = process.argv.includes("--overwrite");
  const expected: Record<string, number> = {};
  for (const r of seedRecords()) expected[r.kind] = (expected[r.kind] ?? 0) + 1;
  const written = await seedAll("seed-script", overwrite);
  console.log(overwrite ? "Seeded (overwrite):" : "Seeded (kept existing):");
  for (const k of Object.keys(expected)) console.log(`  ${k.padEnd(14)} ${String(written[k] ?? 0).padStart(3)} written / ${expected[k]} in files`);
  if ((expected.project ?? 0) !== 89) throw new Error(`Expected 89 projects in the catalog, found ${expected.project}.`);
}
main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
