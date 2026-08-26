import { createFileRoute, useNavigate, useRouter } from "@/lib/navigation";
import { useEffect, useState, type ChangeEvent } from "react";
import {
  BookOpen,
  Database,
  FolderTree,
  Image as ImageIcon,
  ImagePlus,
  LogOut,
  MessageSquareQuote,
  PencilLine,
  Plus,
  Save,
  ShoppingBag,
  Trash2,
  Map,
  Users,
} from "lucide-react";
import {
  adminTourCategoryPresetSlugs,
  adminTourCategoryPresets,
} from "@/data/adminCategories";
import {
  deleteBlogPost,
  deleteCategory,
  deleteGalleryItem,
  deleteLegacyContent,
  deleteShopItem,
  deleteTeamMember,
  deleteTestimonial,
  deleteTour,
  getAdminDashboardContent,
  logoutAdmin,
  saveBlogPost,
  saveCategory,
  saveGalleryItem,
  saveHeroSection,
  saveShopItem,
  saveTeamMember,
  saveTestimonial,
  saveTour,
} from "@/lib/content.functions";
import type {
  SaveBlogPostInput,
  SaveCategoryInput,
  SaveGalleryItemInput,
  SaveHeroSectionInput,
  SaveShopItemInput,
  SaveTeamMemberInput,
  SaveTestimonialInput,
  SaveTourInput,
} from "@/lib/content.server";
import type {
  BlogPost,
  ContentCategory,
  GalleryItem,
  HeroSectionContent,
  ManagedTour,
  ShopItem,
  TeamMember,
  Testimonial,
} from "@/lib/content.types";

export const Route = createFileRoute("/admin/")({
  loader: () => getAdminDashboardContent(),
  head: () => ({
    meta: [{ title: "Admin Dashboard - Paranjape Tours" }],
  }),
  component: AdminDashboard,
});

type Feedback =
  | {
      type: "success" | "error";
      text: string;
    }
  | null;

type AdminSectionId =
  | "categories"
  | "hero"
  | "tours"
  | "gallery"
  | "testimonials"
  | "team"
  | "shop"
  | "blogs";
type ImageInputMode = "upload" | "url";

type CategoryDraft = {
  id?: number;
  name: string;
  slug: string;
  description: string;
};

type TourGalleryDraftItem = {
  id: string;
  src: string;
  alt: string;
};

type TestimonialDraft = {
  id?: number;
  legacyKey?: string;
  name: string;
  role: string;
  text: string;
};

type TeamMemberDraft = {
  id?: number;
  slug: string;
  name: string;
  role: string;
  description: string;
};

type ShopItemDraft = {
  id?: number;
  legacyKey?: string;
  slug: string;
  title: string;
  category: string;
  badge: string;
  price: string;
  description: string;
  image: string;
};

type GalleryDraft = {
  id?: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  sortOrder: string;
  isPublished: string;
};

type BlogDraft = {
  id?: number;
  legacyKey?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  publishedOn: string;
};

type HeroDraft = {
  desktopImage: string;
  mobileImage: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  overlayOpacity: string;
};

type CategoryPresetCard = {
  id?: number;
  name: string;
  slug: string;
  description: string;
  summary: string;
  source?: "database" | "static";
};

type TourDraft = {
  id?: number;
  legacyKey?: string;
  slug: string;
  title: string;
  status: string;
  categoryId: string;
  location: string;
  duration: string;
  tourDate: string;
  tourDateLabel: string;
  bookingUrl: string;
  difficulty: string;
  bestFor: string;
  bestSeason: string;
  groupSize: string;
  price: string;
  image: string;
  coverImageInput: string;
  short: string;
  overview: string;
  history: string;
  whoCanJoin: string;
  highlightsText: string;
  itineraryText: string;
  inclusionsText: string;
  exclusionsText: string;
  carryText: string;
  faqsText: string;
  notesText: string;
  galleryItems: TourGalleryDraftItem[];
};

const MIN_NEW_TOUR_GALLERY_ITEMS = 4;
const HERO_ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ImageUploadOptions = {
  maxWidth: number;
  maxHeight: number;
  minWidth?: number;
  minHeight?: number;
  quality?: number;
  maxFileSizeBytes?: number;
  allowedMimeTypes?: string[];
  label?: string;
};

const DEFAULT_IMAGE_UPLOAD_OPTIONS: ImageUploadOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.7,
  maxFileSizeBytes: 6 * 1024 * 1024,
};

const HERO_DESKTOP_UPLOAD_OPTIONS: ImageUploadOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  minWidth: 1280,
  minHeight: 720,
  quality: 0.78,
  maxFileSizeBytes: 8 * 1024 * 1024,
  allowedMimeTypes: HERO_ACCEPTED_FILE_TYPES,
  label: "desktop hero image",
};

const HERO_MOBILE_UPLOAD_OPTIONS: ImageUploadOptions = {
  maxWidth: 1080,
  maxHeight: 1350,
  minWidth: 720,
  minHeight: 900,
  quality: 0.78,
  maxFileSizeBytes: 8 * 1024 * 1024,
  allowedMimeTypes: HERO_ACCEPTED_FILE_TYPES,
  label: "mobile hero image",
};

const multilineInputClass =
  "w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3.5 text-sm text-white placeholder:text-white/28 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] transition focus:border-orange-400/40 focus:outline-none focus:ring-4 focus:ring-orange-400/10";
const darkPanelClass =
  "rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,22,0.98),rgba(12,12,12,0.98))] p-6 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.95)]";
const darkSubPanelClass =
  "rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(24,24,24,0.98),rgba(14,14,14,0.98))] p-5 shadow-[0_18px_36px_-24px_rgba(0,0,0,0.95)]";
const ghostButtonClass =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/82 transition hover:border-white/18 hover:bg-white/[0.08]";
const accentGhostButtonClass =
  "inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/8 px-4 py-2 text-sm font-medium text-orange-200 transition hover:border-orange-400/30 hover:bg-orange-500/12";

function formatError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function linesToText(values?: string[]) {
  return (values ?? []).join("\n");
}

function textToLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function createDraftId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createGalleryDraftItem(src = "", alt = ""): TourGalleryDraftItem {
  return {
    id: createDraftId(),
    src,
    alt,
  };
}

function createGalleryDraftItems(count: number) {
  return Array.from({ length: count }, () => createGalleryDraftItem());
}

function toEditableImageValue(src: string) {
  const trimmed = src.trim();

  if (!trimmed || trimmed.startsWith("data:") || trimmed.length > 200) {
    return "";
  }

  return trimmed;
}

function galleryToDraftItems(tour: ManagedTour) {
  return (tour.gallery ?? [])
    .filter((image) => image.src.trim().length > 0)
    .map((image) => createGalleryDraftItem(image.src, image.alt ?? ""));
}

function formatFileSize(size: number) {
  return `${Math.round((size / (1024 * 1024)) * 10) / 10} MB`;
}

function readFileAsDataUrl(file: File, options: ImageUploadOptions = DEFAULT_IMAGE_UPLOAD_OPTIONS) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File is not an image."));
      return;
    }

    const {
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      quality = 0.7,
      maxFileSizeBytes = 6 * 1024 * 1024,
      allowedMimeTypes,
      label = "image",
    } = options;

    if (allowedMimeTypes && !allowedMimeTypes.includes(file.type)) {
      reject(new Error(`Please upload a JPG, PNG, or WEBP file for the ${label}.`));
      return;
    }

    if (file.size > maxFileSizeBytes) {
      reject(
        new Error(
          `The ${label} is too large (${formatFileSize(file.size)}). Keep it under ${formatFileSize(maxFileSizeBytes)}.`,
        ),
      );
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.width;
      let height = img.height;

      if (minWidth && width < minWidth) {
        reject(
          new Error(
            `The ${label} is too small (${width}x${height}). Minimum recommended size is ${minWidth}x${minHeight ?? minWidth}.`,
          ),
        );
        return;
      }

      if (minHeight && height < minHeight) {
        reject(
          new Error(
            `The ${label} is too small (${width}x${height}). Minimum recommended size is ${minWidth ?? minHeight}x${minHeight}.`,
          ),
        );
        return;
      }

      if (width > height && width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      } else if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Unable to compress image."));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/webp", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Unable to read ${file.name}.`));
    };

    img.src = url;
  });
}

function itineraryToText(tour: ManagedTour) {
  return (tour.itinerary ?? [])
    .map((item) => [item.time, item.title, item.desc].join(" | "))
    .join("\n");
}

function textToItinerary(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [time = "", title = "", desc = ""] = line.split("|").map((part) => part.trim());
      return { time, title, desc };
    });
}

function faqsToText(tour: ManagedTour) {
  return (tour.faqs ?? []).map((item) => `${item.q} | ${item.a}`).join("\n");
}

function textToFaqs(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [q = "", a = ""] = line.split("|").map((part) => part.trim());
      return { q, a };
    });
}

function categoryToDraft(category?: ContentCategory): CategoryDraft {
  return {
    id: category?.id,
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
  };
}

function categoryPresetToDraft(category: CategoryPresetCard): CategoryDraft {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
  };
}

function testimonialToDraft(testimonial?: Testimonial): TestimonialDraft {
  return {
    id: testimonial?.id,
    legacyKey: testimonial?.legacyKey,
    name: testimonial?.name ?? "",
    role: testimonial?.role ?? "",
    text: testimonial?.text ?? "",
  };
}

function teamMemberToDraft(member?: TeamMember): TeamMemberDraft {
  return {
    id: member?.id,
    slug: member?.slug ?? "",
    name: member?.name ?? "",
    role: member?.role ?? "",
    description: member?.description ?? "",
  };
}

function shopItemToDraft(item?: ShopItem): ShopItemDraft {
  return {
    id: item?.id,
    legacyKey: item?.legacyKey,
    slug: item?.slug ?? "",
    title: item?.title ?? "",
    category: item?.category ?? "",
    badge: item?.badge ?? "",
    price: item?.price ?? "",
    description: item?.description ?? "",
    image: item?.image ?? "",
  };
}

function galleryToDraft(item?: GalleryItem): GalleryDraft {
  return {
    id: item?.id,
    slug: item?.slug ?? "",
    title: item?.title ?? "",
    image: item?.image ?? "",
    description: item?.description ?? "",
    sortOrder: item ? String(item.sortOrder) : "100",
    isPublished: item?.isPublished === false ? "draft" : "published",
  };
}

function blogDateToInput(post?: BlogPost) {
  if (!post?.date) {
    return new Date().toISOString().slice(0, 10);
  }

  const date = new Date(post.date);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

function blogToDraft(post?: BlogPost): BlogDraft {
  return {
    id: post?.id,
    legacyKey: post?.legacyKey,
    slug: post?.slug ?? "",
    title: post?.title ?? "",
    category: post?.category ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    image: post?.image ?? "",
    publishedOn: blogDateToInput(post),
  };
}

function heroToDraft(hero: HeroSectionContent): HeroDraft {
  return {
    desktopImage: hero.desktopImage ?? "",
    mobileImage: hero.mobileImage ?? "",
    heading: hero.heading ?? "",
    subheading: hero.subheading ?? "",
    ctaText: hero.ctaText ?? "",
    ctaLink: hero.ctaLink ?? "",
    overlayOpacity: String(Math.round((hero.overlayOpacity ?? 0.35) * 100)),
  };
}

function normalizeOverlayPercent(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 35;
  }

  return Math.min(90, Math.max(0, Math.round(parsed)));
}

function draftToHeroInput(draft: HeroDraft): SaveHeroSectionInput {
  return {
    desktopImage: draft.desktopImage.trim(),
    mobileImage: draft.mobileImage.trim() || "",
    heading: draft.heading.trim(),
    subheading: draft.subheading.trim(),
    ctaText: draft.ctaText.trim(),
    ctaLink: draft.ctaLink.trim(),
    overlayOpacity: normalizeOverlayPercent(draft.overlayOpacity) / 100,
  };
}

function createEmptyTourDraft(categories: ContentCategory[]): TourDraft {
  return {
    legacyKey: undefined,
    slug: "",
    title: "",
    status: "published",
    categoryId: categories[0] ? String(categories[0].id) : "",
    location: "",
    duration: "",
    tourDate: "",
    tourDateLabel: "",
    bookingUrl: "",
    difficulty: "",
    bestFor: "",
    bestSeason: "",
    groupSize: "",
    price: "",
    image: "",
    coverImageInput: "",
    short: "",
    overview: "",
    history: "",
    whoCanJoin: "",
    highlightsText: "",
    itineraryText: "",
    inclusionsText: "",
    exclusionsText: "",
    carryText: "",
    faqsText: "",
    notesText: "",
    galleryItems: createGalleryDraftItems(MIN_NEW_TOUR_GALLERY_ITEMS),
  };
}

function tourToDraft(tour: ManagedTour, categories: ContentCategory[]): TourDraft {
  const galleryItems = galleryToDraftItems(tour);

  return {
    id: tour.id,
    legacyKey: tour.legacyKey,
    slug: tour.slug,
    title: tour.title,
    status: tour.status ?? "published",
    categoryId:
      tour.categoryId !== undefined
        ? String(tour.categoryId)
        : categories.find((item) => item.name === tour.category)?.id
          ? String(categories.find((item) => item.name === tour.category)?.id)
          : "",
    location: tour.location,
    duration: tour.duration,
    tourDate: tour.tourDate ?? "",
    tourDateLabel: tour.tourDateLabel ?? "",
    bookingUrl: tour.bookingUrl ?? "",
    difficulty: tour.difficulty,
    bestFor: tour.bestFor,
    bestSeason: tour.bestSeason,
    groupSize: tour.groupSize,
    price: tour.price,
    image: tour.image,
    coverImageInput: toEditableImageValue(tour.image),
    short: tour.short,
    overview: tour.overview,
    history: tour.history,
    whoCanJoin: tour.whoCanJoin,
    highlightsText: linesToText(tour.highlights),
    itineraryText: itineraryToText(tour),
    inclusionsText: linesToText(tour.inclusions),
    exclusionsText: linesToText(tour.exclusions),
    carryText: linesToText(tour.carry),
    faqsText: faqsToText(tour),
    notesText: linesToText(tour.notes),
    galleryItems:
      galleryItems.length > 0
        ? galleryItems
        : createGalleryDraftItems(MIN_NEW_TOUR_GALLERY_ITEMS),
  };
}

function draftToTourInput(draft: TourDraft): SaveTourInput {
  const gallery = draft.galleryItems
    .map((item) => ({
      src: item.src.trim(),
      alt: item.alt.trim(),
    }))
    .filter((item) => item.src.length > 0);

  return {
    id: draft.id,
    legacyKey: draft.legacyKey,
    slug: draft.slug,
    title: draft.title,
    status: draft.status === "draft" ? "draft" : "published",
    categoryId: draft.categoryId ? Number(draft.categoryId) : undefined,
    categoryLabel: undefined,
    location: draft.location,
    duration: draft.duration,
    tourDate: draft.tourDate.trim() || undefined,
    tourDateLabel: draft.tourDateLabel.trim() || undefined,
    bookingUrl: draft.bookingUrl.trim() || undefined,
    difficulty: draft.difficulty,
    bestFor: draft.bestFor,
    bestSeason: draft.bestSeason,
    groupSize: draft.groupSize,
    price: draft.price,
    image: draft.image.trim() || gallery[0]?.src || "",
    short: draft.short,
    overview: draft.overview,
    history: draft.history,
    whoCanJoin: draft.whoCanJoin,
    highlights: textToLines(draft.highlightsText),
    itinerary: textToItinerary(draft.itineraryText),
    inclusions: textToLines(draft.inclusionsText),
    exclusions: textToLines(draft.exclusionsText),
    carry: textToLines(draft.carryText),
    faqs: textToFaqs(draft.faqsText),
    notes: textToLines(draft.notesText),
    gallery,
  };
}

function createHiddenLegacyTourInput(
  tour: ManagedTour,
  categories: ContentCategory[],
): SaveTourInput {
  const draft = tourToDraft(tour, categories);
  const payload = draftToTourInput({
    ...draft,
    status: "draft",
  });

  return {
    ...payload,
    categoryLabel: tour.category,
  };
}

function AdminDashboard() {
  const {
    admin,
    tours,
    blogPosts,
    testimonials,
    teamMembers,
    shopItems,
    galleryItems,
    heroSection,
    categories,
    databaseAvailable,
  } =
    Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();

  const editableTours = tours.filter((tour) => tour.source === "database");
  const legacyTours = tours.filter((tour) => tour.source !== "database");
  const editableBlogs = blogPosts.filter((post) => post.source === "database");
  const legacyBlogs = blogPosts.filter((post) => post.source !== "database");
  const editableTestimonials = testimonials.filter((item) => item.source === "database");
  const legacyTestimonials = testimonials.filter((item) => item.source !== "database");
  const editableTeamMembers = teamMembers.filter((item) => item.source === "database");
  const legacyTeamMembers = teamMembers.filter((item) => item.source !== "database");
  const editableShopItems = shopItems.filter((item) => item.source === "database");
  const legacyShopItems = shopItems.filter((item) => item.source !== "database");
  const editableGalleryItems = galleryItems.filter((item) => item.source === "database");
  const legacyGalleryItems = galleryItems.filter((item) => item.source !== "database");
  const adminCategories = categories.filter((category) => category.id > 0);
  const presetCategories: CategoryPresetCard[] = adminTourCategoryPresets.map((preset) => {
    const matchingCategory = adminCategories.find((category) => category.slug === preset.slug);

    return {
      id: matchingCategory?.id,
      name: matchingCategory?.name ?? preset.name,
      slug: matchingCategory?.slug ?? preset.slug,
      description: matchingCategory?.description || preset.description,
      summary: preset.summary,
      source: matchingCategory?.source,
    };
  });
  const extraCategories = adminCategories.filter(
    (category) => !adminTourCategoryPresetSlugs.has(category.slug),
  );
  const tourCategoryOptions = [
    ...presetCategories
      .filter((category) => category.id)
      .map((category) => ({
        value: String(category.id),
        label: category.name,
      })),
    ...extraCategories.map((category) => ({
      value: String(category.id),
      label: category.name,
    })),
  ];

  const [activeSection, setActiveSection] = useState<AdminSectionId>("categories");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [tourCoverMode, setTourCoverMode] = useState<ImageInputMode>("upload");

  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft>(() => categoryToDraft());
  const [tourDraft, setTourDraft] = useState<TourDraft>(() => createEmptyTourDraft(adminCategories));
  const [testimonialDraft, setTestimonialDraft] = useState<TestimonialDraft>(() =>
    testimonialToDraft(),
  );
  const [teamMemberDraft, setTeamMemberDraft] = useState<TeamMemberDraft>(() =>
    teamMemberToDraft(),
  );
  const [shopDraft, setShopDraft] = useState<ShopItemDraft>(() => shopItemToDraft());
  const [galleryDraft, setGalleryDraft] = useState<GalleryDraft>(() => galleryToDraft());
  const [blogDraft, setBlogDraft] = useState<BlogDraft>(() => blogToDraft());
  const [heroDraft, setHeroDraft] = useState<HeroDraft>(() => heroToDraft(heroSection));
  const isLegacyTourDraft = Boolean(tourDraft.legacyKey && !tourDraft.id);
  const isLegacyTestimonialDraft = Boolean(testimonialDraft.legacyKey && !testimonialDraft.id);
  const isLegacyShopDraft = Boolean(shopDraft.legacyKey && !shopDraft.id);
  const isLegacyBlogDraft = Boolean(blogDraft.legacyKey && !blogDraft.id);

  const sidebarItems: Array<{
    id: AdminSectionId;
    label: string;
    icon: any;
    count: string;
    note: string;
  }> = [
    {
      id: "categories",
      label: "Categories",
      icon: FolderTree,
      count: `${adminCategories.length}`,
      note: "Used in the tour form",
    },
    {
      id: "hero",
      label: "Hero Section",
      icon: ImageIcon,
      count: "1",
      note: heroSection.source === "database" ? "Homepage hero managed in admin" : "Using fallback hero settings",
    },
    {
      id: "tours",
      label: "Tours",
      icon: Map,
      count: `${editableTours.length}`,
      note: `${legacyTours.length} legacy still visible`,
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: ImagePlus,
      count: `${editableGalleryItems.length}`,
      note: `${legacyGalleryItems.length} legacy still visible`,
    },
    {
      id: "testimonials",
      label: "Testimonials",
      icon: MessageSquareQuote,
      count: `${editableTestimonials.length}`,
      note: `${legacyTestimonials.length} legacy quotes`,
    },
    {
      id: "team",
      label: "Team",
      icon: Users,
      count: `${editableTeamMembers.length}`,
      note: `${legacyTeamMembers.length} legacy guides`,
    },
    {
      id: "shop",
      label: "Shop",
      icon: ShoppingBag,
      count: `${editableShopItems.length}`,
      note: `${legacyShopItems.length} legacy products`,
    },
    {
      id: "blogs",
      label: "Blogs",
      icon: BookOpen,
      count: `${editableBlogs.length}`,
      note: `${legacyBlogs.length} legacy posts`,
    },
  ];
  const activeSidebarItem =
    sidebarItems.find((item) => item.id === activeSection) ?? sidebarItems[0];

  const currentTourCover =
    tourDraft.image.trim() || tourDraft.galleryItems.find((item) => item.src.trim())?.src || "";
  const galleryImageCount = tourDraft.galleryItems.filter((item) => item.src.trim().length > 0).length;
  const heroOverlayPercent = normalizeOverlayPercent(heroDraft.overlayOpacity);
  const heroOverlayOpacity = heroOverlayPercent / 100;

  useEffect(() => {
    if (!tourDraft.image.trim() || tourDraft.image.startsWith("data:")) {
      setTourCoverMode("upload");
      return;
    }

    setTourCoverMode("url");
  }, [tourDraft.id, tourDraft.image]);

  useEffect(() => {
    setHeroDraft(heroToDraft(heroSection));
  }, [
    heroSection.desktopImage,
    heroSection.mobileImage,
    heroSection.heading,
    heroSection.subheading,
    heroSection.ctaText,
    heroSection.ctaLink,
    heroSection.overlayOpacity,
  ]);

  async function runTask(taskKey: string, successText: string, task: () => Promise<void>) {
    setBusyKey(taskKey);
    setFeedback(null);

    try {
      await task();
      await router.invalidate();
      setFeedback({ type: "success", text: successText });
    } catch (error) {
      setFeedback({ type: "error", text: formatError(error) });
    } finally {
      setBusyKey(null);
    }
  }

  async function hideLegacyItem(type: "tour" | "blog" | "testimonial" | "shop", legacyKey: string) {
    await deleteLegacyContent({ data: { type, legacyKey } });
  }

  async function handleLogout() {
    setBusyKey("logout");
    setFeedback(null);

    try {
      await logoutAdmin();
      await router.invalidate();
      await navigate({ to: "/admin/login" });
    } catch (error) {
      setFeedback({ type: "error", text: formatError(error) });
      setBusyKey(null);
      return;
    }
  }

  async function handleTourGalleryUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    setUploadingGallery(true);
    setFeedback(null);

    try {
      const uploadedItems = await Promise.all(
        files.map(async (file) =>
          createGalleryDraftItem(
            await readFileAsDataUrl(file),
            file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim(),
          ),
        ),
      );

      setTourDraft((prev) => {
        const nextImage = prev.image.trim() || uploadedItems[0]?.src || "";

        return {
          ...prev,
          image: nextImage,
          coverImageInput: prev.image.trim()
            ? prev.coverImageInput
            : toEditableImageValue(nextImage),
          galleryItems: [...prev.galleryItems, ...uploadedItems],
        };
      });
    } catch (error) {
      setFeedback({ type: "error", text: formatError(error) });
    } finally {
      setUploadingGallery(false);
    }
  }

  function handleGalleryItemChange(itemId: string, field: "src" | "alt", value: string) {
    setTourDraft((prev) => {
      const previousItem = prev.galleryItems.find((item) => item.id === itemId);
      const galleryItems = prev.galleryItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      );

      if (field !== "src" || !previousItem || prev.image !== previousItem.src) {
        return { ...prev, galleryItems };
      }

      const fallbackImage =
        value.trim() || galleryItems.find((item) => item.id !== itemId && item.src.trim())?.src || "";

      return {
        ...prev,
        image: fallbackImage,
        coverImageInput: toEditableImageValue(fallbackImage),
        galleryItems,
      };
    });
  }

  function handleAddGalleryItems(count = 1) {
    setTourDraft((prev) => ({
      ...prev,
      galleryItems: [...prev.galleryItems, ...createGalleryDraftItems(count)],
    }));
  }

  function handleRemoveGalleryItem(itemId: string) {
    setTourDraft((prev) => {
      const itemToRemove = prev.galleryItems.find((item) => item.id === itemId);
      const galleryItems = prev.galleryItems.filter((item) => item.id !== itemId);

      if (!itemToRemove || prev.image !== itemToRemove.src) {
        return { ...prev, galleryItems };
      }

      const nextImage = galleryItems.find((item) => item.src.trim())?.src || "";

      return {
        ...prev,
        image: nextImage,
        coverImageInput: toEditableImageValue(nextImage),
        galleryItems,
      };
    });
  }

  function handleSetCoverImage(src: string) {
    setTourDraft((prev) => ({
      ...prev,
      image: src,
      coverImageInput: toEditableImageValue(src),
    }));
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,119,0,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(255,61,113,0.1),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,119,0,0.08),transparent_22%),linear-gradient(180deg,#120d0d_0%,#090909_55%,#050505_100%)] text-white">
      <div className="mx-auto max-w-[1480px] px-4 py-8 md:px-8 md:py-10">
        <header className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(19,19,19,0.98),rgba(10,10,10,0.96))] p-6 shadow-[0_35px_100px_-45px_rgba(0,0,0,0.95)] md:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/45">
                Paranjape Tours CMS
              </p>
              <h1 className="mt-4 font-sans text-4xl font-semibold tracking-[-0.03em] text-white md:text-[4rem]">
                Admin Dashboard
              </h1>
              <p className="mt-3 text-sm text-white/50 md:text-base">
                Tours: {editableTours.length} | Categories: {adminCategories.length} |
                Gallery: {editableGalleryItems.length} |
                Testimonials: {editableTestimonials.length} | Team: {editableTeamMembers.length} |
                Shop: {editableShopItems.length} | Blogs: {editableBlogs.length}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/25 bg-orange-500/8 px-5 py-3 text-sm font-medium text-orange-300">
                <Database size={16} />
                {databaseAvailable ? "MySQL Connected" : "Fallback Mode"}
              </div>
              <div className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/60">
                @{admin.username}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={busyKey === "logout"}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <LogOut size={15} />
                {busyKey === "logout" ? "Signing out..." : "Logout"}
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {sidebarItems.map(({ id, label }) => {
              const active = activeSection === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`inline-flex items-center rounded-2xl border px-6 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-transparent bg-[linear-gradient(135deg,#ff7a18_0%,#ff3d71_100%)] text-white shadow-[0_18px_35px_-18px_rgba(255,97,45,0.75)]"
                      : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/18 hover:bg-white/[0.06]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </header>

        {feedback && (
          <div
            className={`mt-6 rounded-[1.5rem] border px-5 py-4 text-sm shadow-sm ${
              feedback.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/20 bg-red-500/10 text-red-300"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <main className="mt-8">
          <div className="mb-6 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,22,0.98),rgba(12,12,12,0.98))] p-5 shadow-[0_26px_60px_-36px_rgba(0,0,0,0.95)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                  Active Section
                </p>
                <h2 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.02em] text-white">
                  {activeSidebarItem.label}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
                  {activeSidebarItem.note}.{" "}
                  {activeSection === "hero"
                    ? "Update banner images, copy, CTA, and overlay from one place."
                    : "Legacy frontend items can now be imported into admin management or hidden directly from this dashboard."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/70">
                  {activeSidebarItem.count} records
                </span>
                <span className="inline-flex rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/55">
                  {admin.displayName}
                </span>
              </div>
            </div>
          </div>

            {activeSection === "categories" && (
              <SectionCard
                id="categories"
                title="Categories"
                subtitle="The frontend tour menu and tour filters use the saved categories below."
              >
                <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="grid gap-5">
                    <div className={darkPanelClass}>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Preset Category Groups
                      </p>
                      <h3 className="mt-3 font-sans text-2xl font-semibold tracking-[-0.02em] text-white">
                        One Day Tour, Heritage Walk and Multiple Day Tour
                      </h3>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
                        These are the starting category options. Click a card to review or update
                        its details.
                      </p>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-3">
                      {presetCategories.map((category) => (
                        <div
                          key={category.slug}
                          className={darkSubPanelClass}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/15 bg-orange-500/10 text-orange-200">
                              <FolderTree size={18} />
                            </div>
                            <span className="rounded-full border border-orange-500/18 bg-orange-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-200">
                              {category.id ? "Ready" : "Create"}
                            </span>
                          </div>
                          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-orange-300/72">
                            {category.slug}
                          </p>
                          <h4 className="mt-2 font-sans text-2xl font-semibold tracking-[-0.02em] text-white">
                            {category.name}
                          </h4>
                          <p className="mt-3 text-sm leading-6 text-white/72">
                            {category.description || category.summary}
                          </p>
                          <p className="mt-3 text-xs leading-5 text-white/42">
                            {category.summary}
                          </p>
                          <div className="mt-5">
                            <SmallButton
                              label={category.id ? "Edit category" : "Create category"}
                              icon={PencilLine}
                              onClick={() => setCategoryDraft(categoryPresetToDraft(category))}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {extraCategories.length > 0 && (
                      <div className={darkPanelClass}>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Extra Saved Categories
                        </p>
                        <h3 className="mt-3 font-sans text-2xl font-semibold tracking-[-0.02em] text-white">
                          Additional categories
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-white/55">
                          These saved categories now appear in the public tours menu and filter
                          buttons.
                        </p>
                        <div className="mt-5 grid gap-4">
                          {extraCategories.map((category) => (
                            <RecordCard
                              key={category.id}
                              title={category.name}
                              meta={category.slug}
                              source={category.source}
                              description={category.description || "No description added yet."}
                              actions={
                                <div className="flex gap-2">
                                  <SmallButton
                                    label="Edit"
                                    icon={PencilLine}
                                    onClick={() => setCategoryDraft(categoryToDraft(category))}
                                  />
                                  <DangerButton
                                    label="Delete"
                                    icon={Trash2}
                                    onClick={() => {
                                      if (!window.confirm(`Delete the category "${category.name}"?`)) {
                                        return;
                                      }

                                      void runTask("delete-category", "Category deleted.", async () => {
                                        await deleteCategory({ data: { id: category.id } });
                                        setCategoryDraft(categoryToDraft());
                                      });
                                    }}
                                  />
                                </div>
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void runTask("save-category", "Category saved.", async () => {
                        const payload: SaveCategoryInput = {
                          id: categoryDraft.id,
                          name: categoryDraft.name,
                          slug: categoryDraft.slug,
                          description: categoryDraft.description,
                        };
                        await saveCategory({ data: payload });
                        setCategoryDraft(categoryToDraft());
                      });
                    }}
                    className={`${darkPanelClass} xl:sticky xl:top-6`}
                  >
                    <FormHeader
                      title={categoryDraft.id ? "Edit category" : "Add category"}
                      description="Use this panel to update an existing category or save a new frontend tour category."
                      onReset={() => setCategoryDraft(categoryToDraft())}
                    />
                    <div className="mt-6 rounded-[1.5rem] border border-orange-500/16 bg-orange-500/8 p-4 text-sm leading-6 text-white/72">
                      The tours menu starts with these preset labels:
                      <strong className="ml-1 text-orange-200">
                        One Day Tour, Heritage Walk, Multiple Day Tour
                      </strong>
                    </div>
                    <div className="mt-6 grid gap-4">
                      <Field
                        label="Category Name"
                        value={categoryDraft.name}
                        onChange={(value) => setCategoryDraft((prev) => ({ ...prev, name: value }))}
                        required
                      />
                      <Field
                        label="Slug"
                        value={categoryDraft.slug}
                        onChange={(value) => setCategoryDraft((prev) => ({ ...prev, slug: value }))}
                        placeholder="optional-auto-generated"
                      />
                      <TextAreaField
                        label="Description"
                        value={categoryDraft.description}
                        onChange={(value) =>
                          setCategoryDraft((prev) => ({ ...prev, description: value }))
                        }
                        rows={5}
                      />
                    </div>
                    <SubmitButton
                      busy={busyKey === "save-category"}
                      label={categoryDraft.id ? "Update category" : "Create category"}
                    />
                  </form>
                </div>
              </SectionCard>
            )}

            {activeSection === "hero" && (
              <SectionCard
                id="hero"
                title="Hero Section"
                subtitle="Manage the homepage hero banner image, mobile variant, copy, call-to-action, and overlay intensity."
              >
                <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="grid gap-5">
                    <div className={darkPanelClass}>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Live Preview
                      </p>
                      <h3 className="mt-3 font-sans text-2xl font-semibold tracking-[-0.02em] text-white">
                        Homepage hero frame
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-white/55">
                        This keeps the current hero layout while letting you change image and copy
                        without code changes or redeploy.
                      </p>

                      <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.95)]">
                        <div className="relative aspect-[16/9]">
                          <picture>
                            {heroDraft.mobileImage.trim() && (
                              <source media="(max-width: 767px)" srcSet={heroDraft.mobileImage} />
                            )}
                            <img
                              src={heroDraft.desktopImage.trim() || heroSection.desktopImage}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </picture>
                          <div
                            className="absolute inset-0 bg-black"
                            style={{ opacity: heroOverlayOpacity }}
                          />
                          <div className="absolute inset-0 flex items-end p-6 md:p-8">
                            <div className="max-w-xl text-white">
                              <p className="text-xs uppercase tracking-[0.24em] text-orange-200/90">
                                Homepage Hero
                              </p>
                              <h4 className="mt-3 font-serif text-2xl leading-tight md:text-4xl">
                                {heroDraft.heading || "Explore Living Heritage Beyond Tourism"}
                              </h4>
                              <p className="mt-3 text-sm leading-6 text-white/88 md:text-base">
                                {heroDraft.subheading ||
                                  "Temple towns, sacred spaces and layered stories led with depth and clarity."}
                              </p>
                              <span className="mt-5 inline-flex rounded-full bg-gold px-4 py-2 text-xs font-semibold text-gold-foreground">
                                {heroDraft.ctaText || "Explore Tours"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <SingleImagePicker
                      label="Desktop Hero Image"
                      value={heroDraft.desktopImage}
                      onChange={(value) => setHeroDraft((prev) => ({ ...prev, desktopImage: value }))}
                      uploadLabel="Choose desktop banner image"
                      urlPlaceholder="https://example.com/hero-desktop.jpg"
                      helper="Recommended: 1920x1080 (minimum 1280x720). JPG, PNG, WEBP only. Uploaded files are auto-optimized. Leaving it blank while editing keeps the current banner."
                      uploadOptions={HERO_DESKTOP_UPLOAD_OPTIONS}
                      accept="image/jpeg,image/png,image/webp"
                    />

                    <SingleImagePicker
                      label="Mobile Hero Image (Optional)"
                      value={heroDraft.mobileImage}
                      onChange={(value) => setHeroDraft((prev) => ({ ...prev, mobileImage: value }))}
                      uploadLabel="Choose mobile banner image"
                      urlPlaceholder="https://example.com/hero-mobile.jpg"
                      helper="Recommended: 1080x1350 (minimum 720x900). Leaving it blank while editing keeps the current mobile banner; if none exists, mobile uses the desktop image."
                      uploadOptions={HERO_MOBILE_UPLOAD_OPTIONS}
                      accept="image/jpeg,image/png,image/webp"
                    />
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void runTask("save-hero", "Hero section saved.", async () => {
                        await saveHeroSection({ data: draftToHeroInput(heroDraft) });
                      });
                    }}
                    className={`${darkPanelClass} xl:sticky xl:top-6`}
                  >
                    <FormHeader
                      title="Hero Content Controls"
                      description="Manage heading, supporting text, CTA, destination link, and overlay intensity."
                      onReset={() => setHeroDraft(heroToDraft(heroSection))}
                    />
                    <div className="mt-6 grid gap-4">
                      <Field
                        label="Heading Text"
                        value={heroDraft.heading}
                        onChange={(value) => setHeroDraft((prev) => ({ ...prev, heading: value }))}
                        required
                      />
                      <TextAreaField
                        label="Subheading Text"
                        value={heroDraft.subheading}
                        onChange={(value) =>
                          setHeroDraft((prev) => ({ ...prev, subheading: value }))
                        }
                        rows={4}
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field
                          label="CTA Button Text"
                          value={heroDraft.ctaText}
                          onChange={(value) =>
                            setHeroDraft((prev) => ({ ...prev, ctaText: value }))
                          }
                          required
                        />
                        <Field
                          label="CTA Button Link"
                          value={heroDraft.ctaLink}
                          onChange={(value) =>
                            setHeroDraft((prev) => ({ ...prev, ctaLink: value }))
                          }
                          placeholder="/tours or https://..."
                          required
                        />
                      </div>
                      <div className="rounded-[1.25rem] border border-white/10 bg-black/30 p-4">
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
                          Dark Overlay Opacity
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={90}
                          step={1}
                          value={heroOverlayPercent}
                          onChange={(event) =>
                            setHeroDraft((prev) => ({
                              ...prev,
                              overlayOpacity: event.target.value,
                            }))
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
                        />
                        <p className="mt-2 text-sm text-white/65">{heroOverlayPercent}%</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[1.25rem] border border-orange-500/16 bg-orange-500/8 p-4 text-sm leading-6 text-white/72">
                      If no desktop image is saved, the homepage falls back to the default hero
                      artwork automatically.
                    </div>

                    <SubmitButton busy={busyKey === "save-hero"} label="Save hero section" />
                  </form>
                </div>
              </SectionCard>
            )}

            {activeSection === "tours" && (
              <SectionCard
                id="tours"
                title="Tours"
                subtitle="Add new tours, override legacy frontend tours by slug, or update database-backed tours."
              >
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {tours.map((tour) => (
                <RecordCard
                  key={`${tour.source}-${tour.slug}`}
                  title={tour.title}
                  meta={[
                    tour.status === "draft" ? "Draft" : "Published",
                    tour.category,
                    tour.location,
                    (tour.tourDateLabel || tour.tourDate)
                      ? `Date: ${tour.tourDateLabel || tour.tourDate}`
                      : undefined,
                  ]
                    .filter(Boolean)
                    .join(" - ")}
                  source={tour.source}
                  description={tour.short}
                  actions={
                    <div className="flex gap-2">
                      <SmallButton
                        label="Edit"
                        icon={PencilLine}
                        onClick={() => setTourDraft(tourToDraft(tour, adminCategories))}
                      />
                      <DangerButton
                        label="Delete"
                        icon={Trash2}
                        onClick={() => {
                          const confirmText = tour.id
                            ? `Delete the tour "${tour.title}"?`
                            : `Delete "${tour.title}" from live tours? This will move it to draft.`;

                          if (!window.confirm(confirmText)) {
                            return;
                          }

                          const tourId = tour.id;
                          if (tourId) {
                            void runTask("delete-tour", "Tour deleted.", async () => {
                              await deleteTour({ data: { id: tourId } });
                              setTourDraft(createEmptyTourDraft(adminCategories));
                            });
                            return;
                          }

                          void runTask("delete-tour", "Legacy tour moved to draft.", async () => {
                            await saveTour({
                              data: createHiddenLegacyTourInput(tour, adminCategories),
                            });
                            setTourDraft(createEmptyTourDraft(adminCategories));
                          });
                        }}
                      />
                    </div>
                  }
                />
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void runTask("save-tour", "Tour saved.", async () => {
                  await saveTour({ data: draftToTourInput(tourDraft) });
                  setTourDraft(createEmptyTourDraft(adminCategories));
                });
              }}
              className={`mt-6 ${darkPanelClass}`}
            >
              <FormHeader
                title={
                  tourDraft.id
                    ? "Edit tour"
                    : isLegacyTourDraft
                      ? "Import legacy tour"
                      : "Add tour"
                }
                description={
                  isLegacyTourDraft
                    ? "This legacy tour will be copied into the CMS and the old frontend-only version will be hidden after you save."
                    : "Upload multiple tour images, choose the cover image, and use one line per item in the structured text fields."
                }
                onReset={() => setTourDraft(createEmptyTourDraft(adminCategories))}
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Tour Title"
                  value={tourDraft.title}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, title: value }))}
                  required
                />
                <Field
                  label="Slug"
                  value={tourDraft.slug}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, slug: value }))}
                  placeholder="optional-auto-generated"
                />
                <SelectField
                  label="Status"
                  value={tourDraft.status}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, status: value }))}
                  options={[
                    { value: "published", label: "Published" },
                    { value: "draft", label: "Draft (hidden from website)" },
                  ]}
                  required
                />
                <SelectField
                  label="Category"
                  value={tourDraft.categoryId}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, categoryId: value }))}
                  options={tourCategoryOptions}
                  required
                />
                <Field
                  label="Location"
                  value={tourDraft.location}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, location: value }))}
                />
                <Field
                  label="Duration"
                  value={tourDraft.duration}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, duration: value }))}
                />
                <Field
                  label="Tour Date"
                  type="date"
                  value={tourDraft.tourDate}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, tourDate: value }))}
                />
                <Field
                  label="Tour Date Badge Text"
                  value={tourDraft.tourDateLabel}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, tourDateLabel: value }))}
                  placeholder="e.g. 10-16 August"
                />
                <Field
                  label="Book Now Link"
                  value={tourDraft.bookingUrl}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, bookingUrl: value }))}
                  placeholder="https://rzp.io/...."
                />
                <Field
                  label="Difficulty"
                  value={tourDraft.difficulty}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, difficulty: value }))}
                />
                <Field
                  label="Best For"
                  value={tourDraft.bestFor}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, bestFor: value }))}
                />
                <Field
                  label="Best Season"
                  value={tourDraft.bestSeason}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, bestSeason: value }))}
                />
                <Field
                  label="Group Size"
                  value={tourDraft.groupSize}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, groupSize: value }))}
                />
                <Field
                  label="Price"
                  value={tourDraft.price}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, price: value }))}
                />
              </div>

              <div className={`mt-6 ${darkPanelClass}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Cover Image
                    </p>
                    <h4 className="mt-2 font-sans text-2xl font-semibold tracking-[-0.02em] text-white">
                      Tour gallery and cover
                    </h4>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                      Choose images from upload first. If needed, you can switch to an image URL,
                      and any gallery image can be promoted as the cover image. New tours start
                      with 4 gallery slots ready below.
                    </p>
                  </div>

                  {currentTourCover && (
                    <button
                      type="button"
                      onClick={() =>
                        setTourDraft((prev) => ({
                          ...prev,
                          image: "",
                          coverImageInput: "",
                        }))
                      }
                      className={ghostButtonClass}
                    >
                      <Trash2 size={14} />
                      Clear cover
                    </button>
                  )}
                </div>

                <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35 shadow-[0_18px_34px_-22px_rgba(0,0,0,0.95)]">
                    <div className="aspect-[4/3] bg-black/25">
                      {currentTourCover ? (
                        <img
                          src={currentTourCover}
                          alt={tourDraft.title || "Tour cover preview"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/42">
                          Upload gallery images or add a cover image URL to preview it here.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setTourCoverMode("upload")}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                          tourCoverMode === "upload"
                            ? "border-transparent bg-[linear-gradient(135deg,#ff7a18_0%,#ff3d71_100%)] text-white"
                            : "border-white/10 bg-white/[0.04] text-white/75"
                        }`}
                      >
                        <ImagePlus size={14} />
                        Upload images
                      </button>
                      <button
                        type="button"
                        onClick={() => setTourCoverMode("url")}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                          tourCoverMode === "url"
                            ? "border-transparent bg-[linear-gradient(135deg,#ff7a18_0%,#ff3d71_100%)] text-white"
                            : "border-white/10 bg-white/[0.04] text-white/75"
                        }`}
                      >
                        <PencilLine size={14} />
                        Use image URL
                      </button>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">
                        Upload Multiple Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) => void handleTourGalleryUpload(event)}
                        className="block w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-[linear-gradient(135deg,#ff7a18_0%,#ff3d71_100%)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                      />
                      <p className="mt-2 text-xs leading-5 text-white/42">
                        Select as many images as you want. Uploaded images are added to the tour
                        gallery, and you can choose any of them as the cover.
                      </p>
                    </div>

                    {tourCoverMode === "url" && (
                      <Field
                        label="Cover Image URL"
                        value={tourDraft.coverImageInput}
                        onChange={(value) =>
                          setTourDraft((prev) => ({
                            ...prev,
                            image: value,
                            coverImageInput: value,
                          }))
                        }
                        placeholder="https://example.com/cover.jpg"
                      />
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddGalleryItems(1)}
                        className={ghostButtonClass}
                      >
                        <Plus size={14} />
                        Add 1 more slot
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddGalleryItems(MIN_NEW_TOUR_GALLERY_ITEMS)}
                        className={accentGhostButtonClass}
                      >
                        <Plus size={14} />
                        Add 4 more slots
                      </button>
                      {uploadingGallery && (
                        <span className="inline-flex items-center rounded-full border border-orange-500/16 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
                          Uploading images...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                <TextAreaField
                  label="Short Description"
                  value={tourDraft.short}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, short: value }))}
                  rows={3}
                />
                <TextAreaField
                  label="Overview"
                  value={tourDraft.overview}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, overview: value }))}
                  rows={5}
                />
                <TextAreaField
                  label="History"
                  value={tourDraft.history}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, history: value }))}
                  rows={5}
                />
                <TextAreaField
                  label="Who Can Join"
                  value={tourDraft.whoCanJoin}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, whoCanJoin: value }))}
                  rows={4}
                />
              </div>

              <div className={`mt-6 ${darkPanelClass}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Gallery Images
                    </p>
                    <h4 className="mt-2 font-sans text-2xl font-semibold tracking-[-0.02em] text-white">
                      {galleryImageCount} image{galleryImageCount === 1 ? "" : "s"} added
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Each slot can upload an image, choose a file from your device, or use a
                      remote image URL. Add 4 more slots anytime for larger galleries.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  {tourDraft.galleryItems.map((item, index) => {
                    const isCover = currentTourCover === item.src && item.src.trim().length > 0;

                    return (
                      <div
                        key={item.id}
                        className={darkSubPanelClass}
                      >
                        <SingleImagePicker
                          label={`Gallery Image ${index + 1}`}
                          value={item.src}
                          onChange={(value) => handleGalleryItemChange(item.id, "src", value)}
                          uploadLabel="Choose gallery image"
                          urlPlaceholder="https://example.com/gallery-photo.jpg"
                          helper="Upload from your device or paste an image URL for this gallery slot."
                        />

                        <div className="mt-4 grid gap-4">
                          <Field
                            label="Alt Text"
                            value={item.alt}
                            onChange={(value) => handleGalleryItemChange(item.id, "alt", value)}
                            placeholder="Describe this photo"
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={!item.src.trim() || isCover}
                            onClick={() => handleSetCoverImage(item.src)}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/82 transition hover:border-white/18 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <PencilLine size={14} />
                            {isCover ? "Current cover" : "Set as cover"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryItem(item.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/14"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                <TextAreaField
                  label="Highlights"
                  value={tourDraft.highlightsText}
                  onChange={(value) =>
                    setTourDraft((prev) => ({ ...prev, highlightsText: value }))
                  }
                  rows={6}
                  helper="One highlight per line."
                />
                <TextAreaField
                  label="Itinerary"
                  value={tourDraft.itineraryText}
                  onChange={(value) =>
                    setTourDraft((prev) => ({ ...prev, itineraryText: value }))
                  }
                  rows={6}
                  helper="One line each. Format: time | title | description"
                />
                <TextAreaField
                  label="FAQs"
                  value={tourDraft.faqsText}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, faqsText: value }))}
                  rows={6}
                  helper="One line each. Format: question | answer"
                />
                <TextAreaField
                  label="Inclusions"
                  value={tourDraft.inclusionsText}
                  onChange={(value) =>
                    setTourDraft((prev) => ({ ...prev, inclusionsText: value }))
                  }
                  rows={5}
                  helper="One item per line."
                />
                <TextAreaField
                  label="Exclusions"
                  value={tourDraft.exclusionsText}
                  onChange={(value) =>
                    setTourDraft((prev) => ({ ...prev, exclusionsText: value }))
                  }
                  rows={5}
                  helper="One item per line."
                />
                <TextAreaField
                  label="Things to Carry"
                  value={tourDraft.carryText}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, carryText: value }))}
                  rows={5}
                  helper="One item per line."
                />
                <TextAreaField
                  label="Notes"
                  value={tourDraft.notesText}
                  onChange={(value) => setTourDraft((prev) => ({ ...prev, notesText: value }))}
                  rows={5}
                  helper="One note per line."
                />
              </div>

              <SubmitButton
                busy={busyKey === "save-tour"}
                label={
                  tourDraft.id
                    ? "Update tour"
                    : isLegacyTourDraft
                      ? "Save as admin-managed tour"
                      : "Create tour"
                }
              />
            </form>
              </SectionCard>
            )}

            {activeSection === "gallery" && (
              <SectionCard
                id="gallery"
                title="Gallery"
                subtitle="Manage photos for the Gallery page. Draft items stay hidden from public view."
              >
                <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
                  <div className="grid gap-4 md:grid-cols-2">
                    {galleryItems.map((item) => (
                      <RecordCard
                        key={`${item.source}-${item.slug}`}
                        title={item.title}
                        meta={`${item.isPublished ? "Published" : "Draft"} - Order ${item.sortOrder}`}
                        source={item.source}
                        description={item.description || "No description added yet."}
                        actions={
                          item.id ? (
                            <div className="flex gap-2">
                              <SmallButton
                                label="Edit"
                                icon={PencilLine}
                                onClick={() => setGalleryDraft(galleryToDraft(item))}
                              />
                              <DangerButton
                                label="Delete"
                                icon={Trash2}
                                onClick={() => {
                                  if (!window.confirm(`Delete the gallery item "${item.title}"?`)) {
                                    return;
                                  }

                                  void runTask("delete-gallery-item", "Gallery item deleted.", async () => {
                                    await deleteGalleryItem({ data: { id: item.id! } });
                                    setGalleryDraft(galleryToDraft());
                                  });
                                }}
                              />
                            </div>
                          ) : (
                            <LegacyNote text="Legacy gallery item. Use the same slug to override it from admin." />
                          )
                        }
                      />
                    ))}
                  </div>

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void runTask("save-gallery-item", "Gallery item saved.", async () => {
                        const payload: SaveGalleryItemInput = {
                          id: galleryDraft.id,
                          slug: galleryDraft.slug,
                          title: galleryDraft.title,
                          image: galleryDraft.image,
                          description: galleryDraft.description,
                          sortOrder: Number(galleryDraft.sortOrder || "100"),
                          isPublished: galleryDraft.isPublished !== "draft",
                        };
                        await saveGalleryItem({ data: payload });
                        setGalleryDraft(galleryToDraft());
                      });
                    }}
                    className={darkPanelClass}
                  >
                    <FormHeader
                      title={galleryDraft.id ? "Edit gallery item" : "Add gallery item"}
                      description="Published items appear on the Gallery page. Draft items are saved for later."
                      onReset={() => setGalleryDraft(galleryToDraft())}
                    />
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <Field
                        label="Title"
                        value={galleryDraft.title}
                        onChange={(value) => setGalleryDraft((prev) => ({ ...prev, title: value }))}
                        required
                      />
                      <Field
                        label="Slug"
                        value={galleryDraft.slug}
                        onChange={(value) => setGalleryDraft((prev) => ({ ...prev, slug: value }))}
                        placeholder="optional-auto-generated"
                      />
                      <Field
                        label="Sort Order"
                        type="number"
                        value={galleryDraft.sortOrder}
                        onChange={(value) => setGalleryDraft((prev) => ({ ...prev, sortOrder: value }))}
                      />
                      <SelectField
                        label="Status"
                        value={galleryDraft.isPublished}
                        onChange={(value) => setGalleryDraft((prev) => ({ ...prev, isPublished: value }))}
                        options={[
                          { value: "published", label: "Published" },
                          { value: "draft", label: "Draft (hidden from website)" },
                        ]}
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <SingleImagePicker
                        label="Gallery Image"
                        value={galleryDraft.image}
                        onChange={(value) => setGalleryDraft((prev) => ({ ...prev, image: value }))}
                        uploadLabel="Choose gallery image"
                        urlPlaceholder="https://example.com/heritage-photo.jpg"
                        helper="Upload or provide a hosted URL for this gallery image. When editing an existing item, leaving this blank keeps the stored database image."
                      />
                    </div>
                    <div className="mt-4">
                      <TextAreaField
                        label="Description"
                        value={galleryDraft.description}
                        onChange={(value) => setGalleryDraft((prev) => ({ ...prev, description: value }))}
                        rows={5}
                      />
                    </div>
                    <SubmitButton
                      busy={busyKey === "save-gallery-item"}
                      label={galleryDraft.id ? "Update gallery item" : "Create gallery item"}
                    />
                  </form>
                </div>
              </SectionCard>
            )}

            {activeSection === "testimonials" && (
              <SectionCard
                id="testimonials"
                title="Testimonials"
                subtitle="Add new traveller reviews without removing the existing homepage testimonials."
              >
            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-4 md:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <RecordCard
                    key={`${testimonial.source}-${testimonial.id ?? testimonial.name}`}
                    title={testimonial.name}
                    meta={testimonial.role}
                    source={testimonial.source}
                    description={testimonial.text}
                    actions={
                      testimonial.id ? (
                        <div className="flex gap-2">
                          <SmallButton
                            label="Edit"
                            icon={PencilLine}
                            onClick={() => setTestimonialDraft(testimonialToDraft(testimonial))}
                          />
                          <DangerButton
                            label="Delete"
                            icon={Trash2}
                            onClick={() => {
                              if (!window.confirm(`Delete the testimonial from ${testimonial.name}?`)) {
                                return;
                              }

                              void runTask("delete-testimonial", "Testimonial deleted.", async () => {
                                await deleteTestimonial({ data: { id: testimonial.id! } });
                                setTestimonialDraft(testimonialToDraft());
                            });
                          }}
                        />
                      </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                          <SmallButton
                            label="Edit"
                            icon={PencilLine}
                            onClick={() => setTestimonialDraft(testimonialToDraft(testimonial))}
                          />
                          <DangerButton
                            label="Delete"
                            icon={Trash2}
                            onClick={() => {
                              if (
                                !testimonial.legacyKey ||
                                !window.confirm(
                                  `Hide the legacy testimonial from ${testimonial.name}?`,
                                )
                              ) {
                                return;
                              }

                              void runTask(
                                "delete-legacy-testimonial",
                                "Legacy testimonial hidden.",
                                async () => {
                                  await hideLegacyItem("testimonial", testimonial.legacyKey!);
                                  setTestimonialDraft((prev) =>
                                    prev.legacyKey === testimonial.legacyKey
                                      ? testimonialToDraft()
                                      : prev,
                                  );
                                },
                              );
                            }}
                          />
                        </div>
                      )
                    }
                  />
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void runTask("save-testimonial", "Testimonial saved.", async () => {
                    const payload: SaveTestimonialInput = { ...testimonialDraft };
                    await saveTestimonial({ data: payload });
                    setTestimonialDraft(testimonialToDraft());
                  });
                }}
                className={darkPanelClass}
              >
                <FormHeader
                  title={
                    testimonialDraft.id
                      ? "Edit testimonial"
                      : isLegacyTestimonialDraft
                        ? "Import legacy testimonial"
                        : "Add testimonial"
                  }
                  description={
                    isLegacyTestimonialDraft
                      ? "Saving this legacy testimonial creates an admin-managed copy and hides the older frontend-only version."
                      : "These entries appear along with the current traveller quotes on the homepage."
                  }
                  onReset={() => setTestimonialDraft(testimonialToDraft())}
                />
                <div className="mt-6 grid gap-4">
                  <Field
                    label="Name"
                    value={testimonialDraft.name}
                    onChange={(value) =>
                      setTestimonialDraft((prev) => ({ ...prev, name: value }))
                    }
                    required
                  />
                  <Field
                    label="Role"
                    value={testimonialDraft.role}
                    onChange={(value) =>
                      setTestimonialDraft((prev) => ({ ...prev, role: value }))
                    }
                  />
                  <TextAreaField
                    label="Testimonial"
                    value={testimonialDraft.text}
                    onChange={(value) =>
                      setTestimonialDraft((prev) => ({ ...prev, text: value }))
                    }
                    rows={6}
                  />
                </div>
                <SubmitButton
                  busy={busyKey === "save-testimonial"}
                  label={
                    testimonialDraft.id
                      ? "Update testimonial"
                      : isLegacyTestimonialDraft
                        ? "Save as admin-managed testimonial"
                        : "Create testimonial"
                  }
                />
              </form>
            </div>
              </SectionCard>
            )}

            {activeSection === "team" && (
              <SectionCard
                id="team"
                title="Team Members"
                subtitle="Manage the guide cards shown on the About page. Legacy frontend team members stay visible until you override them with the same slug."
              >
            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-4 md:grid-cols-2">
                {teamMembers.map((member) => (
                  <RecordCard
                    key={`${member.source}-${member.slug}`}
                    title={member.name}
                    meta={member.role ? `${member.role} - ${member.slug}` : member.slug}
                    source={member.source}
                    description={member.description}
                    actions={
                      member.id ? (
                        <div className="flex gap-2">
                          <SmallButton
                            label="Edit"
                            icon={PencilLine}
                            onClick={() => setTeamMemberDraft(teamMemberToDraft(member))}
                          />
                          <DangerButton
                            label="Delete"
                            icon={Trash2}
                            onClick={() => {
                              if (!window.confirm(`Delete the team member "${member.name}"?`)) {
                                return;
                              }

                              void runTask("delete-team-member", "Team member deleted.", async () => {
                                await deleteTeamMember({ data: { id: member.id! } });
                                setTeamMemberDraft(teamMemberToDraft());
                              });
                            }}
                          />
                        </div>
                      ) : (
                        <LegacyNote text="Legacy about page team member. Use the same slug to override it from the admin panel." />
                      )
                    }
                  />
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void runTask("save-team-member", "Team member saved.", async () => {
                    const payload: SaveTeamMemberInput = { ...teamMemberDraft };
                    await saveTeamMember({ data: payload });
                    setTeamMemberDraft(teamMemberToDraft());
                  });
                }}
                className={darkPanelClass}
              >
                <FormHeader
                  title={teamMemberDraft.id ? "Edit team member" : "Add team member"}
                  description="These entries power the team section on the About page."
                  onReset={() => setTeamMemberDraft(teamMemberToDraft())}
                />
                <div className="mt-6 grid gap-4">
                  <Field
                    label="Name"
                    value={teamMemberDraft.name}
                    onChange={(value) =>
                      setTeamMemberDraft((prev) => ({ ...prev, name: value }))
                    }
                    required
                  />
                  <Field
                    label="Slug"
                    value={teamMemberDraft.slug}
                    onChange={(value) =>
                      setTeamMemberDraft((prev) => ({ ...prev, slug: value }))
                    }
                    placeholder="optional-auto-generated"
                  />
                  <Field
                    label="Role"
                    value={teamMemberDraft.role}
                    onChange={(value) =>
                      setTeamMemberDraft((prev) => ({ ...prev, role: value }))
                    }
                  />
                  <TextAreaField
                    label="Description"
                    value={teamMemberDraft.description}
                    onChange={(value) =>
                      setTeamMemberDraft((prev) => ({ ...prev, description: value }))
                    }
                    rows={6}
                  />
                </div>
                <SubmitButton
                  busy={busyKey === "save-team-member"}
                  label={teamMemberDraft.id ? "Update team member" : "Create team member"}
                />
              </form>
            </div>
              </SectionCard>
            )}

            {activeSection === "shop" && (
              <SectionCard
                id="shop"
                title="Shop Items"
                subtitle="Add books and shop products that appear on the existing shop page."
              >
            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-4 md:grid-cols-2">
                {shopItems.map((item) => (
                  <RecordCard
                    key={`${item.source}-${item.slug}`}
                    title={item.title}
                    meta={`${item.category} - ${item.price}`}
                    source={item.source}
                    description={item.description}
                    actions={
                      item.id ? (
                        <div className="flex gap-2">
                          <SmallButton
                            label="Edit"
                            icon={PencilLine}
                            onClick={() => setShopDraft(shopItemToDraft(item))}
                          />
                          <DangerButton
                            label="Delete"
                            icon={Trash2}
                            onClick={() => {
                              if (!window.confirm(`Delete the shop item "${item.title}"?`)) {
                                return;
                              }

                              void runTask("delete-shop", "Shop item deleted.", async () => {
                                await deleteShopItem({ data: { id: item.id! } });
                                setShopDraft(shopItemToDraft());
                            });
                          }}
                        />
                      </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                          <SmallButton
                            label="Edit"
                            icon={PencilLine}
                            onClick={() => setShopDraft(shopItemToDraft(item))}
                          />
                          <DangerButton
                            label="Delete"
                            icon={Trash2}
                            onClick={() => {
                              if (
                                !item.legacyKey ||
                                !window.confirm(`Hide the legacy shop item "${item.title}"?`)
                              ) {
                                return;
                              }

                              void runTask("delete-legacy-shop", "Legacy shop item hidden.", async () => {
                                await hideLegacyItem("shop", item.legacyKey!);
                                setShopDraft((prev) =>
                                  prev.legacyKey === item.legacyKey ? shopItemToDraft() : prev,
                                );
                              });
                            }}
                          />
                        </div>
                      )
                    }
                  />
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void runTask("save-shop", "Shop item saved.", async () => {
                    const payload: SaveShopItemInput = { ...shopDraft };
                    await saveShopItem({ data: payload });
                    setShopDraft(shopItemToDraft());
                  });
                }}
                className={darkPanelClass}
              >
                <FormHeader
                  title={
                    shopDraft.id
                      ? "Edit shop item"
                      : isLegacyShopDraft
                        ? "Import legacy shop item"
                        : "Add shop item"
                  }
                  description={
                    isLegacyShopDraft
                      ? "Saving this legacy product moves it under admin control and hides the older frontend-only card."
                      : "Use this for books, kits, maps, souvenirs or any shop card you want to show."
                  }
                  onReset={() => setShopDraft(shopItemToDraft())}
                />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Title"
                    value={shopDraft.title}
                    onChange={(value) => setShopDraft((prev) => ({ ...prev, title: value }))}
                    required
                  />
                  <Field
                    label="Slug"
                    value={shopDraft.slug}
                    onChange={(value) => setShopDraft((prev) => ({ ...prev, slug: value }))}
                    placeholder="optional-auto-generated"
                  />
                  <Field
                    label="Category"
                    value={shopDraft.category}
                    onChange={(value) => setShopDraft((prev) => ({ ...prev, category: value }))}
                  />
                  <Field
                    label="Badge"
                    value={shopDraft.badge}
                    onChange={(value) => setShopDraft((prev) => ({ ...prev, badge: value }))}
                    placeholder="Bestseller / New / Gift Pick"
                  />
                  <Field
                    label="Price"
                    value={shopDraft.price}
                    onChange={(value) => setShopDraft((prev) => ({ ...prev, price: value }))}
                  />
                </div>
                <div className="mt-4">
                  <SingleImagePicker
                    label="Shop Image"
                    value={shopDraft.image}
                    onChange={(value) => setShopDraft((prev) => ({ ...prev, image: value }))}
                    uploadLabel="Choose shop image"
                    urlPlaceholder="https://example.com/book.jpg"
                    helper="Upload a product image or switch to a URL if the image is already hosted online."
                  />
                </div>
                <div className="mt-4">
                  <TextAreaField
                    label="Description"
                    value={shopDraft.description}
                    onChange={(value) =>
                      setShopDraft((prev) => ({ ...prev, description: value }))
                    }
                    rows={5}
                  />
                </div>
                <SubmitButton
                  busy={busyKey === "save-shop"}
                  label={
                    shopDraft.id
                      ? "Update shop item"
                      : isLegacyShopDraft
                        ? "Save as admin-managed shop item"
                        : "Create shop item"
                  }
                />
              </form>
            </div>
              </SectionCard>
            )}

            {activeSection === "blogs" && (
              <SectionCard
                id="blogs"
                title="Blogs"
                subtitle="Create blog posts that show up in the blog listing, homepage journal section and blog detail pages."
              >
            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-4">
                {blogPosts.map((post) => (
                  <RecordCard
                    key={`${post.source}-${post.slug}`}
                    title={post.title}
                    meta={`${post.category} - ${post.date}`}
                    source={post.source}
                    description={post.excerpt}
                    actions={
                      post.id ? (
                        <div className="flex gap-2">
                          <SmallButton
                            label="Edit"
                            icon={PencilLine}
                            onClick={() => setBlogDraft(blogToDraft(post))}
                          />
                          <DangerButton
                            label="Delete"
                            icon={Trash2}
                            onClick={() => {
                              if (!window.confirm(`Delete the blog "${post.title}"?`)) {
                                return;
                              }

                              void runTask("delete-blog", "Blog post deleted.", async () => {
                                await deleteBlogPost({ data: { id: post.id! } });
                                setBlogDraft(blogToDraft());
                            });
                          }}
                        />
                      </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                          <SmallButton
                            label="Edit"
                            icon={PencilLine}
                            onClick={() => setBlogDraft(blogToDraft(post))}
                          />
                          <DangerButton
                            label="Delete"
                            icon={Trash2}
                            onClick={() => {
                              if (
                                !post.legacyKey ||
                                !window.confirm(`Hide the legacy blog "${post.title}"?`)
                              ) {
                                return;
                              }

                              void runTask("delete-legacy-blog", "Legacy blog hidden.", async () => {
                                await hideLegacyItem("blog", post.legacyKey!);
                                setBlogDraft((prev) =>
                                  prev.legacyKey === post.legacyKey ? blogToDraft() : prev,
                                );
                              });
                            }}
                          />
                        </div>
                      )
                    }
                  />
                ))}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void runTask("save-blog", "Blog post saved.", async () => {
                    const payload: SaveBlogPostInput = { ...blogDraft };
                    await saveBlogPost({ data: payload });
                    setBlogDraft(blogToDraft());
                  });
                }}
                className={darkPanelClass}
              >
                <FormHeader
                  title={
                    blogDraft.id
                      ? "Edit blog post"
                      : isLegacyBlogDraft
                        ? "Import legacy blog post"
                        : "Add blog post"
                  }
                  description={
                    isLegacyBlogDraft
                      ? "Saving this legacy article creates a CMS-managed copy and hides the older frontend-only version."
                      : "Use the content field for the full article body. Separate paragraphs with blank lines."
                  }
                  onReset={() => setBlogDraft(blogToDraft())}
                />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Title"
                    value={blogDraft.title}
                    onChange={(value) => setBlogDraft((prev) => ({ ...prev, title: value }))}
                    required
                  />
                  <Field
                    label="Slug"
                    value={blogDraft.slug}
                    onChange={(value) => setBlogDraft((prev) => ({ ...prev, slug: value }))}
                    placeholder="optional-auto-generated"
                  />
                  <Field
                    label="Category"
                    value={blogDraft.category}
                    onChange={(value) => setBlogDraft((prev) => ({ ...prev, category: value }))}
                  />
                  <Field
                    label="Published On"
                    type="date"
                    value={blogDraft.publishedOn}
                    onChange={(value) =>
                      setBlogDraft((prev) => ({ ...prev, publishedOn: value }))
                    }
                  />
                </div>
                <div className="mt-4">
                  <SingleImagePicker
                    label="Blog Cover Image"
                    value={blogDraft.image}
                    onChange={(value) => setBlogDraft((prev) => ({ ...prev, image: value }))}
                    uploadLabel="Choose blog image"
                    urlPlaceholder="https://example.com/blog-cover.jpg"
                    helper="Upload the cover image directly, or switch to a URL if the image already lives online."
                  />
                </div>
                <div className="mt-4 grid gap-4">
                  <TextAreaField
                    label="Excerpt"
                    value={blogDraft.excerpt}
                    onChange={(value) => setBlogDraft((prev) => ({ ...prev, excerpt: value }))}
                    rows={4}
                  />
                  <TextAreaField
                    label="Full Content"
                    value={blogDraft.content}
                    onChange={(value) => setBlogDraft((prev) => ({ ...prev, content: value }))}
                    rows={12}
                    helper="Use blank lines between paragraphs."
                  />
                </div>
                <SubmitButton
                  busy={busyKey === "save-blog"}
                  label={
                    blogDraft.id
                      ? "Update blog post"
                      : isLegacyBlogDraft
                        ? "Save as admin-managed blog"
                        : "Create blog post"
                  }
                />
              </form>
            </div>
              </SectionCard>
            )}
          </main>
        </div>
      </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  subvalue,
}: {
  icon: any;
  label: string;
  value: string;
  subvalue: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(24,24,24,0.98),rgba(14,14,14,0.98))] p-5 shadow-[0_18px_36px_-24px_rgba(0,0,0,0.95)] transition hover:-translate-y-0.5 hover:border-white/14 hover:shadow-[0_24px_44px_-26px_rgba(0,0,0,1)]">
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-500/15 bg-orange-500/10 text-orange-200">
          <Icon size={20} />
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Dashboard
        </span>
      </div>
      <p className="mt-5 text-xs uppercase tracking-[0.22em] text-white/40">{label}</p>
      <p className="mt-2 font-sans text-[2.1rem] font-semibold leading-none tracking-[-0.02em] text-white">
        {value}
      </p>
      <p className="mt-2 text-sm text-white/55">{subvalue}</p>
    </div>
  );
}

function SectionCard({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,20,0.98),rgba(12,12,12,0.98))] p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.95)] md:p-8"
    >
      <div className="mb-8 border-b border-white/8 pb-6">
        <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
          {title}
        </span>
        <h2 className="mt-4 font-sans text-3xl font-semibold tracking-[-0.02em] text-white md:text-[2.75rem]">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function FormHeader({
  title,
  description,
  onReset,
}: {
  title: string;
  description: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h3 className="font-sans text-2xl font-semibold tracking-[-0.02em] text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/18 hover:bg-white/[0.08]"
      >
        <Plus size={15} />
        Reset form
      </button>
    </div>
  );
}

function RecordCard({
  title,
  meta,
  source,
  description,
  actions,
}: {
  title: string;
  meta: string;
  source?: string;
  description: string;
  actions: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(24,24,24,0.98),rgba(14,14,14,0.98))] p-5 shadow-[0_18px_36px_-24px_rgba(0,0,0,0.95)] transition hover:-translate-y-0.5 hover:border-white/14 hover:shadow-[0_24px_44px_-26px_rgba(0,0,0,1)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-orange-300/80">{meta}</p>
          <h3 className="mt-2 font-sans text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-white">
            {title}
          </h3>
        </div>
        <SourceBadge source={source} />
      </div>
      <p className="mt-4 min-h-[72px] text-sm leading-6 text-white/58">{description}</p>
      <div className="mt-5 border-t border-white/8 pt-4">{actions}</div>
    </div>
  );
}

function SourceBadge({ source }: { source?: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
        source === "database"
          ? "border border-emerald-500/20 bg-emerald-500/12 text-emerald-300"
          : "border border-white/10 bg-white/[0.04] text-white/50"
      }`}
    >
      {source === "database" ? "Admin managed" : "Legacy frontend"}
    </span>
  );
}

function LegacyNote({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
      {text}
    </div>
  );
}

function SmallButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: any;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={ghostButtonClass}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function DangerButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: any;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/14"
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function SubmitButton({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff7a18_0%,#ff3d71_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-18px_rgba(255,97,45,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_-18px_rgba(255,97,45,0.72)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <Save size={16} />
      {busy ? "Saving..." : label}
    </button>
  );
}

function SingleImagePicker({
  label,
  value,
  onChange,
  uploadLabel,
  urlPlaceholder,
  helper,
  uploadOptions,
  accept,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  uploadLabel: string;
  urlPlaceholder: string;
  helper?: string;
  uploadOptions?: ImageUploadOptions;
  accept?: string;
}) {
  const [mode, setMode] = useState<ImageInputMode>("upload");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const hasImage = value.trim().length > 0;

  useEffect(() => {
    setUploadError(null);

    if (value.trim().startsWith("data:")) {
      setMode("upload");
      return;
    }

    if (value.trim()) {
      setMode("url");
      return;
    }

    setMode("upload");
  }, [value]);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadError(null);

    try {
      onChange(await readFileAsDataUrl(file, uploadOptions));
      setMode("upload");
    } catch (error) {
      setUploadError(formatError(error));
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(20,20,20,0.98),rgba(14,14,14,0.98))] p-5 shadow-[0_20px_40px_-26px_rgba(0,0,0,0.95)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
          <h4 className="mt-2 font-sans text-2xl font-semibold tracking-[-0.02em] text-white">Choose image</h4>
          {helper && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{helper}</p>
          )}
        </div>
        {hasImage && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/18 hover:bg-white/[0.08]"
          >
            <Trash2 size={14} />
            Clear image
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-[1.25rem] border border-white/8 bg-black/35 shadow-[0_14px_28px_-20px_rgba(0,0,0,0.95)]">
          <div className="aspect-[4/3] bg-black/30">
            {hasImage ? (
              <img src={value} alt={label} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/45">
                Choose an image from upload or switch to an image URL.
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => setMode("upload")}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                  mode === "upload"
                    ? "border-transparent bg-[linear-gradient(135deg,#ff7a18_0%,#ff3d71_100%)] text-white"
                    : "border-white/10 bg-white/[0.04] text-white/75"
                }`}
              >
              <ImagePlus size={14} />
              Upload image
            </button>
            <button
                type="button"
                onClick={() => setMode("url")}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                  mode === "url"
                    ? "border-transparent bg-[linear-gradient(135deg,#ff7a18_0%,#ff3d71_100%)] text-white"
                    : "border-white/10 bg-white/[0.04] text-white/75"
                }`}
              >
              <PencilLine size={14} />
              Use image URL
            </button>
          </div>

          {mode === "upload" ? (
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">
                {uploadLabel}
              </label>
              <input
                type="file"
                accept={accept ?? "image/*"}
                onChange={(event) => void handleImageUpload(event)}
                className="block w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-[linear-gradient(135deg,#ff7a18_0%,#ff3d71_100%)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {uploadError && <p className="mt-2 text-xs text-red-300">{uploadError}</p>}
            </div>
          ) : (
            <Field
              label="Image URL"
              value={value}
              onChange={onChange}
              placeholder={urlPlaceholder}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className={multilineInputClass}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className={multilineInputClass}
      >
        <option value="">Select option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  helper?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={multilineInputClass}
      />
      {helper && <p className="mt-2 text-xs leading-5 text-white/42">{helper}</p>}
    </div>
  );
}
