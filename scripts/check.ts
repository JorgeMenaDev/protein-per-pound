// Validates every recipe against the schema in src/lib/recipes.ts and the CSV
// against its required columns. Runs in CI on every pull request and before each build.
import path from "node:path";
import { parseRecipeFile, recipeFiles } from "../src/lib/recipes";
import { CSV_PATH, parseCSV } from "../src/lib/protein-sources";
import fs from "node:fs";

const errors: string[] = [];

const files = recipeFiles();
for (const file of files) {
  try {
    parseRecipeFile(file);
  } catch (e) {
    errors.push(`recipes/${path.basename(file)}: ${(e as Error).message}`);
  }
}

const rows = parseCSV(fs.readFileSync(CSV_PATH, "utf8"));
rows.forEach((r, i) => {
  const where = `data/protein-sources.csv row ${i + 2} (${r.name || "no name"})`;
  for (const col of ["name", "store", "price_gbp", "package_size", "package_unit"]) {
    if (!r[col]) errors.push(`${where}: ${col} is empty`);
  }
  if (!["g", "ml", "piece"].includes(r.package_unit)) errors.push(`${where}: package_unit must be g, ml or piece`);
  const protein = r.package_unit === "piece" ? r.protein_per_piece : r.protein_per_100g;
  if (!protein || Number.isNaN(Number(protein))) {
    errors.push(`${where}: ${r.package_unit === "piece" ? "protein_per_piece" : "protein_per_100g"} is missing`);
  }
});

if (errors.length) {
  console.error(`${errors.length} problem(s):\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`ok: ${files.length} recipes, ${rows.length} protein sources`);
