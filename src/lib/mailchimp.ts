import { createHash } from "node:crypto";

/**
 * Mailchimp Marketing API: add a contact to the audience and tag it.
 * Env: MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX (e.g. "us21"), MAILCHIMP_AUDIENCE_ID.
 * Only called for visitors who ticked the opt-in checkbox.
 */
export const MAILCHIMP_TAG = "Website inquiry";

export function mailchimpConfigured(): boolean {
  return Boolean(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_SERVER_PREFIX && process.env.MAILCHIMP_AUDIENCE_ID);
}

function base() {
  return `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;
}
function headers() {
  return {
    Authorization: `Basic ${Buffer.from(`fotb:${process.env.MAILCHIMP_API_KEY}`).toString("base64")}`,
    "Content-Type": "application/json",
  };
}
export const subscriberHash = (email: string) => createHash("md5").update(email.trim().toLowerCase()).digest("hex");

export type MailchimpResult = { ok: true } | { ok: false; error: string };

export async function subscribeToAudience(contact: { email: string; name: string }): Promise<MailchimpResult> {
  if (!mailchimpConfigured()) return { ok: false, error: "Mailchimp env vars are not set" };
  const list = process.env.MAILCHIMP_AUDIENCE_ID!;
  const hash = subscriberHash(contact.email);
  try {
    // PUT = add or update; status_if_new keeps an existing unsubscribed contact unsubscribed.
    const put = await fetch(`${base()}/lists/${list}/members/${hash}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({
        email_address: contact.email,
        status_if_new: "subscribed",
        merge_fields: { FNAME: contact.name },
      }),
    });
    if (!put.ok) return { ok: false, error: `Mailchimp member ${put.status}: ${(await put.text()).slice(0, 200)}` };

    const tag = await fetch(`${base()}/lists/${list}/members/${hash}/tags`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ tags: [{ name: process.env.MAILCHIMP_TAG || MAILCHIMP_TAG, status: "active" }] }),
    });
    if (!tag.ok) return { ok: false, error: `Mailchimp tag ${tag.status}: ${(await tag.text()).slice(0, 200)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message.slice(0, 200) : "Mailchimp request failed" };
  }
}
