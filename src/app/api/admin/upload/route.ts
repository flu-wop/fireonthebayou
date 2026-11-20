import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireUser } from "@/lib/admin-auth";
import { logAudit } from "@/lib/content/admin-store";
import { addMedia } from "@/lib/media-store";
import { rateLimit } from "@/lib/rate-limit";
import { slugify } from "@/lib/slugs";

export const runtime = "nodejs";

const MAX_BYTES = 4.4 * 1024 * 1024; // Vercel functions cap request bodies at ~4.5 MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Reject SVGs that carry scripts, handlers or external content. */
function svgIsSafe(svg: string): boolean {
  return /<svg[\s>]/i.test(svg) && !/<script|<foreignObject|\son\w+\s*=|javascript:|<iframe|<embed|<object|xlink:href\s*=\s*["']https?:/i.test(svg);
}

/**
 * POST /api/admin/upload  (multipart: file, slot?, alt, width?, height?)
 * Images are auto-resized (never enlarged, EXIF stripped); SVGs are checked;
 * the result goes to Vercel Blob and is recorded in fotb_media. When `slot`
 * (a /public path) is given, the file replaces that slot site-wide.
 */
export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const wait = rateLimit(req, "upload", { limit: 40, windowMs: 10 * 60_000 });
    if (wait) return NextResponse.json({ error: "Too many uploads. Wait a few minutes." }, { status: 429 });
    if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "File storage isn't set up (BLOB_READ_WRITE_TOKEN)." }, { status: 503 });

    const fd = await req.formData();
    const file = fd.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file." }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "That file is over 4 MB. Reduce it and try again." }, { status: 413 });

    const slot = String(fd.get("slot") ?? "") || null;
    if (slot && !/^\/(images|video)\/[\w\-./]+$/.test(slot)) return NextResponse.json({ error: "Bad slot." }, { status: 400 });
    const alt = String(fd.get("alt") ?? "").trim().slice(0, 300);
    const maxW = Math.min(Number(fd.get("width")) || 2400, 2400);
    const maxH = Math.min(Number(fd.get("height")) || 2400, 2400);
    const buf = Buffer.from(await file.arrayBuffer());
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "upload";

    let body: Buffer = buf;
    let contentType = file.type;
    let ext = "";
    let width: number | undefined;
    let height: number | undefined;

    if (file.type === "image/svg+xml") {
      if (!svgIsSafe(buf.toString("utf8"))) return NextResponse.json({ error: "That SVG contains scripts or external links. Export a plain SVG." }, { status: 400 });
      ext = "svg";
    } else if (IMAGE_TYPES.includes(file.type)) {
      const wantWebp = slot?.endsWith(".webp") || (!slot && file.type === "image/webp");
      const out = sharp(buf).rotate().resize({ width: maxW, height: maxH, fit: "inside", withoutEnlargement: true });
      const { data, info } = await (wantWebp ? out.webp({ quality: 84 }) : out.jpeg({ quality: 85, mozjpeg: true })).toBuffer({ resolveWithObject: true });
      body = data;
      width = info.width;
      height = info.height;
      contentType = wantWebp ? "image/webp" : "image/jpeg";
      ext = wantWebp ? "webp" : "jpg";
    } else {
      return NextResponse.json({ error: "Use a JPG, PNG, WebP or SVG." }, { status: 400 });
    }

    const blob = await put(`media/${base}-${Date.now().toString(36)}.${ext}`, body, { access: "public", contentType, addRandomSuffix: true });
    const id = await addMedia({ slot, url: blob.url, alt, filename: file.name, contentType, bytes: body.length, width, height, user: user.email });
    await logAudit({ user: user.email, action: "media.upload", kind: "media", key: slot ?? String(id), after: { url: blob.url, alt } });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, id, url: blob.url, width, height });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: msg }, { status: /sign in|Owner/.test(msg) ? 401 : 500 });
  }
}
