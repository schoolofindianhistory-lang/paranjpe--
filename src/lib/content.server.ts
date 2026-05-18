import { blogPosts as staticBlogPosts } from "@/data/blogPosts";
import { tours as staticTours } from "@/data/tours";
import {
  findEnquiryCategoryConfig,
  findPreferredContactMethod,
  type ContactEnquiryInput,
} from "@/data/contactEnquiry";
import { siteContact } from "@/data/siteContact";
import {
  staticGalleryItems,
  staticHeroSection,
  staticShopItems,
  staticTeamMembers,
  staticTestimonials,
} from "@/data/staticSiteContent";
import { requireAdmin } from "@/lib/auth.server";
import { getPool } from "@/lib/db.server";
import type {
  AdminDashboardData,
  BlogPost,
  ContentCategory,
  GalleryItem,
  HeroSectionContent,
  ManagedTour,
  PublicSiteContent,
  ShopItem,
  TeamMember,
  Testimonial,
} from "@/lib/content.types";

type GalleryImage = { src: string; alt: string };
type TourItinerary = { time: string; title: string; desc: string };
type TourFaq = { q: string; a: string };
type FetchContentOptions = {
  includeDraftTours?: boolean;
  includeUnpublishedGallery?: boolean;
};

function normalizeTourStatus(value: unknown): "draft" | "published" {
  return String(value || "").trim().toLowerCase() === "draft" ? "draft" : "published";
}

function isPublishedTour(tour: Pick<ManagedTour, "status">) {
  return normalizeTourStatus(tour.status) === "published";
}

function toIsoDateString(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const raw = Buffer.isBuffer(value) ? value.toString("utf8").trim() : String(value).trim();
  if (!raw) {
    return undefined;
  }

  const match = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) {
    return match[1];
  }

  const parsedDate = new Date(raw);
  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export type LegacyContentType = "tour" | "blog" | "testimonial" | "shop";

const legacyContentTypes: LegacyContentType[] = ["tour", "blog", "testimonial", "shop"];

function normalizeOverlayOpacity(value: unknown, fallback = 0.35) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(0.9, Math.max(0, Math.round(numeric * 100) / 100));
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseJsonColumn<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  if (Buffer.isBuffer(value)) {
    try {
      return JSON.parse(value.toString("utf8")) as T;
    } catch {
      return fallback;
    }
  }

  return value as T;
}

function formatDate(dateString: string | Date) {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function mergeBySlug<T extends { slug: string }>(databaseItems: T[], staticItems: T[]) {
  const seen = new Set<string>();
  const merged: T[] = [];

  for (const item of [...databaseItems, ...staticItems]) {
    const key = item.slug.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    merged.push(item);
  }

  return merged;
}

function buildStaticCategories() {
  const unique = new Map<string, ContentCategory>();

  for (const tour of staticTours) {
    const name = tour.category.trim();
    if (!name) {
      continue;
    }

    const slug = slugify(name);
    if (!unique.has(slug)) {
      unique.set(slug, {
        id: -1 * (unique.size + 1),
        name,
        slug,
        description: "",
        source: "static",
      });
    }
  }

  return [...unique.values()];
}

function mapTourRow(row: any): ManagedTour {
  const mainImage = String(row.image || "");
  const gallery = parseJsonColumn<GalleryImage[]>(row.gallery_json, []);
  const resolvedGallery =
    gallery.length > 0
      ? gallery
      : mainImage
        ? [{ src: mainImage, alt: String(row.title || "") }]
        : [];

  return {
    id: Number(row.id),
    categoryId: row.category_id ? Number(row.category_id) : undefined,
    slug: String(row.slug),
    title: String(row.title),
    category: String(row.category_name || row.category_label || ""),
    location: String(row.location || ""),
    duration: String(row.duration || ""),
    tourDate: toIsoDateString(row.tour_date_value ?? row.tour_date),
    tourDateLabel: String(row.tour_date_label || "").trim() || undefined,
    bookingUrl: String(row.booking_url || "").trim() || undefined,
    status: normalizeTourStatus(row.status),
    difficulty: String(row.difficulty || ""),
    bestFor: String(row.best_for || ""),
    bestSeason: String(row.best_season || ""),
    groupSize: String(row.group_size || ""),
    price: String(row.price || ""),
    image: mainImage,
    gallery: resolvedGallery,
    short: String(row.short_description || ""),
    overview: String(row.overview || ""),
    history: String(row.history || ""),
    highlights: parseJsonColumn<string[]>(row.highlights_json, []),
    itinerary: parseJsonColumn<TourItinerary[]>(row.itinerary_json, []),
    inclusions: parseJsonColumn<string[]>(row.inclusions_json, []),
    exclusions: parseJsonColumn<string[]>(row.exclusions_json, []),
    carry: parseJsonColumn<string[]>(row.carry_json, []),
    whoCanJoin: String(row.who_can_join || ""),
    faqs: parseJsonColumn<TourFaq[]>(row.faqs_json, []),
    notes: parseJsonColumn<string[] | null>(row.notes_json, null) ?? undefined,
    source: "database",
  };
}

function mapBlogRow(row: any): BlogPost {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    date: formatDate(row.published_on),
    category: String(row.category),
    excerpt: String(row.excerpt),
    content: String(row.content || ""),
    image: String(row.image || ""),
    source: "database",
  };
}

function mapShopRow(row: any): ShopItem {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    image: String(row.image || ""),
    badge: String(row.badge || ""),
    category: String(row.category || ""),
    title: String(row.title || ""),
    price: String(row.price || ""),
    description: String(row.description || ""),
    source: "database",
  };
}

function mapGalleryRow(row: any): GalleryItem {
  return {
    id: Number(row.id),
    slug: String(row.slug || ""),
    title: String(row.title || ""),
    image: String(row.image || ""),
    description: String(row.description || ""),
    sortOrder: Number(row.sort_order ?? 100),
    isPublished: Number(row.is_published ?? 1) === 1,
    source: "database",
  };
}

function mapTestimonialRow(row: any): Testimonial {
  return {
    id: Number(row.id),
    name: String(row.name || ""),
    role: String(row.role || ""),
    text: String(row.text || ""),
    source: "database",
  };
}

function mapTeamMemberRow(row: any): TeamMember {
  return {
    id: Number(row.id),
    slug: String(row.slug || ""),
    name: String(row.name || ""),
    role: String(row.role || ""),
    description: String(row.description || ""),
    source: "database",
  };
}

function mapCategoryRow(row: any): ContentCategory {
  return {
    id: Number(row.id),
    name: String(row.name || ""),
    slug: String(row.slug || ""),
    description: String(row.description || ""),
    source: "database",
  };
}

function mapHeroSectionRow(row: any): HeroSectionContent {
  return {
    desktopImage: String(row.desktop_image || "").trim(),
    mobileImage: String(row.mobile_image || "").trim() || undefined,
    heading: String(row.heading || "").trim(),
    subheading: String(row.subheading || "").trim(),
    ctaText: String(row.cta_text || "").trim(),
    ctaLink: String(row.cta_link || "").trim(),
    overlayOpacity: normalizeOverlayOpacity(row.overlay_opacity, staticHeroSection.overlayOpacity),
    source: "database",
  };
}

function mapStaticTour(tour: (typeof staticTours)[number]): ManagedTour {
  return {
    ...tour,
    status: normalizeTourStatus(tour.status),
    source: "static" as const,
  };
}

function findStaticTourBySlug(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  return staticTours.find((tour) => tour.slug.toLowerCase() === normalizedSlug);
}

function normalizeLegacyKey(value: string) {
  return slugify(value);
}

function getLegacyTourKey(tour: { slug: string }) {
  return normalizeLegacyKey(tour.slug);
}

function getLegacyBlogKey(post: { slug: string }) {
  return normalizeLegacyKey(post.slug);
}

function getLegacyShopKey(item: { slug: string }) {
  return normalizeLegacyKey(item.slug);
}

function getLegacyTestimonialKey(item: { name: string; role: string; text: string }) {
  return normalizeLegacyKey(`${item.name}-${item.role || item.text.slice(0, 48)}`);
}

function createHiddenLegacyMap() {
  return {
    tour: new Set<string>(),
    blog: new Set<string>(),
    testimonial: new Set<string>(),
    shop: new Set<string>(),
  };
}

function mapHiddenLegacyRows(rows: Array<{ content_type?: unknown; legacy_key?: unknown }>) {
  const hidden = createHiddenLegacyMap();

  for (const row of rows) {
    const contentType = String(row.content_type || "") as LegacyContentType;
    const legacyKey = normalizeLegacyKey(String(row.legacy_key || ""));

    if (!legacyKey || !legacyContentTypes.includes(contentType)) {
      continue;
    }

    hidden[contentType].add(legacyKey);
  }

  return hidden;
}

function hideLegacyContentInPool(
  pool: Awaited<ReturnType<typeof getPool>>,
  type: LegacyContentType,
  legacyKey?: string,
) {
  const normalizedKey = normalizeLegacyKey(legacyKey?.trim() ?? "");
  if (!normalizedKey) {
    return Promise.resolve();
  }

  return pool.execute(
    `
      INSERT INTO legacy_content_visibility (content_type, legacy_key, hidden)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE hidden = VALUES(hidden)
    `,
    [type, normalizedKey],
  );
}

export async function fetchPublicSiteContent(
  options: FetchContentOptions = {},
): Promise<PublicSiteContent> {
  const includeDraftTours = Boolean(options.includeDraftTours);
  const includeUnpublishedGallery = Boolean(options.includeUnpublishedGallery);

  try {
    const pool = await getPool();
    const [tourRows] = await pool.query<any[]>(`
      SELECT
        cms_tours.*,
        DATE_FORMAT(cms_tours.tour_date, '%Y-%m-%d') AS tour_date_value,
        categories.name AS category_name
      FROM cms_tours
      LEFT JOIN categories ON categories.id = cms_tours.category_id
      ORDER BY cms_tours.updated_at DESC, cms_tours.id DESC
    `);
    const [blogRows] = await pool.query<any[]>(
      "SELECT * FROM blogs ORDER BY published_on DESC, id DESC",
    );
    const [testimonialRows] = await pool.query<any[]>(
      "SELECT * FROM cms_testimonials ORDER BY updated_at DESC, id DESC",
    );
    const [teamMemberRows] = await pool.query<any[]>(
      "SELECT * FROM about_team_members ORDER BY updated_at DESC, id DESC",
    );
    const [shopRows] = await pool.query<any[]>(
      "SELECT * FROM shop_items ORDER BY updated_at DESC, id DESC",
    );
    const [galleryRows] = await pool.query<any[]>(
      "SELECT * FROM cms_gallery_items ORDER BY sort_order ASC, updated_at DESC, id DESC",
    );
    const [heroRows] = await pool.query<any[]>(
      "SELECT * FROM cms_hero_section_settings ORDER BY updated_at DESC, id DESC LIMIT 1",
    );
    const [categoryRows] = await pool.query<any[]>(
      "SELECT * FROM categories ORDER BY name ASC",
    );
    const [legacyVisibilityRows] = await pool.query<any[]>(
      "SELECT content_type, legacy_key FROM legacy_content_visibility WHERE hidden = 1",
    );

    const databaseTours = tourRows.map(mapTourRow);
    const databaseBlogs = blogRows.map(mapBlogRow);
    const databaseTestimonials = testimonialRows.map(mapTestimonialRow);
    const databaseTeamMembers = teamMemberRows.map(mapTeamMemberRow);
    const databaseShopItems = shopRows.map(mapShopRow);
    const databaseGalleryItems = galleryRows.map(mapGalleryRow);
    const databaseHeroSection = heroRows.length > 0 ? mapHeroSectionRow(heroRows[0]) : undefined;
    const databaseCategories = categoryRows.map(mapCategoryRow);
    const staticCategories = buildStaticCategories();
    const hiddenLegacyItems = mapHiddenLegacyRows(legacyVisibilityRows);
    const visibleStaticTours = staticTours
      .map((tour) => ({
        ...mapStaticTour(tour),
        legacyKey: getLegacyTourKey(tour),
      }))
      .filter((tour) => !hiddenLegacyItems.tour.has(tour.legacyKey));
    const visibleStaticBlogs = staticBlogPosts
      .map((post) => ({
        ...post,
        legacyKey: getLegacyBlogKey(post),
        source: "static" as const,
      }))
      .filter((post) => !hiddenLegacyItems.blog.has(post.legacyKey));
    const visibleStaticTestimonials = staticTestimonials
      .map((item) => ({
        ...item,
        legacyKey: getLegacyTestimonialKey(item),
      }))
      .filter((item) => !hiddenLegacyItems.testimonial.has(item.legacyKey));
    const visibleStaticShopItems = staticShopItems
      .map((item) => ({
        ...item,
        legacyKey: getLegacyShopKey(item),
      }))
      .filter((item) => !hiddenLegacyItems.shop.has(item.legacyKey));
    const mergedTours = mergeBySlug(databaseTours, visibleStaticTours);
    const mergedGalleryItems = mergeBySlug(databaseGalleryItems, staticGalleryItems);
    const resolvedHeroSection: HeroSectionContent = databaseHeroSection
      ? {
          ...staticHeroSection,
          ...databaseHeroSection,
          desktopImage: databaseHeroSection.desktopImage || staticHeroSection.desktopImage,
          heading: databaseHeroSection.heading || staticHeroSection.heading,
          subheading: databaseHeroSection.subheading || staticHeroSection.subheading,
          ctaText: databaseHeroSection.ctaText || staticHeroSection.ctaText,
          ctaLink: databaseHeroSection.ctaLink || staticHeroSection.ctaLink,
          source: "database",
        }
      : staticHeroSection;

    return {
      tours: includeDraftTours ? mergedTours : mergedTours.filter(isPublishedTour),
      blogPosts: mergeBySlug(databaseBlogs, visibleStaticBlogs),
      testimonials: [...databaseTestimonials, ...visibleStaticTestimonials],
      teamMembers: mergeBySlug(databaseTeamMembers, staticTeamMembers),
      shopItems: mergeBySlug(databaseShopItems, visibleStaticShopItems),
      galleryItems: includeUnpublishedGallery
        ? mergedGalleryItems
        : mergedGalleryItems.filter((item) => item.isPublished),
      heroSection: resolvedHeroSection,
      categories: mergeBySlug(databaseCategories, staticCategories),
      databaseAvailable: true,
    };
  } catch (error) {
    console.error("Unable to load MySQL content, falling back to static content.", error);
    const staticToursWithSource = staticTours.map((tour) => ({
      ...mapStaticTour(tour),
      legacyKey: getLegacyTourKey(tour),
    }));
    const staticBlogsWithSource = staticBlogPosts.map((post) => ({
      ...post,
      legacyKey: getLegacyBlogKey(post),
      source: "static" as const,
    }));
    const staticTestimonialsWithLegacy = staticTestimonials.map((item) => ({
      ...item,
      legacyKey: getLegacyTestimonialKey(item),
    }));
    const staticShopItemsWithLegacy = staticShopItems.map((item) => ({
      ...item,
      legacyKey: getLegacyShopKey(item),
    }));

    return {
      tours: includeDraftTours
        ? staticToursWithSource
        : staticToursWithSource.filter(isPublishedTour),
      blogPosts: staticBlogsWithSource,
      testimonials: staticTestimonialsWithLegacy,
      teamMembers: staticTeamMembers,
      shopItems: staticShopItemsWithLegacy,
      galleryItems: includeUnpublishedGallery
        ? staticGalleryItems
        : staticGalleryItems.filter((item) => item.isPublished),
      heroSection: staticHeroSection,
      categories: buildStaticCategories(),
      databaseAvailable: false,
    };
  }
}

export async function fetchAdminDashboardData(): Promise<AdminDashboardData> {
  const admin = await requireAdmin({ redirectTo: "/admin/login" });
  const content = await fetchPublicSiteContent({
    includeDraftTours: true,
    includeUnpublishedGallery: true,
  });
  return { ...content, admin };
}

export type SaveCategoryInput = {
  id?: number;
  name: string;
  slug?: string;
  description?: string;
};

export type SaveTourInput = {
  id?: number;
  legacyKey?: string;
  slug?: string;
  title: string;
  status?: "draft" | "published";
  categoryId?: number;
  categoryLabel?: string;
  location?: string;
  duration?: string;
  tourDate?: string;
  tourDateLabel?: string;
  bookingUrl?: string;
  difficulty?: string;
  bestFor?: string;
  bestSeason?: string;
  groupSize?: string;
  price?: string;
  image?: string;
  gallery?: GalleryImage[];
  short?: string;
  overview?: string;
  history?: string;
  highlights?: string[];
  itinerary?: TourItinerary[];
  inclusions?: string[];
  exclusions?: string[];
  carry?: string[];
  whoCanJoin?: string;
  faqs?: TourFaq[];
  notes?: string[];
};

export type SaveHeroSectionInput = {
  desktopImage?: string;
  mobileImage?: string;
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  overlayOpacity?: number;
};

export type SaveGalleryItemInput = {
  id?: number;
  slug?: string;
  title: string;
  image?: string;
  description?: string;
  sortOrder?: number;
  isPublished?: boolean;
};

export type SaveTestimonialInput = {
  id?: number;
  legacyKey?: string;
  name: string;
  role: string;
  text: string;
};

export type SaveTeamMemberInput = {
  id?: number;
  slug?: string;
  name: string;
  role?: string;
  description?: string;
};

export type SaveShopItemInput = {
  id?: number;
  legacyKey?: string;
  slug?: string;
  title: string;
  category: string;
  badge?: string;
  price?: string;
  description?: string;
  image?: string;
};

export type SaveBlogPostInput = {
  id?: number;
  legacyKey?: string;
  slug?: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  image?: string;
  publishedOn?: string;
};

type NormalizedContactEnquiryInput = ReturnType<typeof normalizeContactEnquiryInput>;

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function countPhoneDigits(value: string) {
  return value.replace(/\D/g, "").length;
}

function normalizeContactEnquiryInput(input: ContactEnquiryInput) {
  const category = findEnquiryCategoryConfig(input.categoryValue);
  if (!category) {
    throw new Error("Please choose a valid enquiry category.");
  }

  const preferredContactMethod = findPreferredContactMethod(input.preferredContactMethod);
  if (!preferredContactMethod) {
    throw new Error("Please choose how you would like us to contact you.");
  }

  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const organizationName = input.organizationName.trim();
  const subject = input.subject.trim();
  const scheduleDetails = input.scheduleDetails.trim();
  const groupDetails = input.groupDetails.trim();
  const locationDetails = input.locationDetails.trim();
  const message = input.message.trim();

  if (fullName.length < 2) {
    throw new Error("Please enter your full name.");
  }

  if (!looksLikeEmail(email)) {
    throw new Error("Please enter a valid email address.");
  }

  if (phone.length > 0 && countPhoneDigits(phone) < 8) {
    throw new Error("Please enter a valid phone or WhatsApp number.");
  }

  if (category.organizationRequired && organizationName.length < 2) {
    throw new Error(`Please enter your ${category.organizationLabel.toLowerCase()}.`);
  }

  if (subject.length < 3) {
    throw new Error(`Please enter your ${category.subjectLabel.toLowerCase()}.`);
  }

  if (scheduleDetails.length < 3) {
    throw new Error(`Please enter your ${category.scheduleLabel.toLowerCase()}.`);
  }

  if (groupDetails.length < 1) {
    throw new Error(`Please enter your ${category.groupLabel.toLowerCase()}.`);
  }

  if (locationDetails.length < 2) {
    throw new Error(`Please enter your ${category.locationLabel.toLowerCase()}.`);
  }

  if (message.length < 12) {
    throw new Error("Please share a few more details so we can guide you properly.");
  }

  return {
    category,
    preferredContactMethod,
    fullName,
    email,
    phone,
    organizationName,
    subject,
    scheduleDetails,
    groupDetails,
    locationDetails,
    message,
  };
}

function getWeb3FormsAccessKey() {
  return (process.env.WEB3FORMS_ACCESS_KEY ?? process.env.VITE_WEB3FORMS_ACCESS_KEY ?? "").trim();
}

function buildContactEnquiryEmailPayload(normalized: NormalizedContactEnquiryInput) {
  return {
    access_key: getWeb3FormsAccessKey(),
    subject: `New Paranjape Tours enquiry from ${normalized.fullName}`,
    from_name: "Paranjape Tours Website",
    replyto: normalized.email,
    name: normalized.fullName,
    email: normalized.email,
    phone: normalized.phone || "Not provided",
    enquiry_category: normalized.category.label,
    preferred_contact_method: normalized.preferredContactMethod.label,
    organization_name: normalized.organizationName || "Not provided",
    enquiry_subject: normalized.subject,
    schedule_details: normalized.scheduleDetails,
    group_details: normalized.groupDetails,
    location_details: normalized.locationDetails,
    message: normalized.message,
  };
}

async function sendContactEnquiryEmail(normalized: NormalizedContactEnquiryInput) {
  const accessKey = getWeb3FormsAccessKey();
  if (!accessKey) {
    return { skipped: true };
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(buildContactEnquiryEmailPayload(normalized)),
  });

  const result = await response.json().catch(() => null);
  const message =
    result?.message ??
    result?.body?.message ??
    "We couldn't send your enquiry email right now.";

  if (!response.ok || result?.success === false) {
    throw new Error(message);
  }

  return result;
}

async function getCategoryLabel(categoryId?: number) {
  if (!categoryId) {
    return "";
  }

  const pool = await getPool();
  const [rows] = await pool.execute<any[]>(
    "SELECT name FROM categories WHERE id = ? LIMIT 1",
    [categoryId],
  );

  if (!rows.length) {
    throw new Error("Selected category does not exist anymore.");
  }

  return String(rows[0].name);
}

export async function upsertCategory(input: SaveCategoryInput) {
  await requireAdmin();
  const pool = await getPool();

  const name = input.name.trim();
  const slug = slugify(input.slug?.trim() || name);
  const description = input.description?.trim() ?? "";

  if (!name) {
    throw new Error("Category name is required.");
  }

  if (!slug) {
    throw new Error("Category slug is required.");
  }

  if (input.id) {
    await pool.execute(
      "UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?",
      [name, slug, description, input.id],
    );
  } else {
    await pool.execute(
      "INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)",
      [name, slug, description],
    );
  }
}

export async function deleteCategoryById(id: number) {
  await requireAdmin();
  const pool = await getPool();
  const [rows] = await pool.execute<any[]>(
    "SELECT COUNT(*) AS count FROM cms_tours WHERE category_id = ?",
    [id],
  );

  if (Number(rows[0]?.count ?? 0) > 0) {
    throw new Error("This category is used by a tour. Update the tour first, then delete the category.");
  }

  await pool.execute("DELETE FROM categories WHERE id = ?", [id]);
}

export async function upsertTour(input: SaveTourInput) {
  await requireAdmin();
  const pool = await getPool();

  const title = input.title.trim();
  const slug = slugify(input.slug?.trim() || title);

  if (!title) {
    throw new Error("Tour title is required.");
  }

  if (!slug) {
    throw new Error("Tour slug is required.");
  }

  const dbCategoryLabel = await getCategoryLabel(input.categoryId);
  const finalCategoryLabel = input.categoryId ? dbCategoryLabel : (input.categoryLabel?.trim() ?? "");
  const image = input.image?.trim() ?? "";
  const gallery = input.gallery?.filter((item) => item.src.trim()) ?? [];
  const normalizedTourDate = toIsoDateString(input.tourDate?.trim()) ?? null;
  const normalizedTourDateLabel = input.tourDateLabel?.trim() || null;
  const normalizedBookingUrl = input.bookingUrl?.trim() ?? "";
  const normalizedStatus = normalizeTourStatus(input.status);

  const values = [
    slug,
    title,
    normalizedStatus,
    input.categoryId ?? null,
    finalCategoryLabel,
    input.location?.trim() ?? "",
    input.duration?.trim() ?? "",
    normalizedTourDate,
    normalizedTourDateLabel,
    normalizedBookingUrl,
    input.difficulty?.trim() ?? "",
    input.bestFor?.trim() ?? "",
    input.bestSeason?.trim() ?? "",
    input.groupSize?.trim() ?? "",
    input.price?.trim() ?? "",
    image,
    JSON.stringify(gallery),
    input.short?.trim() ?? "",
    input.overview?.trim() ?? "",
    input.history?.trim() ?? "",
    JSON.stringify(input.highlights ?? []),
    JSON.stringify(input.itinerary ?? []),
    JSON.stringify(input.inclusions ?? []),
    JSON.stringify(input.exclusions ?? []),
    JSON.stringify(input.carry ?? []),
    input.whoCanJoin?.trim() ?? "",
    JSON.stringify(input.faqs ?? []),
    JSON.stringify(input.notes?.length ? input.notes : null),
  ];

  if (input.id) {
    await pool.execute(
      `
        UPDATE cms_tours
        SET
          slug = ?,
          title = ?,
          status = ?,
          category_id = ?,
          category_label = ?,
          location = ?,
          duration = ?,
          tour_date = ?,
          tour_date_label = ?,
          booking_url = ?,
          difficulty = ?,
          best_for = ?,
          best_season = ?,
          group_size = ?,
          price = ?,
          image = ?,
          gallery_json = ?,
          short_description = ?,
          overview = ?,
          history = ?,
          highlights_json = ?,
          itinerary_json = ?,
          inclusions_json = ?,
          exclusions_json = ?,
          carry_json = ?,
          who_can_join = ?,
          faqs_json = ?,
          notes_json = ?
        WHERE id = ?
      `,
      [...values, input.id],
    );
  } else {
    await pool.execute(
      `
        INSERT INTO cms_tours (
          slug,
          title,
          status,
          category_id,
          category_label,
          location,
          duration,
          tour_date,
          tour_date_label,
          booking_url,
          difficulty,
          best_for,
          best_season,
          group_size,
          price,
          image,
          gallery_json,
          short_description,
          overview,
          history,
          highlights_json,
          itinerary_json,
          inclusions_json,
          exclusions_json,
          carry_json,
          who_can_join,
          faqs_json,
          notes_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values,
    );
  }

  await hideLegacyContentInPool(pool, "tour", input.legacyKey);
}

export async function deleteTourById(id: number) {
  await requireAdmin();
  const pool = await getPool();
  await pool.execute("DELETE FROM cms_tours WHERE id = ?", [id]);
}

export async function upsertHeroSection(input: SaveHeroSectionInput) {
  await requireAdmin();
  const pool = await getPool();

  const [rows] = await pool.query<any[]>(
    "SELECT * FROM cms_hero_section_settings ORDER BY updated_at DESC, id DESC LIMIT 1",
  );
  const existingRow = rows[0];
  const existingHero = existingRow ? mapHeroSectionRow(existingRow) : staticHeroSection;

  const desktopImage = input.desktopImage?.trim() ?? "";
  const mobileImage = input.mobileImage?.trim() || null;
  const heading = input.heading?.trim() || existingHero.heading || staticHeroSection.heading;
  const subheading =
    input.subheading?.trim() || existingHero.subheading || staticHeroSection.subheading;
  const ctaText = input.ctaText?.trim() || existingHero.ctaText || staticHeroSection.ctaText;
  const ctaLink = input.ctaLink?.trim() || existingHero.ctaLink || staticHeroSection.ctaLink;
  const overlayOpacity = normalizeOverlayOpacity(
    input.overlayOpacity,
    existingHero.overlayOpacity ?? staticHeroSection.overlayOpacity,
  );

  const values = [desktopImage, mobileImage, heading, subheading, ctaText, ctaLink, overlayOpacity];

  if (existingRow) {
    await pool.execute(
      `
        UPDATE cms_hero_section_settings
        SET
          desktop_image = ?,
          mobile_image = ?,
          heading = ?,
          subheading = ?,
          cta_text = ?,
          cta_link = ?,
          overlay_opacity = ?
        WHERE id = ?
      `,
      [...values, Number(existingRow.id)],
    );
    return;
  }

  await pool.execute(
    `
      INSERT INTO cms_hero_section_settings (
        desktop_image,
        mobile_image,
        heading,
        subheading,
        cta_text,
        cta_link,
        overlay_opacity
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    values,
  );
}

export async function upsertTestimonial(input: SaveTestimonialInput) {
  await requireAdmin();
  const pool = await getPool();
  const name = input.name.trim();
  const role = input.role.trim();
  const text = input.text.trim();

  if (!name || !text) {
    throw new Error("Testimonial name and text are required.");
  }

  if (input.id) {
    await pool.execute(
      "UPDATE cms_testimonials SET name = ?, role = ?, text = ? WHERE id = ?",
      [name, role, text, input.id],
    );
  } else {
    await pool.execute(
      "INSERT INTO cms_testimonials (name, role, text) VALUES (?, ?, ?)",
      [name, role, text],
    );
  }

  await hideLegacyContentInPool(pool, "testimonial", input.legacyKey);
}

export async function deleteTestimonialById(id: number) {
  await requireAdmin();
  const pool = await getPool();
  await pool.execute("DELETE FROM cms_testimonials WHERE id = ?", [id]);
}

export async function upsertTeamMember(input: SaveTeamMemberInput) {
  await requireAdmin();
  const pool = await getPool();
  const name = input.name.trim();
  const slug = slugify(input.slug?.trim() || name);
  const role = input.role?.trim() ?? "";
  const description = input.description?.trim() ?? "";

  if (!name) {
    throw new Error("Team member name is required.");
  }

  if (!slug) {
    throw new Error("Team member slug is required.");
  }

  if (input.id) {
    await pool.execute(
      "UPDATE about_team_members SET slug = ?, name = ?, role = ?, description = ? WHERE id = ?",
      [slug, name, role, description, input.id],
    );
  } else {
    await pool.execute(
      "INSERT INTO about_team_members (slug, name, role, description) VALUES (?, ?, ?, ?)",
      [slug, name, role, description],
    );
  }
}

export async function fetchPublicTourBySlug(slug: string): Promise<ManagedTour | undefined> {
  const staticTour = findStaticTourBySlug(slug);

  try {
    const pool = await getPool();
    const [rows] = await pool.execute<any[]>(
      `
        SELECT
          cms_tours.*,
          DATE_FORMAT(cms_tours.tour_date, '%Y-%m-%d') AS tour_date_value,
          categories.name AS category_name
        FROM cms_tours
        LEFT JOIN categories ON categories.id = cms_tours.category_id
        WHERE LOWER(cms_tours.slug) = ?
        LIMIT 1
      `,
      [slug.trim().toLowerCase()],
    );

    if (rows.length > 0) {
      const mappedTour = mapTourRow(rows[0]);
      if (!isPublishedTour(mappedTour)) {
        return undefined;
      }
      return mappedTour;
    }
  } catch (error) {
    console.error(`Unable to load tour "${slug}" from MySQL, falling back to static content.`, error);
  }

  if (!staticTour) {
    return undefined;
  }

  const mappedStaticTour = mapStaticTour(staticTour);
  return isPublishedTour(mappedStaticTour) ? mappedStaticTour : undefined;
}

export async function deleteTeamMemberById(id: number) {
  await requireAdmin();
  const pool = await getPool();
  await pool.execute("DELETE FROM about_team_members WHERE id = ?", [id]);
}

export async function upsertShopItem(input: SaveShopItemInput) {
  await requireAdmin();
  const pool = await getPool();
  const title = input.title.trim();
  const slug = slugify(input.slug?.trim() || title);

  if (!title || !slug) {
    throw new Error("Shop item title is required.");
  }

  const values = [
    slug,
    title,
    input.category.trim(),
    input.badge?.trim() ?? "",
    input.price?.trim() ?? "",
    input.description?.trim() ?? "",
    input.image?.trim() ?? "",
  ];

  if (input.id) {
    await pool.execute(
      `
        UPDATE shop_items
        SET
          slug = ?,
          title = ?,
          category = ?,
          badge = ?,
          price = ?,
          description = ?,
          image = ?
        WHERE id = ?
      `,
      [...values, input.id],
    );
  } else {
    await pool.execute(
      `
        INSERT INTO shop_items (slug, title, category, badge, price, description, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      values,
    );
  }

  await hideLegacyContentInPool(pool, "shop", input.legacyKey);
}

export async function deleteShopItemById(id: number) {
  await requireAdmin();
  const pool = await getPool();
  await pool.execute("DELETE FROM shop_items WHERE id = ?", [id]);
}

export async function upsertGalleryItem(input: SaveGalleryItemInput) {
  await requireAdmin();
  const pool = await getPool();
  const title = input.title.trim();
  const slug = slugify(input.slug?.trim() || title);

  if (!title || !slug) {
    throw new Error("Gallery item title is required.");
  }

  const values = [
    slug,
    title,
    input.image?.trim() ?? "",
    input.description?.trim() ?? "",
    Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 100,
    input.isPublished === false ? 0 : 1,
  ];

  if (input.id) {
    await pool.execute(
      `
        UPDATE cms_gallery_items
        SET
          slug = ?,
          title = ?,
          image = ?,
          description = ?,
          sort_order = ?,
          is_published = ?
        WHERE id = ?
      `,
      [...values, input.id],
    );
  } else {
    await pool.execute(
      `
        INSERT INTO cms_gallery_items (slug, title, image, description, sort_order, is_published)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      values,
    );
  }
}

export async function deleteGalleryItemById(id: number) {
  await requireAdmin();
  const pool = await getPool();
  await pool.execute("DELETE FROM cms_gallery_items WHERE id = ?", [id]);
}

export async function upsertBlogPost(input: SaveBlogPostInput) {
  await requireAdmin();
  const pool = await getPool();
  const title = input.title.trim();
  const slug = slugify(input.slug?.trim() || title);

  if (!title || !slug) {
    throw new Error("Blog title is required.");
  }

  const publishedOn = input.publishedOn?.trim() || new Date().toISOString().slice(0, 10);
  const values = [
    slug,
    title,
    input.category.trim(),
    input.excerpt.trim(),
    input.content?.trim() ?? "",
    input.image?.trim() ?? "",
    publishedOn,
  ];

  if (input.id) {
    await pool.execute(
      `
        UPDATE blogs
        SET slug = ?, title = ?, category = ?, excerpt = ?, content = ?, image = ?, published_on = ?
        WHERE id = ?
      `,
      [...values, input.id],
    );
  } else {
    await pool.execute(
      "INSERT INTO blogs (slug, title, category, excerpt, content, image, published_on) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values,
    );
  }

  await hideLegacyContentInPool(pool, "blog", input.legacyKey);
}

export async function deleteBlogPostById(id: number) {
  await requireAdmin();
  const pool = await getPool();
  await pool.execute("DELETE FROM blogs WHERE id = ?", [id]);
}

export async function hideLegacyContent(input: { type: LegacyContentType; legacyKey: string }) {
  await requireAdmin();

  if (!legacyContentTypes.includes(input.type)) {
    throw new Error("Unsupported legacy content type.");
  }

  const pool = await getPool();
  await hideLegacyContentInPool(pool, input.type, input.legacyKey);
}

async function createContactEnquiryRecord(normalized: NormalizedContactEnquiryInput) {
  try {
    const pool = await getPool();
    const [result] = await pool.execute<any>(
      `
        INSERT INTO contact_enquiries (
          category_value,
          category_label,
          full_name,
          email,
          phone,
          preferred_contact_method,
          organization_name,
          subject,
          schedule_details,
          group_details,
          location_details,
          message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        normalized.category.value,
        normalized.category.label,
        normalized.fullName,
        normalized.email,
        normalized.phone,
        normalized.preferredContactMethod.value,
        normalized.organizationName,
        normalized.subject,
        normalized.scheduleDetails,
        normalized.groupDetails,
        normalized.locationDetails,
        normalized.message,
      ],
    );

    return {
      success: true,
      enquiryId: Number(result?.insertId ?? 0),
      categoryLabel: normalized.category.label,
    };
  } catch (error) {
    console.error("Unable to save contact enquiry.", error);
    throw new Error(
      `We couldn't save your enquiry right now. Please email ${siteContact.email} or call ${siteContact.primaryPhone}.`,
    );
  }
}

export async function createContactEnquiry(input: ContactEnquiryInput) {
  return createContactEnquiryRecord(normalizeContactEnquiryInput(input));
}

export async function submitPublicContactEnquiry(input: ContactEnquiryInput) {
  const normalized = normalizeContactEnquiryInput(input);
  const [databaseResult, emailResult] = await Promise.allSettled([
    createContactEnquiryRecord(normalized),
    sendContactEnquiryEmail(normalized),
  ]);

  const savedToDatabase = databaseResult.status === "fulfilled";
  const sentToEmail =
    emailResult.status === "fulfilled" &&
    !(typeof emailResult.value === "object" && emailResult.value?.skipped);

  if (!savedToDatabase && !sentToEmail) {
    const databaseMessage =
      databaseResult.status === "rejected"
        ? databaseResult.reason instanceof Error
          ? databaseResult.reason.message
          : "We couldn't save your enquiry."
        : "";
    const emailMessage =
      emailResult.status === "rejected"
        ? emailResult.reason instanceof Error
          ? emailResult.reason.message
          : "We couldn't send your enquiry email."
        : "";

    throw new Error(emailMessage || databaseMessage || "We couldn't submit your enquiry right now.");
  }

  return {
    success: true,
    savedToDatabase,
    sentToEmail,
    enquiryId: databaseResult.status === "fulfilled" ? Number(databaseResult.value?.enquiryId ?? 0) : 0,
  };
}
