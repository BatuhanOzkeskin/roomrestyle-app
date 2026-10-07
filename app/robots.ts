import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Arama motorları: herkese açık sayfaları tara; giriş gerektiren sayfaları ve API'yi tarama.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/projects", "/login"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
