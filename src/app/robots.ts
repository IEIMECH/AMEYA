import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ameyafest.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/events",
                "/venue",
        "/team",
        "/team/explore",
        "/about",
        "/info",
        "/contact",
        "/privacy",
        "/terms",
      ],
      disallow: [
        "/admin",
        "/api/",
        "/_next/",
        "/private/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
