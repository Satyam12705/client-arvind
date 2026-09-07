import { useState, type FormEvent } from "react";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import Reveal from "../components/Reveal";
import MagneticButton from "../components/MagneticButton";
import Seo from "../components/Seo";
import { useContent } from "../lib/content";
import { buildEnquiryMessage, mailLink, telLink, whatsappLink } from "../lib/whatsapp";

interface FormState {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  requirement: string;
}

const initialState: FormState = {
  name: "",
  companyName: "",
  phone: "",
  email: "",
  location: "",
  service: "",
  requirement: "",
};

export default function Contact() {
  const { company, specializations, pageHeroes, contactContent } = useContent();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const message = buildEnquiryMessage(form);

  return (
    <>
      <Seo path="/contact" breadcrumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
      <PageHero index="08" eyebrow={pageHeroes.contact.eyebrow} title={pageHeroes.contact.title} intro={pageHeroes.contact.intro} />

      {/* Quick contact */}
      <section className="container-edge py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-concrete border border-concrete">
          <Reveal
            as="a"
            href={telLink(company.phones[0])}
            className="block bg-paper p-8 hover:bg-ivory hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <p className="label-eyebrow text-rust">Call</p>
            <p className="mt-3 text-lg font-medium group-hover:text-rust transition-colors">+91 {company.phones[0]}</p>
            <p className="mt-1 text-sm text-steel">+91 {company.phones[1]}</p>
          </Reveal>
          <Reveal
            as="a"
            delay={100}
            href={mailLink(company.emails[0])}
            className="block bg-paper p-8 hover:bg-ivory hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <p className="label-eyebrow text-rust">Email</p>
            <p className="mt-3 text-lg font-medium group-hover:text-rust transition-colors break-all">{company.emails[0]}</p>
          </Reveal>
          <Reveal
            as="a"
            delay={200}
            href={whatsappLink(contactContent.whatsappDefaultMessage, company.whatsappNumber)}
            target="_blank"
            rel="noreferrer"
            className="block bg-paper p-8 hover:bg-ivory hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <p className="label-eyebrow text-rust">WhatsApp</p>
            <p className="mt-3 text-lg font-medium group-hover:text-rust transition-colors">Start a chat</p>
            <p className="mt-1 text-sm text-steel">Instant, no waiting on hold</p>
          </Reveal>
        </div>
      </section>

      {/* Form + address */}
      <section className="bg-ivory border-y border-concrete">
        <div className="container-edge py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-7">
            <SectionLabel index={contactContent.enquiry.eyebrowIndex} label={contactContent.enquiry.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-lg">
              {contactContent.enquiry.heading}
            </h2>

            {!submitted ? (
              <form onSubmit={onSubmit} className="mt-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Full Name" required>
                    <input required value={form.name} onChange={set("name")} className="input" placeholder="Your name" />
                  </Field>
                  <Field label="Company Name">
                    <input value={form.companyName} onChange={set("companyName")} className="input" placeholder="Your company" />
                  </Field>
                  <Field label="Phone Number" required>
                    <input required type="tel" value={form.phone} onChange={set("phone")} className="input" placeholder="10-digit mobile number" />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={form.email} onChange={set("email")} className="input" placeholder="you@company.com" />
                  </Field>
                  <Field label="Project Location">
                    <input value={form.location} onChange={set("location")} className="input" placeholder="City, State" />
                  </Field>
                  <Field label="Service Required">
                    <select value={form.service} onChange={set("service")} className="input">
                      <option value="">Select a service</option>
                      {specializations.map((s) => (
                        <option key={s.number} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Project Requirement" required>
                  <textarea
                    required
                    rows={4}
                    value={form.requirement}
                    onChange={set("requirement")}
                    className="input resize-none"
                    placeholder="Briefly describe your project requirement"
                  />
                </Field>

                <MagneticButton className="w-full md:w-auto">
                  <button
                    type="submit"
                    className="group w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-charcoal text-paper px-8 py-4 label-eyebrow hover:bg-rust hover:shadow-[0_6px_24px_rgba(184,83,31,0.35)] transition-all duration-300"
                  >
                    Send Project Enquiry
                    <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </MagneticButton>
              </form>
            ) : (
              <div className="mt-10 border border-rust/40 bg-paper p-8 animate-fade-up">
                <p className="label-eyebrow text-rust">Enquiry Ready</p>
                <p className="mt-3 text-lg font-medium">
                  Thank you. Your enquiry details are ready to be shared with Anand Techno-Fab.
                </p>
                <p className="mt-2 text-sm text-steel leading-relaxed">
                  This form does not connect to a live inbox in this preview. Use the button
                  below to send your details directly to us over WhatsApp, or reach us by
                  phone or email above.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href={whatsappLink(message, company.whatsappNumber)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-rust text-white px-6 py-3 label-eyebrow hover:bg-rust-dark transition-colors"
                  >
                    Send via WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm(initialState);
                    }}
                    className="border border-charcoal/30 px-6 py-3 label-eyebrow hover:border-charcoal transition-colors"
                  >
                    Start Over
                  </button>
                </div>
                <pre className="mt-6 whitespace-pre-wrap text-xs text-steel bg-ivory border border-concrete p-4 font-mono">
{message}
                </pre>
              </div>
            )}
          </Reveal>

          <Reveal delay={150} className="lg:col-span-5">
            <SectionLabel index={contactContent.office.eyebrowIndex} label={contactContent.office.eyebrowLabel} />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight uppercase max-w-lg">
              {contactContent.office.heading}
            </h2>
            <p className="mt-6 text-charcoal/80 leading-relaxed">{company.registeredAddress}</p>

            <div className="mt-8 space-y-4 border-t border-concrete pt-6">
              <div>
                <p className="label-eyebrow text-steel">Email</p>
                {company.emails.map((e) => (
                  <p key={e}>
                    <a href={mailLink(e)} className="hover:text-rust transition-colors">
                      {e}
                    </a>
                  </p>
                ))}
              </div>
              <div>
                <p className="label-eyebrow text-steel">Phone</p>
                {company.phones.map((p) => (
                  <p key={p}>
                    <a href={telLink(p)} className="hover:text-rust transition-colors">
                      +91 {p}
                    </a>
                  </p>
                ))}
              </div>
              <div>
                <p className="label-eyebrow text-steel">GST No.</p>
                <p>{company.gstNo}</p>
              </div>
              <div>
                <p className="label-eyebrow text-steel">LLP Identity No.</p>
                <p>{company.llpIdentityNo}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          background: var(--color-paper);
          border: 1px solid var(--color-concrete);
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          color: var(--color-charcoal);
          transition: border-color 0.25s ease;
        }
        .input:focus {
          outline: none;
          border-color: var(--color-rust);
        }
      `}</style>
    </>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-eyebrow text-steel">
        {label}
        {required && <span className="text-rust"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
