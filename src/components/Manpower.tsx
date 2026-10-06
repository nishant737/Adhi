import type { ReactNode } from "react";
import Reveal from "./Reveal";

// "Categories of Manpower" from Aadhi's brochure.
const industries: { name: string; icon: ReactNode; roles: string[] }[] = [
  {
    name: "Construction",
    icon: <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" />,
    roles: ["Tile Masons", "Pipe Fitters", "Carpenters", "Steel Fixers", "Construction Helpers", "Cleaners", "Heavy & Light Drivers", "AC / HVAC Technicians", "Civil Engineers", "Draftsmen", "Graphic Designers", "Escalator Operators", "Mobile Crane Operators"],
  },
  {
    name: "Hotel",
    icon: <path d="M4 18h16M6 18a6 6 0 0 1 12 0M12 9V7M10 7h4" />,
    roles: ["Waiters", "Front Desk Staff", "Chefs", "Cooks", "Housekeeping Staff", "Concierge", "Bartenders"],
  },
  {
    name: "Healthcare",
    icon: <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10ZM12 10v4M10 12h4" />,
    roles: ["Caregivers (Israel)", "Registered Nurses", "Nursing Assistants", "Medical Technicians", "Physiotherapists", "Laboratory Technicians", "Radiologists", "Pharmacists", "Dental Hygienists", "Optometrists", "Home Healthcare Aides"],
  },
  {
    name: "Poultry",
    icon: <path d="M7 14a5 5 0 0 0 10 0c0-4-2-8-5-8S7 10 7 14ZM12 6V3M9 21h6" />,
    roles: ["Poultry Farm Managers", "Farm Workers", "Veterinarians", "Quality Control Inspectors", "Hatchery Workers", "Feed Mill Operators", "Transportation Staff", "Sales & Marketing"],
  },
  {
    name: "Farming",
    icon: <path d="M12 21V11M12 11C12 7 9 5 5 5c0 4 3 6 7 6ZM12 13c0-4 3-6 7-6 0 4-3 6-7 6ZM5 21h14" />,
    roles: ["Farm Managers", "Crop Cultivation Specialists", "Livestock Handlers", "Irrigation Technicians", "Tractor Operators", "Agronomists", "Farmhands", "Quality Control Inspectors"],
  },
  {
    name: "Mechanical",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
      </>
    ),
    roles: ["Mechanical Engineers", "Maintenance Technicians", "Machine Operators", "Welders", "Electricians", "HVAC Technicians", "Quality Control Inspectors", "Production Supervisors", "CNC Machine Operators", "Instrumentation Technicians"],
  },
];

// Three scrolling rows, two industries each, alternating direction
const rows = [industries.slice(0, 2), industries.slice(2, 4), industries.slice(4, 6)];

export default function Manpower() {
  return (
    <section id="manpower" className="relative z-10 overflow-hidden bg-white py-20 text-[#0d2142] sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <Reveal className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e6ecfa] px-4 py-2 text-xs font-medium sm:px-5 sm:py-2.5 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3f74b5]" />
              Categories of Manpower
            </span>
            <h2 className="mt-5 text-[2rem] font-medium leading-[1.05] tracking-[-0.035em] sm:mt-6 sm:text-5xl lg:text-[3.25rem]">
              Skilled people for <span className="text-[#3f74b5]">every industry.</span>
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-[#0d2142]/60 sm:text-lg lg:justify-self-end lg:pb-1">
            We recruit across six industries, from construction sites and hotels to hospitals,
            farms and factories.
          </p>
        </Reveal>

        {/* Industry overview */}
        <Reveal delay={100}>
          <ul className="mt-10 grid grid-cols-2 gap-2.5 sm:mt-14 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
            {industries.map((ind) => (
              <li key={ind.name} className="flex items-center gap-3 rounded-2xl border border-[#0d2142]/[0.08] bg-[#f6f8fc] px-3.5 py-3 sm:px-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#3f74b5] shadow-[0_1px_0_rgba(13,33,66,0.06)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {ind.icon}
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{ind.name}</span>
                  <span className="block text-[0.7rem] text-[#0d2142]/50">{ind.roles.length} roles</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Scrolling rows of roles; pause on hover */}
      <div className="mt-10 space-y-3 sm:mt-14 sm:space-y-4 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        {rows.map((row, r) => {
          const items = row.flatMap((ind) => ind.roles.map((role) => ({ role, ind })));
          return (
            <div key={r} className="group flex overflow-hidden motion-reduce:overflow-x-auto">
              <div
                className={`flex w-max shrink-0 gap-3 pr-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
                  r % 2 ? "animate-marquee-reverse" : "animate-marquee"
                }`}
                style={{ animationDuration: `${items.length * 3.2}s` }}
              >
                {[0, 1].map((copy) => (
                  <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 gap-3">
                    {items.map(({ role, ind }) => (
                      <li
                        key={`${copy}-${ind.name}-${role}`}
                        className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#0d2142]/10 bg-white py-2 pl-2 pr-4 text-sm shadow-[0_1px_0_rgba(13,33,66,0.04)] transition-colors hover:border-[#0d2142] hover:bg-[#0d2142] hover:text-white sm:py-2.5 sm:text-[0.95rem]"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef2fa] text-[#3f74b5]">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            {ind.icon}
                          </svg>
                        </span>
                        <span className="whitespace-nowrap font-medium">{role}</span>
                        <span className="whitespace-nowrap text-xs opacity-50">· {ind.name}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
