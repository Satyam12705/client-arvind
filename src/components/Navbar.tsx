import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { mailLink, telLink } from "../lib/whatsapp";
import { useContent } from "../lib/content";

export default function Navbar() {
  const { nav, company, siteSettings } = useContent();
  // "Contact" is deliberately left out here — the "Contact Us" button next
  // to these links (desktop) / below them (mobile menu) already covers it,
  // so listing it again read as a redundant duplicate link.
  const navLinks = nav.filter((n) => n.label !== "Home" && n.label !== "Contact");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Utility bar — desktop only. Sits in normal document flow (not sticky) so it
          scrolls away natively with zero JS and zero layout shift for the sticky nav below. */}
      <div className="hidden xl:block bg-charcoal text-ivory/55">
        <div className="container-edge flex items-center justify-between h-9 text-[0.7rem] tracking-[0.1em] font-mono uppercase">
          <p className="flex items-center gap-2.5">
            {siteSettings.certBarItems.map((item: string, i: number) => (
              <span key={item} className="flex items-center gap-2.5">
                {i > 0 && <Dot />}
                <span>{item}</span>
              </span>
            ))}
          </p>
          <div className="flex items-center gap-6">
            <a href={mailLink(company.emails[0])} className="hover:text-rust-light transition-colors">
              {company.emails[0]}
            </a>
            <a href={telLink(company.phones[0])} className="hover:text-rust-light transition-colors">
              +91 {company.phones[0]}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 animate-fade-down">
        {/* Main nav */}
        <div
          className={`border-b transition-colors duration-300 ${
            scrolled
              ? "bg-paper/95 border-concrete backdrop-blur"
              : "bg-paper border-concrete/70"
          }`}
          style={scrolled ? { boxShadow: "0 1px 0 rgba(0,0,0,0.02)" } : undefined}
        >
          <div
            className={`container-edge flex items-center justify-between gap-4 transition-[height] duration-300 ${
              scrolled ? "h-16 xl:h-[4.5rem]" : "h-16 xl:h-24"
            }`}
          >
            <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Anand Techno-Fab LLP home">
              <img
                src={siteSettings.logo}
                alt="Anand Techno-Fab LLP"
                width={455}
                height={238}
                className="h-11 xl:h-14 w-auto transition-all duration-300"
              />
            </Link>

            {/* Nav links + CTA grouped together so justify-between on the row
                above only opens one flexible gap (logo <-> this group) — with
                the group split into two separate flex children, removing a
                nav link shrank the links block and justify-between widened
                *both* surrounding gaps to compensate, leaving a visibly
                oversized, unbalanced gap right before the CTA button. */}
            <div className="hidden xl:flex items-center gap-8 2xl:gap-12 shrink-0">
              <nav className="flex items-center gap-4 2xl:gap-8 shrink-0">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="group relative py-2 label-eyebrow text-[0.72rem] 2xl:text-[0.78rem] text-charcoal/65 hover:text-charcoal transition-colors whitespace-nowrap"
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          className={`absolute left-0 right-0 -bottom-0.5 h-[2px] bg-rust origin-center transition-transform duration-300 ${
                            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 whitespace-nowrap bg-charcoal text-paper px-4 2xl:px-6 py-3 label-eyebrow text-[0.72rem] 2xl:text-[0.78rem] overflow-hidden relative hover:shadow-[0_4px_18px_rgba(184,83,31,0.35)] transition-shadow duration-300"
              >
                <span className="absolute inset-0 bg-rust origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                <span className="relative">{siteSettings.navCtaLabel}</span>
                <span className="relative inline-block transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
            </div>

            <div className="flex xl:hidden items-center gap-3">
              <a
                href={telLink(company.phones[0])}
                aria-label="Call Anand Techno-Fab"
                className="p-2 border border-charcoal/20 text-charcoal"
              >
                <PhoneIcon />
              </a>
              <button
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="p-2 border border-charcoal/20 text-charcoal"
              >
                {open ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="xl:hidden border-t border-concrete bg-paper animate-fade-up">
            <nav className="container-edge py-4 flex flex-col">
              {nav.filter((n) => n.label !== "Contact").map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `py-3 border-b border-concrete/70 label-eyebrow ${
                      isActive ? "text-rust" : "text-charcoal/80"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                className="mt-4 text-center bg-charcoal text-paper px-5 py-3 label-eyebrow"
              >
                {siteSettings.navCtaLabel}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

function Dot() {
  return <span className="w-1 h-1 rounded-full bg-ivory/25" />;
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 3h3l1.5 4-2 1.5a10 10 0 0 0 5 5l1.5-2 4 1.5v3a1 1 0 0 1-1 1C10 17 3 10 3 4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
