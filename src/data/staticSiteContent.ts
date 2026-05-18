import heroTemple from "@/assets/hero-temple.jpg";
import heroStory from "@/assets/hero-story.jpg";
import heroWalk from "@/assets/hero-walk.jpg";
import shaniwar from "@/assets/tour-shaniwar.jpg";
import sinhagad from "@/assets/tour-sinhagad.jpg";
import shivneri from "@/assets/tour-shivneri.jpg";
import shaniwarFront from "@/assets/gallery/shaniwar-front.jpg";
import sinhagadView from "@/assets/gallery/sinhagad-view.jpg";
import shivneriMain from "@/assets/gallery/shivneri-main.jpg";
import parvatiHill from "@/assets/gallery/parvati-hill.jpg";
import kondaneChaitya from "@/assets/gallery/kondane-chaitya.jpg";
import gondeshwarComplex from "@/assets/gallery/gondeshwar-complex.jpg";
import hampiVitthala from "@/assets/gallery/hampi-vitthala.jpg";
import varanasiMunshiGhat from "@/assets/gallery/varanasi-munshi-ghat.jpg";
import { defaultTeamMembers } from "@/data/teamMembers";
import type {
  GalleryItem,
  HeroSectionContent,
  ShopItem,
  TeamMember,
  Testimonial,
} from "@/lib/content.types";

export const staticTestimonials: Testimonial[] = [
  {
    name: "Anita Joshi",
    role: "Family traveller",
    text: "The Shaniwar Wada walk made history come alive for our kids. We didn't want it to end.",
    source: "static",
  },
  {
    name: "Rahul Deshmukh",
    role: "School teacher",
    text: "I've taken three batches of students with Paranjape Tours. The storytelling is exceptional.",
    source: "static",
  },
  {
    name: "Meera Kulkarni",
    role: "History enthusiast",
    text: "Sinhagad with their guide felt less like a trek and more like a Maratha epic unfolding.",
    source: "static",
  },
  {
    name: "Aniket Patil",
    role: "Corporate group lead",
    text: "Smooth, soulful and genuinely premium. Our team still talks about it.",
    source: "static",
  },
];

export const staticTeamMembers: TeamMember[] = defaultTeamMembers.map((member) => ({
  ...member,
  source: "static",
}));

export const staticShopItems: ShopItem[] = [
  {
    slug: "pune-heritage-walk-companion",
    image: heroWalk,
    badge: "Bestseller",
    category: "Booklet",
    title: "Pune Heritage Walk Companion",
    price: "Rs. 299",
    description: "A compact storytelling guide to old Pune landmarks, wadas and cultural clues.",
    source: "static",
  },
  {
    slug: "shivneri-explorer-kit",
    image: shivneri,
    badge: "New",
    category: "Study Kit",
    title: "Shivneri Explorer Kit",
    price: "Rs. 649",
    description: "Timeline cards, a site map and activity sheets for students visiting Shivneri.",
    source: "static",
  },
  {
    slug: "temple-detail-postcard-pack",
    image: heroTemple,
    badge: "Gift Pick",
    category: "Print Set",
    title: "Temple Detail Postcard Pack",
    price: "Rs. 399",
    description: "A set of textured art postcards inspired by stone carvings and temple motifs.",
    source: "static",
  },
  {
    slug: "shaniwar-wada-keepsake-box",
    image: shaniwar,
    badge: "Group Order",
    category: "Souvenir",
    title: "Shaniwar Wada Keepsake Box",
    price: "Rs. 899",
    description: "A premium gift box for school groups, cultural events and corporate outings.",
    source: "static",
  },
  {
    slug: "sahyadri-fort-trails-map",
    image: sinhagad,
    badge: "Traveller Favorite",
    category: "Map",
    title: "Sahyadri Fort Trails Map",
    price: "Rs. 349",
    description: "A folded reference map for iconic fort circuits with quick history notes.",
    source: "static",
  },
  {
    slug: "curated-heritage-gift-hamper",
    image: heroStory,
    badge: "Custom",
    category: "Bulk Gifting",
    title: "Curated Heritage Gift Hamper",
    price: "From Rs. 1,499",
    description: "Made-to-order hampers for institutions, family celebrations and hosted groups.",
    source: "static",
  },
];

export const staticGalleryItems: GalleryItem[] = [
  {
    slug: "shaniwar-wada-night-view",
    title: "Shaniwar Wada at Dusk",
    image: shaniwarFront,
    description: "An evening frame of Pune's iconic Peshwa-era fortification.",
    sortOrder: 10,
    isPublished: true,
    source: "static",
  },
  {
    slug: "sinhagad-ridge-view",
    title: "Sinhagad Ridge View",
    image: sinhagadView,
    description: "A sweeping Sahyadri view from the Sinhagad fort walls.",
    sortOrder: 20,
    isPublished: true,
    source: "static",
  },
  {
    slug: "shivneri-main-approach",
    title: "Shivneri Main Approach",
    image: shivneriMain,
    description: "The historic approach inside Shivneri, birthplace of Chhatrapati Shivaji Maharaj.",
    sortOrder: 30,
    isPublished: true,
    source: "static",
  },
  {
    slug: "parvati-hill-complex",
    title: "Parvati Hill Complex",
    image: parvatiHill,
    description: "Temple silhouettes and city-facing heights of Parvati.",
    sortOrder: 40,
    isPublished: true,
    source: "static",
  },
  {
    slug: "kondane-chaitya-detail",
    title: "Kondane Chaitya Detail",
    image: kondaneChaitya,
    description: "Rock-cut forms that preserve early Buddhist architectural memory.",
    sortOrder: 50,
    isPublished: true,
    source: "static",
  },
  {
    slug: "gondeshwar-complex-panorama",
    title: "Gondeshwar Panorama",
    image: gondeshwarComplex,
    description: "A wide architectural look at the Hemadpanthi Gondeshwar complex.",
    sortOrder: 60,
    isPublished: true,
    source: "static",
  },
  {
    slug: "hampi-vitthala-corridor",
    title: "Hampi Vitthala Corridor",
    image: hampiVitthala,
    description: "Stone pavilions and rhythm at the Vitthala Temple complex, Hampi.",
    sortOrder: 70,
    isPublished: true,
    source: "static",
  },
  {
    slug: "varanasi-ghat-life",
    title: "Varanasi Ghat Life",
    image: varanasiMunshiGhat,
    description: "Boats, light, and devotional movement along the riverfront in Varanasi.",
    sortOrder: 80,
    isPublished: true,
    source: "static",
  },
];

export const staticHeroSection: HeroSectionContent = {
  desktopImage: heroTemple,
  mobileImage: "",
  heading: "Explore Living Heritage Beyond Tourism",
  subheading:
    "Temple towns, sacred spaces and layered stories led with depth and clarity.",
  ctaText: "Explore Tours",
  ctaLink: "/tours",
  overlayOpacity: 0.35,
  source: "static",
};
