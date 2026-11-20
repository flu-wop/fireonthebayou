import Hero from "@/components/sections/Hero";
import LogoBanner from "@/components/sections/LogoBanner";
import { getClients, getSettings } from "@/lib/content";
import { HERO_POSTER_PATH, HERO_REEL_PATH, clientLogoPath, getMediaOverrides, resolveWith } from "@/lib/media";

/** One screen: the reel, the tagline, the client logo banner, one call to action. */
export default async function HomeView({ draft }: { draft?: boolean }) {
  const [settings, clients, map] = await Promise.all([getSettings({ draft }), getClients({ draft }), getMediaOverrides()]);
  const logos = clients.filter((c) => c.data.banner).map((c) => ({ name: c.data.name, slug: c.key, src: resolveWith(map, clientLogoPath(c.key)) }));
  return (
    <Hero
      mp4={resolveWith(map, HERO_REEL_PATH) ?? undefined}
      poster={resolveWith(map, HERO_POSTER_PATH) ?? HERO_POSTER_PATH}
      youtubeId={settings.heroYoutubeId}
      lines={settings.heroLines}
      sub={settings.heroSub}
      phone={settings.phone}
      phoneHref={settings.phoneHref}
      banner={<LogoBanner logos={logos} />}
    />
  );
}
