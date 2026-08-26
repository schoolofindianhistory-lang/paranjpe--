import { createFileRoute } from "@/lib/navigation";
import { useState, type ComponentType, type FormEvent } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import type { ContactEnquiryInput } from "@/data/contactEnquiry";
import { Layout } from "@/components/site/Layout";
import { PageBanner } from "@/components/site/PageBanner";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { siteContact } from "@/data/siteContact";
import type { ManagedTour } from "@/lib/content.types";
import { getPublicSiteContent, submitContactEnquiry } from "@/lib/static-content";

export const Route = createFileRoute("/contact")({
  loader: () => getPublicSiteContent(),
  head: () => ({
    meta: [
      { title: "Contact - Paranjape Tours" },
      {
        name: "description",
        content: "Plan your heritage journey. Talk to our team via phone, email or WhatsApp.",
      },
      { property: "og:title", content: "Contact Paranjape Tours" },
      { property: "og:description", content: "We'd love to design your next heritage trip." },
    ],
  }),
  component: Contact,
});

type SimpleContactFormState = {
  fullName: string;
  email: string;
  phone: string;
  tourInterest: string;
  preferredDate: string;
  numberOfPeople: string;
  message: string;
};

type ContactCard = {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  lines: { text: string; href?: string; external?: boolean }[];
};

const defaultTourInterest = "Any / Need recommendation";

const contactCards: ContactCard[] = [
  {
    icon: Phone,
    title: "Call Us",
    lines: [
      { text: siteContact.primaryPhone, href: siteContact.primaryPhoneHref },
      { text: "Mon - Sat, 10am - 7pm" },
    ],
  },
  {
    icon: WhatsAppIcon,
    title: "WhatsApp",
    lines: [
      { text: siteContact.whatsappPhone, href: siteContact.whatsappUrl, external: true },
      { text: "Personal / fastest way to reach us" },
    ],
  },
  {
    icon: Mail,
    title: "Email",
    lines: [{ text: siteContact.email, href: siteContact.mailtoHref }],
  },
  {
    icon: MapPin,
    title: "Office",
    lines: [{ text: "Avalon, Anandnagar," }, { text: "Sinhagad Road, Pune" }],
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: [{ text: "Office Timings: 11 AM - 4 PM" }, { text: "Sunday: by appointment" }],
  },
];

const faqItems = [
  {
    question: "How do I book a tour?",
    answer: "Send an enquiry through this form or WhatsApp us. Our team confirms within a few hours.",
  },
  {
    question: "Do you offer custom private tours?",
    answer: "Yes - for families, schools and corporate groups. Just tell us your dates and group size.",
  },
  {
    question: "Are tours kid-friendly?",
    answer: "Most heritage walks are. Each tour page lists the recommended age.",
  },
  {
    question: "What if it rains?",
    answer: "Monsoon adds magic to many tours. We provide guidance on what to carry and reschedule if conditions are unsafe.",
  },
] as const;

const initialFormState: SimpleContactFormState = {
  fullName: "",
  email: "",
  phone: "",
  tourInterest: defaultTourInterest,
  preferredDate: "",
  numberOfPeople: "",
  message: "",
};

function buildTourInterestOptions(tours: ManagedTour[]) {
  const seen = new Set<string>();
  const options = [defaultTourInterest];

  for (const tour of tours) {
    const title = tour.title.trim();
    if (!title) {
      continue;
    }

    const key = title.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    options.push(title);
  }

  return options;
}

function buildEnquiryMessage(formData: SimpleContactFormState) {
  const note = formData.message.trim();
  const details = [
    `Tour interested in: ${formData.tourInterest}`,
    formData.preferredDate ? `Preferred date: ${formData.preferredDate}` : undefined,
    formData.numberOfPeople ? `Number of people: ${formData.numberOfPeople}` : undefined,
    note ? `Message: ${note}` : undefined,
  ].filter(Boolean);

  return details.join(". ") || "Tour enquiry submitted from the website contact page.";
}

function mapToContactEnquiry(formData: SimpleContactFormState): ContactEnquiryInput {
  return {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    categoryValue: "tours-and-walks",
    preferredContactMethod: formData.phone.trim() ? "phone" : "email",
    organizationName: "",
    subject: formData.tourInterest,
    scheduleDetails: formData.preferredDate || "Flexible",
    groupDetails: formData.numberOfPeople || "Not specified",
    locationDetails: "Not provided",
    message: buildEnquiryMessage(formData),
  };
}

function Contact() {
  const { tours } = Route.useLoaderData();
  const tourInterestOptions = buildTourInterestOptions(tours);
  const [formData, setFormData] = useState<SimpleContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{
    tone: "idle" | "success" | "error";
    message: string;
  }>({
    tone: "idle",
    message: "",
  });

  function updateField<K extends keyof SimpleContactFormState>(field: K, value: SimpleContactFormState[K]) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ tone: "idle", message: "" });
    setIsSubmitting(true);

    try {
      const result = await submitContactEnquiry({
        data: mapToContactEnquiry(formData),
      });

      const savedToDatabase = Boolean(result?.savedToDatabase);
      const sentToEmail = Boolean(result?.sentToEmail);
      const referenceNumber = Number(result?.enquiryId ?? 0);

      setSubmitState({
        tone: "success",
        message:
          savedToDatabase && sentToEmail
            ? referenceNumber
              ? `Thanks. Your enquiry was emailed and saved successfully. Reference #${referenceNumber}.`
              : "Thanks. Your enquiry was emailed and saved successfully."
            : sentToEmail
              ? "Thanks. Your enquiry email was sent successfully."
              : referenceNumber
                ? `Thanks. Your enquiry was saved successfully. Reference #${referenceNumber}.`
                : "Thanks. Your enquiry was saved successfully.",
      });
      setFormData(initialFormState);
    } catch (error) {
      setSubmitState({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : `We couldn't send your enquiry right now. Please email ${siteContact.email}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <PageBanner
        title="Get in Touch"
        subtitle="Tell us where your curiosity is taking you next."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />

      <section className="container-prose grid gap-10 py-16 lg:grid-cols-[1.3fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] md:p-9"
        >
          <span className="section-eyebrow">Send Enquiry</span>
          <h2 className="mt-3 font-serif text-3xl text-primary">Plan your heritage journey</h2>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <InputField
              id="name"
              label="Full Name"
              value={formData.fullName}
              onChange={(value) => updateField("fullName", value)}
              required
              autoComplete="name"
            />
            <InputField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => updateField("email", value)}
              required
              autoComplete="email"
            />
            <InputField
              id="phone"
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(value) => updateField("phone", value)}
              autoComplete="tel"
            />
            <SelectField
              label="Tour Interested In"
              value={formData.tourInterest}
              onChange={(value) => updateField("tourInterest", value)}
              options={tourInterestOptions}
            />
            <InputField
              id="date"
              label="Preferred Date"
              type="date"
              value={formData.preferredDate}
              onChange={(value) => updateField("preferredDate", value)}
            />
            <InputField
              id="people"
              label="Number of People"
              type="number"
              value={formData.numberOfPeople}
              onChange={(value) => updateField("numberOfPeople", value)}
              min={1}
            />
            <div className="sm:col-span-2">
              <TextareaField
                label="Message"
                value={formData.message}
                onChange={(value) => updateField("message", value)}
                placeholder="Tell us a little about who's travelling and what you'd love to experience..."
                rows={4}
              />
            </div>
          </div>

          {submitState.tone !== "idle" && (
            <div
              className={`mt-5 rounded-xl px-4 py-3 text-sm ${
                submitState.tone === "success"
                  ? "border border-emerald-300/50 bg-emerald-50 text-emerald-800"
                  : "border border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {submitState.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send size={16} />
            {isSubmitting ? "Sending..." : "Send Enquiry"}
          </button>
        </form>

        <div className="space-y-5">
          {contactCards.map((card) => (
            <ContactInfoCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section className="container-prose pb-16">
        <div className="aspect-[16/7] overflow-hidden rounded-2xl border border-border bg-secondary">
          <iframe
            title="Office location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=73.83%2C18.50%2C73.88%2C18.55&layer=mapnik"
            className="h-full w-full"
            loading="lazy"
          />
        </div>
      </section>

      <section className="container-prose pb-20">
        <h2 className="text-center font-serif text-3xl text-primary md:text-4xl">Frequently Asked Questions</h2>
        <div className="heritage-divider my-5">
          <span />
        </div>
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-medium text-primary">{item.question}</h3>
              <p className="mt-2 text-sm text-foreground/80">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function ContactInfoCard({ card }: { card: ContactCard }) {
  const Icon = card.icon;

  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-primary">
        <Icon size={18} />
      </span>
      <div>
        <h4 className="font-serif text-lg text-primary">{card.title}</h4>
        <div className="mt-0.5 space-y-1">
          {card.lines.map((line) =>
            line.href ? (
              <a
                key={`${card.title}-${line.text}`}
                href={line.href}
                target={line.external ? "_blank" : undefined}
                rel={line.external ? "noreferrer" : undefined}
                className="block text-sm text-foreground/80 transition-colors hover:text-primary"
              >
                {line.text}
              </a>
            ) : (
              <p key={`${card.title}-${line.text}`} className="text-sm text-foreground/80">
                {line.text}
              </p>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
  min,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  min?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        min={min}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
