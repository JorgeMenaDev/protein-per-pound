import { ImageResponse } from "next/og";
import { getProteinSources } from "@/lib/protein-sources";
import { getRecipes } from "@/lib/recipes";
import { perServing } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

// Social preview images (1200×630) for the pages without a photo of their own.
export const dynamic = "force-static";
export const dynamicParams = false;

const PAGES = ["home", "table", "recipes"] as const;
export function generateStaticParams() {
  return PAGES.map((page) => ({ page }));
}

export async function GET(_: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const sources = getProteinSources();
  const recipes = getRecipes();

  const heading =
    page === "table"
      ? "The cheapest protein in UK supermarkets"
      : page === "recipes"
        ? `${recipes.length} high-protein recipes`
        : "Cheap protein, ranked by price per gram";
  const sub =
    page === "recipes"
      ? "Calories, protein, carbs and fat per serving"
      : page === "table"
        ? "Supermarket foods ranked by what a gram of protein costs"
        : `UK supermarket prices and ${recipes.length} high-protein recipes`;
  const rows =
    page === "recipes"
      ? [...recipes]
          .sort((a, b) => perServing(b).protein - perServing(a).protein)
          .slice(0, 4)
          .map((r) => [r.name, `${perServing(r).protein} g protein`])
      : sources.slice(0, 4).map((s) => [s.name, `£${s.p100.toFixed(2)} / 100 g protein`]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          background: "#0c0a09",
          color: "#f2f2f2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 26, color: "#22c55e", fontWeight: 600 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 20, lineHeight: 1.05 }}>
          {heading}
        </div>
        <div style={{ fontSize: 30, color: "#a1a1aa", marginTop: 16 }}>{sub}</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          {rows.map(([name, value], i) => (
            <div
              key={name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 28,
                padding: "12px 0",
                borderTop: i === 0 ? "none" : "1px solid #27272a",
              }}
            >
              <span>{name}</span>
              <span style={{ color: "#22c55e" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
