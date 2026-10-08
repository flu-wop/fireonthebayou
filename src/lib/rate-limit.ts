/**
 * Small fixed-window rate limiter for the API routes.
 *
 * It lives in memory, so each serverless instance keeps its own count. That
 * stops a single visitor (or a script) from hammering checkout or the contact
 * form. For a hard, platform-wide limit add a Vercel Firewall rate-limit rule
 * on /api/* as well; this is the in-app backstop.
 */
type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : req.headers.get("x-real-ip") || "unknown").trim();
}

/** Returns null when allowed, or the seconds to wait when the limit is hit. */
export function rateLimit(
  req: Request,
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): number | null {
  const now = Date.now();
  const id = `${key}:${clientIp(req)}`;
  const b = buckets.get(id);

  if (!b || b.reset <= now) {
    buckets.set(id, { count: 1, reset: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
    }
    return null;
  }
  if (b.count >= limit) return Math.ceil((b.reset - now) / 1000);
  b.count += 1;
  return null;
}
