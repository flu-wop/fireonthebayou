import Reveal from "@/components/effects/Reveal";
import MediaSlot from "@/components/media/MediaSlot";
import { postStillPath } from "@/lib/media";

type Step = { title: string; description: string };

/** Content of the Post-Production tab: copy plus 3–4 stills (labeled slots until supplied). */
export default function PostProduction({ heading, intro, steps }: { heading: string; intro: string; steps: Step[] }) {
  return (
    <section className="frame py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <p className="eyebrow mb-5">Post-Production</p>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] text-cream">{heading}</h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-mist">{intro}</p>
          </div>
        </div>
        <div className="md:col-span-8">
          <ol>
            {steps.map((s, i) => (
              <Reveal key={s.title}>
                <li className="flex gap-6 border-b border-border py-8 first:pt-0 md:gap-10">
                  <span className="font-display text-4xl text-border md:text-6xl">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="mb-2 font-display text-2xl text-cream md:text-3xl">{s.title}</h3>
                    <p className="max-w-xl text-base leading-relaxed text-mist">{s.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <MediaSlot
                key={n}
                src={postStillPath(n)}
                alt={`Post-production still ${n}`}
                placeholder={{
                  variant: "still",
                  label: "STILL 1600×1067",
                  size: "1600×1067 JPG (3:2)",
                  where: `/public${postStillPath(n)}`,
                  title: `Post-Production still ${n}`,
                  aspect: "aspect-[3/2]",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
