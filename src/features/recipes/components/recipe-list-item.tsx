import Image from "next/image";
import Link from "next/link";
import { BicepsFlexed, Flame, Wheat } from "lucide-react";
import type { Recipe } from "@/lib/recipes";
import { KetoBadge } from "./keto-badge";
import { RecipeImagePlaceholder } from "./recipe-image-placeholder";

export function RecipeListItem({ recipe }: { recipe: Recipe }) {
  const servings = recipe.servings || 1;
  const calories = Math.round((recipe.macros.calories ?? 0) / servings);
  const protein = Math.round((recipe.macros.protein ?? 0) / servings);
  const carbs = Math.round((recipe.macros.carbs ?? 0) / servings);

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="flex items-center gap-4 p-3 rounded-lg border bg-card transition-colors hover:bg-muted/50"
    >
      {/* Thumbnail */}
      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
        {recipe.imgUrl ? (
          <Image src={recipe.imgUrl} alt={recipe.name} fill sizes="48px" className="object-cover" />
        ) : (
          <RecipeImagePlaceholder className="h-4 w-4" />
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{recipe.name}</h3>
        <p className="text-xs text-muted-foreground truncate">{recipe.author}</p>
      </div>

      {/* Macros */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
        <span className="hidden sm:flex items-center gap-1">
          <Flame className="w-3 h-3 text-orange-500" />
          {calories}
        </span>
        <span className="flex items-center gap-1">
          <BicepsFlexed className="w-3 h-3 text-emerald-500" />
          {protein}g
        </span>
        <span className="hidden sm:flex items-center gap-1">
          <Wheat className="w-3 h-3 text-amber-500" />
          {carbs}g
        </span>
      </div>

      {/* Keto badge - hidden on mobile */}
      <div className="hidden md:block">
        <KetoBadge carbs={carbs} calories={calories} />
      </div>
    </Link>
  );
}
