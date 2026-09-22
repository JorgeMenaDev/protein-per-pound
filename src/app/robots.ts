import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Everything is public open data; search engines and AI crawlers are all welcome.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
