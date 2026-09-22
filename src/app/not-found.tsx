import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">That page does not exist, or the recipe was renamed.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/table">Open the price table</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/recipes">Browse recipes</Link>
        </Button>
      </div>
    </div>
  );
}
