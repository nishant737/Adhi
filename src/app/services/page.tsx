import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import Manpower from "@/components/Manpower";
import PageHeader from "@/components/PageHeader";
import Services from "@/components/Services";
import Solutions from "@/components/Solutions";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Job placement in India and abroad, visa and emigration support, German language training, recruitment and payroll for employers.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main className="relative flex-1">
      <PageHeader
        eyebrow="Services"
        title="Everything we do,"
        accent="in one place."
        intro="For job seekers: placement, visas and training. For employers: hiring and payroll. Jump to the part you need."
        jumps={[
          { label: "For job seekers", href: "#services" },
          { label: "For employers", href: "#employers" },
          { label: "Industries & roles", href: "#manpower" },
        ]}
      />
      <Services />
      <Solutions />
      <Manpower />
      <CtaBand />
    </main>
  );
}
