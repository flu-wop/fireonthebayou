import type { Metadata } from "next";
import { getPageSeo } from "@/lib/content";
import { getMediaOverrides, OG_IMAGE_PATH, resolveWith } from "@/lib/media";

/**
 * Per-page metadata: defaults in code, overridden by the title, description and
 * link-preview image set in Admin > SEO (published values only).
 */
export async function pageMetadata(path: string, defaults: { title: string; description: string }): Promise<Metadata> {
  const seo = await getPageSeo(path);
  const title = seo.title?.trim() || defaults.title;
  const description = seo.description?.trim() || defaults.description;
  const image = seo.ogImage || resolveWith(await getMediaOverrides(), OG_IMAGE_PATH) || OG_IMAGE_PATH;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [image] },
    twitter: { card: "summary_large_image", images: [image] },
  };
}
