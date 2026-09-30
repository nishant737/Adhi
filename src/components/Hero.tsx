import Link from "next/link";
import type { CSSProperties } from "react";
import { preload } from "react-dom";
import HeroVideo from "./HeroVideo";

const POSTER = "/videos/hero-poster.jpg";

// Placeholder figures: replace with Aadhi's real numbers before going live.
const stats = [
  { value: "500+", label: "Nurses Trained" },
  { value: "200+", label: "Placed in German Hospitals" },
  { value: "A1–B2", label: "German Language Training" },
  { value: "100%", label: "Visa & Recognition Support" },
];

// Staggered entrance that starts after the video has faded in
const reveal = (delayMs: number): CSSProperties => ({ animationDelay: `${delayMs}ms` });

export default function Hero() {
  // Fetch the first frame early so the intro starts on a sharp image, not a blank screen
  preload(POSTER, { as: "image", fetchPriority: "high" });

  return (
    // Sticky: the video stays pinned while the next section slides up over it
    // Phones/tablets (portrait): video fills the top, content sits below on white.
    // Desktop: video fills the whole screen with the content over it.
    <section className="sticky top-0 z-0 flex h-svh w-full flex-col overflow-hidden bg-white lg:block">
      <div className="relative min-h-[36svh] flex-1 overflow-hidden lg:absolute lg:inset-0">
        <div className="hero-scroll absolute inset-0">
          {/* The reveal is pure CSS, so it starts on first paint instead of waiting for JavaScript */}
          <HeroVideo poster={POSTER} />
        </div>
        {/* Portrait: blend the bottom of the video into the white content area */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/60 to-transparent lg:hidden" />
      </div>

      {/* Desktop: soft light wash on the left and bottom so the navy text stays readable over the video */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden w-3/5 bg-gradient-to-r from-white/70 via-white/30 to-transparent lg:block"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-white/50 to-transparent lg:block" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 hidden h-[520px] w-[620px] rounded-full bg-[#79a7d8]/25 blur-[120px] lg:block"
      />

      <div className="relative flex flex-col justify-end gap-6 bg-white px-5 pb-8 pt-2 text-[#0d2142] sm:gap-8 sm:px-10 sm:pb-12 lg:h-full lg:flex-row lg:justify-between lg:gap-12 lg:bg-transparent lg:pb-14 lg:pt-36">
        {/* Left column */}
        <div className="flex flex-col justify-end">
          <div>
            <p
              style={reveal(1000)}
              className="motion-safe:animate-fade-up flex items-center gap-2 text-[0.65rem] font-medium tracking-[0.08em] text-[#0d2142]/80 sm:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#79a7d8]" />
              NURSING CAREERS IN GERMANY · MANGALURU
            </p>

            {/* Heading sits in the lower strip, clear of faces; buttons in a row underneath */}
            <div>
              <h1
                style={reveal(1150)}
                className="motion-safe:animate-fade-up mt-2 text-[2rem] font-semibold leading-[0.92] tracking-[-0.05em] sm:mt-4 sm:text-6xl lg:text-[3.5rem] xl:text-[3.75rem]"
              >
                <span className="block">
                  YOUR NURSING <br className="lg:hidden" />
                  CAREER
                </span>
                <span className="block text-[#3f74b5]">IN GERMANY</span>
              </h1>

              <div style={reveal(1350)} className="motion-safe:animate-fade-up mt-5 flex gap-2 sm:mt-6 sm:gap-3">
                <Link
                  href="#contact"
                  className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full sm:flex-none bg-[#0d2142] px-3 py-2.5 text-[0.65rem] sm:px-5 sm:py-3 sm:text-xs font-medium tracking-tight text-white shadow-lg shadow-[#0d2142]/20 transition-colors hover:bg-[#16305c] sm:px-7 sm:py-4 sm:text-sm"
                >
                  <CalendarIcon />
                  BOOK FREE COUNSELLING
                </Link>
                <Link
                  href="#services"
                  className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full sm:flex-none border border-[#0d2142]/15 bg-white px-3 py-2.5 text-[0.65rem] sm:px-5 sm:py-3 sm:text-xs lg:border-0 lg:bg-white/90 font-medium tracking-tight text-[#0d2142] shadow-sm backdrop-blur transition-colors hover:bg-white sm:px-7 sm:py-4 sm:text-sm"
                >
                  EXPLORE PROGRAMS
                  <ArrowIcon />
                </Link>
              </div>

              <p
                style={reveal(1500)}
                className="motion-safe:animate-fade-up mt-4 max-w-md text-[0.8rem] leading-relaxed sm:mt-5 text-[#0d2142]/75 sm:text-base lg:max-w-none lg:text-[1.05rem]"
              >
                We train Indian nurses and help them build careers in hospitals abroad, mainly in
                Germany.
              </p>
            </div>
          </div>
        </div>

        {/* Right column: stats */}
        <div className="flex flex-col justify-between gap-8 lg:shrink-0 lg:items-end">
          <dl className="grid grid-cols-4 gap-x-3 border-t border-[#0d2142]/10 pt-4 sm:gap-x-6 sm:pt-6 lg:grid-cols-1 lg:gap-5 lg:border-0 lg:pt-0 lg:text-right">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                style={reveal(1400 + i * 120)}
                className="motion-safe:animate-fade-up flex flex-col"
              >
                <dt className="order-2 mt-1 text-[0.6rem] leading-tight tracking-tight text-[#0d2142]/70 sm:text-sm lg:mt-0.5 lg:text-[0.7rem]">{stat.label}</dt>
                <dd className="order-1 text-lg font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[1.625rem] xl:text-[1.75rem]">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Darkens everything as the next section covers the hero */}
      <div aria-hidden className="hero-shade pointer-events-none absolute inset-0 bg-black opacity-0" />
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg className="hidden shrink-0 min-[380px]:block" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="hidden shrink-0 min-[380px]:block" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
