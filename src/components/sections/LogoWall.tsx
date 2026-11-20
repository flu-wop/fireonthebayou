import MediaSlot from "@/components/media/MediaSlot";
import { catalogClients, clientLogoPath } from "@/lib/media-manifest";

/** "Who We've Made Films For" — one logo per catalog client (SVG, white on transparent). */
export default function LogoWall() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
      {catalogClients().map((name) => (
        <li key={name} className="grid h-24 place-items-center bg-bayou-deep p-4">
          <MediaSlot
            src={clientLogoPath(name)}
            alt={name}
            className="h-10 w-auto max-w-full object-contain opacity-80"
            placeholder={{
              variant: "logo",
              compact: true,
              aspect: "aspect-auto",
              className: "h-14 w-full border-0 bg-transparent",
              label: "LOGO — SVG",
              size: "SVG, white on transparent",
              where: `/public${clientLogoPath(name)}`,
              title: name,
            }}
          />
        </li>
      ))}
    </ul>
  );
}
