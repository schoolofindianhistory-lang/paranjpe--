import { createFileRoute } from "@/lib/navigation";
import { Award, Compass, Heart, Sparkles, UserRound, Users } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageBanner } from "@/components/site/PageBanner";
import { getPublicSiteContent } from "@/lib/static-content";
import heroStory from "@/assets/hero-story.jpg";
import founderPortrait from "@/assets/gallery/WhatsApp Image 2026-05-11 at 11.10.11 PM.jpeg";

export const Route = createFileRoute("/about")({
  loader: () => getPublicSiteContent(),
  head: () => ({
    meta: [
      { title: "About Us - Paranjape Tours" },
      { name: "description", content: "A heritage storytelling travel brand designing meaningful journeys." },
      { property: "og:title", content: "About Paranjape Tours" },
      { property: "og:description", content: "Our story, mission and tour philosophy." },
    ],
  }),
  component: About,
});

const stats = [
  { v: "4000+", l: "Happy Travellers" },
  { v: "100+", l: "Heritage Locations" },
  { v: "300+", l: "Number Of Tours" },
  { v: "4.5", l: "Experience Rating" },
];

function About() {
  const { teamMembers } = Route.useLoaderData();

  return (
    <Layout>
      <PageBanner
        title="About Paranjape Tours"
        subtitle="A heritage storytelling travel experience brand."
        crumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]}
        image={heroStory}
      />

      <section className="container-prose grid gap-12 py-20 md:grid-cols-2 md:items-start">
        <div className="image-zoom overflow-hidden shadow-[var(--shadow-elegant)] md:self-start">
          <img
            src={founderPortrait}
            alt="Founder of Paranjape Tours standing outdoors near a waterfall viewpoint"
            className="h-[420px] w-full object-cover object-center sm:h-[480px] md:h-[540px] lg:h-[580px]"
            loading="lazy"
          />
        </div>
        <div>
          <span className="section-eyebrow">From the Founder</span>
          <h2 className="mt-3 font-serif text-4xl text-primary">
            Born from a love for history, architecture and lived experience.
          </h2>
          <p className="mt-4 text-justify leading-relaxed text-foreground/80">
            Paranjape Tours & Travels began with a simple belief: forts, temples and historic cities deserve to be understood, not merely visited.
          </p>
          <p className="mt-4 text-justify leading-relaxed text-foreground/80">
            What started as a personal passion for Indian history, temple architecture and historical research gradually evolved into a venture dedicated to meaningful heritage travel — built on careful storytelling, field study and genuine curiosity about India’s past.
          </p>
          <p className="mt-4 text-justify leading-relaxed text-foreground/80">
            Our work draws from years of reading, research and on-ground exploration. Through architecture, inscriptions, landscapes and forgotten stories, we try to understand how politics, devotion, trade and everyday life shaped one another across centuries.
          </p>
          <p className="mt-4 text-justify leading-relaxed text-foreground/80">
            That is why our journeys go beyond conventional sightseeing. Whether it is a fort trail in Maharashtra, a temple study tour, or a heritage walk through an old city, we focus on interpretation as much as experience — helping travellers notice not only what they see, but why it matters.
          </p>
          <p className="mt-4 text-justify leading-relaxed text-foreground/80">
            Today, we design thoughtful small-group journeys for families, students, researchers and curious travellers who seek depth, accuracy and a deeper connection with India’s cultural and historical heritage.
          </p>
        </div>
      </section>

      <section className="bg-[color-mix(in_oklab,var(--secondary)_50%,var(--background))] py-20">
        <div className="container-prose site-card-grid grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Compass,
              title: "Our Vision",
              desc: "To reconnect people with India’s civilisational heritage by transforming travel into a journey of understanding, curiosity and discovery.",
            },
            {
              icon: Sparkles,
              title: "Our Mission",
              desc: "To create immersive and research-driven heritage experiences that help travellers understand India’s historical landscapes, architectural traditions and cultural legacy with depth, accuracy and wonder.",
            },
            {
              icon: Heart,
              title: "Our Tour Philosophy",
              desc: "We believe history is best understood not through textbooks alone, but through landscapes, architecture, inscriptions, stories and lived experiences.",
            },
          ].map((card) => (
            <div key={card.title} className="site-card rounded-2xl border border-border bg-card p-7 hover-lift">
              <div className="site-card-icon mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-primary">
                <card.icon size={22} />
              </div>
              <div className="site-card-content">
                <h3 className="font-serif text-xl text-primary">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-prose py-20">
        <div className="mb-12 text-center">
          <span className="section-eyebrow">Meet Our Guides</span>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">Storytellers, not script-readers.</h2>
        </div>
        <div className="site-card-grid grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {teamMembers.map((guide) => (
            <div key={guide.slug} className="site-card rounded-2xl border border-border bg-card p-6 text-center hover-lift">
              <div className="site-card-icon mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 text-primary">
                <UserRound size={30} />
              </div>
              <div className="site-card-content">
                <h3 className="mt-4 font-serif text-lg text-primary">{guide.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{guide.role}</p>
                <p className="mt-2 text-sm text-foreground/75">{guide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container-prose grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.l}>
              <div className="font-serif text-5xl text-gold">{stat.v}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-primary-foreground/80">{stat.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-prose py-20 text-center">
        <Award className="mx-auto text-gold" size={36} />
        <h2 className="mt-4 font-serif text-3xl text-primary md:text-4xl">Travel that stays with you.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Whether you're a parent, a teacher, a student, or simply curious - there is a Paranjape
          journey waiting for you.
        </p>
        <Users className="mx-auto mt-8 text-primary/40" size={20} />
      </section>
    </Layout>
  );
}
