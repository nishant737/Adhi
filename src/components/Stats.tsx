"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Figures from Aadhi's existing website.
const stats: { value: number; suffix: string; label: string; note: string; icon: ReactNode }[] = [
  {
    value: 1000,
    suffix: "+",
    label: "Registered Candidates",
    note: "Job seekers who trust us with their careers",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </>
    ),
  },
  {
    value: 300,
    suffix: "+",
    label: "Jobs Posted",
    note: "Openings across industries in India and abroad",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
      </>
    ),
  },
  {
    value: 90,
    suffix: "+",
    label: "Partner Companies",
    note: "Employers who hire through Aadhi",
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="1.5" />
        <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3" />
      </>
    ),
  },
];

const DURATION_MS = 1600;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  // Count up once, the first time the band scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION_MS);
          setProgress(easeOut(t));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="stats"
      aria-label="Aadhi Consulting in numbers"
      className="relative z-10 overflow-hidden bg-gradient-to-br from-[#0b1a33] via-[#10275a] to-[#1d4196] text-white"
    >
      <div aria-hidden className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#7ea6ff]/20 blur-3xl" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-10 sm:py-20">
        <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-white/55 sm:text-sm">
          Aadhi Consulting in numbers
        </p>

        <dl className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/10">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-col sm:gap-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-6 sm:py-2 sm:text-center"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#7ea6ff] sm:h-14 sm:w-14">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {s.icon}
                </svg>
              </span>
              <div className="min-w-0 sm:mt-5">
                <dd className="text-4xl font-semibold tabular-nums tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  {Math.round(s.value * progress).toLocaleString("en-IN")}
                  <span className="text-[#7ea6ff]">{s.suffix}</span>
                </dd>
                <dt className="mt-1 text-base font-medium sm:mt-2 sm:text-lg">{s.label}</dt>
                <p className="mt-0.5 text-xs leading-relaxed text-white/55 sm:mt-1 sm:text-sm">{s.note}</p>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
