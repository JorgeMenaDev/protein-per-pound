// Recipe photos live next to their Markdown in recipes/; the site serves them from public/recipes/.
import fs from "node:fs";
import path from "node:path";

const src = path.join(process.cwd(), "recipes");
const dest = path.join(process.cwd(), "public", "recipes");
fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });
for (const f of fs.readdirSync(src)) {
  if (/\.(webp|jpe?g|png)$/.test(f)) fs.copyFileSync(path.join(src, f), path.join(dest, f));
}
