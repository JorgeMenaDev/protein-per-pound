import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RecipeCardFullDetail from "@/features/recipes/components/full-details-recipe-card";
import { getRecipe, getRecipes } from "@/lib/recipes";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = getRecipe((await params).slug);
  if (!recipe) return {};
  const per = (n: number) => Math.round(n / recipe.servings);
  return {
    title: recipe.name,
    description: `${per(recipe.macros.protein)} g protein, ${per(recipe.macros.calories)} kcal per serving.`,
    openGraph: recipe.imgUrl ? { images: [recipe.imgUrl] } : undefined,
  };
}

export default async function RecipePage({ params }: Props) {
  const recipe = getRecipe((await params).slug);
  if (!recipe) notFound();
  return (
    <div className="container">
      <div className="max-w-6xl mx-auto">
        <RecipeCardFullDetail recipe={recipe} />
      </div>
    </div>
  );
}
