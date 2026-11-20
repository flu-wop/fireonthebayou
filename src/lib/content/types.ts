export type Kind =
  | "project"
  | "testimonial"
  | "client"
  | "crew"
  | "service"
  | "process_step"
  | "post_step"
  | "faq"
  | "setting"
  | "page_seo";

export type Taxon = { key: string; label: string };
export type Taxonomy = { formats: Taxon[]; industries: Taxon[] };

export type Writeup = {
  category?: "Brand Film" | "Music Video" | "Documentary" | "Commercial";
  year?: string;
  award?: string;
  blurb?: string;
  logline?: string;
  approach?: { heading: string; body: string[]; references?: string[] };
  credits?: { role: string; name: string }[];
  /** YouTube id -> label shown in the screening room's part switcher. */
  filmLabels?: Record<string, string>;
};

export type ProjectData = {
  slug: string;
  title: string;
  client: string;
  industries: string[];
  formats: string[];
  youtubeIds: string[];
  featured: boolean;
  order: number;
  writeup?: Writeup;
};
export type TestimonialData = { client: string; youtubeId: string | null; quote?: string; order: number };
export type ClientData = { name: string; banner: boolean; wall: boolean; order: number };
export type CrewData = { name: string; role: string; note: string; href?: string; order: number };
export type ServiceData = { title: string; blurb: string; capabilities: string[]; order: number };
export type StepData = { title: string; description: string; order: number };
export type FaqData = { q: string; a: string; order: number };
export type PageSeoData = { title?: string; description?: string; ogImage?: string };

export type SiteSettings = {
  tagline: string;
  description: string;
  heroLines: string[];
  heroSub: string;
  heroYoutubeId: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  socials: { instagram: string; youtube: string; facebook: string; linkedin: string };
  founderName: string;
  founderRole: string;
  postHeading: string;
  postIntro: string;
};

export type DataByKind = {
  project: ProjectData;
  testimonial: TestimonialData;
  client: ClientData;
  crew: CrewData;
  service: ServiceData;
  process_step: StepData;
  post_step: StepData;
  faq: FaqData;
  setting: SiteSettings | Taxonomy;
  page_seo: PageSeoData;
};

export type Rec<K extends Kind = Kind> = { key: string; data: DataByKind[K] };
export type DraftRec<K extends Kind = Kind> = Rec<K> & { state: "published" | "edit" | "new" | "delete" };
