import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ProteinTable } from "@/features/protein-table/protein-table";
import { getProteinSources } from "@/lib/protein-sources";
import { breadcrumbJsonLd, datasetJsonLd, lastUpdated, OG_BASE, TWITTER_BASE } from "@/lib/seo";
import { REPO_URL } from "@/lib/site";

export function generateMetadata(): Metadata {
  const sources = getProteinSources();
  const storeList = [...new Set(sources.map((s) => s.store))];
  const stores = storeList.length > 1 ? `${storeList.slice(0, -1).join(", ")} and ${storeList.at(-1)}` : storeList[0];
  const top = sources[0];
  const title = "Cheapest protein per gram in UK supermarkets";
  const description = `${sources.length} foods from ${stores} ranked by price per gram of protein. Cheapest: ${top.name}, £${top.p100.toFixed(2)} per 100 g of protein. Updated ${lastUpdated(sources)}.`;
  return {
    title,
    description,
    alternates: { canonical: "/table" },
    openGraph: { ...OG_BASE, url: "/table", title, description, images: [{ url: "/og/table", width: 1200, height: 630, alt: title }] },
    twitter: { ...TWITTER_BASE, title, description, images: ["/og/table"] },
  };
}

export default function TablePage() {
  const rows = getProteinSources();
  const updated = lastUpdated(rows);
  return (
    <div className="container pb-12">
      <JsonLd data={datasetJsonLd(rows)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Protein price table", path: "/table" }])} />
      <div className="py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Protein price table</h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
          What a gram of protein costs at UK supermarkets, cheapest first. Prices in GBP, updated {updated}.{" "}
          <a href="/data/protein-sources.csv" className="underline underline-offset-4 hover:text-foreground">
            Download the CSV
          </a>{" "}
          or{" "}
          <a href={`${REPO_URL}#adding-a-food`} className="underline underline-offset-4 hover:text-foreground">
            add an item on GitHub
          </a>
          .
        </p>
      </div>
      <ProteinTable rows={rows} />
      <section className="mt-10 max-w-2xl text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">How the ranking works</h2>
        <p className="mt-2">
          Each row is one product in one package size, with the shelf price and the protein figure from its nutrition
          label. Total protein is the package size times the protein per 100 g (or per piece for eggs and multipacks).
          Dividing the price by that total gives the price of one gram of protein, and the table sorts by it. A food
          that looks cheap per kilo can still be expensive protein if little of it is protein.
        </p>
        <p className="mt-2">
          Prices come from shelf labels and receipts, and each row keeps the date it entered the table, so check the
          date before relying on a price.
        </p>
      </section>
    </div>
  );
}
