import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BicepsFlexed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeImagePlaceholder } from "@/features/recipes/components/recipe-image-placeholder";
import { getProteinSources } from "@/lib/protein-sources";
import { getRecipes } from "@/lib/recipes";
import { REPO_URL, SITE_NAME } from "@/lib/site";

export default function Home() {
  const sources = getProteinSources();
  const recipes = getRecipes();
  // Most protein per serving first, so the preview shows the recipes this site is about.
  const featured = [...recipes]
    .filter((r) => r.imgUrl && r.instructions.length > 0)
    .sort((a, b) => b.macros.protein / b.servings - a.macros.protein / a.servings)
    .slice(0, 3);

  return (
    <div className="container pb-16">
      <section className="py-14 sm:py-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.03em] leading-[1.05]">{SITE_NAME}</h1>
        <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Supermarket foods ranked by what a gram of protein costs, and high-protein recipes to cook with them.
          Every food and every recipe is a file on GitHub, added by pull request.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/table">Open the price table</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/recipes">Browse recipes</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Protein price table</CardTitle>
            <p className="text-sm text-muted-foreground">
              {sources.length} foods from UK supermarkets. The cheapest protein right now:
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <ol className="divide-y text-sm">
              {sources.slice(0, 5).map((s, i) => (
                <li key={`${s.name}-${s.size}`} className="flex items-baseline gap-3 py-2">
                  <span className="w-4 text-muted-foreground tabular-nums">{i + 1}</span>
                  <span className="flex-1 truncate">{s.name}</span>
                  <span className="text-muted-foreground">{s.store}</span>
                  <span className="w-28 text-right font-mono tabular-nums">£{s.p100.toFixed(2)} / 100 g</span>
                </li>
              ))}
            </ol>
          </CardContent>
          <div className="p-6 pt-0">
            <Link href="/table" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4">
              See all {sources.length} foods <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Recipes</CardTitle>
            <p className="text-sm text-muted-foreground">
              {recipes.length} high-protein recipes with calories and macros per serving.
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="grid grid-cols-3 gap-3">
              {featured.map((r) => (
                <Link key={r.slug} href={`/recipes/${r.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
                    {r.imgUrl ? (
                      <Image
                        src={r.imgUrl}
                        alt={r.name}
                        fill
                        sizes="(min-width: 768px) 15vw, 30vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <RecipeImagePlaceholder />
                    )}
                  </div>
                  <p className="mt-2 truncate text-sm font-medium">{r.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BicepsFlexed className="h-3 w-3 text-emerald-500" />
                    {Math.round(r.macros.protein / r.servings)}g protein
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Link href="/recipes" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4">
              See all {recipes.length} recipes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Add to it</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Nothing here is edited on the site. Open a pull request and it goes live once merged. A check runs on every pull
          request and tells you if a row or a recipe breaks the format.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-5">
            <h3 className="font-semibold">A food</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a row to <code className="rounded bg-muted px-1 py-0.5 text-foreground">data/protein-sources.csv</code> with
              the shelf price, package size and protein per 100 g from the label.
            </p>
            <a href={`${REPO_URL}#adding-a-food`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4">
              How to add a food <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-lg border p-5">
            <h3 className="font-semibold">A recipe</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add <code className="rounded bg-muted px-1 py-0.5 text-foreground">recipes/your-recipe.md</code> with
              ingredients and total macros, steps as a numbered list, and a photo next to it.
            </p>
            <a href={`${REPO_URL}#adding-a-recipe`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4">
              How to add a recipe <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
