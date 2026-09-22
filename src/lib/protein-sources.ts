import fs from "node:fs";
import path from "node:path";

export type ProteinSource = {
  name: string;
  store: string;
  price: number;
  size: number;
  unit: string;
  protein: number | null;
  proteinUnit: string;
  carbs: number | null;
  ppg: number;
  p100: number;
  dateAdded: string;
  image: string;
};

export const CSV_PATH = path.join(process.cwd(), "data", "protein-sources.csv");

function splitLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  const header = splitLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitLine(line);
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""]));
  });
}

const num = (v: string) => (v === "" ? null : Number(v));

// Derived columns follow the formula in the README.
function toSource(r: Record<string, string>): ProteinSource {
  const piece = r.package_unit === "piece";
  const size = Number(r.package_size);
  const total = piece ? size * Number(r.protein_per_piece) : (size * Number(r.protein_per_100g)) / 100;
  const ppg = total > 0 ? Number(r.price_gbp) / total : 0;
  return {
    name: r.name,
    store: r.store,
    price: Number(r.price_gbp),
    size,
    unit: r.package_unit,
    protein: num(piece ? r.protein_per_piece : r.protein_per_100g),
    proteinUnit: piece ? "/piece" : "/100g",
    carbs: num(r.carbs_per_100g),
    ppg: r.price_per_g_protein !== "" ? Number(r.price_per_g_protein) : ppg,
    p100: r.price_per_100g_protein !== "" ? Number(r.price_per_100g_protein) : ppg * 100,
    dateAdded: r.date_added ?? "",
    image: r.image_url ?? "",
  };
}

export function getProteinSources(): ProteinSource[] {
  return parseCSV(fs.readFileSync(CSV_PATH, "utf8"))
    .map(toSource)
    .sort((a, b) => a.ppg - b.ppg);
}
