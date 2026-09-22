# Contributing to Protein per Pound

Thanks for helping. This project is two datasets, a price table and a recipe collection, and a site that shows them. Most contributions are a single row or a single file.

## The one rule: only add what you can prove

The table is only useful if every number in it is real.

- A price comes from a shelf label, a receipt, or the shop's own product page.
- A protein or carb figure comes from the nutrition panel on the packaging.
- Recipe macros come from the recipe's source or from adding up the labels of its ingredients.

If a number is missing or unreadable, leave it out and say so in the pull request. Never estimate it. A guessed row is worse than no row.

## Ways to contribute

| You want to | Easiest way |
| --- | --- |
| Add a food or update a price | Edit [`data/protein-sources.csv`](data/protein-sources.csv) on GitHub, or use the [new food form](https://github.com/JorgeMenaDev/protein-per-pound/issues/new?template=add-food.yml) |
| Add a recipe | Add a file to [`recipes/`](recipes) on GitHub, or use the [new recipe form](https://github.com/JorgeMenaDev/protein-per-pound/issues/new?template=add-recipe.yml) |
| Add steps to a recipe that has none | Press "Suggest an edit" on the recipe page |
| Fix a wrong price or macro | Edit the file, or use the [fix a number form](https://github.com/JorgeMenaDev/protein-per-pound/issues/new?template=fix-data.yml) |
| Improve the site | Open an issue first for anything bigger than a small fix |

## Adding a food

1. Open [`data/protein-sources.csv`](data/protein-sources.csv) and press the pencil icon.
2. Search for the product. Same name and same package size: update the price in that row and leave `date_added` alone. Anything else: add a new row.
3. Fill `name`, `store`, `price_gbp`, `package_size`, `package_unit` (`g`, `ml` or `piece`), `protein_per_100g` (or `protein_per_piece` for eggs and multipacks) and `date_added` (today, `YYYY-MM-DD`). The two price-per-protein columns can stay empty; the site calculates them.
4. Keep the file sorted by price per gram of protein, cheapest first. If you are unsure where the row goes, put it at the end and say so; a maintainer will move it.
5. Write the shop and date in the commit message, for example `data: Tesco shop 2026-10-01`, and open the pull request.

Prices are in GBP from UK shops for now. The column reference and the formula are in the [README](README.md#adding-a-food).

## Adding a recipe

1. Go to [`recipes/`](recipes), press **Add file**, then **Create new file**.
2. Name it after the dish in lowercase words joined by hyphens, for example `recipes/lemon-garlic-chicken.md`. The name becomes the page address, so pick it carefully.
3. Paste this template and fill it in:

```markdown
---
name: "Lemon Garlic Chicken"
author: "Your Name"
cook_time: "30 min"
servings: 2
macros:            # totals for the whole recipe, not per serving
  calories: 820
  protein: 96
  carbs: 12
  fat: 40
ingredients:
  - name: "Chicken breast"
    amount: 400
    unit: "g"
  - name: "Lemon, juiced"
    amount: 1
    unit: "whole"
tags: ["high-protein", "one-pan"]
image: lemon-garlic-chicken.webp
created: 2026-10-01
---

## Instructions

1. First step, one line.
2. Second step, one line.

## Notes

- Anything worth knowing, one line each.
```

4. Add a photo with the same name: `.webp`, `.jpg` or `.png`, around 800×600 and under 300 KB. Upload it in the same folder with **Add file**, then **Upload files**. No photo is fine; leave out the `image` line.
5. Open the pull request.

The site divides the macros by `servings`, so enter totals for the whole recipe. Steps and notes are optional.

## The check

Every pull request runs `bun run check`, which validates the CSV and every recipe, followed by a production build. If it fails, the log says which file and which field, for example:

```
recipes/lemon-garlic-chicken.md: macros.fat: Invalid input: expected number, received undefined
```

To run it yourself: install [Bun](https://bun.sh), then `bun install && bun run check`. `bun run dev` starts the site at http://localhost:3000.

## Code changes

The site is Next.js 15 with Tailwind CSS. Keep changes small and focused, keep the site read-only (no accounts, no database), and describe what you checked in the pull request. The recipe schema lives in `src/lib/recipes.ts`; changing it means updating the README, this guide and every recipe in the same pull request.

## Review

A maintainer reviews every pull request. Data changes usually get merged once the source is clear. When a pull request merges, the site redeploys within a couple of minutes.

By contributing you agree that your contribution is released under the [MIT license](LICENSE) and that you follow the [code of conduct](CODE_OF_CONDUCT.md).
