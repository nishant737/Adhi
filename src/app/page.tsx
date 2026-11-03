import About from "@/components/About";
import Careers from "@/components/Careers";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Faculty from "@/components/Faculty";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Manpower from "@/components/Manpower";
import Navbar from "@/components/Navbar";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import Solutions from "@/components/Solutions";
import Stats from "@/components/Stats";
import WhatsAppButton from "@/components/WhatsAppButton";
import { contact } from "@/data/contact";
import { SITE_URL } from "@/data/site";
import { faqs } from "@/data/faqs";
import { getOpenings } from "@/data/sheet";

// Structured data so search engines and AI assistants can read the business details and FAQs directly
const jsonLd = [
  {
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
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default async function Home() {
  const openings = await getOpenings();

  return (
    <>
      {/* One standard JSON-LD block per entity, each with its own @context */}
      {jsonLd.map((data) => (
        <script
          key={data["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
      ))}
      <main className="relative flex-1">
        <Navbar />
        <Hero />
        {/* Slides up over the pinned hero */}
        <About />
        <Services />
        <Solutions />
        <Manpower />
        <Stats />
        <Careers jobs={openings} />
        <Faculty />
        <Reviews />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
