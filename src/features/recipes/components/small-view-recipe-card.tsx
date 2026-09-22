import Image from "next/image";
import Link from "next/link";
import { BicepsFlexed, Flame, Wheat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButterIcon } from "@/components/icons/butter-icon";
import type { Recipe } from "@/lib/recipes";
import { ProteinPercentageBadge } from "./protein-percentage-badge";
import { KetoBadge } from "./keto-badge";
import { RecipeImagePlaceholder } from "./recipe-image-placeholder";

export default function SmallViewRecipeCard({ recipe }: { recipe: Recipe }) {
  const servings = recipe.servings || 1;
  const calories = Math.round((recipe.macros.calories ?? 0) / servings);
  const protein = Math.round((recipe.macros.protein ?? 0) / servings);
  const carbs = Math.round((recipe.macros.carbs ?? 0) / servings);
  const fat = Math.round((recipe.macros.fat ?? 0) / servings);

  return (
    <Card className="h-full overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <Link href={`/recipes/${recipe.slug}`} className="block h-full">
        <CardHeader className="relative p-0 flex-shrink-0">
          <div className="relative w-full aspect-[4/3] bg-muted">
            {recipe.imgUrl ? (
              <Image
                src={recipe.imgUrl}
                alt={recipe.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <RecipeImagePlaceholder />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative group mb-2">
            <CardTitle className="text-base font-bold truncate">{recipe.name}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground mb-2">
            <span className="flex items-center">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-orange-500" />
              <span className="text-xs sm:text-sm">{calories}</span>
            </span>
            <span className="flex items-center">
              <BicepsFlexed className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-emerald-500" />
              <span className="text-xs sm:text-sm">{protein}g</span>
            </span>
            <span className="flex items-center">
              <Wheat className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-amber-500" />
              <span className="text-xs sm:text-sm">{carbs}g</span>
            </span>
            <span className="flex items-center">
              <ButterIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-yellow-500" />
              <span className="text-xs sm:text-sm">{fat}g</span>
            </span>
            <ProteinPercentageBadge protein={protein} calories={calories} />
          </div>
          <div className="flex justify-start">
            <KetoBadge carbs={carbs} calories={calories} />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
