"use client";

import { useState } from "react";
import { Grid, List, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { REPO_URL } from "@/lib/site";
import type { Recipe } from "@/lib/recipes";
import SmallViewRecipeCard from "./small-view-recipe-card";
import { RecipeListItem } from "./recipe-list-item";

export function LandingRecipesPage({ recipes }: { recipes: Recipe[] }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredRecipes = q
    ? recipes.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.ingredients.some((i) => i.name.toLowerCase().includes(q)),
      )
    : recipes;

  return (
    <div className="container pb-12">
      {/* TITLE */}
      <div className="py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recipes</h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
          High-protein meals with macros per serving. Every recipe is a Markdown file on GitHub.
        </p>
      </div>

      {/* MAIN CONTROLS BAR */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes or ingredients, e.g. chicken, whey"
            className="pl-9"
            aria-label="Search recipes"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* View Toggle - hidden on mobile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex overflow-hidden rounded-md border bg-background">
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-none border-0 px-3 active:scale-100",
                  viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                title="Grid view"
              >
                <Grid className="h-4 w-4 mr-2" />
                <span>Grid</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-none border-0 border-l px-3 active:scale-100",
                  viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                title="List view"
              >
                <List className="h-4 w-4 mr-2" />
                <span>List</span>
              </Button>
            </div>
            <span className="text-sm text-muted-foreground tabular-nums">
              {filteredRecipes.length} / {recipes.length}
            </span>
          </div>

          {/* Recipes are added by pull request */}
          <Button asChild className="w-full sm:w-auto">
            <a href={`${REPO_URL}#adding-a-recipe`} className="flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add a recipe on GitHub</span>
            </a>
          </Button>
        </div>
      </div>

      {/* RECIPES */}
      {filteredRecipes.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No recipes match &ldquo;{query}&rdquo;.</p>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRecipes.map((recipe) => (
            <SmallViewRecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredRecipes.map((recipe) => (
            <RecipeListItem key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
