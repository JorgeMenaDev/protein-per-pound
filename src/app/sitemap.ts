import type { MetadataRoute } from "next";
import { getProteinSources } from "@/lib/protein-sources";
import { getRecipes } from "@/lib/recipes";
import { absoluteUrl, lastUpdated } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const recipes = getRecipes();
  const tableUpdated = lastUpdated(getProteinSources());
  const recipesUpdated = recipes.map((r) => r.createdAt).sort().at(-1);
  const newest = [tableUpdated, recipesUpdated].filter(Boolean).sort().at(-1);

  return [
    { url: absoluteUrl("/"), lastModified: newest, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/table"), lastModified: tableUpdated, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/recipes"), lastModified: recipesUpdated, changeFrequency: "weekly", priority: 0.9 },
    ...recipes.map((r) => ({
      url: absoluteUrl(`/recipes/${r.slug}`),
      lastModified: r.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(r.imgUrl && { images: [absoluteUrl(r.imgUrl)] }),
    })),
  ];
}
