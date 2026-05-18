import type { Tour } from "@/data/tours";

export type ManagedTour = Tour & {
  id?: number;
  categoryId?: number;
  legacyKey?: string;
  source?: "database" | "static";
};

export type ContentCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  source?: "database" | "static";
};

export type BlogPost = {
  id?: number;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content?: string;
  image: string;
  legacyKey?: string;
  sourceName?: string;
  sourceUrl?: string;
  source?: "database" | "static";
};

export type Testimonial = {
  id?: number;
  name: string;
  role: string;
  text: string;
  legacyKey?: string;
  source?: "database" | "static";
};

export type TeamMember = {
  id?: number;
  slug: string;
  name: string;
  role: string;
  description: string;
  source?: "database" | "static";
};

export type ShopItem = {
  id?: number;
  slug: string;
  image: string;
  badge: string;
  category: string;
  title: string;
  price: string;
  description: string;
  legacyKey?: string;
  source?: "database" | "static";
};

export type GalleryItem = {
  id?: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  sortOrder: number;
  isPublished: boolean;
  source?: "database" | "static";
};

export type HeroSectionContent = {
  desktopImage: string;
  mobileImage?: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  overlayOpacity: number;
  source?: "database" | "static";
};

export type AdminUser = {
  id: number;
  username: string;
  displayName: string;
};

export type PublicSiteContent = {
  tours: ManagedTour[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  teamMembers: TeamMember[];
  shopItems: ShopItem[];
  galleryItems: GalleryItem[];
  heroSection: HeroSectionContent;
  categories: ContentCategory[];
  databaseAvailable: boolean;
};

export type AdminDashboardData = PublicSiteContent & {
  admin: AdminUser;
};
