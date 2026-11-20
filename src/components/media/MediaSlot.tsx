import { getMediaOverrides, resolveWith } from "@/lib/media";
import MediaView, { type MediaViewProps } from "./MediaView";

/**
 * MediaSlot — server component. Resolves the slot's /public path to an uploaded
 * file or a /public file; if neither exists it renders a labeled
 * PlaceholderFrame. Add the file in admin (or /public) and the placeholder
 * swaps itself out. No code change.
 */
export default async function MediaSlot({ src, ...rest }: Omit<MediaViewProps, "present"> & { src: string }) {
  const url = src.startsWith("http") ? src : resolveWith(await getMediaOverrides(), src);
  return <MediaView {...rest} src={url ?? src} present={url !== null} />;
}
