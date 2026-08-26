import { createFileRoute } from "@/lib/navigation";
import { Layout } from "@/components/site/Layout";
import { PageBanner } from "@/components/site/PageBanner";
import heroWalk from "@/assets/hero-walk.jpg";

export const Route = createFileRoute("/general-faqs")({
  head: () => ({
    meta: [
      { title: "General FAQs - Paranjape Tours" },
      {
        name: "description",
        content:
          "Common questions about group size, bookings, payments, cancellation, hotels, meals, and transport.",
      },
      { property: "og:title", content: "General FAQs - Paranjape Tours" },
      {
        property: "og:description",
        content: "Plan confidently with quick answers to common heritage tour questions.",
      },
    ],
  }),
  component: GeneralFaqs,
});

type FaqItem = {
  question: string;
  answer: string;
};

type FaqGroup = {
  title: string;
  items: FaqItem[];
};

const faqGroups: FaqGroup[] = [
  {
    title: "General Tour Questions",
    items: [
      {
        question: "What is the usual group size?",
        answer:
          "Most group departures are kept compact, usually around 20 travellers, so the experience stays interactive.",
      },
      {
        question: "Can I join a tour midway or extend my stay?",
        answer:
          "In some itineraries, midpoint joining and post-tour stay extension are possible. Any route deviation or extra arrangements are chargeable.",
      },
      {
        question: "Can the itinerary change after booking?",
        answer:
          "Yes. Timings or sequence can change due to weather, transport disruption, venue restrictions, or other unforeseen factors.",
      },
      {
        question: "Do you provide a doctor on the tour?",
        answer:
          "No dedicated doctor travels with the group. Local medical help can be arranged in case of need, and the tour team carries basic first-aid support.",
      },
      {
        question: "Can I skip a sightseeing point and claim a refund?",
        answer:
          "You can skip a visit at your discretion, but skipped services are generally non-refundable.",
      },
    ],
  },
  {
    title: "Air/Rail and Baggage",
    items: [
      {
        question: "When are tickets issued?",
        answer:
          "Ticketing timelines depend on booking confirmation and transport availability. Confirmed details are shared by the team once processed.",
      },
      {
        question: "Can I upgrade to business class or higher train class?",
        answer:
          "Yes, subject to seat availability and fare difference payable by the traveller.",
      },
      {
        question: "Do you help with wheelchair requests?",
        answer:
          "Yes, requests can be placed in advance. Availability and charges depend on airline, airport, or station policies.",
      },
      {
        question: "What baggage allowance applies?",
        answer:
          "Baggage limits depend on airline or rail rules and your travel class. Final allowance is shared with your ticket details.",
      },
    ],
  },
  {
    title: "Booking, Payment, and Refunds",
    items: [
      {
        question: "Can I pay the full amount at once?",
        answer:
          "Yes. Full upfront payment is usually accepted, and in some cases may unlock early-payment benefits.",
      },
      {
        question: "Is partial payment possible?",
        answer:
          "Yes. You can reserve with a registration amount and pay the balance as per schedule shared by the team.",
      },
      {
        question: "What payment methods are supported?",
        answer:
          "Common options include bank transfer, UPI, cards, and cheque or demand draft (subject to clearance where applicable).",
      },
      {
        question: "How long do refunds usually take?",
        answer:
          "Approved refunds are generally processed within 7 working days, though partner-side timelines can extend this in specific cases.",
      },
      {
        question: "What happens if a tour is cancelled by the company?",
        answer:
          "In that situation, guests are typically offered a full refund or an option to adjust the amount against a future tour.",
      },
    ],
  },
  {
    title: "Hotels, Meals, and Local Transport",
    items: [
      {
        question: "When are hotel details shared?",
        answer:
          "Hotel details are usually shared before departure, and can be revised if operations require last-minute replacement.",
      },
      {
        question: "Is Wi-Fi always available in hotels?",
        answer:
          "Many hotels provide complimentary Wi-Fi, but network quality and paid access can vary by destination.",
      },
      {
        question: "What food is served on tour?",
        answer:
          "Most group plans include Indian vegetarian meals, with local variations by destination. Special requests can be attempted with advance notice.",
      },
      {
        question: "Is Jain meal support available?",
        answer:
          "Yes, requests are accepted in advance, but availability can vary by location and meal setup.",
      },
      {
        question: "What local transport is used?",
        answer:
          "Group size and destination decide the vehicle type, commonly AC minibuses or tempo travellers.",
      },
    ],
  },
];

function GeneralFaqs() {
  return (
    <Layout>
      <PageBanner
        title="General FAQs"
        subtitle="Quick answers to common tour planning questions."
        crumbs={[{ label: "Home", to: "/" }, { label: "General FAQs" }]}
        image={heroWalk}
      />

      <section className="container-prose py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] md:p-10">
          <p className="text-sm leading-relaxed text-foreground/80">
            This FAQ is drafted from common traveller queries and follows the same coverage style
            as the reference travel portal you shared.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            For itinerary-specific rules, please also review the Terms and Conditions page.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {faqGroups.map((group) => (
            <article key={group.title} className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
              <h2 className="font-serif text-2xl text-primary">{group.title}</h2>
              <div className="mt-5 space-y-4">
                {group.items.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-border/80 bg-background/55 p-5">
                    <h3 className="font-medium text-primary">{item.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/80">{item.answer}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
