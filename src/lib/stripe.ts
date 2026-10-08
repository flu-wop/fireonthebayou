import Stripe from "stripe";

/**
 * Lazy Stripe client — created on first use, never at module load, so the
 * build doesn't need STRIPE_SECRET_KEY. Returns null when it isn't set, which
 * lets the site run (and the consult button fall back to /contact) before
 * Stripe is wired.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  _stripe = new Stripe(key);
  return _stripe;
}

export function siteUrl(req: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(req.url).origin;
}
