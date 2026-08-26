import { createFileRoute, Link } from "@/lib/navigation";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  BookOpen,
  Gift,
  Map,
  Package,
  Phone,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageBanner } from "@/components/site/PageBanner";
import { getPublicSiteContent } from "@/lib/static-content";
import heroTemple from "@/assets/hero-temple.jpg";

export const Route = createFileRoute("/shop")({
  loader: () => getPublicSiteContent(),
  head: () => ({
    meta: [
      { title: "Shop - Paranjape Tours" },
      {
        name: "description",
        content:
          "Browse heritage-inspired books, maps, souvenirs and gifting options from Paranjape Tours.",
      },
      { property: "og:title", content: "Paranjape Tours Shop" },
      {
        property: "og:description",
        content: "Take history's stories home with curated keepsakes, study kits and travel gifts.",
      },
    ],
  }),
  component: Shop,
});

const collections = [
  {
    icon: BookOpen,
    title: "Story Guides",
    desc: "Readable booklets and mini-companions that turn walks, forts and old city lanes into take-home stories.",
    points: ["Short heritage reads", "Student-friendly notes", "Tour companion booklets"],
  },
  {
    icon: Map,
    title: "Maps and Study Kits",
    desc: "Route maps, illustrated timelines and learning packs designed for curious families, schools and history clubs.",
    points: ["Printed route maps", "Timeline cards", "Teacher-ready kits"],
  },
  {
    icon: Gift,
    title: "Souvenirs and Gifts",
    desc: "Thoughtful keepsakes inspired by architecture, legends and travel memories.",
    points: ["Gift-ready sets", "Event mementos", "Custom group orders"],
  },
] as const;

const orderingSteps = [
  {
    icon: Package,
    title: "Choose your favourites",
    desc: "Browse the collection and note the items or gifting style you want.",
  },
  {
    icon: Phone,
    title: "Send an enquiry",
    desc: "We confirm availability, quantities, customization and delivery timelines.",
  },
  {
    icon: ShieldCheck,
    title: "We prepare your order",
    desc: "Once confirmed, we reserve the products and share the next steps personally.",
  },
] as const;

const cardDelayStyle = (index: number, offset = 0): CSSProperties => ({
  "--card-delay": `${offset + index * 90}ms`,
}) as CSSProperties;

function Shop() {
  const { shopItems } = Route.useLoaderData();

  return (
    <Layout>
      <PageBanner
        title="Heritage Shop"
        subtitle="Books, maps, keepsakes and gifting ideas inspired by forts, temples and old city stories."
        crumbs={[{ label: "Home", to: "/" }, { label: "Shop" }]}
        image={heroTemple}
      />

      <section className="container-prose py-20 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="section-eyebrow">Curated by Storytellers</span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl text-primary">
            Take a piece of the journey home.
          </h2>
          <p className="mt-4 text-foreground/80 leading-relaxed">
            The Paranjape Tours shop is built for travellers who want more than a souvenir. From story-led
            reading material to gifting sets for schools and group departures, every item is chosen to keep the
            heritage experience alive after the tour ends.
          </p>
          <div
            className="site-card mt-6 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm text-foreground/80"
            style={cardDelayStyle(1)}
          >
            <div className="site-card-content flex items-start gap-3">
              <Sparkles className="mt-0.5 text-primary" size={18} />
              <p>
                Orders are managed by enquiry so we can confirm stock, customization and group pricing before we
                reserve anything for you.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
            >
              Ask for the Catalogue <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+919420010881"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-primary hover:border-gold"
            >
              Call to Order <Phone size={16} />
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-[var(--gradient-paper)] p-8 shadow-[var(--shadow-elegant)]">
          <div className="site-card-grid grid gap-4 sm:grid-cols-2">
            {[
              "Gift-ready packaging",
              "Student and school bundles",
              "Custom event mementos",
              "Small-batch curated items",
            ].map((point, index) => (
              <div
                key={point}
                className="site-card rounded-2xl border border-white/50 bg-white/55 p-5 backdrop-blur"
                style={cardDelayStyle(index, 2 * 90)}
              >
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Included</p>
                <p className="mt-2 font-serif text-xl text-primary">{point}</p>
              </div>
            ))}
          </div>
          <div
            className="site-card mt-6 rounded-2xl bg-primary p-6 text-primary-foreground"
            style={cardDelayStyle(4, 2 * 90)}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-gold">Best for</p>
            <p className="mt-2 font-serif text-2xl">Schools, heritage groups, family gifting and tour souvenirs.</p>
            <p className="mt-3 text-sm text-primary-foreground/85">
              Need quantities for an event or educational visit? We can help you put together a matching bundle.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[color-mix(in_oklab,var(--secondary)_55%,var(--background))] py-20">
        <div className="container-prose">
          <div className="text-center mb-12">
            <span className="section-eyebrow">Collections</span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl text-primary">What you can shop</h2>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
              Thoughtful collections that feel connected to the tours, not like generic merchandise.
            </p>
          </div>

          <div className="site-card-grid grid gap-6 md:grid-cols-3">
            {collections.map((collection, index) => (
              <div
                key={collection.title}
                className="site-card rounded-3xl border border-border bg-card p-7 hover-lift"
                style={cardDelayStyle(index)}
              >
                <div className="site-card-icon inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-primary">
                  <collection.icon size={22} />
                </div>
                <div className="site-card-content">
                  <h3 className="mt-5 font-serif text-2xl text-primary">{collection.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{collection.desc}</p>
                  <ul className="mt-5 space-y-2 text-sm text-foreground/80">
                    {collection.points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <ArrowRight size={14} className="text-gold" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-prose py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-eyebrow">Featured Picks</span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl text-primary">Shop highlights</h2>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            A sample of the catalogue. If you need school quantities, custom branding or a full gifting list, reach
            out and we will help you build it.
          </p>
        </div>

        <div className="site-card-grid mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shopItems.map((product, index) => (
            <article
              key={product.slug}
              className="heritage-tile group h-full"
              style={cardDelayStyle(index)}
            >
              <div className="heritage-tile-media">
                <img src={product.image} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="heritage-tile-body pr-6">
                <p className="heritage-tile-kicker">{product.category}</p>
                <h3 className="mt-3 font-serif text-[1.65rem] leading-[1.08] text-primary">{product.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                <div className="heritage-tile-footer mt-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Price</p>
                    <p className="font-serif text-2xl text-primary">{product.price}</p>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    Enquire
                    <ArrowRight className="heritage-tile-linkicon" size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container-prose">
          <div className="text-center mb-12">
            <span className="section-eyebrow !text-gold-foreground">Ordering</span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">Simple, personal and easy to confirm.</h2>
          </div>

          <div className="site-card-grid grid gap-6 md:grid-cols-3">
            {orderingSteps.map((step, index) => (
              <div
                key={step.title}
                className="site-card rounded-3xl border border-white/15 bg-white/8 p-7"
                style={cardDelayStyle(index)}
              >
                <div className="site-card-icon inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/20 text-gold">
                  <step.icon size={22} />
                </div>
                <div className="site-card-content">
                  <h3 className="mt-5 font-serif text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="site-card mt-12 rounded-[2rem] border border-white/15 bg-white/8 p-8 text-center"
            style={cardDelayStyle(3)}
          >
            <ScrollText className="mx-auto text-gold" size={28} />
            <h3 className="mt-4 font-serif text-3xl">Need a custom bundle?</h3>
            <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/80">
              We can assemble school packs, farewell gifts, traveller keepsakes and event souvenirs around your budget
              and theme.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-gold)]"
              >
                Start an Enquiry <ArrowRight size={16} />
              </Link>
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-primary-foreground"
              >
                Pair It with a Tour <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
