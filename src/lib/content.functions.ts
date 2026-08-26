import type { ContactEnquiryInput } from "@/data/contactEnquiry";
import type { AdminDashboardData, PublicSiteContent } from "@/lib/content.types";
import type {
  LegacyContentType,
  SaveBlogPostInput,
  SaveCategoryInput,
  SaveGalleryItemInput,
  SaveHeroSectionInput,
  SaveShopItemInput,
  SaveTeamMemberInput,
  SaveTestimonialInput,
  SaveTourInput,
} from "@/lib/content.server";

type ServerFnInput<T> = { data: T };

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed.");
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return payload as T;
}

function postData<TInput, TOutput = { success: true }>(path: string, input: ServerFnInput<TInput>) {
  return apiRequest<TOutput>(path, {
    method: "POST",
    body: JSON.stringify(input.data),
  });
}

export function getPublicSiteContent() {
  return apiRequest<PublicSiteContent>("/api/content");
}

export function getAdminDashboardContent() {
  return apiRequest<AdminDashboardData>("/api/admin/dashboard");
}

export function getAdminSessionState() {
  return apiRequest<{ authenticated: boolean; admin: AdminDashboardData["admin"] | null }>(
    "/api/admin/session",
  );
}

export function loginAdmin({ data }: ServerFnInput<{ username: string; password: string }>) {
  return apiRequest<AdminDashboardData["admin"]>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logoutAdmin() {
  return apiRequest<{ success: true }>("/api/admin/logout", { method: "POST" });
}

export function saveCategory(input: ServerFnInput<SaveCategoryInput>) {
  return postData("/api/admin/categories", input);
}

export function deleteCategory(input: ServerFnInput<{ id: number }>) {
  return postData("/api/admin/categories/delete", input);
}

export function saveTour(input: ServerFnInput<SaveTourInput>) {
  return postData("/api/admin/tours", input);
}

export function deleteTour(input: ServerFnInput<{ id: number }>) {
  return postData("/api/admin/tours/delete", input);
}

export function saveHeroSection(input: ServerFnInput<SaveHeroSectionInput>) {
  return postData("/api/admin/hero", input);
}

export function saveTestimonial(input: ServerFnInput<SaveTestimonialInput>) {
  return postData("/api/admin/testimonials", input);
}

export function deleteTestimonial(input: ServerFnInput<{ id: number }>) {
  return postData("/api/admin/testimonials/delete", input);
}

export function saveTeamMember(input: ServerFnInput<SaveTeamMemberInput>) {
  return postData("/api/admin/team-members", input);
}

export function deleteTeamMember(input: ServerFnInput<{ id: number }>) {
  return postData("/api/admin/team-members/delete", input);
}

export function saveShopItem(input: ServerFnInput<SaveShopItemInput>) {
  return postData("/api/admin/shop-items", input);
}

export function deleteShopItem(input: ServerFnInput<{ id: number }>) {
  return postData("/api/admin/shop-items/delete", input);
}

export function saveGalleryItem(input: ServerFnInput<SaveGalleryItemInput>) {
  return postData("/api/admin/gallery-items", input);
}

export function deleteGalleryItem(input: ServerFnInput<{ id: number }>) {
  return postData("/api/admin/gallery-items/delete", input);
}

export function saveBlogPost(input: ServerFnInput<SaveBlogPostInput>) {
  return postData("/api/admin/blog-posts", input);
}

export function deleteBlogPost(input: ServerFnInput<{ id: number }>) {
  return postData("/api/admin/blog-posts/delete", input);
}

export function deleteLegacyContent(input: ServerFnInput<{ type: LegacyContentType; legacyKey: string }>) {
  return postData("/api/admin/legacy-content/delete", input);
}

export function submitContactEnquiry(input: ServerFnInput<ContactEnquiryInput>) {
  return postData<
    ContactEnquiryInput,
    { savedToDatabase: boolean; sentToEmail: boolean; enquiryId: number }
  >("/api/contact-enquiries", input);
}
