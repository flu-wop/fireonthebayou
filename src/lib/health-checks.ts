import { getDB } from "@/lib/db";
import { mailchimpConfigured } from "@/lib/mailchimp";

export type Status = "ok" | "warn" | "fail";
export interface Check {
  label: string;
  status: Status;
  detail: string;
}

/** Every env var this site reads. required = site is degraded without it. */
export const REQUIRED_VARS: { group: string; name: string; required: boolean; note?: string }[] = [
  { group: "Site", name: "NEXT_PUBLIC_SITE_URL", required: true },
  { group: "Site", name: "SITE_INDEXABLE", required: false, note: "Set to true at launch so search engines can index" },
  { group: "Admin", name: "ADMIN_PASSWORD", required: true },
  { group: "Database", name: "TURSO_URL", required: true },
  { group: "Database", name: "TURSO_TOKEN", required: true },
  { group: "Mailchimp", name: "MAILCHIMP_API_KEY", required: true },
  { group: "Mailchimp", name: "MAILCHIMP_SERVER_PREFIX", required: true, note: "The part after the dash in the API key, e.g. us21" },
  { group: "Mailchimp", name: "MAILCHIMP_AUDIENCE_ID", required: true },
];

export function checkEnvVars() {
  return REQUIRED_VARS.map((v) => ({ ...v, set: Boolean(process.env[v.name]) }));
}

const safe = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 160);

export async function checkMailchimp(): Promise<Check[]> {
  if (!mailchimpConfigured()) {
    return [{ label: "Mailchimp", status: "fail", detail: "MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX or MAILCHIMP_AUDIENCE_ID is not set" }];
  }
  const base = `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;
  const auth = { Authorization: `Basic ${Buffer.from(`fotb:${process.env.MAILCHIMP_API_KEY}`).toString("base64")}` };
  try {
    const res = await fetch(`${base}/lists/${process.env.MAILCHIMP_AUDIENCE_ID}?fields=name,stats.member_count`, { headers: auth, cache: "no-store" });
    if (res.status === 401 || res.status === 403) return [{ label: "Mailchimp", status: "fail", detail: "API key was rejected" }];
    if (res.status === 404) return [{ label: "Mailchimp", status: "fail", detail: "Audience ID not found in this account" }];
    if (!res.ok) return [{ label: "Mailchimp", status: "fail", detail: `Mailchimp returned ${res.status}` }];
    const body = (await res.json()) as { name?: string; stats?: { member_count?: number } };
    return [{ label: "Mailchimp audience", status: "ok", detail: `${body.name ?? "Audience"} · ${body.stats?.member_count ?? 0} contacts` }];
  } catch (e) {
    return [{ label: "Mailchimp", status: "fail", detail: safe(e) }];
  }
}

export async function checkDatabase(): Promise<Check[]> {
  const db = getDB();
  if (!db) return [{ label: "Database (Turso)", status: "fail", detail: "TURSO_URL is not set" }];
  try {
    await db.execute("SELECT 1");
    return [{ label: "Database (Turso)", status: "ok", detail: "Connected" }];
  } catch (e) {
    return [{ label: "Database (Turso)", status: "fail", detail: safe(e) }];
  }
}
