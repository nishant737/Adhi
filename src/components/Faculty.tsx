"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";

// PLACEHOLDERS — replace with Aadhi's real faculty before going live.
// Put photos in /public/images/faculty/ and set `photo`, e.g. "/images/faculty/anita.jpg".
const PLACEHOLDER_NOTE = "A short note about this faculty member — their background and how they help nurses.";
const faculty: { name: string; role: string; tags: string[]; experience: string; note: string; photo?: string }[] = [
  { name: "Faculty Name", role: "German Language Trainer", tags: ["German", "Healthcare vocabulary"], experience: "X+", note: PLACEHOLDER_NOTE },
  { name: "Faculty Name", role: "German Language Trainer", tags: ["German", "Exam preparation"], experience: "X+", note: PLACEHOLDER_NOTE },
  { name: "Faculty Name", role: "Nursing Mentor", tags: ["Clinical practice", "Interview prep"], experience: "X+", note: PLACEHOLDER_NOTE },
  { name: "Faculty Name", role: "Placement Advisor", tags: ["Job placement", "Visa guidance"], experience: "X+", note: PLACEHOLDER_NOTE },
];

export default function Faculty() {
  // Tapped/clicked card stays open (hover opens cards too, on devices that can hover)
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faculty" className="relative z-10 bg-[#f4f7fc] text-[#0d2142]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
        {/* Header */}
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium shadow-sm sm:px-5 sm:py-2.5 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3f74b5]" />
              Our Faculty
            </span>
            <h2 className="mt-5 max-w-3xl text-[2.1rem] font-medium leading-[1.02] tracking-[-0.04em] sm:mt-6 sm:text-6xl lg:text-[4.25rem]">
              Learn from people who <span className="text-[#3f74b5]">know the way.</span>
            </h2>
          </div>
        </Reveal>

        {/* Cards: grid on larger screens, swipeable row on phones */}
        <div className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {faculty.map((person, i) => (
            <Reveal key={i} delay={i * 100} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <article
                tabIndex={0}
                role="button"
                aria-expanded={open === i}
                aria-label={`${person.name}, ${person.role} — show details`}
                data-open={open === i}
                onClick={() => setOpen(open === i ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen(open === i ? null : i);
                  }
                }}
                className="group relative aspect-[3/4] cursor-pointer select-none overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#dfe7f6] to-[#c8d5ee] shadow-[0_1px_0_rgba(13,33,66,0.06)] outline-none transition-shadow duration-500 hover:shadow-[0_30px_60px_rgba(13,33,66,0.15)] focus-visible:ring-2 focus-visible:ring-[#3f74b5]"
              >
                {/* Photo fills the card */}
                {person.photo ? (
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-data-[open=true]:scale-105"
                  />
                ) : (
                  // Silhouette until a photo is added — clipped so it ends behind the details panel
                  <div className="absolute inset-x-0 top-0 bottom-[22%] overflow-hidden">
                  <svg viewBox="0 0 100 125" className="absolute inset-x-0 top-[6%] w-full text-[#a9badb] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-data-[open=true]:scale-105" fill="currentColor" aria-hidden>
                    <circle cx="50" cy="45" r="19" />
                    <path d="M13 125c0-24 16.5-42 37-42s37 18 37 42Z" />
                  </svg>
                  </div>
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0d2142]/45 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-data-[open=true]:opacity-100" />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[0.65rem] font-medium tabular-nums backdrop-blur">
                  0{i + 1}
                </span>

                {/* Details panel — anchored to the bottom, grows upward on hover */}
                <div className="absolute inset-x-3 bottom-3 rounded-[1.25rem] bg-white/95 p-4 shadow-lg shadow-[#0d2142]/10 backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-data-[open=true]:-translate-y-1 sm:p-5">
                  <span
                    aria-hidden
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#eef2fa] text-[#0d2142] transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:bg-[#0d2142] group-hover:text-white group-data-[open=true]:rotate-45 group-data-[open=true]:bg-[#0d2142] group-data-[open=true]:text-white sm:right-5 sm:top-5"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                  <p className="pr-9 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[#3f74b5] sm:text-xs">{person.role}</p>
                  <h3 className="mt-1.5 text-lg font-medium tracking-tight sm:text-xl">{person.name}</h3>

                  {/* Revealed on hover (always shown on phones) */}
                  <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100 group-data-[open=true]:grid-rows-[1fr] group-data-[open=true]:opacity-100">
                    <div className="min-h-0 overflow-hidden">
                      <div className="mt-4 flex items-center gap-3 border-t border-[#0d2142]/10 pt-4">
                        <span className="text-3xl font-medium leading-none tracking-[-0.04em] text-[#0d2142]">{person.experience}</span>
                        <span className="text-[0.7rem] leading-tight text-[#0d2142]/55">
                          Years of
                          <br />
                          experience
                        </span>
                      </div>
                      <p className="mt-3 text-[0.8rem] leading-relaxed text-[#0d2142]/65">{person.note}</p>
                    </div>
                  </div>

                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {person.tags.map((tag) => (
                      <li key={tag} className="rounded-full bg-[#eef2fa] px-2.5 py-1 text-[0.65rem] font-medium text-[#0d2142]/70">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
