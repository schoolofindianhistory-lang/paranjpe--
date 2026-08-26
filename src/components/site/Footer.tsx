import { Link } from "@/lib/navigation";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import footerBackdrop from "@/assets/gallery/gondeshwar-complex.jpg";
import { siteContact } from "@/data/siteContact";
import { tourListingFilters } from "@/data/tourFilters";
import { WhatsAppIcon } from "./WhatsAppIcon";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/firasti_heritage/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/peshwehistory/", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@CAShantanuParanjape", label: "YouTube" },
] as const;

const footerTourCategories = tourListingFilters.filter((filter) => filter.value !== "all");

export function Footer() {
  return (
    <footer className="relative isolate mt-24 overflow-hidden border-t border-border bg-[color-mix(in_oklab,var(--secondary)_60%,var(--background))]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(143,89,47,0.08),transparent_42%)]" />
        <img
          src={footerBackdrop}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-center opacity-[0.26] [filter:sepia(0.16)_saturate(1)_brightness(0.94)_contrast(1)] sm:opacity-[0.3] md:opacity-[0.38]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,232,0.82)_0%,rgba(247,241,232,0.64)_40%,rgba(247,241,232,0.74)_100%)] sm:bg-[linear-gradient(180deg,rgba(247,241,232,0.8)_0%,rgba(247,241,232,0.58)_42%,rgba(247,241,232,0.7)_100%)] md:bg-[linear-gradient(90deg,rgba(247,241,232,0.84)_0%,rgba(247,241,232,0.64)_24%,rgba(247,241,232,0.42)_52%,rgba(247,241,232,0.5)_76%,rgba(247,241,232,0.64)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(180deg,rgba(247,241,232,0.36)_0%,rgba(247,241,232,0.16)_62%,transparent_100%)] md:h-[46%]" />
      </div>
      <div className="container-prose relative z-10 grid items-start gap-x-8 gap-y-12 py-14 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1.15fr] lg:gap-x-14 xl:gap-x-16">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif">
              &#2346;&#2366;
            </span>
            <span className="font-serif text-xl text-primary">Paranjape Tours</span>
          </div>
          <p className="text-sm leading-9 text-foreground/85 [text-align:justify] sm:leading-8">
            A heritage storytelling travel experience brand &mdash; helping you rediscover history through forts,
            temples, walks and stories.
          </p>
        </div>

        <div className="min-w-0">
          <h4 className="mb-5 font-serif text-lg text-primary">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Tours", "/tours"],
              ["Gallery", "/gallery"],
              ["Shop", "/shop"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
              ["Privacy Policy", "/privacy-policy"],
              ["Terms and Conditions", "/terms-and-conditions"],
              ["General FAQs", "/general-faqs"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to as string} className="text-foreground/85 transition-colors hover:text-primary">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 max-w-[14rem]">
          <h4 className="mb-5 font-serif text-lg text-primary">Tour Categories</h4>
          <ul className="space-y-4 text-sm">
            {footerTourCategories.map((filter) => (
              <li key={filter.value}>
                <Link
                  to="/tours"
                  search={{ type: filter.value }}
                  className="text-foreground/85 transition-colors hover:text-primary"
                >
                  {filter.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-border/70 pt-5">
            <p className="mb-4 text-[0.7rem] uppercase tracking-[0.24em] text-foreground/70">
              Follow Us
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <h4 className="mb-5 font-serif text-lg text-primary">Get in Touch</h4>
          <ul className="space-y-3.5 text-sm leading-7 text-foreground/90">
            <li className="flex items-start gap-3">
              <Phone size={16} className="mt-1 shrink-0 text-gold" />
              <a href={siteContact.primaryPhoneHref} className="transition-colors hover:text-primary">
                {siteContact.primaryPhone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <WhatsAppIcon size={16} className="mt-1 shrink-0 text-gold" />
              <a
                href={siteContact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                Personal: {siteContact.whatsappPhone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="mt-1 shrink-0 text-gold" />
              <a href={siteContact.mailtoHref} className="break-all transition-colors hover:text-primary">
                {siteContact.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-1 shrink-0 text-gold" />
              <a
                href={siteContact.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                {siteContact.address}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 border-t border-border/80 bg-[color-mix(in_oklab,var(--background)_74%,transparent)] px-4 py-5 text-center text-[0.82rem] font-medium leading-6 text-foreground/75 backdrop-blur-sm">
        &copy; 2026 All Rights Reserved By Paranjape Tours. Designed By{" "}
        <a href="https://webakoof.com/index.html" className="transition-colors hover:text-primary">
          Webakoof
        </a>
        .
      </div>
    </footer>
  );
}
