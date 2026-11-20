// Confirms every legacy WordPress redirect resolves: the source answers with a
// permanent redirect and its destination answers 200.
//   npm run build && npx next start -p 3100 &   then   npm run check:redirects
import { legacyRedirects } from "../src/lib/redirects";

const base = process.env.BASE_URL ?? "http://localhost:3100";

async function main() {
  let bad = 0;
  for (const r of legacyRedirects) {
    const src = r.source.replace(/:\w+\*/g, "sample-slug");
    const first = await fetch(base + src, { redirect: "manual" });
    const loc = first.headers.get("location");
    const dest = (loc ?? "").replace(base, "").split("#")[0] || "/";
    let status = 0;
    if (loc) status = (await fetch(base + dest, { redirect: "manual" })).status;
    const ok = [301, 308].includes(first.status) && status === 200;
    if (!ok) {
      bad++;
      console.log(`FAIL ${r.source} -> ${first.status} ${loc ?? "(no location)"} -> ${status}`);
    }
  }
  console.log(`${legacyRedirects.length - bad}/${legacyRedirects.length} redirects resolve`);
  process.exit(bad ? 1 : 0);
}
main();
