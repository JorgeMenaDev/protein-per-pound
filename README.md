# Protein price table

Supermarket foods ranked by what a gram of protein costs. This is the price-per-gram-of-protein table from Fitbite, a legacy food tracking app, opened up as a plain CSV so anyone can add items with a pull request.

Browsable version: https://protein-price-table.vercel.app

## The data

Everything lives in [`data/protein-sources.csv`](data/protein-sources.csv), one row per product. Prices are GBP from Aldi, Amazon, and one local shop (UK), collected between 2024 and 2026.

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

The derived columns follow the original Fitbite formula:

```
total_protein = package_size * protein_per_100g / 100        # g or ml packages
total_protein = package_size * protein_per_piece             # piece packages
price_per_g_protein = price_gbp / total_protein
price_per_100g_protein = price_per_g_protein * 100
```

## Adding an item

Edit `data/protein-sources.csv` and open a pull request. Fill in name, store, price_gbp, package_size, package_unit, and protein_per_100g (or protein_per_piece for piece packages). The derived columns can be left blank, the viewer computes them either way. Keep one row per product and package size.

## Provenance

Extracted on 2026-09-22 from the Fitbite Convex databases and the protein source seed list of its v2 codebase. Re-entries of the same product across databases were collapsed into one row; obvious typos in product names were fixed.

Released under the MIT license.
