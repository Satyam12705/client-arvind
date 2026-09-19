import { SITE_URL } from "../data/seoRoutes";
import { company } from "../data/company";

/**
 * Site-wide GeneralContractor/Organization structured data, rendered once in
 * Layout. Built entirely from the static company.ts record (registered
 * address, GST/Udyam identifiers, phones) rather than live admin content, so
 * it stays valid even before /api/content resolves and can't drift out of
 * sync with the legal/registration details a search engine cross-checks.
 */
export default function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE_URL}/#organization`,
    name: company.displayName,
    legalName: company.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    foundingDate: String(company.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: company.registeredAddress,
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    telephone: `+91${company.phones[0]}`,
    email: company.emails[0],
    areaServed: [
      { "@type": "State", name: "Gujarat" },
      { "@type": "State", name: "Rajasthan" },
      { "@type": "State", name: "Madhya Pradesh" },
    ],
    sameAs: [],
  };

  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
