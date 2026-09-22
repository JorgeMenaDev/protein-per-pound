import { getProteinSources } from "@/lib/protein-sources";
import { getRecipes, type Recipe } from "@/lib/recipes";
import { absoluteUrl, formatIngredient, lastUpdated, recipeSummary } from "@/lib/seo";
import { REPO_URL, SITE_NAME } from "@/lib/site";

const INTRO = `> UK supermarket foods ranked by what a gram of protein costs, plus high-protein recipes with calories, protein, carbs and fat per serving. Open data under the MIT license; every food and recipe is a file in ${REPO_URL}, added by pull request.

Price per gram of protein = package price / total protein in the package, where total protein = package size × protein per 100 g / 100 (or package size × protein per piece for piece packages). Prices are in GBP from UK shops; each row records the date it entered the table.`;

export function llmsIndex() {
  const sources = getProteinSources();
  const recipes = getRecipes();
  return `# ${SITE_NAME}

${INTRO}

## Data

- [Protein price table](${absoluteUrl("/table")}): ${sources.length} foods ranked by price per gram of protein, last updated ${lastUpdated(sources)}
- [Protein price table as CSV](${absoluteUrl("/data/protein-sources.csv")}): the raw data, one row per product and package size
- [Everything in one Markdown file](${absoluteUrl("/llms-full.txt")}): the full table and every recipe

## Recipes

${recipes.map((r) => `- [${r.name}](${absoluteUrl(`/recipes/${r.slug}`)}): ${recipeSummary(r)}`).join("\n")}

## Contributing

- [README with both schemas](${REPO_URL}#readme): how to add a food or a recipe by pull request
`;
}

function recipeMarkdown(r: Recipe) {
  const parts = [
    `### ${r.name}`,
    "",
    `URL: ${absoluteUrl(`/recipes/${r.slug}`)}`,
    `Author: ${r.author}${r.cookTime ? ` · Time: ${r.cookTime}` : ""}`,
    "",
    recipeSummary(r),
    "",
    "Ingredients (whole recipe):",
    ...r.ingredients.map((i) => `- ${formatIngredient(i)}`),
  ];
  if (r.instructions.length) parts.push("", "Instructions:", ...r.instructions.map((s, i) => `${i + 1}. ${s}`));
  if (r.notes.length) parts.push("", "Notes:", ...r.notes.map((n) => `- ${n}`));
  return parts.join("\n");
}

export function llmsFull() {
  const sources = getProteinSources();
  const rows = sources.map(
    (s, i) =>
      `| ${i + 1} | ${s.name} | ${s.store} | £${s.price.toFixed(2)} | ${s.size} ${s.unit} | ${s.protein ?? ""} g ${s.proteinUnit} | £${s.p100.toFixed(2)} | ${s.dateAdded} |`,
  );
  return `# ${SITE_NAME}

${INTRO}

## Protein price table

Ranked cheapest first. Last updated ${lastUpdated(sources)}.

| # | Item | Store | Price | Package | Protein | £ per 100 g protein | Added |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

## Recipes

${getRecipes().map(recipeMarkdown).join("\n\n")}
`;
}
