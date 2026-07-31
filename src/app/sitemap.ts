import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE, TRUST_ROUTES } from "@/lib/constants";
import { TRUST_LAYER_ENABLED } from "@/lib/flags";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: string[] = [
    ...PUBLIC_ROUTES,
    ...(TRUST_LAYER_ENABLED ? TRUST_ROUTES : []),
  ];
  return routes.map((route) => ({
      url: `${SITE.url}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "/" ? 1 : 0.7,
    }));
}
