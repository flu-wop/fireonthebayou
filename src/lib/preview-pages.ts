/** Public pages that can be previewed with unpublished changes: path -> /preview/<slug>. */
export const PREVIEW_PAGES: { path: string; slug: string; label: string }[] = [
  { path: "/", slug: "home", label: "Home" },
  { path: "/work", slug: "work", label: "Work" },
  { path: "/services", slug: "services", label: "Services" },
  { path: "/process", slug: "process", label: "Process" },
  { path: "/about", slug: "about", label: "Studio" },
  { path: "/testimonials", slug: "testimonials", label: "Testimonials" },
  { path: "/contact", slug: "contact", label: "Let's Talk" },
];
export const previewSlugFor = (path: string) => PREVIEW_PAGES.find((p) => p.path === path)?.slug ?? "home";
