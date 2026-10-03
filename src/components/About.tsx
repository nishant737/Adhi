"use client";

import { useEffect, useRef, useState } from "react";
import Globe from "./Globe";

const steps = [
  {
    title: "Based in Mangaluru",
    body: "A local team you can meet in person, guiding job seekers from India who want to build a career abroad.",
    icon: PinIcon,
  },
  {
    title: "Jobs Across the World",
    body: "We match candidates from every profession with employers overseas, and support them through visa and emigration.",
    icon: BriefcaseIcon,
  },
  {
    title: "Training for Your Destination",
    body: "Language and job-readiness training to prepare you for work and life in your new country, before you fly.",
    icon: CapIcon,
  },
];

const HOLD = 0.06; // share of the pinned scroll spent resting before the first and after the last step

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function About() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    let frame = 0;

    const update = () => {
      frame = 0;

      // Rounded top corners flatten as the section slides up to the top of the screen
      const maxRadius = window.innerWidth >= 640 ? 48 : 32;
      const top = section.getBoundingClientRect().top;
      const radius = maxRadius * clamp01(top / (window.innerHeight * 0.5));
      section.style.borderTopLeftRadius = section.style.borderTopRightRadius = `${radius}px`;

      // The section is pinned and the steps stay still; scrolling highlights them one by one,
      // and each step's line grows with the scroll
      const count = steps.length;
      const scrollable = track.offsetHeight - window.innerHeight;
      const raw = clamp01(-track.getBoundingClientRect().top / scrollable);
      const position = clamp01((raw - HOLD) / (1 - HOLD * 2)) * count; // 0 → count
      lineRefs.current.forEach((el, i) => el && (el.style.transform = `scaleY(${clamp01(position - i)})`));
      setActive(Math.min(count - 1, Math.floor(position)));
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
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 overflow-clip rounded-t-[2rem] bg-gradient-to-br from-[#0b1a33] via-[#10275a] to-[#1d4196] text-white shadow-[0_-24px_60px_rgba(0,0,0,0.18)] sm:rounded-t-[3rem]"
    >
      {/* This tall track gives the pinned view room to scroll through the steps */}
      <div ref={trackRef} className="relative h-[280vh]">
        {/* Everything inside this layer — including the background tiles — stays put while pinned */}
        <div className="sticky top-0 h-svh">
          <GridSquares />

          <div className="relative mx-auto flex h-full max-w-7xl flex-col px-5 pb-6 pt-12 sm:px-10 sm:pt-16 lg:pb-10">
            {/* Header row: label + heading on the left, intro on the right */}
            <div className="grid justify-items-center gap-4 text-center sm:gap-8 lg:grid-cols-2 lg:items-end lg:justify-items-start lg:gap-20 lg:text-left">
              <div>
                <span className="inline-flex rounded-full bg-[#e6ecfa] px-4 py-2 text-xs font-medium text-[#0d2142] sm:px-5 sm:py-2.5 sm:text-sm">
                  About Us
                </span>
                <h2 className="mt-4 text-[1.9rem] font-medium leading-[1.05] tracking-[-0.03em] sm:mt-6 sm:text-5xl lg:text-[3.25rem]">
                  Connecting Indian Talent
                  <span className="mt-1 block text-[1.5rem] text-[#7ea6ff] sm:mt-2 sm:text-4xl lg:text-[2.4rem]">
                    With Jobs Worldwide
                  </span>
                </h2>
              </div>

              <p className="mx-auto max-w-md text-[0.85rem] leading-relaxed lg:mx-0 lg:max-w-lg text-white/70 sm:text-lg lg:pb-2 max-lg:[@media(max-height:680px)]:hidden">
                Aadhi Consulting Services is a Mangaluru-based job placement consultancy. We help
                people from India find the right job abroad — from the first conversation to the
                visa — with training to prepare you for working abroad.
              </p>
            </div>

            <div className="mt-5 grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-5 sm:mt-10 lg:grid-cols-2 lg:grid-rows-1 lg:gap-20">
              <div className="flex min-h-0 flex-col justify-center">
                <Globe className="mx-auto w-full max-w-md lg:max-w-none" />
              </div>

              {/* Steps stay still; the active one lights up as you scroll */}
              <div className="flex flex-col justify-center">
                <ol className="mx-auto w-full max-w-sm sm:max-w-md lg:mx-0 lg:max-w-none">
                  {steps.map((step, i) => {
                    const isActive = i === active;
                    const Icon = step.icon;
                    return (
                      <li
                        key={step.title}
                        className="grid grid-cols-[2rem_1fr] gap-x-4 pb-5 last:pb-0 sm:grid-cols-[2.5rem_1fr] sm:gap-x-8 lg:pb-10"
                      >
                        <div className="flex flex-col items-center">
                          <Icon
                            className={`h-6 w-6 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-7 sm:w-7 ${isActive ? "text-white" : "text-white/30"}`}
                          />
                          <span className="mt-3 w-0.5 flex-1 overflow-hidden rounded-full bg-white/10 sm:mt-4">
                            <span
                              ref={(el) => {
                                lineRefs.current[i] = el;
                              }}
                              style={{ transform: "scaleY(0)" }}
                              className="block h-full w-full origin-top rounded-full bg-gradient-to-b from-white to-white/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            />
                          </span>
                        </div>

                        <div
                          className={`transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isActive ? "opacity-100" : "opacity-35"
                          }`}
                        >
                          <h3 className="text-[1.35rem] font-medium tracking-tight sm:text-2xl lg:text-3xl">{step.title}</h3>
                          {/* Phones show only the active step's text, expanding smoothly; desktop shows all */}
                          <div
                            className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[1fr] lg:opacity-100 ${
                              isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <p className="min-h-0 max-w-lg overflow-hidden pt-2 text-[0.9rem] leading-relaxed text-[#a9bde8] sm:pt-3 sm:text-base lg:pt-4 lg:text-lg">
                              {step.body}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Soft blue tiles in the top-right, like the reference
function GridSquares() {
  const tiles = [
    [0, 1, 0.08], [1, 0, 0.05], [1, 2, 0.1], [2, 1, 0.14], [3, 0, 0.06], [3, 2, 0.05],
    [4, 1, 0.1], [2, 3, 0.07], [4, 3, 0.12], [0, 3, 0.04], [5, 2, 0.08], [5, 0, 0.05],
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-0 top-0 hidden h-[640px] w-[720px] [mask-image:radial-gradient(ellipse_at_top_right,black_30%,transparent_75%)] md:block"
    >
      {tiles.map(([col, row, alpha], i) => (
        <span
          key={i}
          className="absolute h-[120px] w-[120px]"
          style={{ right: col * 120, top: row * 120, backgroundColor: `rgba(99, 132, 255, ${alpha})` }}
        />
      ))}
    </div>
  );
}

type IconProps = { className?: string };

function PinIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function CapIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 9l10-5 10 5-10 5L2 9Z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 9v6" />
    </svg>
  );
}

function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
    </svg>
  );
}
