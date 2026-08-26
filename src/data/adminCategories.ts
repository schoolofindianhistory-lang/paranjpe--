export const adminTourCategoryPresets = [
  {
    name: "One Day Tour",
    slug: "one-day-tour",
    description: "Short format trips and excursions that begin and finish the same day.",
    summary: "Single-day experiences for quick getaways and local discovery.",
  },
  {
    name: "Heritage Walk",
    slug: "heritage-walk",
    description: "Story-led walking tours focused on culture, architecture and local history.",
    summary: "Slow-paced guided walks through heritage sites and neighborhoods.",
  },
  {
    name: "Multiple Day Tour",
    slug: "multiple-day-tour",
    description: "Longer journeys with overnight stays, deeper exploration and full itineraries.",
    summary: "Extended tours for travellers who want a broader, multi-stop experience.",
  },
] as const;

export const adminTourCategoryPresetSlugs = new Set<string>(
  adminTourCategoryPresets.map((category) => category.slug),
);

export function isAdminTourPresetSlug(slug: string) {
  return adminTourCategoryPresetSlugs.has(slug);
}
