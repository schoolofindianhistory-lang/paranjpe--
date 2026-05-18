import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Check, ChevronDown, Clock, MapPin, Mountain, Users, X } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { TourCard } from "@/components/site/TourCard";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { createWhatsAppUrl } from "@/data/siteContact";
import { isExternalLink, resolveTourBookingHref } from "@/lib/booking";
import { getPublicSiteContent } from "@/lib/content.functions";
import { buildTourPagePath, toAbsoluteSiteUrl } from "@/lib/site-url";
import { getTourDisplayImage, getTourShareImageUrl } from "@/lib/tour-images";

export const Route = createFileRoute("/tours/$slug")({
  loader: async ({ params }) => {
    const content = await getPublicSiteContent();
    const tour = content.tours.find((item) => item.slug === params.slug);
    if (!tour) throw notFound();

    return {
      tour,
      tours: content.tours,
    };
  },
  headers: () => ({
    "Cache-Control": "no-cache, no-store, must-revalidate",
  }),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.tour.title} | Paranjape Tours` },
          { name: "description", content: loaderData.tour.short },
          { property: "og:title", content: loaderData.tour.title },
          { property: "og:description", content: loaderData.tour.short },
          { property: "og:type", content: "website" },
          { property: "og:url", content: toAbsoluteSiteUrl(buildTourPagePath(loaderData.tour.slug)) },
          { property: "og:image", content: getTourShareImageUrl(loaderData.tour) },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: loaderData.tour.title },
          { name: "twitter:description", content: loaderData.tour.short },
          { name: "twitter:image", content: getTourShareImageUrl(loaderData.tour) },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <Layout>
      <div className="container-prose py-32 text-center">
        <h1 className="font-serif text-4xl text-primary">Tour not found</h1>
        <Link
          to="/tours"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
        >
          Back to Tours
        </Link>
      </div>
    </Layout>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <Layout>
        <div className="container-prose py-24 text-center">
          <h1 className="font-serif text-3xl text-primary">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </Layout>
    );
  },
  component: TourDetail,
});

function TourDetail() {
  const { tour, tours } = Route.useLoaderData();
  const heroImage = getTourDisplayImage(tour);
  const tourGallery = useMemo(
    () => tour.gallery.filter((image) => image.src.trim().length > 0),
    [tour.gallery],
  );
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const bookNowHref = resolveTourBookingHref(tour);
  const bookNowIsExternal = isExternalLink(bookNowHref);
  const related = tours
    .filter((t) => t.slug !== tour.slug && t.category === tour.category)
    .slice(0, 3);
  const fallback = tours.filter((t) => t.slug !== tour.slug).slice(0, 3);
  const metaItems = [
    { icon: Clock, label: "Duration", value: tour.duration },
    { icon: MapPin, label: "Location", value: tour.location },
    { icon: Mountain, label: "Difficulty", value: tour.difficulty },
    { icon: Calendar, label: "Best Season", value: tour.bestSeason },
    { icon: Users, label: "Group Size", value: tour.groupSize },
    { icon: Check, label: "Price", value: tour.price },
  ].filter((item) => item.value.trim().length > 0);

  useEffect(() => {
    setActiveGalleryIndex(null);
  }, [tour.slug]);

  useEffect(() => {
    if (activeGalleryIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveGalleryIndex(null);
        return;
      }

      if (!tourGallery.length) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveGalleryIndex((prev) => {
          const current = prev ?? 0;
          return (current + 1) % tourGallery.length;
        });
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveGalleryIndex((prev) => {
          const current = prev ?? 0;
          return (current - 1 + tourGallery.length) % tourGallery.length;
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
  }, [activeGalleryIndex, tourGallery]);

  return (
    <Layout>
      <section className="relative h-[64vh] min-h-[420px] w-full overflow-hidden">
        <img src={heroImage} alt={tour.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background" />
        <div className="container-prose relative z-10 flex h-full flex-col justify-end pb-10 text-primary-foreground">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Tours", to: "/tours" },
              { label: tour.title },
            ]}
          />
          <span className="mt-3 section-eyebrow w-fit">{tour.category}</span>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl md:text-6xl">{tour.title}</h1>
        </div>
      </section>

      <section className="container-prose relative z-20 -mt-8">
        <div className="site-card grid items-center gap-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] md:grid-cols-[1fr_auto] md:p-7">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {metaItems.map((item) => (
              <Meta key={item.label} icon={item.icon} label={item.label} value={item.value} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {bookNowIsExternal ? (
              <a
                href={bookNowHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-gold px-5 py-3 text-sm font-medium text-gold-foreground shadow-[var(--shadow-gold)]"
              >
                Book Now
              </a>
            ) : (
              <Link
                to={bookNowHref}
                className="inline-flex items-center rounded-full bg-gold px-5 py-3 text-sm font-medium text-gold-foreground shadow-[var(--shadow-gold)]"
              >
                Book Now
              </Link>
            )}
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)]"
            >
              Enquire Now
            </Link>
            <a
              href={createWhatsAppUrl(`I'd like to know more about ${tour.title}`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-medium text-white"
            >
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="container-prose grid gap-12 py-16 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-12">
          {tour.overview.trim() && (
            <Block title="Overview">
              <p className="leading-relaxed text-foreground/85">{tour.overview}</p>
            </Block>
          )}

          {tour.history.trim() && (
            <Block title="Historical Significance">
              <p className="leading-relaxed text-foreground/85">{tour.history}</p>
            </Block>
          )}

          {tour.highlights.length > 0 && (
            <Block title="Tour Highlights">
              <ul className="grid gap-2 sm:grid-cols-2">
                {tour.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-foreground/85">
                    <Check className="mt-0.5 text-gold" size={16} />
                    {highlight}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {tour.itinerary.length > 0 && (
            <Block title="Detailed Itinerary">
              <ol className="relative space-y-6 border-l-2 border-gold/40 pl-6">
                {tour.itinerary.map((item, index) => (
                  <li key={`${item.time}-${item.title}-${index}`} className="relative">
                    <span className="absolute -left-[34px] top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-semibold text-gold-foreground">
                      {index + 1}
                    </span>
                    <p className="text-xs uppercase tracking-[0.2em] text-gold">{item.time}</p>
                    <h4 className="mt-1 font-serif text-lg text-primary">{item.title}</h4>
                    <p className="mt-1 text-sm text-foreground/80">{item.desc}</p>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {(tour.inclusions.length > 0 || tour.exclusions.length > 0) && (
            <div className="grid gap-8 md:grid-cols-2">
              {tour.inclusions.length > 0 && (
                <Block title="Inclusions">
                  <ul className="space-y-2">
                    {tour.inclusions.map((item) => (
                      <li key={item} className="flex gap-2 text-foreground/85">
                        <Check size={16} className="mt-0.5 text-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Block>
              )}
              {tour.exclusions.length > 0 && (
                <Block title="Exclusions">
                  <ul className="space-y-2">
                    {tour.exclusions.map((item) => (
                      <li key={item} className="flex gap-2 text-foreground/85">
                        <X size={16} className="mt-0.5 text-destructive" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Block>
              )}
            </div>
          )}

          {(tour.carry.length > 0 || tour.whoCanJoin.trim()) && (
            <div className="grid gap-8 md:grid-cols-2">
              {tour.carry.length > 0 && (
                <Block title="Things to Carry">
                  <ul className="space-y-2">
                    {tour.carry.map((item) => (
                      <li key={item} className="flex gap-2 text-foreground/85">
                        <Check size={16} className="mt-0.5 text-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Block>
              )}
              {tour.whoCanJoin.trim() && (
                <Block title="Who Can Join">
                  <p className="leading-relaxed text-foreground/85">{tour.whoCanJoin}</p>
                </Block>
              )}
            </div>
          )}

          {tour.notes && tour.notes.length > 0 && (
            <Block title="Important Notes">
              <ul className="space-y-2">
                {tour.notes.map((note) => (
                  <li key={note} className="flex gap-2 text-foreground/85">
                    <Check size={16} className="mt-0.5 text-gold" />
                    {note}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block title="Photo Gallery">
            {tourGallery.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {tourGallery.map((image, index) => (
                  <button
                    key={`${tour.slug}-${index}`}
                    type="button"
                    onClick={() => setActiveGalleryIndex(index)}
                    className="image-zoom aspect-square overflow-hidden rounded-xl border border-border/80 text-left transition focus:outline-none focus:ring-2 focus:ring-gold/70"
                    aria-label={`Open gallery image ${index + 1}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Gallery images will be added soon.</p>
            )}
          </Block>

          {tour.faqs.length > 0 && (
            <Block title="Frequently Asked Questions">
              <div className="space-y-3">
                {tour.faqs.map((faq, index) => (
                  <Faq key={`${faq.q}-${index}`} q={faq.q} a={faq.a} />
                ))}
              </div>
            </Block>
          )}
        </div>

        <aside className="self-start space-y-6 lg:sticky lg:top-24">
          <div className="site-card rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Starting From</p>
            <p className="mt-1 font-serif text-3xl text-primary">{tour.price}</p>
            {bookNowIsExternal ? (
              <a
                href={bookNowHref}
                target="_blank"
                rel="noreferrer"
                className="mt-5 block rounded-full bg-gold px-5 py-3 text-center text-sm font-medium text-gold-foreground shadow-[var(--shadow-gold)]"
              >
                Book Now
              </a>
            ) : (
              <Link
                to={bookNowHref}
                className="mt-5 block rounded-full bg-gold px-5 py-3 text-center text-sm font-medium text-gold-foreground shadow-[var(--shadow-gold)]"
              >
                Book Now
              </Link>
            )}
            <Link
              to="/contact"
              className="mt-3 block rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground"
            >
              Send Enquiry
            </Link>
            <a
              href={createWhatsAppUrl(`I'd like to enquire about ${tour.title}`)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block rounded-full bg-whatsapp px-5 py-3 text-center text-sm font-medium text-white"
            >
              WhatsApp Now
            </a>
          </div>
          <div className="site-card rounded-2xl border border-border bg-[color-mix(in_oklab,var(--secondary)_60%,var(--background))] p-6">
            <h4 className="font-serif text-lg text-primary">Need a custom date?</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              We design private heritage trips for families, schools and corporate groups.
            </p>
            <Link to="/contact" className="mt-4 inline-flex text-sm font-medium text-primary">
              Plan with us
            </Link>
          </div>
        </aside>
      </section>

      <section className="bg-[color-mix(in_oklab,var(--secondary)_50%,var(--background))] py-16">
        <div className="container-prose">
          <h2 className="mb-10 text-center font-serif text-3xl text-primary">Related Tours</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {(related.length ? related : fallback).map((item, index) => (
              <TourCard key={item.slug} tour={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {activeGalleryIndex !== null && tourGallery[activeGalleryIndex] ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Tour gallery lightbox"
          onClick={() => setActiveGalleryIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveGalleryIndex(null)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition hover:bg-black/60"
            aria-label="Close gallery"
          >
            <X size={18} />
          </button>

          {tourGallery.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveGalleryIndex(
                    (activeGalleryIndex - 1 + tourGallery.length) % tourGallery.length,
                  );
                }}
                className="absolute left-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition hover:bg-black/60"
                aria-label="Previous image"
              >
                <span className="text-2xl leading-none">&lt;</span>
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveGalleryIndex((activeGalleryIndex + 1) % tourGallery.length);
                }}
                className="absolute right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition hover:bg-black/60 md:right-16"
                aria-label="Next image"
              >
                <span className="text-2xl leading-none">&gt;</span>
              </button>
            </>
          ) : null}

          <figure className="max-h-full w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={tourGallery[activeGalleryIndex].src}
              alt={tourGallery[activeGalleryIndex].alt}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
            <figcaption className="mt-3 flex items-center justify-between text-sm text-white/85">
              <span>{tourGallery[activeGalleryIndex].alt}</span>
              <span>
                {activeGalleryIndex + 1}/{tourGallery.length}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </Layout>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-primary">
        <Icon size={16} />
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-primary">{value}</p>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-primary md:text-3xl">{title}</h2>
      <div className="heritage-divider !mx-0 my-4 max-w-[160px]">
        <span />
      </div>
      {children}
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="site-card overflow-hidden rounded-xl border border-border bg-card">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-medium text-primary">{q}</span>
        <ChevronDown
          size={18}
          className={`text-gold transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="animate-fade-in px-5 pb-5 text-sm text-foreground/80">{a}</div>}
    </div>
  );
}
