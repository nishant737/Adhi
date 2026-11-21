import CtaBand from "@/components/CtaBand";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import QuickPaths from "@/components/QuickPaths";
import Reviews from "@/components/Reviews";
import Stats from "@/components/Stats";
import { contact } from "@/data/contact";
import { SITE_URL } from "@/data/site";

const agency = {
  "@context": "https://schema.org",
  "@type": "EmploymentAgency",
  name: "Aadhi Consulting Services",
  description:
    "Job placement and HR consultancy offering job placement in India and abroad, HR services, training, career guidance and visa application support.",
  telephone: contact.phones,
  email: contact.email,
  ...(SITE_URL && { url: SITE_URL }),
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.addressParts.street,
    addressLocality: contact.addressParts.locality,
    addressRegion: contact.addressParts.region,
    postalCode: contact.addressParts.postalCode,
    addressCountry: contact.addressParts.country,
  },
  areaServed: ["India", "Worldwide"],
  knowsAbout: ["Job placement", "Overseas jobs", "HR services", "Recruitment", "Career guidance", "Training", "Visa application"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: ["Job Placement (Domestic & International)", "Payroll Management", "German Language Training", "Visa Application Support"].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

// Home is short on purpose: hero, "what are you looking for?", proof, and a way to act.
// Everything else lives on its own page (Services, Jobs, About, Contact).
export default function Home() {
  return (
    <main className="relative flex-1">
      <JsonLd data={agency} />
      <Hero />
      {/* Slides up over the pinned hero */}
      <QuickPaths />
      <Stats />
      <Reviews />
      <CtaBand />
    </main>
  );
}
