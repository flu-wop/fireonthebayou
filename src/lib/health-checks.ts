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
  { group: "Resend", name: "RESEND_API_KEY", required: true },
  { group: "Resend", name: "RESEND_FROM_EMAIL", required: true, note: "Must be on a verified Resend domain" },
  { group: "Resend", name: "RESEND_TO_EMAIL", required: false, note: "Defaults to the studio inbox" },
];

export function checkEnvVars() {
  return REQUIRED_VARS.map((v) => ({ ...v, set: Boolean(process.env[v.name]) }));
}

const safe = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 160);

export async function checkResend(): Promise<Check[]> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return [{ label: "Resend API", status: "fail", detail: "RESEND_API_KEY is not set" }];
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) {
      // Send-only keys can't list domains; the key itself is still valid.
      return [{ label: "Resend API", status: "warn", detail: "Key is send-only, so domain status can't be read. Check the Resend dashboard." }];
    }
    if (!res.ok) return [{ label: "Resend API", status: "fail", detail: `Resend returned ${res.status}` }];
    const body = (await res.json()) as { data?: { name: string; status: string }[] };
    const out: Check[] = [{ label: "Resend API", status: "ok", detail: "Key works" }];
    const from = process.env.RESEND_FROM_EMAIL ?? "";
    const m = from.match(/@([^>\s]+)/);
    if (!m) {
      out.push({ label: "Resend sender domain", status: "fail", detail: "RESEND_FROM_EMAIL is not set (falls back to onboarding@resend.dev, which only delivers to the account owner)" });
    } else {
      const d = body.data?.find((x) => x.name === m[1].toLowerCase());
      out.push(
        !d
          ? { label: "Resend sender domain", status: "fail", detail: `${m[1]} isn't added in Resend` }
          : d.status === "verified"
            ? { label: "Resend sender domain", status: "ok", detail: `${m[1]} is verified` }
            : { label: "Resend sender domain", status: "fail", detail: `${m[1]} status: ${d.status}. Finish DNS verification in Resend.` }
      );
    }
    return out;
  } catch (e) {
    return [{ label: "Resend API", status: "fail", detail: safe(e) }];
  }
}
