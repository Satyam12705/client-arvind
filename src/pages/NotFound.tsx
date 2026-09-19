import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo
        path={typeof window !== "undefined" ? window.location.pathname : "/404"}
        title="Page Not Found | Anand Techno-Fab LLP"
        description="The page you're looking for doesn't exist or may have moved."
        noindex
      />
      <PageHero eyebrow="404" title="Page Not Found" intro="The page you're looking for doesn't exist or may have moved." />
      <section className="container-edge py-16 md:py-20 text-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2.5 bg-charcoal text-paper px-8 py-4 label-eyebrow hover:bg-rust transition-colors duration-300"
        >
          Back to Home
        </Link>
      </section>
    </>
  );
}
