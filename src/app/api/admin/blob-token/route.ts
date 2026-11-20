import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/admin-auth";

export const runtime = "nodejs";

/** Issues short-lived tokens so signed-in admins can upload MP4s (≤15 MB) directly to Blob. */
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    await requireUser();
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({ allowedContentTypes: ["video/mp4"], maximumSizeInBytes: 15 * 1024 * 1024, addRandomSuffix: true }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Not allowed." }, { status: 400 });
  }
}
