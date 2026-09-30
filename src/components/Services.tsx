"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Reveal from "./Reveal";
import { scrollToY } from "./SmoothScroll";

const AUTOPLAY_MS = 5000;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const DESKTOP = "(min-width: 1024px)";
const subscribeDesktop = (onChange: () => void) => {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const HOLD = 0.05; // share of the pinned scroll spent resting before the first and after the last service
const subscribeReducedMotion = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

const services: { title: string; body: string; tags?: string[]; visual: () => ReactNode }[] = [
  {
    title: "Job Placement",
    body: "Helping nurses find the right role — at home in India or overseas.",
    tags: ["Domestic", "International"],
    visual: () => <JobVisual />,
  },
  {
    title: "Visa & Emigration",
    body: "Guidance through visa stamping and the emigration process, step by step.",
    tags: ["Visa stamping", "Emigration process"],
    visual: () => <VisaVisual />,
  },
  {
    title: "German Training",
    body: "German language training designed for healthcare professionals.",
    tags: ["For healthcare professionals"],
    visual: () => <LanguageVisual />,
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  // Rows play through on their own until the visitor hovers, taps or focuses one
  const [autoplay, setAutoplay] = useState(true);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Desktop: the section is pinned and page scroll picks the open service
  const pinned = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP).matches, () => false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = track.offsetHeight - window.innerHeight;
      const raw = Math.min(1, Math.max(0, -track.getBoundingClientRect().top / scrollable));
      const position = Math.min(1, Math.max(0, (raw - HOLD) / (1 - HOLD * 2))) * services.length;
      const current = Math.min(services.length - 1, Math.floor(position));
      // The line along the open row fills as you scroll through that service
      progressRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleX(${i === current ? Math.min(1, position - i) : 0})`;
      });
      setActive(current);
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
  }, [pinned]);

  useEffect(() => {
    if (pinned || !autoplay || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % services.length), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [active, autoplay, inView, pinned]);

  const choose = (i: number) => {
    setAutoplay(false);
    setActive(i);
  };

  // Desktop: clicking a row glides the page to that service's part of the pinned scroll
  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const scrollable = track.offsetHeight - window.innerHeight;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const raw = HOLD + ((i + 0.35) / services.length) * (1 - HOLD * 2);
    scrollToY(trackTop + raw * scrollable);
  };

  return (
    <section ref={sectionRef} id="services" className="relative z-10 overflow-clip bg-white text-[#0d2142]">
      {/* Desktop: this tall track gives the pinned view room to scroll through the three services */}
      <div ref={trackRef} className="lg:h-[300vh]">
      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-10 sm:pt-28 lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:pt-0">
        {/* Header */}
        <Reveal>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e6ecfa] px-4 py-2 text-xs font-medium sm:px-5 sm:py-2.5 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3f74b5]" />
              Our Services
            </span>
            <h2 className="mt-5 max-w-3xl text-[2.1rem] font-medium leading-[1.02] tracking-[-0.04em] sm:mt-6 sm:text-6xl lg:mt-5 lg:text-[3.5rem]">
              From the classroom to your <span className="text-[#3f74b5]">first shift abroad.</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 sm:mt-20 lg:mt-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          {/* Service rows */}
          <ol className="border-b border-[#0d2142]/10">
            {services.map((service, i) => {
              const isActive = i === active;
              return (
                <li key={service.title} className="relative border-t border-[#0d2142]/10">
                  {/* Autoplay progress along the top edge of the active row */}
                  {pinned ? (
                    <span
                      ref={(el) => {
                        progressRefs.current[i] = el;
                      }}
                      aria-hidden
                      style={{ transform: "scaleX(0)" }}
                      className="absolute -top-px left-0 h-0.5 w-full origin-left bg-[#3f74b5] transition-transform duration-200 ease-out"
                    />
                  ) : autoplay && isActive && inView && (
                    <span
                      key={`progress-${active}`}
                      aria-hidden
                      className="animate-service-progress absolute -top-px left-0 h-0.5 w-full origin-left bg-[#3f74b5] motion-reduce:hidden"
                      style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                    />
                  )}

                  <button
                    type="button"
                    aria-expanded={isActive}
                    onMouseEnter={pinned ? undefined : () => choose(i)}
                    onFocus={pinned ? undefined : () => choose(i)}
                    onClick={() => (pinned ? goTo(i) : choose(i))}
                    className="group grid w-full grid-cols-[2.25rem_1fr_auto] items-center gap-3 py-5 text-left sm:grid-cols-[3.5rem_1fr_auto] sm:py-7 lg:py-5"
                  >
                    <span
                      className={`text-xs font-medium tabular-nums transition-colors duration-500 sm:text-sm ${
                        isActive ? "text-[#3f74b5]" : "text-[#0d2142]/30"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`text-[1.7rem] font-medium leading-none tracking-[-0.04em] transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-5xl lg:text-[3.4rem] ${
                        isActive ? "translate-x-0 text-[#0d2142]" : "text-[#0d2142]/25 group-hover:translate-x-1.5 group-hover:text-[#0d2142]/50"
                      }`}
                    >
                      {service.title}
                    </span>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-12 sm:w-12 ${
                        isActive
                          ? "rotate-0 border-[#0d2142] bg-[#0d2142] text-white"
                          : "-rotate-45 border-[#0d2142]/15 text-[#0d2142]/40"
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>

                  {/* Details open under the active row */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="pb-6 sm:pb-8 sm:pl-[calc(3.5rem+0.75rem)]">
                        <p className="max-w-md text-[0.95rem] leading-relaxed text-[#0d2142]/65 sm:text-lg">{service.body}</p>
                        {service.tags && (
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {service.tags.map((tag) => (
                              <li key={tag} className="rounded-full bg-[#eef2fa] px-3.5 py-1.5 text-xs font-medium text-[#0d2142]/80">
                                {tag}
                              </li>
                            ))}
                          </ul>
                        )}
                        {/* Phones: the animated preview sits inside the open row */}
                        <div className="mt-5 lg:hidden">
                          <PreviewCard index={i} active={isActive} compact />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Desktop: animated preview that follows the active row */}
          <div className="hidden lg:block">
            <PreviewCard index={active} active />
          </div>
        </div>
      </div>
      </div>

      <div className="h-20 sm:h-28 lg:hidden" />
    </section>
  );
}

// Dark card that cross-fades between the three animated previews
function PreviewCard({ index, active, compact = false }: { index: number; active: boolean; compact?: boolean }) {
  const decor = (
    <>
      {/* Soft glow + subtle grid */}
      <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7ea6ff]/25 blur-3xl" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:40px_40px]"
      />
    </>
  );
  const header = (i: number) => (
    <div className="flex items-start justify-between p-5 sm:p-7">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/50">{services[i].title}</span>
      <span className="text-5xl font-medium leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)] sm:text-7xl">
        0{i + 1}
      </span>
    </div>
  );
  const cardClass = "relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0b1a33] via-[#10275a] to-[#1d4196] text-white";

  // Phones/tablets: sized by its content, only the active preview is rendered
  if (compact) {
    return (
      <div className={cardClass}>
        {decor}
        <div className="relative">
          {header(index)}
          <div className="px-5 pb-10 pt-1 sm:px-8 sm:pb-12">
            {active && <div key={`v-${index}`}>{services[index].visual()}</div>}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: fixed square that cross-fades between the three previews
  return (
    <div className={`${cardClass} aspect-square max-h-[calc(100svh-17rem)] w-full`}>
      {decor}
      {services.map((service, i) => (
        <div
          key={service.title}
          aria-hidden={i !== index}
          className={`absolute inset-0 flex flex-col transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            i === index && active ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          {header(i)}
          <div className="flex flex-1 items-center justify-center px-5 pb-6 sm:px-8 sm:pb-10">
            {/* Remount on activation so each preview's animation replays */}
            {i === index && active && <div key={`v-${index}`} className="w-full">{service.visual()}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function JobVisual() {
  const jobs = [
    { type: 0, role: "Staff Nurse", place: "Hospital · India", flag: <IndiaFlag /> },
    { type: 1, role: "Registered Nurse", place: "Hospital · Germany", flag: <GermanyFlag /> },
    { type: 1, role: "Staff Nurse", place: "Hospital · Israel", flag: <IsraelFlag /> },
  ];
  const tabs = ["Domestic", "International"];
  const stages = ["Applied", "Interview", "Placed"];

  // Cycle through the listings; each one walks through the stages before moving on
  const [job, setJob] = useState(0);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    // With reduced motion the card simply stays still (see `shownStage` below)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setStage((st) => {
        if (st < stages.length - 1) return st + 1;
        setJob((j) => (j + 1) % jobs.length);
        return 0;
      });
    }, 1100);
    return () => clearInterval(timer);
  }, [jobs.length, stages.length]);

  const current = jobs[job];
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
  const shownStage = reduceMotion ? stages.length - 1 : stage;
  const placed = shownStage === stages.length - 1;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 sm:gap-5">
      {/* Domestic | International switch with a sliding pill */}
      <div className="relative grid w-full grid-cols-2 rounded-full border border-white/15 bg-white/5 p-1 text-xs font-medium sm:text-sm">
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(${current.type * 100}%)` }}
        />
        {tabs.map((t, i) => (
          <span
            key={t}
            className={`relative z-10 py-1.5 text-center transition-colors duration-500 sm:py-2 ${current.type === i ? "text-[#0d2142]" : "text-white/60"}`}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Card stack */}
      <div className="relative w-full pb-4">
        <div aria-hidden className="absolute inset-x-6 bottom-0 top-4 rounded-2xl bg-white/10" />
        <div aria-hidden className="absolute inset-x-3 bottom-2 top-2 rounded-2xl bg-white/20" />

        <div key={job} className="animate-bubble relative rounded-2xl bg-white p-4 text-[#0d2142] shadow-2xl shadow-black/30 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef2fa] text-[#3f74b5] sm:h-11 sm:w-11">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M12 7v6M9 10h6M9 21v-3h6v3" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold sm:text-base">{current.role}</p>
              <p className="truncate text-xs text-[#0d2142]/55">{current.place}</p>
            </div>
            <span className="block h-6 w-9 shrink-0 overflow-hidden rounded-md shadow-sm ring-1 ring-black/5">{current.flag}</span>
          </div>

          <div className="mt-3 flex gap-1.5 sm:mt-4">
            {["Full-time", "Nursing"].map((tag) => (
              <span key={tag} className="rounded-full bg-[#eef2fa] px-2.5 py-1 text-[0.65rem] font-medium text-[#0d2142]/70">
                {tag}
              </span>
            ))}
          </div>

          {/* Stage tracker */}
          <div className="mt-4 border-t border-[#0d2142]/10 pt-4 sm:mt-5">
            <div className="relative flex justify-between">
              <span aria-hidden className="absolute left-2 right-2 top-2 h-0.5 rounded bg-[#0d2142]/10" />
              <span
                aria-hidden
                className="absolute left-2 top-2 h-0.5 rounded bg-[#1f8a5b] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `calc((100% - 1rem) * ${shownStage / (stages.length - 1)})` }}
              />
              {stages.map((st, i) => (
                <div key={st} className="relative flex flex-col items-center gap-1.5">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-500 ${
                      i <= shownStage ? "bg-[#1f8a5b] text-white" : "border-2 border-[#0d2142]/15 bg-white"
                    }`}
                  >
                    {i <= shownStage && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-[0.65rem] font-medium transition-colors duration-500 ${i <= shownStage ? "text-[#0d2142]" : "text-[#0d2142]/35"}`}>
                    {st}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status line */}
      <p className={`flex items-center gap-2 text-xs transition-colors duration-500 sm:text-sm ${placed ? "text-white" : "text-white/50"}`}>
        <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${placed ? "bg-[#4ade80]" : "bg-white/40"}`} />
        {placed ? "Placement confirmed" : "Matching you with the right role…"}
      </p>
    </div>
  );
}

function VisaVisual() {
  const fields = [
    { label: "Gültig für / Valid for", value: "DEUTSCHLAND" },
    { label: "Art / Type", value: "D · NATIONAL" },
    { label: "Name / Surname", value: "SAMPLE" },
    { label: "Vorname / Given name", value: "NURSE" },
    { label: "Bemerkungen / Remarks", value: "EMPLOYMENT", wide: true },
  ];
  return (
    <div className="relative mx-auto w-[min(92%,21rem)] lg:scale-[1.3]">
      <div className="animate-passport-in relative">
        {/* Passport cover peeking out behind the page */}
        <div aria-hidden className="absolute inset-0 translate-x-2.5 translate-y-2.5 rotate-[3deg] rounded-2xl bg-[#16284f] shadow-2xl shadow-black/40 ring-1 ring-white/10">
          <span className="absolute bottom-2.5 right-3.5 text-[0.45rem] font-semibold uppercase tracking-[0.3em] text-[#d8b76a]/80">Passport</span>
        </div>

        {/* Passport page */}
        <div className="animate-stamp-jolt relative overflow-hidden rounded-2xl bg-[#f4f1e6] p-2.5 text-[#1d2b4a] shadow-2xl shadow-black/30 sm:p-3">
          {/* Security pattern */}
          <div aria-hidden className="absolute inset-0 opacity-60 [background:repeating-radial-gradient(circle_at_75%_35%,transparent_0_5px,rgba(63,116,181,0.12)_5px_6px),repeating-linear-gradient(45deg,transparent_0_9px,rgba(180,120,160,0.07)_9px_10px)]" />

          {/* Visa sticker */}
          <div className="relative overflow-hidden rounded-lg border border-[#3f74b5]/25 bg-gradient-to-br from-[#eaf1fb] via-[#f7eef4] to-[#ecf6ef] p-2.5 sm:p-3">
            {/* Holographic shine */}
            <div aria-hidden className="animate-holo pointer-events-none absolute inset-y-0 -left-full w-full bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.9)_45%,rgba(170,200,255,0.55)_52%,rgba(255,190,230,0.4)_58%,transparent_75%)]" />
            {/* Specimen watermark */}
            <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-2xl font-bold tracking-[0.3em] text-[#c0392b]/10 sm:text-3xl">
              SPECIMEN
            </span>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="block h-3 w-[1.1rem] overflow-hidden rounded-[2px]"><GermanyFlag /></span>
                <span className="text-[0.55rem] font-bold uppercase tracking-[0.18em] sm:text-[0.6rem]">Visum · Visa</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#1d2b4a] text-[0.6rem] font-bold text-white">D</span>
            </div>

            <div className="relative mt-2 grid grid-cols-[2.6rem_1fr] gap-2.5 sm:mt-2.5 sm:grid-cols-[3rem_1fr]">
              {/* Photo */}
              <div className="flex aspect-[3/4] items-end justify-center overflow-hidden rounded-md bg-gradient-to-b from-[#cfd9ea] to-[#b9c6dd]">
                <svg viewBox="0 0 24 28" className="w-[85%] text-[#8a9bb8]" fill="currentColor" aria-hidden>
                  <circle cx="12" cy="10" r="5" />
                  <path d="M2 28c0-6 4.5-10 10-10s10 4 10 10Z" />
                </svg>
              </div>
              {/* Fields */}
              <dl className="grid grid-cols-2 gap-x-2 gap-y-1">
                {fields.map((f) => (
                  <div key={f.label} className={f.wide ? "col-span-2" : ""}>
                    <dt className="text-[0.38rem] uppercase leading-tight tracking-wide text-[#1d2b4a]/50 sm:text-[0.42rem]">{f.label}</dt>
                    <dd className="font-mono text-[0.55rem] font-semibold leading-tight sm:text-[0.6rem]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Machine-readable zone prints line by line */}
            <div className="relative mt-2 space-y-0.5 border-t border-[#1d2b4a]/10 pt-1.5 font-mono text-[0.46rem] leading-none tracking-[0.12em] text-[#1d2b4a]/75 sm:text-[0.5rem]">
              <p className="animate-mrz overflow-hidden whitespace-nowrap" style={{ animationDelay: "600ms" }}>VDDEUSAMPLE&lt;&lt;NURSE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</p>
              <p className="animate-mrz overflow-hidden whitespace-nowrap" style={{ animationDelay: "900ms" }}>X000000&lt;&lt;0IND0000000F0000000&lt;&lt;</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stamp lands last */}
      <div className="animate-stamp absolute -bottom-6 -right-4 flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full border-[3px] border-[#1f8a5b]/85 text-center font-mono text-[0.55rem] font-bold uppercase leading-tight tracking-[0.14em] text-[#1f8a5b]/90 mix-blend-multiply sm:h-24 sm:w-24">
        <span className="flex h-[78%] w-[78%] flex-col items-center justify-center rounded-full border border-dashed border-[#1f8a5b]/80">
          <span className="text-[0.4rem] tracking-[0.2em]">★ Visa ★</span>
          Approved
        </span>
      </div>
    </div>
  );
}

// Speaks German with the browser's built-in voices (no audio files needed)
function speakGerman(text: string, onEnd: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 0.9;
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("de"));
  if (voice) utterance.voice = voice;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  synth.speak(utterance);
  return true;
}

function LanguageVisual() {
  const words = [
    { de: "die Pflegekraft", en: "the nurse" },
    { de: "der Blutdruck", en: "blood pressure" },
    { de: "die Schmerzen", en: "pain" },
  ];
  const phrases = [
    { de: "Guten Morgen!", en: "Good morning!" },
    { de: "Wie fühlen Sie sich heute?", en: "How are you feeling today?" },
    { de: "Haben Sie Schmerzen?", en: "Are you in pain?" },
  ];

  // Cycle through the words; each card shows German, then flips to English
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Hold the card still while it's being read out
    if (speaking === "card") return;
    const timer = setInterval(() => {
      setFlipped((f) => {
        if (f) setIndex((i) => (i + 1) % words.length);
        return !f;
      });
    }, 1600);
    return () => clearInterval(timer);
  }, [words.length, speaking]);

  // Stop any speech when this preview is switched away
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const play = (id: string, text: string) => {
    if (speaking === id) {
      window.speechSynthesis?.cancel();
      setSpeaking(null);
      return;
    }
    if (speakGerman(text, () => setSpeaking((cur) => (cur === id ? null : cur)))) setSpeaking(id);
  };

  const changePhrase = (step: number) => {
    window.speechSynthesis?.cancel();
    setSpeaking(null);
    setPhrase((i) => (i + step + phrases.length) % phrases.length);
  };

  const word = words[index];

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-2.5 sm:gap-3">
      {/* Lesson header + progress */}
      <div className="animate-bubble flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/20 sm:h-8 sm:w-8">
          <GermanyFlag />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium sm:text-sm">Lektion · Im Krankenhaus</p>
            <p className="text-[0.6rem] tabular-nums text-white/50 sm:text-xs">{index + 1}/{words.length}</p>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7ea6ff] to-white transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${((index + (flipped ? 1 : 0.5)) / words.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Flashcard — tap to hear the word */}
      <button
        type="button"
        onClick={() => {
          setFlipped(false);
          play("card", word.de);
        }}
        aria-label={`Hear "${word.de}" in German`}
        className="group [perspective:900px]"
      >
        <div
          className="relative h-20 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] sm:h-24"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white text-[#0d2142] shadow-xl shadow-black/25 [backface-visibility:hidden]">
            <span className="flex items-center gap-1.5 text-[0.55rem] font-medium uppercase tracking-[0.18em] text-[#0d2142]/40 sm:text-[0.6rem]">
              Deutsch
              <SpeakerIcon className="h-3 w-3 transition-colors group-hover:text-[#3f74b5]" />
            </span>
            <span className="mt-0.5 text-lg font-semibold tracking-tight sm:mt-1 sm:text-2xl">{word.de}</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-[#3f74b5] text-white shadow-xl shadow-black/25 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.18em] text-white/60 sm:text-[0.6rem]">English</span>
            <span className="mt-0.5 text-lg font-semibold tracking-tight sm:mt-1 sm:text-2xl">{word.en}</span>
          </div>
        </div>
      </button>

      {/* One phrase at a time — arrows to switch, tap to hear it */}
      <div className="flex items-center gap-2">
        <CarouselArrow dir="prev" onClick={() => changePhrase(-1)} />
        <button
          type="button"
          onClick={() => play(`phrase-${phrase}`, phrases[phrase].de)}
          aria-label={`Hear "${phrases[phrase].de}" in German`}
          className={`flex min-w-0 flex-1 items-center gap-3 rounded-2xl border p-2 text-left backdrop-blur transition-colors duration-300 sm:p-2.5 ${
            speaking === `phrase-${phrase}` ? "border-white/40 bg-white/15" : "border-white/10 bg-white/5 hover:bg-white/10"
          }`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-9 sm:w-9 ${
              speaking === `phrase-${phrase}` ? "bg-[#7ea6ff] text-white" : "bg-white text-[#0d2142]"
            }`}
          >
            {speaking === `phrase-${phrase}` ? <SoundBars /> : <SpeakerIcon className="h-4 w-4" />}
          </span>
          <span key={phrase} className="animate-bubble min-w-0">
            <span className="block text-[0.8rem] font-medium leading-snug sm:truncate sm:text-sm">{phrases[phrase].de}</span>
            <span className="block truncate text-[0.65rem] text-white/55 sm:text-[0.7rem]">{phrases[phrase].en}</span>
          </span>
        </button>
        <CarouselArrow dir="next" onClick={() => changePhrase(1)} />
      </div>
      <div className="flex justify-center gap-1.5" aria-hidden>
        {phrases.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === phrase ? "w-5 bg-white" : "w-1.5 bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

function CarouselArrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous phrase" : "Next phrase"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15 active:scale-95"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}

function SpeakerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function SoundBars() {
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
      {[0, 150, 300, 450].map((d) => (
        <span key={d} className="animate-sound-bar w-[3px] rounded-full bg-white" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}

function IndiaFlag() {
  return (
    <svg viewBox="0 0 30 20" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.67" fill="#FF9933" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.6" />
      <circle cx="15" cy="10" r="0.5" fill="#000080" />
    </svg>
  );
}

function IsraelFlag() {
  return (
    <svg viewBox="0 0 30 20" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
      <rect width="30" height="20" fill="#fff" />
      <rect y="2" width="30" height="2.4" fill="#0038b8" />
      <rect y="15.6" width="30" height="2.4" fill="#0038b8" />
      <g fill="none" stroke="#0038b8" strokeWidth="0.8">
        <path d="M15 6.4 18.1 11.8H11.9Z" />
        <path d="M15 13.6 11.9 8.2H18.1Z" />
      </g>
    </svg>
  );
}

function GermanyFlag() {
  return (
    <svg viewBox="0 0 30 20" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
      <rect width="30" height="6.67" fill="#000" />
      <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
      <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
    </svg>
  );
}
