import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, TrendingUp } from "lucide-react";
import { type Tour } from "@/data/tours";
import { isExternalLink, resolveTourBookingHref } from "@/lib/booking";
import { getTourRibbonLabel } from "@/lib/tour-dates";

export function TourCard({
  tour,
  index = 0,
  tagLabel,
}: {
  tour: Tour;
  index?: number;
  tagLabel?: string;
}) {
  const ribbonLabel = getTourRibbonLabel(tour);
  const bookNowHref = resolveTourBookingHref(tour);
  const bookNowIsExternal = isExternalLink(bookNowHref);

  return (
    <article
      className="tour-card group relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-[var(--shadow-soft)]"
      style={{ "--card-delay": `${index * 90}ms` } as CSSProperties}
    >
      <div className="relative overflow-hidden">
        <div className="tour-card-media relative aspect-[4/3] overflow-hidden">
          <img
            src={tour.image}
            alt={tour.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/78 via-primary/16 to-transparent" />
          {ribbonLabel ? (
            <span className="pointer-events-none absolute -left-[3.85rem] top-6 z-20 w-52 -rotate-45 bg-[#bd3a4f] px-8 py-2 text-center text-[0.95rem] font-semibold text-white shadow-[0_10px_22px_-12px_rgba(0,0,0,0.65)]">
              {ribbonLabel}
            </span>
          ) : null}
          <span className="absolute left-5 bottom-5 inline-flex rounded-full bg-background/88 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary shadow-sm backdrop-blur-sm">
            {tagLabel ?? tour.category}
          </span>
        </div>
      </div>

      <div className="tour-card-content relative px-5 pb-5 pt-9">
        <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <span className="h-px w-8 bg-gold/70" />
          <span>Curated Journey</span>
        </div>

        <h3 className="font-serif text-2xl text-primary leading-snug">{tour.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {tour.short}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] text-foreground/75">
          <span className="tour-card-meta inline-flex items-center gap-1.5 rounded-full bg-secondary/65 px-3 py-2">
            <MapPin size={12} className="text-gold" />
            <span className="truncate">{tour.location}</span>
          </span>
          <span className="tour-card-meta inline-flex items-center gap-1.5 rounded-full bg-secondary/65 px-3 py-2">
            <Clock size={12} className="text-gold" />
            <span className="truncate">{tour.duration}</span>
          </span>
          <span className="tour-card-meta inline-flex items-center gap-1.5 rounded-full bg-secondary/65 px-3 py-2">
            <TrendingUp size={12} className="text-gold" />
            <span className="truncate">{tour.difficulty}</span>
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Starting From
            </p>
            <span className="font-serif text-xl text-primary">{tour.price}</span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link
              to="/tours/$slug"
              params={{ slug: tour.slug }}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3"
            >
              View Details
              <ArrowRight size={16} />
            </Link>
            {bookNowIsExternal ? (
              <a
                href={bookNowHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
              >
                Book Now
              </a>
            ) : (
              <Link
                to={bookNowHref}
                className="inline-flex items-center rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
              >
                Book Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
