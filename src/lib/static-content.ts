import { blogPosts as staticBlogPosts } from "@/data/blogPosts";
import { tours as staticTours } from "@/data/tours";
import {
  staticGalleryItems,
  staticHeroSection,
  staticShopItems,
  staticTeamMembers,
  staticTestimonials,
} from "@/data/staticSiteContent";
import { siteContact } from "@/data/siteContact";
import type { ContactEnquiryInput } from "@/data/contactEnquiry";
import type { BlogPost, ContentCategory, ManagedTour, PublicSiteContent } from "@/lib/content.types";

type SubmitContactEnquiryArgs = {
  data: ContactEnquiryInput;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildStaticCategories(tours: ManagedTour[]): ContentCategory[] {
  const uniqueCategories = new Map<string, ContentCategory>();

  for (const tour of tours) {
    const name = tour.category.trim();
    if (!name) continue;

    const slug = slugify(name);
    if (uniqueCategories.has(slug)) continue;

    uniqueCategories.set(slug, {
      id: uniqueCategories.size + 1,
      name,
      slug,
      description: `${name} experiences curated by Paranjape Tours.`,
      source: "static",
    });
  }

  return Array.from(uniqueCategories.values());
}

export function getPublicSiteContent(): PublicSiteContent {
  const tours: ManagedTour[] = staticTours
    .filter((tour) => tour.status !== "draft")
    .map((tour) => ({
      ...tour,
      legacyKey: tour.slug,
      source: "static",
    }));

  const blogPosts: BlogPost[] = staticBlogPosts.map((post) => ({
    ...post,
    legacyKey: post.slug,
    source: "static",
  }));

  return {
    tours,
    blogPosts,
    testimonials: staticTestimonials,
    teamMembers: staticTeamMembers,
    shopItems: staticShopItems,
    galleryItems: staticGalleryItems
      .filter((item) => item.isPublished)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
    heroSection: staticHeroSection,
    categories: buildStaticCategories(tours),
    databaseAvailable: false,
  };
}

function getWeb3FormsAccessKey() {
  return (
    import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
    import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ||
    import.meta.env.WEB3FORMS_ACCESS_KEY ||
    ""
  ).trim();
}

function formatEnquiryMessage(data: ContactEnquiryInput) {
  return [
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    `Category: ${data.categoryValue}`,
    `Preferred contact: ${data.preferredContactMethod}`,
    `Organisation: ${data.organizationName || "Not provided"}`,
    `Subject: ${data.subject}`,
    `Schedule: ${data.scheduleDetails}`,
    `Group: ${data.groupDetails}`,
    `Location: ${data.locationDetails}`,
    "",
    data.message,
  ].join("\n");
}

export async function submitContactEnquiry({ data }: SubmitContactEnquiryArgs) {
  const accessKey = getWeb3FormsAccessKey();

  if (!accessKey) {
    throw new Error(
      `Automatic enquiry email is not configured yet. Please email ${siteContact.email} or message us on WhatsApp.`,
    );
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      from_name: data.fullName,
      email: data.email,
      phone: data.phone,
      subject: `Website enquiry: ${data.subject}`,
      message: formatEnquiryMessage(data),
    }),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `We could not send your enquiry right now. Please email ${siteContact.email}.`,
    );
  }

  return {
    savedToDatabase: false,
    sentToEmail: true,
    enquiryId: 0,
  };
}
