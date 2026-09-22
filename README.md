# Protein per Pound

Cheap protein, ranked by what a gram actually costs, plus high-protein recipes to cook with it. Both halves are plain files in this repo: a CSV of supermarket foods and one Markdown file per recipe. The site only reads them. Anything new arrives as a pull request.

Site: https://protein-per-pound.vercel.app

- **Price table** (`/table`): supermarket foods ranked by the cost of a gram of protein.
- **Recipes** (`/recipes`): high-protein meals with calories, protein, carbs and fat per serving, each with a full page.

## Adding a food

Everything lives in [`data/protein-sources.csv`](data/protein-sources.csv), one row per product and package size. Prices are GBP from UK shops.

| column | meaning |
| --- | --- |
| name | product name |
| store | where the price was seen |
| price_gbp | price of one package |
| package_size | how much one package contains |
| package_unit | `g`, `ml`, or `piece` |
| protein_per_100g | grams of protein per 100 g (or 100 ml) |
| protein_per_piece | grams of protein per piece, for `piece` packages |
| carbs_per_100g | grams of carbs per 100 g, when known |
| price_per_g_protein | derived: cost of one gram of protein |
| price_per_100g_protein | derived: cost of 100 g of protein |
| date_added | date the row entered this table (YYYY-MM-DD) |
| image_url | optional URL of a product photo, shown as a thumbnail that opens full screen |

Fill in name, store, price_gbp, package_size, package_unit, and protein_per_100g (or protein_per_piece for piece packages), plus date_added. The derived columns can stay blank; the site computes them with this formula:

```
total_protein = package_size * protein_per_100g / 100        # g or ml packages
total_protein = package_size * protein_per_piece             # piece packages
price_per_g_protein = price_gbp / total_protein
price_per_100g_protein = price_per_g_protein * 100
```

Keep one row per product and package size. `image_url` is optional; any stable URL to a product photo works (longest edge around 1600 px).

## Adding a recipe

Add two files to [`recipes/`](recipes): `your-recipe.md` and, optionally, a photo `your-recipe.webp` (or `.jpg`/`.png`, around 800×600, under 300 KB). The file name becomes the page address, so use lowercase words joined by hyphens.

```markdown
---
name: "Chicken Fajitas"
author: "Your Name"
cook_time: "4 hours"          # optional
servings: 2
macros:                       # totals for the whole recipe, not per serving
  calories: 570
  protein: 74
  carbs: 45
  fat: 12
ingredients:
  - name: "Chicken breast"
    amount: 300
    unit: "g"
  - name: "Red pepper, cut into strips"
    amount: 1
    unit: "whole"
tags: ["slow-cooker", "high-protein"]
image: chicken-fajitas.webp   # optional, a file next to this one
created: 2026-09-22
---

## Instructions

1. Put the peppers in the slow cooker and lay the chicken on top.
2. Cook on high for 2 hours or low for 4, then slice the chicken.

## Notes

- Frozen chicken works too; give it longer.
```

The rules the check enforces:

- `name`, `author`, `servings`, `macros` (all four numbers), at least one ingredient, and `created` are required. `amount` is a number; the site divides macros by `servings` and scales ingredient amounts when someone changes the serving size.
- The body may only contain `## Instructions` (a numbered list, one step per line) and `## Notes` (a bullet list). Both are optional.
- `image` must name a file that exists in `recipes/`.

Run the check locally with `bun install && bun run check`. The same check runs on every pull request.

## Running the site

```
bun install
bun run dev
```

Next.js 15, Tailwind, and components carried over from the Fitbite app. Recipe photos are copied from `recipes/` to `public/recipes/` at build time.

## Provenance

The price table was extracted on 2026-09-22 from the Fitbite Convex databases and the protein source seed list of its v2 codebase. The first 21 recipes are Jorge Mena's own, exported the same day from his Fitbite account, with obvious typos in names fixed.

Released under the MIT license.
