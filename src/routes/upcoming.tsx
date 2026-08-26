import { createFileRoute, Link } from "@/lib/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageBanner } from "@/components/site/PageBanner";
import { upcomingTours } from "@/data/tours";
import { isExternalLink, resolveTourBookingHref } from "@/lib/booking";
import { getPublicSiteContent } from "@/lib/static-content";
import { isScheduledDateExpired } from "@/lib/tour-dates";
import heroTemple from "@/assets/hero-temple.jpg";

export const Route = createFileRoute("/upcoming")({
  loader: () => getPublicSiteContent(),
  head: () => ({
    meta: [
      { title: "Upcoming Heritage Tours — Paranjape Tours" },
      {
        name: "description",
        content: "Join our upcoming heritage walks, fort trails and temple tours.",
      },
      { property: "og:title", content: "Upcoming Tours" },
      { property: "og:description", content: "Reserve your seat on the next heritage journey." },
    ],
  }),
  component: Upcoming,
});

function Upcoming() {
  const { tours } = Route.useLoaderData();
  const items = upcomingTours
    .map((u) => {
      const tour = tours.find((item) => item.slug === u.slug);
      const date = isScheduledDateExpired(u.date) ? "Coming Soon" : u.date;
      return tour ? { ...u, tour, date } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  return (
    <Layout>
      <PageBanner
        title="Upcoming Tours"
        subtitle="Plan your next journey through forts, temples and living stories."
        crumbs={[{ label: "Home", to: "/" }, { label: "Upcoming" }]}
        image={heroTemple}
      />

      <section className="container-prose py-16">
        <ol className="site-card-stack relative border-l-2 border-gold/40 pl-8 space-y-8 max-w-4xl mx-auto">
          {items.map((it, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[42px] top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-gold-foreground">
                <Calendar size={14} />
              </span>
              <div className="site-card rounded-2xl border border-border bg-card overflow-hidden grid sm:grid-cols-[180px_1fr] hover-lift">
                <div className="site-card-media">
                  <img
                    src={it.tour.image}
                    alt={it.tour.title}
                    className="h-full w-full object-cover aspect-square sm:aspect-auto"
                    loading="lazy"
                  />
                </div>
                <div className="site-card-content p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold">{it.date}</p>
                  <h3 className="mt-1 font-serif text-2xl text-primary">{it.tour.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{it.tour.short}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-foreground/75">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} className="text-gold" />
                      {it.tour.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users size={12} className="text-gold" />
                      {it.seats} seats left
                    </span>
                    <span>{it.tour.duration}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to="/tours/$slug"
                      params={{ slug: it.tour.slug }}
                      className="site-card-link inline-flex rounded-full border border-border px-4 py-2 text-xs hover:border-primary hover:text-primary transition-colors"
                    >
                      View Tour
                    </Link>
                    {isExternalLink(resolveTourBookingHref(it.tour)) ? (
                      <a
                        href={resolveTourBookingHref(it.tour)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground"
                      >
                        Book Now
                      </a>
                    ) : (
                      <Link
                        to={resolveTourBookingHref(it.tour)}
                        className="inline-flex rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground"
                      >
                        Book Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </Layout>
  );
}
