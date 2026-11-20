import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";

import { site } from "@/lib/site";

const BASE_URL = site.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/process",
    "/services",
    "/testimonials",
    "/work",
    ...projects.filter((r) => r.data.writeup && r.data.youtubeIds.length).map((r) => `/work/${r.data.slug}`),
  ];

  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
