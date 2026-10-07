// Sitenin herkese açık (canlı) adresi — SEO için: canonical, sitemap, paylaşım kartı.
// Bilinçli olarak NEXT_PUBLIC_SITE_URL'den bağımsız: o ayar lokalde localhost'u gösterir.
// Özel alan adına geçince Vercel'de NEXT_PUBLIC_SEO_URL tanımlamak (ya da buradaki varsayılanı değiştirmek) yeter.
export const SITE_URL = (process.env.NEXT_PUBLIC_SEO_URL || "https://roomrestyle-app.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "RoomRestyle";
