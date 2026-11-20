import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/admin-auth";
import { logAudit } from "@/lib/content/admin-store";
import { addMedia } from "@/lib/media-store";

export const runtime = "nodejs";

/** Registers a video the browser uploaded straight to Blob (files too big for a function body). */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const b = (await req.json()) as { url?: string; slot?: string; alt?: string; bytes?: number; filename?: string; contentType?: string };
    if (!b.url || !/^https:\/\/[\w-]+\.public\.blob\.vercel-storage\.com\//.test(b.url)) return NextResponse.json({ error: "Unexpected file location." }, { status: 400 });
    if (b.slot && !/^\/video\/[\w\-./]+$/.test(b.slot)) return NextResponse.json({ error: "Bad slot." }, { status: 400 });
    const id = await addMedia({ slot: b.slot ?? null, url: b.url, alt: (b.alt ?? "").slice(0, 300), filename: b.filename ?? "video.mp4", contentType: b.contentType ?? "video/mp4", bytes: b.bytes ?? 0, user: user.email });
    await logAudit({ user: user.email, action: "media.upload", kind: "media", key: b.slot ?? String(id), after: { url: b.url } });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, id, url: b.url });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 401 });
  }
}
