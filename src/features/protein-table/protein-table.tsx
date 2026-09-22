"use client";

import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ProteinSource } from "@/lib/protein-sources";

type SortKey = keyof Pick<
  ProteinSource,
  "name" | "store" | "price" | "size" | "protein" | "carbs" | "ppg" | "p100" | "dateAdded"
>;

const COLUMNS: { key: SortKey; label: string; num?: boolean }[] = [
  { key: "name", label: "Item" },
  { key: "store", label: "Store" },
  { key: "price", label: "Price", num: true },
  { key: "size", label: "Package", num: true },
  { key: "protein", label: "Protein", num: true },
  { key: "carbs", label: "Carbs", num: true },
  { key: "ppg", label: "£ / g protein", num: true },
  { key: "p100", label: "£ / 100 g protein", num: true },
  { key: "dateAdded", label: "Added" },
];

const numCell = "text-right tabular-nums font-mono text-[0.85em]";

export function ProteinTable({ rows }: { rows: ProteinSource[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("ppg");
  const [sortDir, setSortDir] = useState(1);
  const [photo, setPhoto] = useState<{ src: string; alt: string } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = rows
    .filter((r) => !q || r.name.toLowerCase().includes(q) || r.store.toLowerCase().includes(q))
    .sort((a, b) => {
      const x = a[sortKey];
      const y = b[sortKey];
      const cmp = typeof x === "number" && typeof y === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? ""));
      return cmp * sortDir;
    });

  function sortBy(key: SortKey) {
    if (key === sortKey) setSortDir(-sortDir);
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  function openPhoto(src: string, alt: string) {
    setPhoto({ src, alt });
    dialog.current?.showModal();
  }

  function closePhoto() {
    const d = dialog.current;
    if (!d) return;
    d.classList.add("closing");
    setTimeout(() => {
      d.classList.remove("closing");
      d.close();
      setPhoto(null);
    }, 130);
  }

  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter items, e.g. lentils, tuna, whey"
            className="pl-9"
            aria-label="Filter items"
          />
        </div>
        <span className="whitespace-nowrap text-sm text-muted-foreground tabular-nums">
          {filtered.length} / {rows.length}
        </span>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="w-14" aria-label="Photo" />
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  aria-sort={sortKey === c.key ? (sortDir === 1 ? "ascending" : "descending") : undefined}
                  className={cn("px-3 py-2 font-normal", c.num ? "text-right" : "text-left")}
                >
                  <button
                    onClick={() => sortBy(c.key)}
                    className={cn(
                      "whitespace-nowrap text-xs uppercase tracking-wide transition-colors hover:text-foreground",
                      sortKey === c.key ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {c.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={`${r.name}-${r.size}-${r.store}`} className="border-t first:border-t-0 hover:bg-primary/5">
                <td className="py-1.5 pl-3 pr-2">
                  {r.image && (
                    <button
                      onClick={() => openPhoto(r.image, r.name)}
                      aria-label={`View photo of ${r.name}`}
                      className="block overflow-hidden rounded-md transition-transform duration-150 ease-out active:scale-[0.97]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image} alt="" loading="lazy" className="h-10 w-10 bg-muted object-cover" />
                    </button>
                  )}
                </td>
                <td className="min-w-[220px] px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.store}</td>
                <td className={cn("px-3 py-2", numCell)}>£{r.price.toFixed(2)}</td>
                <td className={cn("px-3 py-2", numCell)}>
                  {r.size} {r.unit}
                </td>
                <td className={cn("px-3 py-2", numCell)}>
                  {r.protein ?? ""} <span className="text-muted-foreground">{r.protein !== null ? r.proteinUnit : ""}</span>
                </td>
                <td className={cn("px-3 py-2", numCell)}>{r.carbs ?? ""}</td>
                <td className={cn("px-3 py-2", numCell)}>£{r.ppg.toFixed(4)}</td>
                <td className={cn("px-3 py-2", numCell)}>£{r.p100.toFixed(2)}</td>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">{r.dateAdded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        onClick={closePhoto}
        onCancel={(e) => {
          e.preventDefault();
          closePhoto();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photo && <img src={photo.src} alt={photo.alt} />}
      </dialog>
    </>
  );
}
