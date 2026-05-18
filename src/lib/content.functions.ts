import type { ContactEnquiryInput } from "@/data/contactEnquiry";
import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl, setResponseHeader } from "@tanstack/react-start/server";
import { loginWithCredentials, logoutCurrentAdmin, requireAdmin } from "@/lib/auth.server";
import {
  deleteBlogPostById,
  deleteCategoryById,
  deleteGalleryItemById,
  hideLegacyContent,
  deleteShopItemById,
  deleteTeamMemberById,
  deleteTestimonialById,
  deleteTourById,
  fetchAdminDashboardData,
  fetchPublicSiteContent,
  type LegacyContentType,
  type SaveBlogPostInput,
  type SaveCategoryInput,
  type SaveGalleryItemInput,
  type SaveHeroSectionInput,
  type SaveShopItemInput,
  type SaveTeamMemberInput,
  type SaveTestimonialInput,
  type SaveTourInput,
  submitPublicContactEnquiry,
  upsertBlogPost,
  upsertCategory,
  upsertGalleryItem,
  upsertHeroSection,
  upsertShopItem,
  upsertTeamMember,
  upsertTestimonial,
  upsertTour,
} from "@/lib/content.server";

export const getPublicSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  getRequestUrl();
  setResponseHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  return fetchPublicSiteContent();
});

export const getAdminDashboardContent = createServerFn({ method: "GET" }).handler(async () => {
  getRequestUrl();
  setResponseHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  return fetchAdminDashboardData();
});

export const getAdminSessionState = createServerFn({ method: "GET" }).handler(async () => {
  getRequestUrl();
  setResponseHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  const admin = await requireAdmin().catch(() => null);
  return { authenticated: Boolean(admin), admin };
});

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    return loginWithCredentials(data.username.trim(), data.password);
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  await logoutCurrentAdmin();
  return { success: true };
});

export const saveCategory = createServerFn({ method: "POST" })
  .inputValidator((data: SaveCategoryInput) => data)
  .handler(async ({ data }) => {
    await upsertCategory(data);
    return { success: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await deleteCategoryById(data.id);
    return { success: true };
  });

export const saveTour = createServerFn({ method: "POST" })
  .inputValidator((data: SaveTourInput) => data)
  .handler(async ({ data }) => {
    await upsertTour(data);
    return { success: true };
  });

export const saveHeroSection = createServerFn({ method: "POST" })
  .inputValidator((data: SaveHeroSectionInput) => data)
  .handler(async ({ data }) => {
    await upsertHeroSection(data);
    return { success: true };
  });

export const deleteTour = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await deleteTourById(data.id);
    return { success: true };
  });

export const saveTestimonial = createServerFn({ method: "POST" })
  .inputValidator((data: SaveTestimonialInput) => data)
  .handler(async ({ data }) => {
    await upsertTestimonial(data);
    return { success: true };
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await deleteTestimonialById(data.id);
    return { success: true };
  });

export const saveTeamMember = createServerFn({ method: "POST" })
  .inputValidator((data: SaveTeamMemberInput) => data)
  .handler(async ({ data }) => {
    await upsertTeamMember(data);
    return { success: true };
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await deleteTeamMemberById(data.id);
    return { success: true };
  });

export const saveShopItem = createServerFn({ method: "POST" })
  .inputValidator((data: SaveShopItemInput) => data)
  .handler(async ({ data }) => {
    await upsertShopItem(data);
    return { success: true };
  });

export const deleteShopItem = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await deleteShopItemById(data.id);
    return { success: true };
  });

export const saveGalleryItem = createServerFn({ method: "POST" })
  .inputValidator((data: SaveGalleryItemInput) => data)
  .handler(async ({ data }) => {
    await upsertGalleryItem(data);
    return { success: true };
  });

export const deleteGalleryItem = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await deleteGalleryItemById(data.id);
    return { success: true };
  });

export const saveBlogPost = createServerFn({ method: "POST" })
  .inputValidator((data: SaveBlogPostInput) => data)
  .handler(async ({ data }) => {
    await upsertBlogPost(data);
    return { success: true };
  });

export const deleteBlogPost = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await deleteBlogPostById(data.id);
    return { success: true };
  });

export const deleteLegacyContent = createServerFn({ method: "POST" })
  .inputValidator((data: { type: LegacyContentType; legacyKey: string }) => data)
  .handler(async ({ data }) => {
    await hideLegacyContent(data);
    return { success: true };
  });

export const submitContactEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: ContactEnquiryInput) => data)
  .handler(async ({ data }) => {
    return submitPublicContactEnquiry(data);
  });
