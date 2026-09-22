import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GithubIcon } from "@/components/icons/github-icon";
import { AUTHOR, LOCALE, REPO_URL, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: cheapest protein per gram in UK supermarkets`, template: `%s | ${SITE_NAME}` },
  description:
    "UK supermarket foods ranked by what a gram of protein costs, plus high-protein recipes with macros per serving. Open data, added by pull request.",
  applicationName: SITE_NAME,
  authors: [AUTHOR],
  creator: AUTHOR.name,
  keywords: [
    "cheapest protein UK",
    "price per gram of protein",
    "cheap protein sources",
    "high protein recipes",
    "protein per pound",
    "Aldi protein",
    "budget high protein food",
  ],
  category: "food",
  openGraph: { siteName: SITE_NAME, locale: LOCALE, type: "website" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { types: { "text/plain": "/llms.txt" } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

const NAV = [
  { href: "/table", label: "Price table" },
  { href: "/recipes", label: "Recipes" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="min-h-dvh flex flex-col">
        <TooltipProvider delayDuration={300} skipDelayDuration={400}>
          <header className="site-header sticky top-0 z-40 border-b bg-background/75 backdrop-blur-xl backdrop-saturate-150">
            <div className="container flex h-14 items-center gap-6">
              <Link href="/" className="font-semibold tracking-tight">
                {SITE_NAME}
              </Link>
              <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                {NAV.map((item) => (
                  <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                ))}
              </nav>
              <a
                href={REPO_URL}
                className="ml-auto flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <GithubIcon className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 text-sm text-muted-foreground">
            <div className="container flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span>Open data under the MIT license. Started from the Fitbite app.</span>
              <a href={REPO_URL} className="underline-offset-4 hover:underline">
                Add a food or a recipe on GitHub
              </a>
            </div>
          </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
