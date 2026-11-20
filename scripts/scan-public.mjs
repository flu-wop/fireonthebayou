// Lists every file under /public so the app can tell which slots are filled
// without touching the filesystem at runtime (serverless functions don't ship /public).
// Runs before dev and build; writes src/generated/public-files.json.
import { readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../public", import.meta.url).pathname;
const out = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else out.push(p.slice(root.length));
  }
})(root);
out.sort();
mkdirSync(new URL("../src/generated", import.meta.url).pathname, { recursive: true });
writeFileSync(new URL("../src/generated/public-files.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(`public-files: ${out.length} files`);
