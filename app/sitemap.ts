import type { MetadataRoute } from "next";

const BASE_URL = "https://www.latelierdelecharpe.fr";

const routes = ["", "/brunch", "/diner", "/fiesta", "/contact", "/reservation"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
