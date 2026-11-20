import PlaceholderFrame from "@/components/media/PlaceholderFrame";
import { clientLogoPath } from "@/lib/media";

export type LogoItem = { name: string; slug: string; src: string | null };

/**
 * Scrolling banner of client logos along the stage's bottom edge. A client
 * with no SVG yet shows its name as a labeled wordmark placeholder. Pure CSS
 * motion, switched off for reduced motion.
 */
export default function LogoBanner({ logos }: { logos: LogoItem[] }) {
  const row = [...logos, ...logos];
  return (
    <div className="relative overflow-hidden border-y border-border/60 bg-ink/60 py-4 backdrop-blur-sm" aria-label="Clients we've made films for">
      <ul className="flex w-max animate-marquee items-center gap-10 motion-reduce:animate-none">
        {row.map((l, i) => (
          <li key={`${l.name}-${i}`} aria-hidden={i >= logos.length} className="shrink-0">
            {l.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={l.src} alt={l.name} loading="lazy" className="h-9 w-auto max-w-[9rem] object-contain opacity-80" />
            ) : (
              <PlaceholderFrame
                variant="logo"
                compact
                aspect="aspect-auto"
                className="h-12 w-40"
                label="LOGO — SVG"
                size="SVG, white on transparent"
                where={`/public${clientLogoPath(l.slug)}`}
                title={l.name}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
