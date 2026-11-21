import type { Metadata } from "next";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, WhatsApp, email or visit Aadhi Consulting Services in Moodbidri, Mangalore. Answers to common questions too.",
  alternates: { canonical: "/contact" },
};

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function ContactPage() {
  return (
    <main className="relative flex-1">
      <JsonLd data={faqPage} />
      <PageHeader
        eyebrow="Contact"
        title="Talk to us,"
        accent="we're here to help."
        intro="Call, WhatsApp or send an enquiry. Mon to Sat, 9 am to 5 pm. Quick answers to common questions are below."
        jumps={[
          { label: "Call or visit", href: "#contact" },
          { label: "Common questions", href: "#faq" },
        ]}
      />
      <Contact />
      <FAQ />
    </main>
  );
}
