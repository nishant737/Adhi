"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

// PLACEHOLDERS — replace with real reviews (with the person's permission) before going live.
const reviews = [
  {
    quote: "Your client's review goes here: a few sentences about their experience with Aadhi and where they are working now.",
    name: "Client Name",
    detail: "Placed in Germany",
  },
  {
    quote: "Your client's review goes here: how the team helped them find the right job overseas.",
    name: "Client Name",
    detail: "Placed in the UAE",
  },
  {
    quote: "Your client's review goes here: how the team guided them through the visa and emigration process.",
    name: "Client Name",
    detail: "Placed in India",
  },
];

const AUTOPLAY_MS = 6000;

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % reviews.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, inView]);

  const go = (step: number) => {
    setPaused(true);
    setIndex((i) => (i + step + reviews.length) % reviews.length);
  };

  const review = reviews[index];

  return (
    <section
      ref={ref}
      id="reviews"
      className="relative z-10 overflow-hidden bg-gradient-to-br from-[#0b1a33] via-[#10275a] to-[#1d4196] text-white"
    >
      <div aria-hidden className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#7ea6ff]/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur sm:px-5 sm:py-2.5 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7ea6ff]" />
              Client Reviews
            </span>
            <h2 className="mt-5 max-w-3xl text-[2.1rem] font-medium leading-[1.02] tracking-[-0.04em] sm:mt-6 sm:text-6xl lg:text-[4.25rem]">
              Stories from people <span className="text-[#7ea6ff]">we&apos;ve placed.</span>
            </h2>
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            {[-1, 1].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => go(step)}
                aria-label={step < 0 ? "Previous review" : "Next review"}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-[#0d2142] active:scale-95 sm:h-14 sm:w-14"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={step < 0 ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"} />
                </svg>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150} className="mt-12 sm:mt-16">
          <figure
            onMouseEnter={() => setPaused(true)}
            className="relative grid gap-8 rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-14 lg:p-14"
          >
            {/* Big quote mark + counter */}
            <div className="flex items-start justify-between lg:flex-col">
              <svg viewBox="0 0 48 36" className="h-10 w-14 text-[#7ea6ff] sm:h-14 sm:w-20" fill="currentColor" aria-hidden>
                <path d="M0 36V22C0 9 7 1 20 0v7c-6 1-9 5-9 11h9v18H0Zm28 0V22c0-13 7-21 20-22v7c-6 1-9 5-9 11h9v18H28Z" />
              </svg>
              <span className="text-sm tabular-nums text-white/50">
                <span className="text-white">0{index + 1}</span> / 0{reviews.length}
              </span>
            </div>

            <div key={index} className="animate-bubble">
              {/* Stars */}
              <div className="flex gap-1 text-[#ffcf5c]" aria-label="5 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-5 text-xl font-medium leading-snug tracking-tight sm:text-3xl lg:text-[2.1rem]">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#0d2142]">
                  {review.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span>
                  <span className="block font-medium">{review.name}</span>
                  <span className="block text-sm text-white/55">{review.detail}</span>
                </span>
              </figcaption>
            </div>
          </figure>
        </Reveal>

        {/* Dots with autoplay progress */}
        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setPaused(true);
                setIndex(i);
              }}
              aria-label={`Show review ${i + 1}`}
              className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${i === index ? "w-10 bg-white/25" : "w-1.5 bg-white/30"}`}
            >
              {i === index && (
                <span
                  key={`p-${index}-${paused}`}
                  className={`absolute inset-0 origin-left bg-white ${paused || !inView ? "" : "animate-service-progress"}`}
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
