# protein-price-table

One CSV (`data/protein-sources.csv`) of supermarket foods ranked by the cost of a gram of protein, plus a static viewer (`index.html`). Schema and formula: `README.md`.

## Data entry

Applies to Jorge's photo-driven updates and to external pull requests alike.

- One row per product and package size. Same name and same package size means update the price in place; anything else is a new row.
- Only fill values the source proves (shelf price label, packaging nutrition panel, receipt). Never guess a price or a protein figure; leave it out and say so instead.
- `package_unit` is `g`, `ml`, or `piece`. Piece packages carry `protein_per_piece` instead of `protein_per_100g`.
- The derived columns (`price_per_g_protein`, `price_per_100g_protein`) can stay blank, the viewer computes them either way. When filled, use the formula in the README.
- `date_added` is the date the row first entered this table (YYYY-MM-DD). Adding a row: today. Updating a price in place: leave `date_added` alone.
- `image_url` is optional: one stable URL to a product photo per row, longest edge around 1600 px. It renders as a thumbnail that opens full screen. Never write a URL to a file that was not stored somewhere permanent.
- Prices are GBP. Keep the file sorted by `price_per_g_protein` ascending. Fix obvious name typos; keep the shelf wording otherwise.

## Shipping

- Jorge's own updates go straight to `main`, commit message `data: <store> shop <YYYY-MM-DD>`. External contributions arrive as pull requests and go through review.
- Every push to `main` deploys to https://protein-price-table.vercel.app through the Vercel Git integration. If no deployment appears after a push, run `vercel deploy --prod` from a linked checkout.
