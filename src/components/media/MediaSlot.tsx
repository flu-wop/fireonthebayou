import { publicFileExists } from "@/lib/media-manifest";
import MediaView, { type MediaViewProps } from "./MediaView";

/**
 * MediaSlot — server component. Checks whether the file exists under /public;
 * if so it renders it, otherwise a labeled PlaceholderFrame. Add the file and
 * the placeholder swaps itself out on the next build/deploy — no code change.
 */
export default function MediaSlot({ src, ...rest }: Omit<MediaViewProps, "present"> & { src: string }) {
  const present = src.startsWith("http") ? true : publicFileExists(src);
  return <MediaView {...rest} src={src} present={present} />;
}
