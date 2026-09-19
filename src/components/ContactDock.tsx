import { whatsappLink, telLink } from "../lib/whatsapp";
import { useContent } from "../lib/content";

export default function ContactDock() {
  const { company, contactContent } = useContent();
  const waLink = whatsappLink(contactContent.whatsappDefaultMessage, company.whatsappNumber);

  return (
    <>
      {/* Desktop floating WhatsApp control — right wall, vertically centered */}
      <div className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative flex items-center justify-center w-16 h-16 rounded-l-2xl bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,0.4)] hover:w-[13.5rem] hover:rounded-l-2xl transition-all duration-300 ease-out overflow-hidden"
        >
          <span className="absolute inset-0 rounded-l-2xl bg-[#25D366] animate-wa-pulse" />
          <span className="relative flex items-center gap-3 pl-1">
            <WhatsAppIcon className="w-7 h-7 shrink-0" />
            <span className="label-eyebrow whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[9rem] group-hover:opacity-100 transition-all duration-300">
              WhatsApp Us
            </span>
          </span>
        </a>
      </div>

      {/* Mobile sticky action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 bg-charcoal text-paper border-t border-ivory/10">
        <a href={telLink(company.phones[0])} className="flex flex-col items-center justify-center gap-1 py-3 border-r border-ivory/10 active:bg-charcoal-soft">
          <PhoneIcon />
          <span className="label-eyebrow text-[10px]">Call</span>
        </a>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-1 py-3 border-r border-ivory/10 bg-rust active:bg-rust-dark"
        >
          <WhatsAppIcon />
          <span className="label-eyebrow text-[10px]">WhatsApp</span>
        </a>
        <a href="/contact" className="flex flex-col items-center justify-center gap-1 py-3 active:bg-charcoal-soft">
          <EnquireIcon />
          <span className="label-eyebrow text-[10px]">Enquire</span>
        </a>
      </div>
    </>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.6 6.32A8.86 8.86 0 0 0 12.02 3.6a8.94 8.94 0 0 0-7.73 13.4L3 21l4.13-1.28a8.9 8.9 0 0 0 4.9 1.45h.01a8.94 8.94 0 0 0 5.56-15.85Zm-5.58 13.7a7.4 7.4 0 0 1-3.78-1.03l-.27-.16-2.45.76.77-2.4-.18-.28a7.44 7.44 0 0 1 11.55-9.24 7.34 7.34 0 0 1 2.17 5.24 7.44 7.44 0 0 1-7.81 7.11Zm4.06-5.56c-.22-.11-1.31-.65-1.51-.72-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.16-.48.05a6.1 6.1 0 0 1-1.8-1.1 6.7 6.7 0 0 1-1.24-1.54c-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.4-.06-.11-.5-1.2-.68-1.64-.18-.43-.36-.37-.5-.38h-.43c-.15 0-.4.06-.6.28-.2.22-.79.77-.79 1.88 0 1.11.81 2.18.92 2.33.11.15 1.6 2.44 3.87 3.42.54.23.96.37 1.29.48.54.17 1.03.15 1.42.09.43-.06 1.31-.53 1.5-1.05.18-.51.18-.95.13-1.04-.06-.1-.2-.15-.42-.26Z" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 3h3l1.5 4-2 1.5a10 10 0 0 0 5 5l1.5-2 4 1.5v3a1 1 0 0 1-1 1C10 17 3 10 3 4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function EnquireIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 4h14v9H8l-3.5 3V13H3V4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.5 7.5h7M6.5 10h4.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
