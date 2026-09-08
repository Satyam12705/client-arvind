import { Link, useLocation } from "react-router-dom";
import { mailLink, telLink, whatsappLink } from "../lib/whatsapp";
import { useContent } from "../lib/content";
import Reveal from "./Reveal";
import AnimatedText from "./AnimatedText";
import MagneticButton from "./MagneticButton";

export default function Footer() {
  const { company, nav, siteSettings, footerContent, contactContent } = useContent();

  // Home already closes with its own full-bleed photo CTA immediately above
  // the footer — repeating the same "Start a Conversation / WhatsApp Us"
  // pair right below it would read as redundant, not premium.
  const { pathname } = useLocation();
  const showClosingCta = pathname !== "/";

  return (
    <footer className="bg-charcoal text-ivory/80">
      {/* Final brand statement — the last thing a visitor sees, on every page. */}
      <div className="container-edge pt-20 pb-12 md:pt-28 md:pb-16">
        <AnimatedText
          as="h2"
          lines={footerContent.brandStatement.split("\n")}
          className="text-editorial-display font-semibold uppercase tracking-tight leading-[0.98] text-white"
        />
      </div>

      {showClosingCta && (
      <div className="border-b border-ivory/10">
        <div className="container-edge py-16 md:py-20">
          <Reveal>
            <p className="label-eyebrow text-rust-light mb-4">— {footerContent.ctaEyebrow}</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <h2 className="text-3xl md:text-5xl font-semibold uppercase tracking-tight text-white max-w-2xl leading-[1.08]">
                {footerContent.ctaHeading}
              </h2>
              <div className="flex flex-wrap gap-4 shrink-0">
                <MagneticButton>
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2.5 bg-rust text-white px-7 py-3.5 label-eyebrow hover:bg-rust-dark hover:shadow-[0_6px_24px_rgba(184,83,31,0.4)] transition-all duration-300"
                  >
                    {footerContent.ctaPrimaryLabel}
                    <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href={whatsappLink(contactContent.whatsappDefaultMessage, company.whatsappNumber)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block border border-ivory/30 text-white px-7 py-3.5 label-eyebrow hover:border-ivory hover:bg-white/5 transition-all duration-300"
                  >
                    {footerContent.ctaSecondaryLabel}
                  </a>
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      )}

      <div className="container-edge py-14 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
        <div className="md:col-span-5">
          <img
            src={siteSettings.logo}
            alt="Anand Techno-Fab LLP"
            width={455}
            height={238}
            className="h-10 w-auto mb-4"
            loading="lazy"
            decoding="async"
          />
          <p className="text-ivory text-lg font-medium">{company.legalName}</p>
          <p className="mt-1 text-sm text-ivory/60">{company.tagline}</p>
          <p className="mt-6 text-sm leading-relaxed max-w-sm text-ivory/60">{footerContent.description}</p>
        </div>

        <div className="md:col-span-3">
          <p className="label-eyebrow text-ivory/40 mb-4">{footerContent.navigateHeading}</p>
          <ul className="grid grid-cols-2 grid-flow-col grid-rows-4 gap-x-6 gap-y-2.5 text-sm">
            {nav.filter((n) => n.label !== "Home").map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="group inline-flex items-center hover:text-rust-light transition-colors">
                  <span className="relative">
                    {item.label}
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-rust-light transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="label-eyebrow text-ivory/40 mb-4">{footerContent.contactHeading}</p>
          <ul className="space-y-2.5 text-sm">
            <li>{company.cityState}</li>
            <li className="text-ivory/60">{company.registeredAddress}</li>
            <li>
              <a href={mailLink(company.emails[0])} className="hover:text-rust-light transition-colors">
                {company.emails[0]}
              </a>
            </li>
            {company.phones.map((p) => (
              <li key={p}>
                <a href={telLink(p)} className="hover:text-rust-light transition-colors">
                  +91 {p}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-edge py-5 flex flex-col md:flex-row gap-2 md:gap-6 items-start md:items-center justify-between text-xs text-ivory/40">
          <p>© {new Date().getFullYear()} Anand Techno-Fab LLP. All rights reserved.</p>
          <p>LLP Identity No. {company.llpIdentityNo} · GST {company.gstNo}</p>
        </div>
      </div>
    </footer>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
