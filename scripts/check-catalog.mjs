// Verifies data/fotb-catalog.json against the reconciled counts in the rebrand scope.
// Run: npm run check:catalog
import { readFileSync } from "node:fs";

const rows = JSON.parse(readFileSync(new URL("../data/fotb-catalog.json", import.meta.url), "utf8"));
const tally = (key) => rows.flatMap((r) => r[key]).reduce((a, k) => ((a[k] = (a[k] ?? 0) + 1), a), {});

const expected = {
  total: 89,
  industries: { "Food & Beverage": 28, Medical: 15, General: 14, Education: 10, Lifestyle: 9, Tourism: 8, Environmental: 4, Hospitality: 3 },
  formats: { "TV Commercial": 63, "Social Content": 14, "Long Format": 10 },
  noFormat: 10,
  noVideo: 34,
};
const actual = {
  total: rows.length,
  industries: tally("industries"),
  formats: tally("formats"),
  noFormat: rows.filter((r) => r.formats.length === 0).length,
  noVideo: rows.filter((r) => r.youtubeIds.length === 0).length,
};

let bad = 0;
const check = (label, a, e) => {
  const ok = JSON.stringify(a) === JSON.stringify(e);
  if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} ${label}: ${JSON.stringify(a)}${ok ? "" : ` (expected ${JSON.stringify(e)})`}`);
};
const sorted = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
check("projects", actual.total, expected.total);
check("industries", sorted(actual.industries), sorted(expected.industries));
check("formats", sorted(actual.formats), sorted(expected.formats));
check("no format yet", actual.noFormat, expected.noFormat);
check("no YouTube ID", actual.noVideo, expected.noVideo);
process.exit(bad ? 1 : 0);
