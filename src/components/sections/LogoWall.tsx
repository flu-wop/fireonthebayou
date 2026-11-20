import MediaSlot from "@/components/media/MediaSlot";
import { getClients } from "@/lib/content";
import { clientLogoPath } from "@/lib/media";

/** "Who We've Made Films For" — one logo per client marked for the wall (SVG, white on transparent). */
export default async function LogoWall({ draft }: { draft?: boolean }) {
  const clients = (await getClients({ draft })).filter((c) => c.data.wall);
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
      {clients.map((c) => (
        <li key={c.key} className="grid h-24 place-items-center bg-bayou-deep p-4">
          <MediaSlot
            src={clientLogoPath(c.key)}
            alt={c.data.name}
            className="h-10 w-auto max-w-full object-contain opacity-80"
            placeholder={{
              variant: "logo",
              compact: true,
              aspect: "aspect-auto",
              className: "h-14 w-full border-0 bg-transparent",
              label: "LOGO — SVG",
              size: "SVG, white on transparent",
              where: `/public${clientLogoPath(c.key)}`,
              title: c.data.name,
            }}
          />
        </li>
      ))}
    </ul>
  );
}
