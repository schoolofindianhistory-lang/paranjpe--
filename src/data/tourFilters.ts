import type { Tour } from "@/data/tours";
import type { ContentCategory, ManagedTour } from "@/lib/content.types";

export const tourListingFilters = [
  { value: "all", label: "All Tours" },
  { value: "one-day-tour", label: "One Day Tour" },
  { value: "heritage-walk", label: "Heritage Walk" },
  { value: "multiple-day-tour", label: "Multiple Day Tour" },
] as const;

export type TourListingFilter = string;
export type TourListingFilterOption = {
  value: string;
  label: string;
};

function slugifyCategory(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function addFilter(filters: Map<string, TourListingFilterOption>, value: string, label: string) {
  const normalizedValue = value.trim();
  const normalizedLabel = label.trim();

  if (!normalizedValue || !normalizedLabel || filters.has(normalizedValue)) {
    return;
  }

  filters.set(normalizedValue, {
    value: normalizedValue,
    label: normalizedLabel,
  });
}

export function getTourListingType(tour: Tour | ManagedTour, categories: ContentCategory[] = []) {
  const managedTour = tour as ManagedTour;

  if (managedTour.categoryId !== undefined) {
    const category = categories.find((item) => item.id === managedTour.categoryId);
    if (category?.slug) {
      return category.slug;
    }
  }

  const category = categories.find((item) => item.name.trim().toLowerCase() === tour.category.trim().toLowerCase());
  return category?.slug || slugifyCategory(tour.category);
}

export function buildTourListingFilters(tours: ManagedTour[], categories: ContentCategory[]) {
  const filters = new Map<string, TourListingFilterOption>();
  addFilter(filters, "all", "All Tours");

  for (const category of categories) {
    addFilter(filters, category.slug, category.name);
  }

  for (const tour of tours) {
    addFilter(filters, getTourListingType(tour, categories), tour.category);
  }

  return Array.from(filters.values());
}

export function filterToursByListingType(
  list: ManagedTour[],
  filter: TourListingFilter,
  categories: ContentCategory[] = [],
) {
  if (filter === "all") return list;
  return list.filter((tour) => getTourListingType(tour, categories) === filter);
}
