import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
      url: `${SITE.url}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "/" ? 1 : 0.7,
    }));
}
