import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ameyafest.org";

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/events",
        "/agenda",
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
