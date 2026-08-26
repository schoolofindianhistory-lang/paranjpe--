import { Link, createFileRoute, notFound } from "@/lib/navigation";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageBanner } from "@/components/site/PageBanner";
import { resolveBlogImage } from "@/lib/blog-images";
import { getPublicSiteContent } from "@/lib/static-content";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const content = await getPublicSiteContent();
    const post = content.blogPosts.find((item) => item.slug === params.slug);
    if (!post) {
      throw notFound();
    }

    return {
      post,
      recentPosts: content.blogPosts.filter((item) => item.slug !== params.slug).slice(0, 3),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} â€” Paranjape Tours Blog` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:image", content: resolveBlogImage(loaderData.post) },
        ]
      : [],
  }),
  component: BlogDetail,
});

function BlogDetail() {
  const { post, recentPosts } = Route.useLoaderData();
  const postImage = resolveBlogImage(post);
  const paragraphs = (post.content?.trim() || post.excerpt)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Layout>
      <PageBanner
        title={post.title}
        subtitle={post.excerpt}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Blog", to: "/blog" },
          { label: post.title },
        ]}
        image={postImage}
      />

      <section className="container-prose grid gap-12 py-16 lg:grid-cols-[2fr_1fr]">
        <article className="site-card rounded-[2rem] border border-border bg-card p-7 shadow-[var(--shadow-soft)] md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">
            {post.category} â€¢ {post.date}
          </p>
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-5xl">{post.title}</h1>
          <img
            src={postImage}
            alt={post.title}
            className="mt-8 aspect-[16/9] w-full rounded-[1.5rem] object-cover"
            loading="lazy"
          />
          <div className="mt-8 space-y-5 text-base leading-8 text-foreground/85">
            {paragraphs.map((paragraph, index) => (
              <p key={`${post.slug}-paragraph-${index}`}>{paragraph}</p>
            ))}
          </div>
          {post.sourceUrl ? (
            <div className="mt-8 rounded-[1.5rem] border border-border bg-[color-mix(in_oklab,var(--secondary)_50%,var(--background))] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-gold">Original Source</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                This post is sourced from {post.sourceName ?? "the original site"} and can also be read on the source page.
              </p>
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                Read the full article on {post.sourceName ?? "the source site"} <ArrowRight size={16} />
              </a>
            </div>
          ) : null}
        </article>

        <aside className="space-y-6">
          <div className="site-card rounded-[2rem] border border-border bg-[color-mix(in_oklab,var(--secondary)_55%,var(--background))] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">More Reading</p>
            <h2 className="mt-3 font-serif text-2xl text-primary">From the journal</h2>
            <div className="mt-5 space-y-4">
              {recentPosts.map((item) => (
                <Link
                  key={item.slug}
                  to="/blog/$slug"
                  params={{ slug: item.slug }}
                  className="block rounded-2xl border border-border bg-background/80 p-4 transition-colors hover:border-gold"
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {item.category}
                  </p>
                  <h3 className="mt-2 font-serif text-xl text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="site-card rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-2xl text-primary">Explore a related journey</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Pair the reading with a guided heritage experience curated by Paranjape Tours.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
              >
                Explore Tours <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-primary"
              >
                Plan an Enquiry <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  );
}
