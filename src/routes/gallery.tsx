import { createFileRoute } from "@/lib/navigation";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageBanner } from "@/components/site/PageBanner";
import { getPublicSiteContent } from "@/lib/static-content";
import heroStory from "@/assets/hero-story.jpg";

export const Route = createFileRoute("/gallery")({
  loader: () => getPublicSiteContent(),
  headers: () => ({
    "Cache-Control": "no-cache, no-store, must-revalidate",
  }),
  head: () => ({
    meta: [
      { title: "Gallery - Paranjape Tours" },
      {
        name: "description",
        content: "Glimpses from our heritage journeys across forts, temples, walks and sacred landscapes.",
      },
      { property: "og:title", content: "Paranjape Tours Gallery" },
      {
        property: "og:description",
        content: "Explore visual highlights from our curated heritage tours and storytelling walks.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { galleryItems } = Route.useLoaderData();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const displayItems = useMemo(
    () => galleryItems.filter((item) => item.image.trim().length > 0),
    [galleryItems],
  );

  useEffect(() => {
    setActiveIndex(null);
  }, [displayItems]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (!displayItems.length) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((prev) => {
          const current = prev ?? 0;
          return (current + 1) % displayItems.length;
        });
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((prev) => {
          const current = prev ?? 0;
          return (current - 1 + displayItems.length) % displayItems.length;
        });
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, displayItems]);

  return (
    <Layout>
      <PageBanner
        title="Gallery"
        subtitle="Moments from forts, temples, old cities, and living heritage trails."
        crumbs={[{ label: "Home", to: "/" }, { label: "Gallery" }]}
        image={heroStory}
      />

      <section className="container-prose py-16">
        {displayItems.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Gallery</p>
            <h2 className="mt-3 font-serif text-3xl text-primary">Photos coming soon.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We are curating new visual stories from our upcoming journeys.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayItems.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="site-card group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[var(--shadow-soft)] transition focus:outline-none focus:ring-2 focus:ring-gold/70"
                aria-label={`Open gallery image: ${item.title}`}
              >
                <div className="site-card-media image-zoom aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="site-card-content p-5">
                  <h3 className="font-serif text-xl text-primary">{item.title}</h3>
                  {item.description.trim() ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {activeIndex !== null && displayItems[activeIndex] ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition hover:bg-black/60"
            aria-label="Close gallery"
          >
            <X size={18} />
          </button>
          <figure className="max-h-full w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={displayItems[activeIndex].image}
              alt={displayItems[activeIndex].title}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
            <figcaption className="mt-3 flex items-center justify-between text-sm text-white/85">
              <span>{displayItems[activeIndex].title}</span>
              <span>
                {activeIndex + 1}/{displayItems.length}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </Layout>
  );
}
