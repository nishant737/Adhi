"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { contact } from "@/data/contact";
import { experienceOptions, jobs, locationOptions, type Job } from "@/data/jobs";
import Reveal from "./Reveal";

const filters = ["All", "India", "Abroad"] as const;
type Filter = (typeof filters)[number];

// No server needed: applications open in WhatsApp, ready to send
function sendToWhatsApp(lines: string[]) {
  const text = encodeURIComponent(lines.filter(Boolean).join("\n"));
  window.open(`https://wa.me/${contact.whatsapp}?text=${text}`, "_blank", "noopener");
}

function applyForJob(job: Job) {
  sendToWhatsApp([
    "Hello Aadhi Consulting, I'd like to apply for this job.",
    `Role: ${job.title}`,
    `Location: ${job.location}`,
  ]);
}

export default function Careers() {
  const [filter, setFilter] = useState<Filter>("All");
  const shown = jobs.filter((job) => filter === "All" || job.region === filter);

  return (
    <section id="careers" className="relative z-10 bg-white text-[#0d2142]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
        <Reveal className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e6ecfa] px-4 py-2 text-xs font-medium sm:px-5 sm:py-2.5 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3f74b5]" />
              Careers
            </span>
            <h2 className="mt-5 text-[2rem] font-medium leading-[1.05] tracking-[-0.035em] sm:mt-6 sm:text-5xl lg:text-[3.25rem]">
              Find your next role <span className="text-[#3f74b5]">with Aadhi.</span>
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-[#0d2142]/60 sm:text-lg lg:justify-self-end lg:pb-1">
            Browse our current openings and apply in one tap. Looking for something else? Tell us
            what you want and we&apos;ll look for it.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-10">
          {/* Openings */}
          <Reveal>
            <div className="flex items-center justify-between gap-4">
              <div role="group" aria-label="Filter openings" className="flex gap-1.5">
                {filters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                      filter === f ? "bg-[#0d2142] text-white" : "bg-[#eef2fa] text-[#0d2142]/70 hover:bg-[#e0e7f5]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <p className="whitespace-nowrap text-sm tabular-nums text-[#0d2142]/50">
                {shown.length} {shown.length === 1 ? "opening" : "openings"}
              </p>
            </div>

            <ul className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#0d2142]/[0.08]">
              {shown.map((job) => (
                <li key={job.title} className="border-b border-[#0d2142]/[0.07] last:border-b-0">
                  <article className="flex flex-col gap-4 p-5 transition-colors duration-300 hover:bg-[#f6f8fc] sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium tracking-tight sm:text-xl">{job.title}</h3>
                      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#0d2142]/60">
                        <Meta icon={<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>}>
                          {job.location}
                        </Meta>
                        <Meta icon={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}>{job.type}</Meta>
                        {job.experience && (
                          <Meta icon={<path d="M4 20h16M6 20V10M12 20V4M18 20v-7" />}>{job.experience}</Meta>
                        )}
                        {job.salary && (
                          <Meta icon={<><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></>}>{job.salary}</Meta>
                        )}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => applyForJob(job)}
                      aria-label={`Apply for ${job.title}`}
                      className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0d2142] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16305c]"
                    >
                      Apply
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </article>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Anything else */}
          <Reveal delay={120} className="lg:sticky lg:top-8">
            <JobRequestForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#3f74b5]" aria-hidden>
        {icon}
      </svg>
      {children}
    </li>
  );
}

function JobRequestForm() {
  const [location, setLocation] = useState(locationOptions[0]);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const place = location === "Other" ? data.get("otherLocation") : location;
    sendToWhatsApp([
      "Hello Aadhi Consulting, I'm looking for a job.",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Job I'm targeting: ${data.get("role")}`,
      `Experience: ${data.get("experience")}`,
      `Preferred location: ${place}`,
    ]);
    setSent(true);
  };

  return (
    <div className="rounded-[1.75rem] bg-gradient-to-br from-[#0b1a33] via-[#10275a] to-[#1d4196] p-6 text-white shadow-[0_30px_80px_rgba(13,33,66,0.2)] sm:p-8">
      {sent ? (
        <div className="animate-bubble flex min-h-[24rem] flex-col items-center justify-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#1f8a5b]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12l5 5L20 7" />
            </svg>
          </span>
          <h3 className="mt-5 text-2xl font-medium tracking-tight">Almost there!</h3>
          <p className="mt-2 max-w-xs text-white/65">Your details are ready in WhatsApp. Just press send and we&apos;ll get back to you.</p>
          <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-medium text-white/70 underline underline-offset-4 hover:text-white">
            Send another request
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <h3 className="text-2xl font-medium tracking-tight">Didn&apos;t find your role?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/60">Tell us what you&apos;re looking for and we&apos;ll reach out when we find a match.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <TextField label="Full name" name="name" placeholder="Your name" autoComplete="name" />
            <TextField label="Phone number" name="phone" type="tel" placeholder="+91" autoComplete="tel" />
          </div>
          <TextField label="Job you're targeting" name="role" placeholder="e.g. Electrician, Staff Nurse, Accountant" />

          <label className="block">
            <span className="text-sm text-white/60">Years of experience</span>
            <select name="experience" required defaultValue="" className={`${inputClass} appearance-none`}>
              <option value="" disabled className="text-[#0d2142]">Select</option>
              {experienceOptions.map((opt) => (
                <option key={opt} value={opt} className="text-[#0d2142]">{opt}</option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="text-sm text-white/60">Preferred location</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {locationOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={location === opt}
                  onClick={() => setLocation(opt)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-300 ${
                    location === opt ? "border-white bg-white text-[#0d2142]" : "border-white/20 text-white/80 hover:border-white/50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </fieldset>

          {location === "Other" && (
            <TextField label="Which location?" name="otherLocation" placeholder="City or country" />
          )}

          <button type="submit" className="group mt-1 flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-[#0d2142] transition-colors hover:bg-[#e6ecfa]">
            Send via WhatsApp
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/60 focus:bg-white/10";

function TextField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm text-white/60">{label}</span>
      <input required {...props} className={inputClass} />
    </label>
  );
}
