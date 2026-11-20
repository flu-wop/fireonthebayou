/** Admin sections shown as cards on the Overview ("Go to"). Plain module so server pages can import it. */
export type AdminSection = { href: string; title: string; desc: string; owner?: boolean };

export const ADMIN_SECTIONS: AdminSection[] = [
  { href: "/admin/content/project", title: "Projects", desc: "The 89 films: tags, videos, featured." },
  { href: "/admin/content/testimonial", title: "Testimonials", desc: "Nine video slots." },
  { href: "/admin/content/client", title: "Clients & logos", desc: "Home banner and Studio wall." },
  { href: "/admin/content/crew", title: "Crew", desc: "Names, roles and bios." },
  { href: "/admin/content/service", title: "Services", desc: "What we make." },
  { href: "/admin/content/process_step", title: "Process", desc: "The five steps." },
  { href: "/admin/content/post_step", title: "Post-Production", desc: "The Post-Production tab." },
  { href: "/admin/content/faq", title: "FAQ", desc: "Working-with-us questions." },
  { href: "/admin/placeholders", title: "Placeholders", desc: "Empty slots, with upload buttons." },
  { href: "/admin/media", title: "Media library", desc: "Uploads and alt text." },
  { href: "/admin/seo", title: "SEO", desc: "Titles, descriptions, link previews." },
  { href: "/admin/settings", title: "Settings", desc: "Tagline, hero, contact, socials." },
  { href: "/admin/taxonomy", title: "Formats & industries", desc: "The filter chips." },
  { href: "/admin/history", title: "History", desc: "Every change, with revert." },
  { href: "/admin/system", title: "System health", desc: "Database, storage, Mailchimp." },
];
