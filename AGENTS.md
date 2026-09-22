# protein-per-pound

Two datasets and a read-only Next.js site that shows them. `data/protein-sources.csv` holds supermarket foods ranked by the cost of a gram of protein. `recipes/*.md` holds one recipe per file, with its photo next to it. Schemas and the formula: `README.md`. The recipe schema in code: `src/lib/recipes.ts`. `bun run check` validates both datasets and runs in CI on every pull request and before every build.

The site never writes data. Adding or changing anything means editing the files and opening a pull request.

## Data entry: the price table

Applies to Jorge's photo-driven updates and to external pull requests alike.

- One row per product and package size. Same name and same package size means update the price in place; anything else is a new row.
- Only fill values the source proves (shelf price label, packaging nutrition panel, receipt). Never guess a price or a protein figure; leave it out and say so instead.
- `package_unit` is `g`, `ml`, or `piece`. Piece packages carry `protein_per_piece` instead of `protein_per_100g`.
- The derived columns (`price_per_g_protein`, `price_per_100g_protein`) can stay blank, the site computes them either way. When filled, use the formula in the README.
- `date_added` is the date the row first entered this table (YYYY-MM-DD). Adding a row: today. Updating a price in place: leave `date_added` alone.
- `image_url` is optional: one stable URL to a product photo per row, longest edge around 1600 px. It renders as a thumbnail that opens full screen. Never write a URL to a file that was not stored somewhere permanent.
- Prices are GBP. Keep the file sorted by `price_per_g_protein` ascending. Fix obvious name typos; keep the shelf wording otherwise.

## Data entry: recipes

- One Markdown file per recipe in `recipes/`, named in kebab-case; the file name is the URL slug, so never rename a published recipe.
- Frontmatter follows the schema in the README. `macros` are totals for the whole recipe, not per serving.
- Photos sit next to the recipe with the same base name, around 800×600 WebP, under 300 KB.
- Only write macros and amounts the source proves. A recipe with no steps is fine; do not invent instructions.

## Shipping

- Jorge's own updates go straight to `main`, commit message `data: <store> shop <YYYY-MM-DD>` for table rows and `recipes: <what>` for recipes. External contributions arrive as pull requests and go through review.
- Every push to `main` deploys to https://protein-per-pound.vercel.app through the Vercel Git integration. If no deployment appears after a push, run `vercel deploy --prod` from a linked checkout.
