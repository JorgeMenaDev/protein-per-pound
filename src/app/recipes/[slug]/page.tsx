import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import RecipeCardFullDetail from "@/features/recipes/components/full-details-recipe-card";
import SmallViewRecipeCard from "@/features/recipes/components/small-view-recipe-card";
import { getRecipe, getRecipes } from "@/lib/recipes";
import { breadcrumbJsonLd, perServing, recipeDescription, recipeJsonLd, OG_BASE, TWITTER_BASE } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = getRecipe((await params).slug);
  if (!recipe) return {};
  const m = perServing(recipe);
  const title = `${recipe.name}: ${m.protein} g protein, ${m.calories} kcal per serving`;
  const description = recipeDescription(recipe);
  const url = `/recipes/${recipe.slug}`;
  const images = recipe.imgUrl ? [{ url: recipe.imgUrl, width: 800, height: 600, alt: recipe.name }] : undefined;
  return {
    title,
    description,
    keywords: ["high protein recipe", recipe.name.toLowerCase(), ...recipe.tags],
    alternates: { canonical: url },
    openGraph: {
      ...OG_BASE,
      type: "article",
      url,
      title,
      description,
      publishedTime: recipe.createdAt,
      authors: [recipe.author],
      images,
    },
    twitter: { ...TWITTER_BASE, title, description, images: images?.map((i) => i.url) },
  };
}

export default async function RecipePage({ params }: Props) {
  const recipe = getRecipe((await params).slug);
  if (!recipe) notFound();
  // Internal links: the highest-protein recipes other than this one.
  const more = getRecipes()
    .filter((r) => r.slug !== recipe.slug && r.imgUrl)
    .sort((a, b) => perServing(b).protein - perServing(a).protein)
    .slice(0, 3);

  return (
    <div className="container">
      <JsonLd data={recipeJsonLd(recipe)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Recipes", path: "/recipes" },
          { name: recipe.name, path: `/recipes/${recipe.slug}` },
        ])}
      />
      <div className="max-w-6xl mx-auto">
        <RecipeCardFullDetail recipe={recipe} />
        <section className="mt-6 mb-12 border-t pt-8">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">More high-protein recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {more.map((r) => (
              <SmallViewRecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
