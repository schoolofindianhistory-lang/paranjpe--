import { createFileRoute } from "@/lib/navigation";
import { Layout } from "@/components/site/Layout";
import { PageBanner } from "@/components/site/PageBanner";
import { siteContact } from "@/data/siteContact";
import heroTemple from "@/assets/hero-temple.jpg";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - Paranjape Tours" },
      {
        name: "description",
        content:
          "Learn how Paranjape Tours collects, uses and protects your personal information.",
      },
      { property: "og:title", content: "Privacy Policy - Paranjape Tours" },
      {
        property: "og:description",
        content: "Our approach to user data, consent, cookies, and communication preferences.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

const collectedInformation = [
  "Identity and contact details you provide during enquiry or booking, including your name, phone number, email address, and address.",
  "Travel-related details required to plan or confirm your tour, such as preferred dates, participant details, and special requests.",
  "Document details required for specific travel workflows, where applicable, including ID and passport-related information.",
  "Basic technical usage data such as IP address, browser type, device type, and page visit patterns.",
  "Payment reference information needed for reconciliation; full card credentials are processed by secure payment providers.",
];

const usageOfInformation = [
  "To respond to your enquiries and confirm bookings.",
  "To share tour updates, schedule changes, and other service-related communication.",
  "To improve our website experience, services, and itinerary recommendations.",
  "To maintain security, prevent misuse, and comply with legal obligations.",
  "To send promotional communication, where you have opted in or where permitted by law.",
];

const sharingPractices = [
  "With trusted vendors and partners who help deliver our tours or website services.",
  "With payment, communication, and booking service providers, only as needed to complete operations.",
  "With authorities where required by applicable law, legal process, or safety obligations.",
  "With successor entities in case of a lawful business transfer or restructuring.",
];

function PrivacyPolicy() {
  return (
    <Layout>
      <PageBanner
        title="Privacy Policy"
        subtitle="How we collect, use, and safeguard your information."
        crumbs={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]}
        image={heroTemple}
      />

      <section className="container-prose py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] md:p-10">
          <p className="text-sm leading-relaxed text-foreground/80">
            This policy explains how Paranjape Tours manages information collected through our
            website, enquiries, and bookings. By using this website, you consent to the practices
            described here.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            Last updated: May 15, 2026.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <PolicySection title="Information We Collect" items={collectedInformation} />
          <PolicySection title="How We Use Information" items={usageOfInformation} />
          <PolicySection title="How Information May Be Shared" items={sharingPractices} />

          <PolicySection
            title="Cookies, Analytics, and Third-Party Links"
            items={[
              "We use cookies and analytics tools to understand site usage and improve the browsing experience.",
              "Third-party websites linked from our website operate under their own privacy policies.",
              "You should review external privacy policies before sharing personal information on those websites.",
            ]}
          />

          <PolicySection
            title="Your Choices"
            items={[
              "You may request to opt out of marketing emails at any time.",
              "Even if you opt out of promotions, we may continue to send transactional communication related to enquiries, payments, or bookings.",
            ]}
          />

          <PolicySection
            title="Policy Updates and Jurisdiction"
            items={[
              "We may revise this policy when required to reflect legal, operational, or service changes.",
              "Any privacy-related disputes are governed by applicable laws of India.",
            ]}
          />

          <div className="rounded-3xl border border-gold/35 bg-gold/10 p-6">
            <h2 className="font-serif text-2xl text-primary">Contact for Privacy Questions</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              For privacy requests or clarifications, contact us at{" "}
              <a href={siteContact.mailtoHref} className="font-medium text-primary hover:underline">
                {siteContact.email}
              </a>{" "}
              or call{" "}
              <a href={siteContact.primaryPhoneHref} className="font-medium text-primary hover:underline">
                {siteContact.primaryPhone}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function PolicySection({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
      <h2 className="font-serif text-2xl text-primary">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/80">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
