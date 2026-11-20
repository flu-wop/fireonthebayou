// lib/insights/config.ts
// Fire on the Bayou's InsightsConfig. The site takes no online payments, so there
// are no revenue sources: Insights tracks visitors, pages, and contact inquiries.
import type { InsightsConfig } from "./types"

export const insightsConfig: InsightsConfig = {
  siteName: "Fire on the Bayou",
  eventsTable: "fotb_site_events",
  timezone: "America/Chicago",
  eventTypes: ["page_view", "page_time", "inquiry_sent"],
  sources: [],
  funnels: [
    {
      label: "Starting a project",
      steps: [
        { label: "Visited the site", type: "page_view" },
        { label: "Opened Let's Talk", type: "page_view", path: "/contact" },
        { label: "Sent an inquiry", type: "inquiry_sent" },
      ],
    },
  ],
}
