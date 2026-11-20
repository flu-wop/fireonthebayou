/** YouTube ID checks: format, then (best effort) that the video exists. */
const ID = /^[A-Za-z0-9_-]{11}$/;

/** Accepts a bare ID or a pasted watch/share/embed URL; returns the ID or null. */
export function extractYouTubeId(input: string): string | null {
  const s = input.trim();
  if (ID.test(s)) return s;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) id = u.searchParams.get("v") || u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] || null;
    return id && ID.test(id) ? id : null;
  } catch {
    return null;
  }
}

export type IdCheck = { id: string; ok: boolean; warn?: boolean; message?: string };

/** exists=false only on a definite "not found"; network trouble returns a warning, not a block. */
export async function checkYouTubeId(id: string): Promise<IdCheck> {
  if (!ID.test(id)) return { id, ok: false, message: `"${id}" isn't a valid YouTube ID (11 letters, numbers, - or _).` };
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`, { signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (res.status === 404 || res.status === 400) return { id, ok: false, message: `YouTube has no video with ID ${id}.` };
    if (res.status === 401 || res.status === 403) return { id, ok: true, warn: true, message: `${id} exists but embedding may be disabled.` };
    if (!res.ok) return { id, ok: true, warn: true, message: `Couldn't confirm ${id} (YouTube returned ${res.status}).` };
    return { id, ok: true };
  } catch {
    return { id, ok: true, warn: true, message: `Couldn't reach YouTube to confirm ${id}.` };
  }
}
