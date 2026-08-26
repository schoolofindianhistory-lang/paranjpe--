import { Link, useLocation } from "@/lib/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { tourListingFilters } from "@/data/tourFilters";

const linksBeforeTours = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
];

const linksAfterTours = [
  { to: "/gallery", label: "Gallery" },
  { to: "/shop", label: "Shop" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

const tourDropdownLinks = tourListingFilters.filter((filter) => filter.value !== "all");
const navLinkClass =
  "text-sm transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full";

export function Header() {
  const [open, setOpen] = useState(false);
  const [desktopToursOpen, setDesktopToursOpen] = useState(false);
  const [mobileToursOpen, setMobileToursOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const currentLocation = useLocation({ select: (location) => location.href });
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) setMobileToursOpen(false);
  }, [open]);
  useEffect(() => {
    setDesktopToursOpen(false);
    setOpen(false);
    setMobileToursOpen(false);
  }, [currentLocation]);

  const closeMenus = () => {
    setDesktopToursOpen(false);
    setOpen(false);
    setMobileToursOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur shadow-[var(--shadow-soft)]" : "bg-background/60 backdrop-blur"
      }`}
    >
      <div className="container-prose flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif text-xl shadow-[var(--shadow-soft)]">
            पा
          </span>
          <span className="font-serif text-xl md:text-2xl text-primary leading-none">
            Paranjape Tours
            <span className="block text-[10px] tracking-[0.3em] text-muted-foreground uppercase mt-0.5">
              Heritage Storytellers
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {linksBeforeTours.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: false }}
              activeProps={{ className: "text-primary font-semibold" }}
              inactiveProps={{ className: "text-foreground/70 hover:text-primary" }}
              className={navLinkClass}
            >
              {l.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setDesktopToursOpen(true)}
            onMouseLeave={() => setDesktopToursOpen(false)}
            onFocusCapture={() => setDesktopToursOpen(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setDesktopToursOpen(false);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setDesktopToursOpen(false);
            }}
          >
            <Link
              to="/tours"
              onClick={() => setDesktopToursOpen(false)}
              activeProps={{ className: "text-primary font-semibold" }}
              inactiveProps={{ className: "text-foreground/70 hover:text-primary" }}
              className={`${navLinkClass} inline-flex items-center gap-1`}
            >
              Tours
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${desktopToursOpen ? "rotate-180" : ""}`}
              />
            </Link>

            <div
              className={`absolute left-0 top-full z-20 pt-4 transition-all duration-200 ${
                desktopToursOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"
              }`}
            >
              <div className="min-w-[220px] rounded-2xl border border-border bg-background/95 p-2 shadow-[var(--shadow-elegant)] backdrop-blur">
                {tourDropdownLinks.map((filter) => (
                  <Link
                    key={filter.value}
                    to="/tours"
                    search={{ type: filter.value }}
                    onClick={() => setDesktopToursOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-sm text-foreground/75 transition-colors hover:bg-secondary hover:text-primary"
                  >
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {linksAfterTours.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: false }}
              activeProps={{ className: "text-primary font-semibold" }}
              inactiveProps={{ className: "text-foreground/70 hover:text-primary" }}
              className={navLinkClass}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elegant)] transition-shadow"
          >
            Enquire Now
          </Link>
          <button
            aria-label="Menu"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-primary"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur animate-fade-in">
          <div className="container-prose py-4 flex flex-col gap-1">
            {linksBeforeTours.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={closeMenus}
                activeOptions={{ exact: false }}
                activeProps={{ className: "bg-secondary text-primary" }}
                className="px-3 py-2.5 rounded-md text-sm hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}

            <div className="rounded-md">
              <div className="flex items-center gap-2">
                <Link
                  to="/tours"
                  onClick={closeMenus}
                  className="flex-1 rounded-md px-3 py-2.5 text-sm hover:bg-secondary"
                  activeProps={{ className: "bg-secondary text-primary" }}
                >
                  Tours
                </Link>
                <button
                  type="button"
                  aria-label="Toggle Tours menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-primary hover:bg-secondary"
                  onClick={() => setMobileToursOpen((value) => !value)}
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${mobileToursOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {mobileToursOpen && (
                <div className="ml-4 mt-2 flex flex-col gap-1 border-l border-border pl-4">
                  {tourDropdownLinks.map((filter) => (
                    <Link
                      key={filter.value}
                      to="/tours"
                      search={{ type: filter.value }}
                      onClick={closeMenus}
                      className="rounded-md px-3 py-2 text-sm text-foreground/75 hover:bg-secondary hover:text-primary"
                    >
                      {filter.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {linksAfterTours.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={closeMenus}
                activeOptions={{ exact: false }}
                activeProps={{ className: "bg-secondary text-primary" }}
                className="px-3 py-2.5 rounded-md text-sm hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={closeMenus}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
