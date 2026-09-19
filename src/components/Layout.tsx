import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ContactDock from "./ContactDock";
import LogoIntro from "./LogoIntro";
import ScrollProgress from "./ScrollProgress";
import OrganizationJsonLd from "./OrganizationJsonLd";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-charcoal pb-16 md:pb-0">
      <OrganizationJsonLd />
      <LogoIntro />
      <ScrollProgress />
      <Navbar />
      {/* overflow-x: clip contains the horizontal entrance offsets used by
          Reveal's "left"/"right" variants. Before an element reveals it sits
          32px off to one side, which on a narrow viewport pushed the page
          wider than the screen and produced a horizontal scrollbar. `clip`
          rather than `hidden` because it does not create a scroll container,
          so the sticky header and in-page anchor scrolling still work. */}
      <main className="flex-1 [overflow-x:clip]">{children}</main>
      <Footer />
      <ContactDock />
    </div>
  );
}
