import type { ProteinSource } from "@/lib/protein-sources";
import type { Recipe } from "@/lib/recipes";
import { AUTHOR, LOCALE, REPO_URL, SITE_NAME, SITE_URL } from "@/lib/site";

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

// Next.js replaces a parent's openGraph/twitter objects instead of merging them, so every page spreads these.
export const OG_BASE = { siteName: SITE_NAME, locale: LOCALE, type: "website" } as const;
export const TWITTER_BASE = { card: "summary_large_image" } as const;

export function perServing(recipe: Recipe) {
  const s = recipe.servings || 1;
  const { calories, protein, carbs, fat } = recipe.macros;
  return {
    calories: Math.round(calories / s),
    protein: Math.round(protein / s),
    carbs: Math.round(carbs / s),
    fat: Math.round(fat / s),
  };
}

// Share of calories from protein (4 kcal per gram), as in the Fitbite protein badge.
export function proteinShare(recipe: Recipe) {
  const { calories, protein } = recipe.macros;
  return calories > 0 ? Math.round(((protein * 4) / calories) * 100) : 0;
}

export function recipeSummary(recipe: Recipe, { withYield = true } = {}) {
  const m = perServing(recipe);
  const servings = recipe.servings === 1 ? "1 serving" : `${recipe.servings} servings`;
  const text = `${m.protein} g protein and ${m.calories} kcal per serving (${m.carbs} g carbs, ${m.fat} g fat), ${proteinShare(recipe)}% of calories from protein.`;
  return withYield ? `${text} Makes ${servings}.` : text;
}

// Meta description: the numbers first, then up to three ingredients (text before any comma, e.g. "Red Onion, Sliced").
export function recipeDescription(recipe: Recipe) {
  const m = perServing(recipe);
  const names = [...new Set(recipe.ingredients.map((i) => i.name.split(",")[0].trim().toLowerCase()))];
  const list =
    names.length > 3 ? `${names.slice(0, 3).join(", ")} and more` : names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];
  return `${m.protein} g protein and ${m.calories} kcal per serving, ${proteinShare(recipe)}% of calories from protein. Made with ${list}.`;
}

export const formatIngredient = (i: Recipe["ingredients"][number]) => `${i.amount} ${i.unit} ${i.name}`;

// "10 min", "4 hours", "1 h 30 min" -> ISO 8601 duration; anything else -> undefined.
export function isoDuration(text?: string) {
  if (!text) return undefined;
  const h = text.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)\b/i);
  const m = text.match(/(\d+)\s*(?:m|min|mins|minute|minutes)\b/i);
  const minutes = Math.round((h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0));
  return minutes > 0 ? `PT${minutes}M` : undefined;
}

const person = { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url };

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en-GB",
    description:
      "UK supermarket foods ranked by the price of a gram of protein, plus high-protein recipes with macros per serving.",
    publisher: person,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function recipeJsonLd(recipe: Recipe) {
  const m = perServing(recipe);
  const time = isoDuration(recipe.cookTime);
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    description: `${recipe.name}: ${recipeSummary(recipe)}`,
    url: absoluteUrl(`/recipes/${recipe.slug}`),
    ...(recipe.imgUrl && { image: [absoluteUrl(recipe.imgUrl)] }),
    author: { "@type": "Person", name: recipe.author },
    datePublished: recipe.createdAt,
    recipeYield: `${recipe.servings} ${recipe.servings === 1 ? "serving" : "servings"}`,
    ...(time && { totalTime: time }),
    keywords: ["high protein", ...recipe.tags].join(", "),
    recipeIngredient: recipe.ingredients.map(formatIngredient),
    ...(recipe.instructions.length > 0 && {
      recipeInstructions: recipe.instructions.map((text, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        text,
      })),
    }),
    nutrition: {
      "@type": "NutritionInformation",
      servingSize: "1 serving",
      calories: `${m.calories} kcal`,
      proteinContent: `${m.protein} g`,
      carbohydrateContent: `${m.carbs} g`,
      fatContent: `${m.fat} g`,
    },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

export function recipesListJsonLd(recipes: Recipe[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "High-protein recipes",
    numberOfItems: recipes.length,
    itemListElement: recipes.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/recipes/${r.slug}`),
      name: r.name,
    })),
  };
}

export function lastUpdated(sources: ProteinSource[]) {
  return sources.map((s) => s.dateAdded).filter(Boolean).sort().at(-1) ?? "";
}

export function datasetJsonLd(sources: ProteinSource[]) {
  const stores = [...new Set(sources.map((s) => s.store))];
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "UK supermarket protein price table",
    description: `${sources.length} UK supermarket foods (${stores.join(", ")}) with shelf price, package size and protein content, ranked by the price of one gram of protein.`,
    url: absoluteUrl("/table"),
    sameAs: REPO_URL,
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    creator: person,
    dateModified: lastUpdated(sources),
    spatialCoverage: { "@type": "Place", name: "United Kingdom" },
    keywords: ["protein", "price per gram of protein", "cheap protein", "UK supermarkets", "nutrition"],
    variableMeasured: ["price (GBP)", "package size", "protein per 100 g", "carbs per 100 g", "price per gram of protein"],
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: absoluteUrl("/data/protein-sources.csv"),
    },
  };
}
