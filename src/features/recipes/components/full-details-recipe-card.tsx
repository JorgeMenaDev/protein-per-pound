"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BicepsFlexed,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Minus,
  Pencil,
  Plus,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { REPO_URL } from "@/lib/site";
import { recipeSummary } from "@/lib/seo";
import type { Recipe } from "@/lib/recipes";
import { RecipeImagePlaceholder } from "./recipe-image-placeholder";

const formatAmount = (value: number) => {
  const rounded = Number(value.toFixed(2));
  if (Number.isInteger(rounded)) return Math.trunc(rounded).toString();
  return rounded.toFixed(1).replace(/\.0$/, "");
};

export default function RecipeCardFullDetail({ recipe }: { recipe: Recipe }) {
  const [currentStep, setCurrentStep] = useState(0);
  const baseServings = recipe.servings || 1;
  const [servings, setServings] = useState(baseServings);
  const [copied, setCopied] = useState(false);

  const { instructions, ingredients, notes, tags, macros } = recipe;
  const hasInstructions = instructions.length > 0;
  const editUrl = `${REPO_URL}/edit/main/recipes/${recipe.slug}.md`;

  const handleShareClick = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: recipe.name, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full w-full border-none shadow-none px-0 py-4 sm:py-6">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All recipes
      </Link>
      <CardHeader className="mt-2 px-0 sm:mt-5">
        <div className="relative w-full aspect-[4/3] max-h-[400px] overflow-hidden rounded-lg bg-muted">
          {recipe.imgUrl ? (
            <Image
              src={recipe.imgUrl}
              alt={recipe.name}
              fill
              priority
              sizes="(min-width: 1200px) 1152px, 100vw"
              className="object-cover"
            />
          ) : (
            <RecipeImagePlaceholder className="h-12 w-12" />
          )}
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{recipe.name}</h1>
        <div className="mb-3 mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{recipe.author}</span>
          {recipe.cookTime && (
            <>
              <span className="hidden h-1 w-1 rounded-full bg-muted-foreground sm:inline-block" />
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 shrink-0" />
                {recipe.cookTime}
              </span>
            </>
          )}
        </div>
        <p className="mx-auto max-w-xl text-center text-sm text-muted-foreground">{recipeSummary(recipe, { withYield: false })}</p>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Per serving (recipe makes {baseServings} {baseServings === 1 ? "serving" : "servings"})
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:flex sm:flex-nowrap sm:items-center sm:justify-center sm:gap-4">
          <span className="flex items-center justify-center gap-2 rounded-xl bg-muted/60 px-4 py-2 font-medium sm:justify-start">
            <Flame className="h-4 w-4 text-orange-500" />
            {Math.round(macros.calories / baseServings)} kcal
          </span>
          <span className="flex items-center justify-center gap-2 rounded-xl bg-muted/60 px-4 py-2 font-medium sm:justify-start">
            <BicepsFlexed className="h-4 w-4 text-emerald-500" />
            {Math.round(macros.protein / baseServings)}g protein
          </span>
          <span className="flex items-center justify-center gap-2 rounded-xl bg-muted/60 px-4 py-2 font-medium sm:justify-start">
            {Math.round(macros.carbs / baseServings)}g carbs
          </span>
          <span className="flex items-center justify-center gap-2 rounded-xl bg-muted/60 px-4 py-2 font-medium sm:justify-start">
            {Math.round(macros.fat / baseServings)}g fat
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">Instructions</h2>
            {hasInstructions ? (
              <Tabs defaultValue="step-by-step">
                <TabsList className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-none sm:flex">
                  <TabsTrigger value="step-by-step" className="w-full text-sm sm:w-auto sm:text-base">
                    Step-by-Step
                  </TabsTrigger>
                  <TabsTrigger value="all-steps" className="w-full text-sm sm:w-auto sm:text-base">
                    View All Steps
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="step-by-step">
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Previous step"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold tabular-nums">
                        Step {currentStep + 1} of {instructions.length}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Next step"
                        onClick={() => setCurrentStep(Math.min(instructions.length - 1, currentStep + 1))}
                        disabled={currentStep === instructions.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-base leading-relaxed">{instructions[currentStep]}</p>
                  </div>
                </TabsContent>
                <TabsContent value="all-steps" forceMount className="data-[state=inactive]:hidden">
                  <ol className="mt-4 list-decimal list-inside space-y-3 text-sm sm:text-base">
                    {instructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </TabsContent>
              </Tabs>
            ) : (
              <p className="text-sm text-muted-foreground">
                No steps yet. Know how this one is made?{" "}
                <a href={editUrl} className="text-foreground underline underline-offset-4">
                  Add the steps on GitHub
                </a>
                .
              </p>
            )}
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">Ingredients</h2>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm">Serving size</span>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Fewer servings"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="rounded-r-none border-r-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  readOnly
                  value={servings}
                  aria-label="Servings"
                  className="h-[2.25rem] w-12 rounded-none border-x-0 text-center tabular-nums"
                />
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="More servings"
                  onClick={() => setServings(servings + 1)}
                  className="rounded-l-none border-l-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="max-w-full border-b py-1 text-sm last:border-b-0 sm:text-base">
                  <span className="tabular-nums">{formatAmount((ingredient.amount / baseServings) * servings)}</span>{" "}
                  {ingredient.unit} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {notes.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">Recipe Notes</h2>
            <ul className="list-disc list-inside space-y-3 text-sm sm:text-base">
              {notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2 text-sm">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-1">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <Button variant="outline" size="sm" onClick={handleShareClick} className="w-full justify-center sm:w-auto">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
              {copied ? "Link copied" : "Share"}
            </Button>
            <Button variant="outline" size="sm" asChild className="w-full justify-center sm:w-auto">
              <a href={editUrl}>
                <Pencil className="mr-2 h-4 w-4" />
                Suggest an edit
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
