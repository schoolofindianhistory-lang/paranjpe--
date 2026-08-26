import { createFileRoute } from "@/lib/navigation";
import { Layout } from "@/components/site/Layout";
import { PageBanner } from "@/components/site/PageBanner";
import { siteContact } from "@/data/siteContact";
import heroStory from "@/assets/hero-story.jpg";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions - Paranjape Tours" },
      {
        name: "description",
        content:
          "Read the tour booking, cancellation, conduct, and liability terms for Paranjape Tours.",
      },
      { property: "og:title", content: "Terms and Conditions - Paranjape Tours" },
      {
        property: "og:description",
        content: "Important terms related to bookings, payments, refunds, and traveller responsibilities.",
      },
    ],
  }),
  component: TermsAndConditions,
});

const cancellationSlabs = [
  { days: "0 to 10 days before departure", charge: "100%" },
  { days: "10 to 20 days before departure", charge: "50%" },
  { days: "20 to 30 days before departure", charge: "30%" },
  { days: "More than 30 days before departure", charge: "10%" },
];

const scopeHighlights = [
  "These terms apply to domestic tours, international tours, customized trips, and related services.",
  "By enquiring, booking, paying, or travelling with us, you agree to the current terms published by Paranjape Tours.",
  "If any provision is declared invalid, the remaining provisions continue to apply.",
];

const bookingHighlights = [
  "A booking is considered initiated when a registration amount or full payment is received.",
  "Guest details must be accurate. Incorrect contact or document information can affect confirmation.",
  "Domestic travel may require valid photo ID. International travel requires a valid passport and applicable documentation.",
  "Any amendment request is handled subject to availability and may involve amendment charges.",
];

const responsibilityHighlights = [
  "Travellers are responsible for personal belongings, travel documents, and punctual reporting.",
  "Medical fitness to travel is the traveller's responsibility. Guests should disclose relevant medical conditions in advance.",
  "Unacceptable behaviour, abuse, disruptive conduct, or prohibited substances can result in removal from tour without refund.",
  "Instructions from the tour team for safety and logistics are expected to be followed during group travel.",
];

const liabilityHighlights = [
  "Itinerary elements may change due to weather, transport disruption, security advisories, or other circumstances beyond control.",
  "Transport, hotels, and venue services are provided by third-party operators with their own operational policies.",
  "Delays, cancellations, baggage loss, or service-level issues by third-party providers may affect tour flow.",
  "Paranjape Tours' liability remains limited to the extent permitted by applicable law and confirmed service terms.",
];

function TermsAndConditions() {
  return (
    <Layout>
      <PageBanner
        title="Terms and Conditions"
        subtitle="Please review these terms carefully before booking."
        crumbs={[{ label: "Home", to: "/" }, { label: "Terms and Conditions" }]}
        image={heroStory}
      />

      <section className="container-prose py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] md:p-10">
          <p className="text-sm leading-relaxed text-foreground/80">
            These terms are adapted to reflect the booking and operating framework commonly used
            for heritage tours. Please read them before making a reservation.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            Last updated: May 15, 2026.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <TermsSection title="Scope and Acceptance" items={scopeHighlights} />
          <TermsSection title="Booking and Documentation" items={bookingHighlights} />

          <article className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-2xl text-primary">Cancellation and Refund Framework</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              Cancellation charges are generally calculated against departure date and can vary by
              itinerary, airfare type, and supplier conditions.
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-[color-mix(in_oklab,var(--secondary)_55%,var(--background))] text-foreground/85">
                  <tr>
                    <th className="px-4 py-3 font-medium">Cancellation Window</th>
                    <th className="px-4 py-3 font-medium">Indicative Charge Per Person</th>
                  </tr>
                </thead>
                <tbody>
                  {cancellationSlabs.map((slab) => (
                    <tr key={slab.days} className="border-t border-border">
                      <td className="px-4 py-3 text-foreground/80">{slab.days}</td>
                      <td className="px-4 py-3 font-medium text-primary">{slab.charge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="mt-5 space-y-2 text-sm leading-relaxed text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>GST and certain taxes are generally non-refundable once levied.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  Non-refundable airfare, visa actions, and supplier-side charges may apply in
                  addition to the slab.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>
                  No-show or mid-tour discontinuation is treated as cancellation and may not be
                  eligible for refund.
                </span>
              </li>
            </ul>
          </article>

          <TermsSection title="Traveller Responsibilities and Conduct" items={responsibilityHighlights} />
          <TermsSection title="Tour Changes, Risk, and Liability" items={liabilityHighlights} />

          <TermsSection
            title="Website Use and Intellectual Property"
            items={[
              "Website availability may vary due to maintenance or technical issues.",
              "Users must not attempt unauthorized access or introduce harmful code into our systems.",
              "Website text, design, and media are protected by intellectual property rights.",
            ]}
          />

          <div className="rounded-3xl border border-gold/35 bg-gold/10 p-6">
            <h2 className="font-serif text-2xl text-primary">Updates and Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              Terms may be revised from time to time. For clarification, contact us at{" "}
              <a href={siteContact.mailtoHref} className="font-medium text-primary hover:underline">
                {siteContact.email}
              </a>{" "}
              or{" "}
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

function TermsSection({ title, items }: { title: string; items: string[] }) {
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
