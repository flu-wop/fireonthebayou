import { cn } from "@/lib/utils";

/**
 * PlaceholderFrame
 * ----------------
 * The labeled stand-in for any empty image / video slot. Dark, grain, thin
 * white corner marks and a pulsing crimson REC dot. It always says what
 * belongs here, the exact size, and where to upload it. MediaSlot swaps it
 * out for the real asset as soon as one exists.
 */
export type PlaceholderVariant = "reel" | "project" | "logo" | "testimonial" | "crew" | "photo" | "still";

export type PlaceholderFrameProps = {
  variant: PlaceholderVariant;
  /** Short slot tag, e.g. "POSTER 1280×720". */
  label: string;
  /** Exact size + format, e.g. "1280×720 JPG". */
  size: string;
  /** Where the file goes, e.g. "/public/images/work-rouses.jpg". */
  where: string;
  /** Real content to show on the frame (project title, client name…). */
  title?: string;
  subtitle?: string;
  tags?: string[];
  /** Tailwind aspect class, e.g. "aspect-video". */
  aspect?: string;
  /** Small footprint (logo banner): only the wordmark + tag, detail in tooltip. */
  compact?: boolean;
  className?: string;
};

const initials = (s: string) =>
  s
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

function Corners() {
  const c = "absolute h-3 w-3 border-cream/40";
  return (
    <>
      <span aria-hidden className={cn(c, "left-2 top-2 border-l border-t")} />
      <span aria-hidden className={cn(c, "right-2 top-2 border-r border-t")} />
      <span aria-hidden className={cn(c, "bottom-2 left-2 border-b border-l")} />
      <span aria-hidden className={cn(c, "bottom-2 right-2 border-b border-r")} />
    </>
  );
}

function FilmStrip({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={cn("absolute inset-y-0 w-3 border-cream/10 opacity-70", side === "left" ? "left-0 border-r" : "right-0 border-l")}
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.14) 0 8px, transparent 8px 16px)",
        backgroundSize: "100% 16px",
        backgroundClip: "content-box",
        padding: "3px 3px",
      }}
    />
  );
}

export default function PlaceholderFrame({
  variant,
  label,
  size,
  where,
  title,
  subtitle,
  tags,
  aspect = "aspect-video",
  compact,
  className,
}: PlaceholderFrameProps) {
  const detail = `${label} · ${size} · ${where}`;

  return (
    <div
      role="img"
      aria-label={`Placeholder: ${detail}`}
      title={detail}
      data-placeholder={variant}
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden rounded-sm border border-border bg-bayou-deep text-center",
        aspect,
        className
      )}
    >
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-screen" />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(208,17,70,0.08) 0%, transparent 70%)" }} />
      <Corners />
      {variant === "project" && (
        <>
          <FilmStrip side="left" />
          <FilmStrip side="right" />
        </>
      )}

      {/* REC dot */}
      {!compact && (
        <span className="absolute left-4 top-3.5 flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-cream/70">
          <span className="h-1.5 w-1.5 animate-ember-pulse rounded-full bg-ember" />
          REC
        </span>
      )}

      <div className={cn("relative z-10 flex max-w-full flex-col items-center px-6", compact ? "gap-1 px-3" : "gap-2")}>
        {variant === "reel" && (
          <span className="mb-1 grid h-16 w-16 place-items-center rounded-full border border-cream/50 md:h-20 md:w-20">
            <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-cream md:border-y-[11px] md:border-l-[18px]" />
          </span>
        )}
        {variant === "testimonial" && <span className="font-serif text-6xl leading-none text-flame">&ldquo;</span>}
        {variant === "crew" && (
          <span className="grid h-20 w-20 place-items-center rounded-full border border-cream/30 font-display text-3xl text-cream">
            {initials(title ?? "")}
          </span>
        )}

        {title && variant !== "crew" && (
          <p
            className={cn(
              variant === "logo" ? "font-display text-cream" : "font-display text-cream",
              compact ? "text-lg leading-none md:text-xl" : variant === "project" ? "text-2xl leading-[0.95] md:text-3xl" : "text-2xl leading-none"
            )}
          >
            {title}
          </p>
        )}
        {title && variant === "crew" && <p className="text-sm font-medium text-cream">{title}</p>}
        {subtitle && <p className="text-xs text-mist">{subtitle}</p>}
        {tags && tags.length > 0 && !compact && (
          <p className="text-[10px] uppercase tracking-wider text-ash">{tags.join(" · ")}</p>
        )}

        <p className={cn("rounded-sm border border-flame/50 px-2 py-0.5 font-medium uppercase tracking-wider text-flame", compact ? "text-[8px]" : "mt-1 text-[10px]")}>
          {label}
        </p>
        {!compact && (
          <p className="max-w-[28ch] break-words text-[10px] leading-snug text-ash">
            {size}
            <br />
            Upload: {where}
          </p>
        )}
      </div>
    </div>
  );
}
