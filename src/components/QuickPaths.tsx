"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import Reveal from "./Reveal";

// The first thing under the hero: visitors pick what they came for and go straight there
const paths: { who: string; title: string; body: string; cta: string; href: string; icon: ReactNode; featured?: boolean }[] = [
  {
    who: "For job seekers",
    title: "Find a job in India or abroad",
    body: "Browse current openings in the Gulf, Europe and India, and apply in one tap.",
    cta: "See open jobs",
    href: "/careers",
    featured: true,
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
      </>
    ),
  },
  {
    who: "Going abroad",
    title: "Visa & language training",
    body: "Visa stamping, emigration steps and German classes before you fly.",
    cta: "How we help",
    href: "/services#services",
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <circle cx="12" cy="10" r="3" />
        <path d="M9 17h6" />
      </>
    ),
  },
  {
    who: "For employers",
    title: "Hire skilled staff",
    body: "Recruitment and payroll across construction, hotels, healthcare, farming and more.",
    cta: "Employer services",
    href: "/services#employers",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.4c2.1.7 3.5 2.7 3.5 5.6" />
      </>
    ),
  },
  {
    who: "Not sure yet?",
    title: "Talk to a counsellor",
    body: "Free career counselling. Call, WhatsApp or drop in at our Moodbidri office.",
    cta: "Contact us",
    href: "/contact",
    icon: <path d="M21 12a8 8 0 0 1-11.8 7L4 20l1.1-4.6A8 8 0 1 1 21 12Z" />,
  },
];

export default function QuickPaths() {
  const ref = useRef<HTMLElement>(null);

  // Rounded top corners flatten to straight as the section slides up to the top of the screen
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const maxRadius = window.innerWidth >= 640 ? 48 : 32;
      const top = section.getBoundingClientRect().top;
      const radius = maxRadius * Math.min(1, Math.max(0, top / (window.innerHeight * 0.5)));
      section.style.borderTopLeftRadius = section.style.borderTopRightRadius = `${radius}px`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    // Slides up over the pinned hero
    <section
      ref={ref}
      id="start"
      className="relative z-10 rounded-t-[2rem] bg-white text-[#0d2142] shadow-[0_-24px_60px_rgba(0,0,0,0.18)] sm:rounded-t-[3rem]"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-10 sm:py-24">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e6ecfa] px-4 py-2 text-xs font-medium sm:px-5 sm:py-2.5 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3f74b5]" />
            Start here
          </span>
          <h2 className="mt-5 text-[2rem] font-medium leading-[1.05] tracking-[-0.035em] sm:mt-6 sm:text-5xl lg:text-[3.25rem]">
            What are you <span className="text-[#3f74b5]">looking for?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[0.95rem] leading-relaxed text-[#0d2142]/60 sm:text-lg">
            Pick one and we&apos;ll take you straight there.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {paths.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 70} className="h-full">
                <Link
                  href={p.href}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] p-6 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 sm:p-7 ${
                    p.featured
                      ? "bg-gradient-to-br from-[#0b1a33] via-[#10275a] to-[#1d4196] text-white shadow-[0_20px_50px_rgba(13,33,66,0.25)]"
                      : "border border-[#0d2142]/[0.08] bg-[#f6f8fc] hover:shadow-[0_20px_50px_rgba(13,33,66,0.1)]"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      p.featured ? "bg-white/10 text-[#9fc0ff]" : "bg-white text-[#3f74b5] shadow-[0_1px_0_rgba(13,33,66,0.06)]"
                    }`}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {p.icon}
                    </svg>
                  </span>

                  <p className={`mt-6 text-[0.7rem] font-medium uppercase tracking-[0.14em] ${p.featured ? "text-[#9fc0ff]" : "text-[#3f74b5]"}`}>
                    {p.who}
                  </p>
                  <h3 className="mt-2 text-xl font-medium leading-tight tracking-tight sm:text-[1.4rem]">{p.title}</h3>
                  <p className={`mt-3 flex-1 text-[0.92rem] leading-relaxed ${p.featured ? "text-white/70" : "text-[#0d2142]/60"}`}>{p.body}</p>

                  <span className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${p.featured ? "text-white" : "text-[#0d2142]"}`}>
                    {p.cta}
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-x-1 ${
                        p.featured ? "bg-white text-[#0d2142]" : "bg-[#0d2142] text-white"
                      }`}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
