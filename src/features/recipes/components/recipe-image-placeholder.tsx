import { UtensilsCrossed } from "lucide-react";

export function RecipeImagePlaceholder({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground/50">
      <UtensilsCrossed className={className} />
    </div>
  );
}
