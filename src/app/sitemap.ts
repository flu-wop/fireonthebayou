import type { MetadataRoute } from "next";
import { screenedProjects } from "@/lib/projects";

const BASE_URL = "https://fireonthebayou.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/consult",
    "/process",
    "/services",
    "/work",
    ...screenedProjects.map((p) => `/work/${p.slug}`),
  ];

  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
