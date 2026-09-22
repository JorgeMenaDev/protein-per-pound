import type { Metadata } from "next";
import { ProteinTable } from "@/features/protein-table/protein-table";
import { getProteinSources } from "@/lib/protein-sources";
import { REPO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Protein price table",
  description: "Supermarket foods ranked by what a gram of protein costs.",
};

export default function TablePage() {
  const rows = getProteinSources();
  return (
    <div className="container pb-12">
      <div className="py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Protein price table</h1>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
          What a gram of protein costs at the supermarket. UK prices in GBP.{" "}
          <a href={`${REPO_URL}#adding-a-food`} className="underline underline-offset-4 hover:text-foreground">
            Add an item on GitHub
          </a>
          .
        </p>
      </div>
      <ProteinTable rows={rows} />
    </div>
  );
}
