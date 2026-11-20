import type { NewInquiry } from "@/lib/inquiries";

/**
 * ============================================================================
 *  NEW-INQUIRY ALERT — UNDECIDED (scope doc, decision 8)
 * ============================================================================
 * Every inquiry is already saved to the database and shown in the admin inbox.
 * How the studio is *told* about a new one is Jason's call:
 *   a) a Mailchimp automation that emails an internal address, or
 *   b) checking the admin inbox.
 * Mailchimp is marketing email, not a transactional sender, so confirm what it
 * can send internally before launch. When decided, implement it HERE and
 * nowhere else; /api/contact already calls this once per inquiry and ignores
 * failures, so a broken alert never loses a lead.
 */
export async function notifyNewInquiry(_inquiry: NewInquiry & { id: number }): Promise<void> {
  // Intentionally empty until the alert channel is chosen.
}
