import type { ReactNode } from "react";
import Reveal from "./Reveal";

// Full service list from Aadhi's existing website, rewritten for clarity.
const solutions: { title: string; tag: string; body: string; points: string[]; icon: ReactNode }[] = [
  {
    title: "Permanent Staffing",
    tag: "Hiring",
    body: "Full-time hiring across IT and a wide range of sectors, for companies throughout India.",
    points: ["IT & technology", "Healthcare", "BPO / KPO", "Ed-tech", "E-commerce", "Manufacturing"],
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </>
    ),
  },
  {
    title: "Leadership Hiring",
    tag: "Permanent & contract",
    body: "A competency-based hiring framework for senior and critical roles, reducing the time and effort it takes to find the right leader.",
    points: ["Senior & executive roles", "Competency-based assessment", "Faster closures"],
    icon: (
      <>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z" />
      </>
    ),
  },
  {
    title: "Contractual Staffing",
    tag: "Flexible models",
    body: "Flexible staffing that adapts to your business needs, from short projects to long-term engagements.",
    points: ["Part-time", "Contract", "Project-based", "Temporary staff", "Work from home"],
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
  {
    title: "Career Guidance",
    tag: "Study abroad",
    body: "Our experienced counsellors help you find a university that fits your budget and career goals, and guide you through the full study-abroad process.",
    points: ["University shortlisting", "Budget planning", "End-to-end application support"],
    icon: (
      <>
        <path d="M2 9l10-5 10 5-10 5L2 9Z" />
        <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
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
            Beyond placements, we support companies with permanent, leadership and contractual
            staffing, and guide students planning to study abroad.
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
