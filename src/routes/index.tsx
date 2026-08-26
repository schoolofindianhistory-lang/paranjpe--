import { createFileRoute, Link } from "@/lib/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Heart,
  MountainSnow,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { getPublicSiteContent } from "@/lib/static-content";
import { resolveBlogImage } from "@/lib/blog-images";
import type { Testimonial } from "@/lib/content.types";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { createWhatsAppUrl } from "@/data/siteContact";
import { TourCard } from "@/components/site/TourCard";
import heroTemple from "@/assets/hero-temple.jpg";
import hampiVitthala from "@/assets/gallery/hampi-vitthala.jpg";
import pattadakalTemple from "@/assets/gallery/pattadakal-temple.jpg";
import shaniwarFront from "@/assets/gallery/shaniwar-front.jpg";
import gondeshwarComplex from "@/assets/gallery/gondeshwar-complex.jpg";

export const Route = createFileRoute("/")({
  loader: () => getPublicSiteContent(),
  headers: () => ({
    "Cache-Control": "no-cache, no-store, must-revalidate",
  }),
  head: () => ({
    meta: [
      { title: "Paranjape Tours - Heritage Storytelling Travel" },
      {
        name: "description",
        content: "Curated heritage walks, fort tours, temple journeys and cultural storytelling experiences.",
      },
      { property: "og:title", content: "Paranjape Tours - Heritage Storytelling" },
      {
        property: "og:description",
        content: "Travel through time, not just places. Heritage journeys led by expert storytellers.",
      },
    ],
  }),
  component: Home,
});

const whyUs = [
  {
    icon: BookOpen,
    title: "Expert Heritage Guides",
    desc: "Historians and storytellers, not script-readers.",
  },
  {
    icon: Sparkles,
    title: "Storytelling-Based Tours",
    desc: "We turn dates into drama and stones into stories.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Comfortable Travel",
    desc: "Vetted transport, first-aid and small group sizes.",
  },
  {
    icon: Users,
    title: "Small Group Experiences",
    desc: "Intimate groups so every question is heard.",
  },
  {
    icon: Compass,
    title: "Curated Itineraries",
    desc: "Every minute is designed for depth and delight.",
  },
  {
    icon: Utensils,
    title: "Local Culture & Food",
    desc: "Regional flavours and warm local hospitality along the way.",
  },
];

const landmarkGallerySources = {
  khajuraho: "https://commons.wikimedia.org/wiki/Special:FilePath/Khajuraho%20Temples.JPG",
  belur: "https://commons.wikimedia.org/wiki/Special:FilePath/BELUR%2C%20TEMPLE.jpg",
  halebidu:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hoysaleswara%20temple%2C%20Halebidu%20%281%29.jpg",
  kumbhalgarh: "https://commons.wikimedia.org/wiki/Special:FilePath/Kumbhalgarh%20fort.JPG",
  konark: "https://commons.wikimedia.org/wiki/Special:FilePath/KONARK%20Sun%20Temple.jpg",
} as const;

const homeGallery = [
  {
    image: landmarkGallerySources.khajuraho,
    title: "Khajuraho",
    alt: "Temple spires at the Khajuraho group of monuments",
  },
  {
    image: landmarkGallerySources.belur,
    title: "Belur",
    alt: "Chennakeshava Temple at Belur",
  },
  {
    image: landmarkGallerySources.halebidu,
    title: "Halebidu",
    alt: "Hoysaleswara Temple at Halebidu",
  },
  {
    image: hampiVitthala,
    title: "Hampi",
    alt: "Stone mandapas at the Vitthala Temple complex in Hampi",
  },
  {
    image: shaniwarFront,
    title: "Shaniwar Wada",
    alt: "Front view of Shaniwar Wada illuminated at night",
  },
  {
    image: landmarkGallerySources.kumbhalgarh,
    title: "Kumbhalgarh",
    alt: "Wide view of Kumbhalgarh Fort in Rajasthan",
  },
  {
    image: landmarkGallerySources.konark,
    title: "Konark",
    alt: "Stone architecture at the Konark Sun Temple",
  },
] as const;

const heroSlides = [
  {
    eyebrow: "Sacred Stone",
    title: "Explore Living Heritage Beyond Tourism",
    sub: "Temple towns, sacred spaces and layered stories led with depth and clarity.",
  },
  {
    eyebrow: "Temple Architecture",
    title: "Travel Through Time, Not Just Places",
    sub: "Decode sculpture, geometry and the imagination of the artisans who shaped them.",
  },
  {
    eyebrow: "World Heritage Journeys",
    title: "Walk Deeper Into the Story",
    sub: "From temple corridors to ruined capitals, every stop is designed for quiet wonder.",
  },
  {
    eyebrow: "Temple Craft",
    title: "Where Stone Still Holds Memory",
    sub: "Experience sculpted shrines, living traditions and architecture that rewards a slower look.",
  },
] as const;

function getFeaturedTours(tours: ReturnType<typeof Route.useLoaderData>["tours"]) {
  return tours.slice(0, 6).map((tour) => ({ tour, tagLabel: tour.category }));
}

function Home() {
  const { tours, blogPosts, testimonials, heroSection } = Route.useLoaderData();
  const [slide, setSlide] = useState(0);
  const featuredExperiences = getFeaturedTours(tours);
  const heroDesktopImage = heroSection.desktopImage?.trim() || heroTemple;
  const heroMobileImage = heroSection.mobileImage?.trim() || "";
  const heroOverlayOpacity = Number.isFinite(heroSection.overlayOpacity)
    ? Math.min(0.9, Math.max(0, heroSection.overlayOpacity))
    : 0.35;
  const slides = [
    { image: heroDesktopImage, mobileImage: heroMobileImage, ...heroSlides[0] },
    { image: pattadakalTemple, mobileImage: "", ...heroSlides[1] },
    { image: hampiVitthala, mobileImage: "", ...heroSlides[2] },
    { image: gondeshwarComplex, mobileImage: "", ...heroSlides[3] },
  ] as const;

  useEffect(() => {
    const timer = setInterval(() => setSlide((current) => (current + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <Layout>
      <section className="relative h-[92vh] min-h-[560px] w-full overflow-hidden">
        {slides.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ${index === slide ? "opacity-100" : "opacity-0"}`}
          >
            {item.mobileImage ? (
              <picture>
                <source media="(max-width: 767px)" srcSet={item.mobileImage} />
                <img
                  src={item.image}
                  alt=""
                  className={`h-full w-full object-cover object-center ${index === slide ? "animate-slow-zoom" : ""}`}
                  fetchPriority={index === 0 ? "high" : undefined}
                  decoding="async"
                />
              </picture>
            ) : (
              <img
                src={item.image}
                alt=""
                className={`h-full w-full object-cover object-center ${index === slide ? "animate-slow-zoom" : ""}`}
                loading="lazy"
                decoding="async"
              />
            )}
            <div className="absolute inset-0 bg-black" style={{ opacity: heroOverlayOpacity }} />
          </div>
        ))}

        <div className="container-prose relative z-10 flex h-full items-center">
          <div className="max-w-2xl text-primary-foreground">
            <span className="section-eyebrow animate-fade-in">{slides[slide].eyebrow}</span>
            <h1 className="mt-4 animate-fade-up font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-7xl">
              {slides[slide].title}
            </h1>
            <p className="mt-5 max-w-xl animate-fade-up text-lg text-primary-foreground/90">{slides[slide].sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.03]"
              >
                Explore Tours <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full border border-primary-foreground/40 bg-primary-foreground/10 px-6 py-3 text-sm font-medium text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((item, index) => (
            <button
              key={`dot-${item.title}-${index}`}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setSlide(index)}
              className={`h-1.5 rounded-full transition-all ${index === slide ? "w-10 bg-gold" : "w-4 bg-primary-foreground/50"}`}
            />
          ))}
        </div>
      </section>

      <Section
        title="Featured Heritage Experiences"
        eyebrow="Curated Journeys"
        subtitle="Six experiences designed for depth, story, and quiet wonder."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredExperiences.map(({ tour, tagLabel }, index) => {
            return <TourCard key={tour.slug} tour={tour} index={index} tagLabel={tagLabel} />;
          })}
        </div>
      </Section>

      <section className="bg-[color-mix(in_oklab,var(--secondary)_50%,var(--background))] py-20">
        <div className="container-prose grid items-center gap-10 md:grid-cols-2">
          <div className="image-zoom overflow-hidden shadow-[var(--shadow-elegant)]">
            <img
              src={gondeshwarComplex}
              alt="Stone temple complex under warm light"
              className="aspect-[5/4] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <span className="section-eyebrow">About Paranjape Tours</span>
            <h2 className="mt-4 font-serif text-3xl text-primary md:text-5xl">
              A heritage storytelling travel brand.
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/80">
              We don't just take you to forts and temples - we take you inside their stories. Founded
              by lovers of history, Paranjape Tours designs small-group, expert-guided journeys for
              families, students and curious travellers.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-foreground/80">
              {[
                "Expert-guided heritage tours",
                "Deep historical context",
                "Small group cultural learning",
                "Family & student friendly",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <Heart size={14} className="text-gold" />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-2 font-medium text-primary transition-all hover:gap-3"
            >
              Read Our Story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Section title="Why Travel With Us" eyebrow="Our Promise">
        <div className="site-card-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item) => (
            <div
              key={item.title}
              className="site-card group rounded-2xl border border-border bg-card p-6 hover-lift"
            >
              <div className="site-card-icon mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-primary transition-colors group-hover:bg-gold/30">
                <item.icon size={22} />
              </div>
              <div className="site-card-content">
                <h3 className="font-serif text-xl text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">Gallery</span>
            <h3 className="mt-3 font-serif text-2xl text-primary md:text-4xl">
              Glimpses from the journeys we love leading
            </h3>
            <p className="mt-3 text-muted-foreground">
              A wider canvas of temple towns, fort walls and sacred architecture across the journeys
              that inspire us.
            </p>
          </div>

          <div className="site-card-grid mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homeGallery.map((item) => (
              <figure
                key={item.title}
                className="site-card group rounded-[1.75rem] border border-border bg-card shadow-[var(--shadow-soft)]"
              >
                <div className="site-card-media relative aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                </div>
                <figcaption className="site-card-content absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                  <h4 className="text-2xl leading-tight">{item.title}</h4>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
        <DecoBg />
        <div className="container-prose relative">
          <div className="text-center">
            <span className="section-eyebrow !text-gold-foreground">Travellers' Voices</span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">Stories from our heritage circle</h2>
          </div>
          <TestimonialsCarousel items={testimonials} />
        </div>
      </section>

      <Section
        title="Read Our Blogs"
        eyebrow="From the Journal"
        subtitle="Long-form notes on forts, temples, lanes and the people who keep them alive."
      >
        <div className="site-card-grid grid gap-6 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="site-card group overflow-hidden rounded-2xl border border-border bg-card hover-lift"
            >
              <div className="site-card-media image-zoom aspect-[4/3]">
                <img
                  src={resolveBlogImage(post)}
                  alt={post.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="site-card-content p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">
                  {post.category} - {post.date}
                </p>
                <h3 className="mt-2 font-serif text-xl leading-snug text-primary">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <span className="site-card-link mt-3 inline-flex items-center gap-1 text-sm text-primary transition-all">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <section className="relative my-20">
        <div className="container-prose">
          <div className="relative overflow-hidden rounded-3xl p-10 text-primary-foreground md:p-16">
            <img src={heroTemple} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-primary/80" />
            <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <span className="section-eyebrow !text-gold-foreground">Ready When You Are</span>
                <h2 className="mt-3 max-w-2xl font-serif text-3xl md:text-5xl">
                  Ready to Experience Living Heritage?
                </h2>
                <p className="mt-3 max-w-xl text-primary-foreground/85">
                  Tell us when, where, and who you'd love to bring along - we'll design a journey
                  worth remembering.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={createWhatsAppUrl(
                    "Hello Paranjape Tours, I would like to enquire about a heritage tour.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-elegant)]"
                >
                  <WhatsAppIcon size={16} /> WhatsApp Now
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-gold)]"
                >
                  Send Enquiry <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Section({
  title,
  eyebrow,
  subtitle,
  children,
  tone,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children: React.ReactNode;
  tone?: "muted";
}) {
  return (
    <section
      className={`py-20 ${tone === "muted" ? "bg-[color-mix(in_oklab,var(--secondary)_50%,var(--background))]" : ""}`}
    >
      <div className="container-prose">
        <div className="mb-12 text-center">
          {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-5xl">{title}</h2>
          {subtitle && <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
          <div className="heritage-divider mt-5">
            <MountainSnow size={14} />
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => setIndex((current) => (current + 1) % items.length), 5000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [items.length]);

  return (
    <div className="mx-auto mt-10 max-w-3xl text-center">
      {items.map((item, itemIndex) => (
        <div key={itemIndex} className={itemIndex === index ? "block animate-fade-up" : "hidden"}>
          <p className="font-serif text-xl leading-relaxed text-primary-foreground/95 md:text-2xl">
            "{item.text}"
          </p>
          <p className="mt-5 text-sm uppercase tracking-[0.2em] text-gold">{item.name}</p>
          <p className="text-xs text-primary-foreground/70">{item.role}</p>
        </div>
      ))}
      <div className="mt-6 flex justify-center gap-2">
        {items.map((_, itemIndex) => (
          <button
            key={itemIndex}
            onClick={() => setIndex(itemIndex)}
            aria-label={`Testimonial ${itemIndex + 1}`}
            className={`h-1.5 rounded-full transition-all ${itemIndex === index ? "w-8 bg-gold" : "w-3 bg-primary-foreground/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

function DecoBg() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="mandala" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="60" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <path
            d="M60 10 L60 110 M10 60 L110 60 M25 25 L95 95 M95 25 L25 95"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mandala)" />
    </svg>
  );
}
