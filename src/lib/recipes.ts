import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

// The recipe schema. Every file in recipes/ must match it or the build fails.
// Field names follow the Fitbite recipes table the data came from.
const ingredientSchema = z.strictObject({
  name: z.string().min(1),
  amount: z.number().positive(),
  unit: z.string().min(1),
});

export const frontmatterSchema = z.strictObject({
  name: z.string().min(1),
  author: z.string().min(1),
  cook_time: z.string().min(1).optional(),
  servings: z.number().int().positive(),
  // Totals for the whole recipe; the site divides by servings.
  macros: z.strictObject({
    calories: z.number().nonnegative(),
    protein: z.number().nonnegative(),
    carbs: z.number().nonnegative(),
    fat: z.number().nonnegative(),
  }),
  ingredients: z.array(ingredientSchema).min(1),
  tags: z.array(z.string().min(1)).default([]),
  image: z
    .string()
    .regex(/^[a-z0-9-]+\.(webp|jpg|jpeg|png)$/, "image must be a file name next to the recipe, e.g. my-recipe.webp")
    .optional(),
  created: z.coerce.date().transform((d) => d.toISOString().slice(0, 10)),
});

export type Ingredient = z.infer<typeof ingredientSchema>;

export type Recipe = {
  slug: string;
  name: string;
  author: string;
  cookTime?: string;
  servings: number;
  macros: { calories: number; protein: number; carbs: number; fat: number };
  ingredients: Ingredient[];
  instructions: string[];
  notes: string[];
  tags: string[];
  imgUrl?: string;
  createdAt: string;
};

export const RECIPES_DIR = path.join(process.cwd(), "recipes");
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SECTIONS = { Instructions: /^\d+\.\s+(.+)$/, Notes: /^[-*]\s+(.+)$/ } as const;

// Body format: optional "## Instructions" (numbered list) and "## Notes" (bullet list).
function parseBody(body: string) {
  const out = { Instructions: [] as string[], Notes: [] as string[] };
  let section: keyof typeof SECTIONS | null = null;
  for (const [i, raw] of body.split("\n").entries()) {
    const line = raw.trim();
    if (!line) continue;
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      if (!(heading[1] in SECTIONS)) throw new Error(`unknown section "## ${heading[1]}" (allowed: ## Instructions, ## Notes)`);
      section = heading[1] as keyof typeof SECTIONS;
      continue;
    }
    const item = section && line.match(SECTIONS[section]);
    if (!section || !item) {
      throw new Error(
        `body line ${i + 1} is not a list item under ## Instructions (1. step) or ## Notes (- note): "${line}"`,
      );
    }
    out[section].push(item[1]);
  }
  return { instructions: out.Instructions, notes: out.Notes };
}

export function parseRecipeFile(file: string): Recipe {
  const slug = path.basename(file, ".md");
  if (!SLUG.test(slug)) throw new Error("file name must be lowercase-kebab-case, e.g. chicken-fajitas.md");
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues.map((i) => `${i.path.join(".") || "frontmatter"}: ${i.message}`).join("; "));
  }
  const fm = result.data;
  if (fm.image && !fs.existsSync(path.join(RECIPES_DIR, fm.image))) {
    throw new Error(`image ${fm.image} not found in recipes/`);
  }
  return {
    slug,
    name: fm.name,
    author: fm.author,
    cookTime: fm.cook_time,
    servings: fm.servings,
    macros: fm.macros,
    ingredients: fm.ingredients,
    tags: fm.tags,
    imgUrl: fm.image ? `/recipes/${fm.image}` : undefined,
    createdAt: fm.created,
    ...parseBody(content),
  };
}

export function recipeFiles() {
  return fs
    .readdirSync(RECIPES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(RECIPES_DIR, f));
}

// Newest first, like the Fitbite recipes page.
export function getRecipes(): Recipe[] {
  return recipeFiles()
    .map(parseRecipeFile)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.name.localeCompare(b.name));
}

export function getRecipe(slug: string): Recipe | undefined {
  return getRecipes().find((r) => r.slug === slug);
}
