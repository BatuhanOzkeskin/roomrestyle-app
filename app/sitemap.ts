import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Şimdilik tek herkese açık sayfa var; yeni açık sayfalar (ör. stil sayfaları) eklenince buraya eklenir.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
