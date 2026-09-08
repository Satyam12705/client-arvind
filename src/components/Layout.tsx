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
      <main className="flex-1">{children}</main>
      <Footer />
      <ContactDock />
    </div>
  );
}
