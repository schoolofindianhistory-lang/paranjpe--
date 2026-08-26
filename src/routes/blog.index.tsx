import { Link, createFileRoute } from "@/lib/navigation";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageBanner } from "@/components/site/PageBanner";
import { getPublicSiteContent } from "@/lib/static-content";
import { resolveBlogImage } from "@/lib/blog-images";
import heroStory from "@/assets/hero-story.jpg";

export const Route = createFileRoute("/blog/")({
  loader: () => getPublicSiteContent(),
  head: () => ({
    meta: [
      { title: "Blog - Paranjape Tours Journal" },
      {
        name: "description",
        content: "Long-form notes on forts, temples, lanes and the people who keep them alive.",
      },
      { property: "og:title", content: "Paranjape Tours Blog" },
      { property: "og:description", content: "Heritage essays and travel notes." },
    ],
  }),
  component: Blog,
});

const cardDelayStyle = (index: number): CSSProperties =>
  ({
    "--card-delay": `${index * 90}ms`,
  }) as CSSProperties;

function Blog() {
  const { blogPosts } = Route.useLoaderData();

  return (
    <Layout>
      <PageBanner
        title="Blog"
        subtitle="Notes, essays and memories from our heritage circle."
        crumbs={[{ label: "Home", to: "/" }, { label: "Blog" }]}
        image={heroStory}
      />

      <section className="container-prose site-card-grid py-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((b, index) => (
          <article
            key={b.slug}
            className="heritage-tile group h-full"
            style={cardDelayStyle(index)}
          >
            <Link to="/blog/$slug" params={{ slug: b.slug }} className="heritage-tile-media block">
              <img
                src={resolveBlogImage(b)}
                alt={b.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </Link>
            <div className="heritage-tile-body pr-6">
              <p className="heritage-tile-kicker">{b.category}</p>
              <h3 className="mt-3 font-serif text-[1.65rem] leading-[1.08] text-primary">
                <Link to="/blog/$slug" params={{ slug: b.slug }} className="hover:text-primary/80">
                  {b.title}
                </Link>
              </h3>
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                {b.excerpt}
              </p>
              <div className="heritage-tile-footer mt-6">
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {b.sourceName ?? "Paranjape Journal"}
                </span>
                <Link
                  to="/blog/$slug"
                  params={{ slug: b.slug }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary"
                >
                  Read More
                  <ArrowRight className="heritage-tile-linkicon" size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </Layout>
  );
}
