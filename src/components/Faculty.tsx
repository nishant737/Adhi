import Image from "next/image";
import Reveal from "./Reveal";

// Photos live in /public/images/faculty/.
// Optional: add `experience` (e.g. "5+") and a short `note` — they show under the name.
type Person = { name: string; role: string; tags: string[]; photo: string; experience?: string; note?: string };
const faculty: Person[] = [
  { name: "Aishwarya Shetty", role: "German Consultant", tags: ["German", "Language training"], photo: "/images/faculty/aishwarya-portrait-new.jpg" },
  { name: "Sheryl Mathias", role: "International Recruiter", tags: ["International", "Recruitment"], photo: "/images/faculty/sheryl-portrait-new.jpg" },
  { name: "Umaira", role: "Pan India Recruiter", tags: ["Pan India", "Recruitment"], photo: "/images/faculty/umaira-portrait-new.jpg" },
  { name: "Vidyashree", role: "Sr. Recruiter", tags: ["Recruitment"], photo: "/images/faculty/vidyashree-portrait-new.jpg" },
];

export default function Faculty() {
  return (
    <section id="team" className="relative z-10 bg-[#f4f7fc] text-[#0d2142]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
        {/* Header */}
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium shadow-sm sm:px-5 sm:py-2.5 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3f74b5]" />
              Our Team
            </span>
            <h2 className="mt-5 max-w-3xl text-[2.1rem] font-medium leading-[1.02] tracking-[-0.04em] sm:mt-6 sm:text-6xl lg:text-[4.25rem]">
              The people behind <span className="text-[#3f74b5]">your placement.</span>
            </h2>
          </div>
        </Reveal>

        {/* Cards: grid on larger screens, swipeable row on phones */}
        <div className="-mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {faculty.map((person, i) => (
            <Reveal key={person.name} delay={i * 100} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <article className="group h-full">
                {/* Photo — all photos are cropped to the same head-and-shoulders framing */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#dfe7f6] shadow-[0_1px_0_rgba(13,33,66,0.06)] transition-shadow duration-500 group-hover:shadow-[0_24px_50px_rgba(13,33,66,0.14)]">
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-white/85 px-2.5 py-1 text-[0.65rem] font-medium tabular-nums backdrop-blur">
                    0{i + 1}
                  </span>
                </div>

                {/* Details — below the photo */}
                <div className="px-1 pt-5">
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[#3f74b5] sm:text-xs">{person.role}</p>
                  <h3 className="mt-1.5 text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-[#3f74b5] sm:text-2xl">{person.name}</h3>
                  {person.experience && (
                    <p className="mt-2 text-sm text-[#0d2142]/60">
                      <span className="font-medium text-[#0d2142]">{person.experience}</span> years of experience
                    </p>
                  )}
                  {person.note && <p className="mt-2 text-sm leading-relaxed text-[#0d2142]/60">{person.note}</p>}
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {person.tags.map((tag) => (
                      <li key={tag} className="rounded-full bg-white px-2.5 py-1 text-[0.7rem] font-medium text-[#0d2142]/70 shadow-[0_1px_0_rgba(13,33,66,0.06)]">
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
