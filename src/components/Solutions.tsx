import type { ReactNode } from "react";
import Reveal from "./Reveal";

// What Aadhi offers.
type Solution = { title: string; tag: string; body: string; points: string[]; icon: ReactNode };

const solutions: Solution[] = [
  {
    title: "Job Placement",
    tag: "Domestic & international",
    body: "We match candidates with the right employers, for roles across India and overseas, and support them from the first interview to the first day.",
    points: ["Domestic placement", "International placement", "All professions"],
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
      </>
    ),
  },
  {
    title: "Payroll Management",
    tag: "For employers",
    body: "Accurate, on-time payroll handled for your workforce, so you can focus on running your business.",
    points: ["Salary processing", "Statutory compliance", "Payslips & records"],
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </>
    ),
  },
  {
    title: "German Language Training",
    tag: "For careers in Germany",
    body: "Structured German language training that prepares candidates for work and life in Germany.",
    points: ["Beginner to advanced", "Workplace German", "Interview preparation"],
    icon: (
      <>
        <path d="M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M11 5c0 3-2 6-6 8" />
        <path d="M13 21l4-9 4 9M14.5 18h5" />
      </>
    ),
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="relative z-10 bg-[#f4f7fc] text-[#0d2142]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
        <Reveal className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium shadow-sm sm:px-5 sm:py-2.5 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3f74b5]" />
              What We Offer
            </span>
            <h2 className="mt-5 text-[2rem] font-medium leading-[1.05] tracking-[-0.035em] sm:mt-6 sm:text-5xl lg:text-[3.25rem]">
              Solutions for businesses <span className="text-[#3f74b5]">and individuals.</span>
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-[#0d2142]/60 sm:text-lg lg:justify-self-end lg:pb-1">
            From finding the right job to managing payroll and learning German, we support
            job seekers and employers at every step.
          </p>
        </Reveal>

        <ol className="mt-12 overflow-hidden rounded-[1.75rem] border border-[#0d2142]/[0.08] bg-white sm:mt-16">
          {solutions.map((s, i) => (
            <li key={s.title} className="border-b border-[#0d2142]/[0.07] last:border-b-0">
              <Reveal delay={i * 60}>
                <article className="group relative isolate grid gap-4 overflow-hidden px-5 py-6 sm:px-8 sm:py-7 lg:grid-cols-[3rem_1.1fr_1.4fr_1.2fr] lg:items-center lg:gap-8">
                  {/* Navy fill that sweeps in from the left on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 origin-left scale-x-0 bg-[#0d2142] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                  />

                  <div className="flex items-center gap-3 lg:block">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef2fa] text-[#3f74b5] transition-colors duration-500 group-hover:bg-white/10 group-hover:text-[#7ea6ff]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {s.icon}
                      </svg>
                    </span>
                    <span className="text-xs font-medium tabular-nums text-[#0d2142]/35 transition-colors duration-500 group-hover:text-white/40 lg:hidden">
                      0{i + 1}
                    </span>
                  </div>

                  <div>
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#3f74b5] transition-colors duration-500 group-hover:text-[#7ea6ff]">
                      <span className="hidden tabular-nums lg:inline">0{i + 1} · </span>
                      {s.tag}
                    </p>
                    <h3 className="mt-1.5 text-xl font-medium tracking-tight transition-colors duration-500 group-hover:text-white sm:text-2xl">
                      {s.title}
                    </h3>
                  </div>

                  <p className="text-[0.92rem] leading-relaxed text-[#0d2142]/65 transition-colors duration-500 group-hover:text-white/70 sm:text-base">
                    {s.body}
                  </p>

                  <ul className="flex flex-wrap gap-1.5 lg:justify-end">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="rounded-full border border-[#0d2142]/10 px-2.5 py-1 text-[0.72rem] font-medium text-[#0d2142]/70 transition-colors duration-500 group-hover:border-white/15 group-hover:text-white/80"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
