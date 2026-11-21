import type { Metadata } from "next";
import Careers from "@/components/Careers";
import PageHeader from "@/components/PageHeader";
import { getOpenings } from "@/data/sheet";

export const metadata: Metadata = {
  title: "Jobs in India & Abroad",
  description: "Current job openings in India and abroad. Apply in one tap, or tell us the role you want and we'll find it.",
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  const openings = await getOpenings();
  const abroad = openings.filter((j) => j.region === "Abroad").length;

  return (
    <main className="relative flex-1">
      <PageHeader
        eyebrow="Jobs"
        title="Open jobs,"
        accent="ready to apply."
        intro={`${openings.length} openings right now${abroad ? `, ${abroad} of them abroad` : ""}. Filter by India or Abroad and apply in one tap. Don't see your role? Send us your CV.`}
        jumps={[
          { label: "Current openings", href: "#careers" },
          { label: "Send your CV", href: "#request" },
        ]}
      />
      <Careers jobs={openings} />
    </main>
  );
}
