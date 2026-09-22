import type { Metadata } from "next";
import { LandingRecipesPage } from "@/features/recipes/components/landing-recipes-page";
import { getRecipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Recipes",
  description: "High-protein recipes with calories, protein, carbs and fat per serving.",
};

export default function RecipesPage() {
  return <LandingRecipesPage recipes={getRecipes()} />;
}
