import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LandingRecipesPage } from "@/features/recipes/components/landing-recipes-page";
import { getRecipes } from "@/lib/recipes";
import { breadcrumbJsonLd, recipesListJsonLd, OG_BASE, TWITTER_BASE } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const count = getRecipes().length;
  const title = "High-protein recipes with macros per serving";
  const description = `${count} high-protein recipes, from shakes to slow-cooker chicken, with calories, protein, carbs and fat per serving. Search by ingredient and scale servings.`;
  return {
    title,
    description,
    alternates: { canonical: "/recipes" },
    openGraph: { ...OG_BASE, url: "/recipes", title, description, images: [{ url: "/og/recipes", width: 1200, height: 630, alt: title }] },
    twitter: { ...TWITTER_BASE, title, description, images: ["/og/recipes"] },
  };
}

export default function RecipesPage() {
  const recipes = getRecipes();
  return (
    <>
      <JsonLd data={recipesListJsonLd(recipes)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Recipes", path: "/recipes" }])} />
      <LandingRecipesPage recipes={recipes} />
    </>
  );
}
