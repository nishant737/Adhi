import type { Metadata } from "next";
import About from "@/components/About";
import CtaBand from "@/components/CtaBand";
import Faculty from "@/components/Faculty";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About Us",
  description: "Who we are and the team behind Aadhi Consulting Services in Moodbidri, Mangalore.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="relative flex-1">
      <PageHeader
        eyebrow="About"
        title="Trusted by job seekers"
        accent="and employers."
        intro="Get to know us: what we do and the team you'll meet when you walk into our office."
        jumps={[
          { label: "Who we are", href: "#about" },
          { label: "Our team", href: "#team" },
        ]}
      />
      <About />
      <Faculty />
      <CtaBand />
    </main>
  );
}
