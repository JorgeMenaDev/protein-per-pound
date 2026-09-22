import fs from "node:fs";
import { CSV_PATH } from "@/lib/protein-sources";

// The raw CSV at the address the original single-page viewer served it from.
export const dynamic = "force-static";

export function GET() {
  return new Response(fs.readFileSync(CSV_PATH, "utf8"), {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
}
