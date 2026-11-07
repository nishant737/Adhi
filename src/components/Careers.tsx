"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { countryCodes, type CountryCode } from "@/data/countryCodes";
import { cleanPhone, cleanWords, phoneError, wordsError } from "@/data/validation";
import { contact, telHref } from "@/data/contact";
import { experienceOptions, locationOptions, type Job } from "@/data/jobs";
import { HONEYPOT, SHEET_URL, sendToSheet } from "@/data/sheet";
import ApplyModal from "./ApplyModal";
import { FieldError, PhoneField, TextField, errorBorder, inputClass } from "./FormFields";
import Reveal from "./Reveal";

const filters = ["All", "India", "Abroad"] as const;
type Filter = (typeof filters)[number];

export default function Careers({ jobs }: { jobs: Job[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [applying, setApplying] = useState<Job | null>(null);
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

            {shown.length === 0 && (
              <p className="mt-5 rounded-[1.75rem] border border-dashed border-[#0d2142]/15 p-8 text-center text-[#0d2142]/60">
                No openings here right now. Tell us what you&apos;re looking for and we&apos;ll reach out.
              </p>
            )}
            <ul className={`mt-5 overflow-hidden rounded-[1.75rem] border border-[#0d2142]/[0.08] ${shown.length ? "" : "hidden"}`}>
              {shown.map((job) => (
                <li key={`${job.title}-${job.location}`} className="border-b border-[#0d2142]/[0.07] last:border-b-0">
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
                      onClick={() => setApplying(job)}
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

      {applying && <ApplyModal job={applying} onClose={() => setApplying(null)} />}
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

type FieldKey = "name" | "phone" | "role" | "experience" | "otherLocation";

function JobRequestForm() {
  const [location, setLocation] = useState(locationOptions[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "unavailable">("idle");
  const sent = status === "sent";
  const [values, setValues] = useState({ name: "", phone: "", role: "", experience: "", otherLocation: "" });
  const [country, setCountry] = useState<CountryCode>(countryCodes[0]);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors: Record<FieldKey, string> = {
    name: wordsError(values.name, "Name"),
    phone: phoneError(values.phone, country),
    role: wordsError(values.role, "Job title"),
    experience: values.experience ? "" : "Select your experience",
    otherLocation: location === "Other" ? wordsError(values.otherLocation, "Location") : "",
  };
  const show = (key: FieldKey) => ((submitted || touched[key]) && errors[key]) || "";
  const set = (key: FieldKey, value: string) => setValues((v) => ({ ...v, [key]: value }));
  const blur = (key: FieldKey) => () => setTouched((t) => ({ ...t, [key]: true }));

  const pickCountry = (c: CountryCode) => {
    setCountry(c);
    set("phone", values.phone.slice(0, c.max));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (status === "sending") return;
    if (data.get(HONEYPOT)) {
      setStatus("sent");
      return;
    }
    setSubmitted(true);
    const firstBad = (Object.keys(errors) as FieldKey[]).find((k) => errors[k]);
    if (firstBad) {
      form.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    const name = values.name.trim();
    const role = values.role.trim();
    const phone = `${country.dial} ${values.phone}`;
    const place = location === "Other" ? values.otherLocation.trim() : location;
    // Saved as a row in the client's Google Sheet
    if (!SHEET_URL) {
      setStatus("unavailable");
      return;
    }
    setStatus("sending");
    try {
      await sendToSheet({ kind: "request", name, phone, role, experience: values.experience, preferredLocation: place });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues({ name: "", phone: "", role: "", experience: "", otherLocation: "" });
    setTouched({});
    setSubmitted(false);
    setStatus("idle");
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
          <h3 className="mt-5 text-2xl font-medium tracking-tight">Thank you!</h3>
          <p className="mt-2 max-w-xs text-white/65">We&apos;ve received your details and will reach out when we find a matching role.</p>
          <button type="button" onClick={reset} className="mt-6 text-sm font-medium text-white/70 underline underline-offset-4 hover:text-white">
            Send another request
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <h3 className="text-2xl font-medium tracking-tight">Didn&apos;t find your role?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/60">Tell us what you&apos;re looking for and we&apos;ll reach out when we find a match.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <TextField
              label="Full name"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => set("name", cleanWords(e.target.value))}
              onBlur={blur("name")}
              error={show("name")}
            />
            <PhoneField
              country={country}
              onCountry={pickCountry}
              value={values.phone}
              onChange={(v) => set("phone", cleanPhone(v, country))}
              onBlur={blur("phone")}
              error={show("phone")}
            />
          </div>
          {/* Spam trap: hidden from people, bots fill it in */}
          <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <TextField
            label="Job you're targeting"
            name="role"
            placeholder="e.g. Electrician, Staff Nurse, Accountant"
            value={values.role}
            onChange={(e) => set("role", cleanWords(e.target.value))}
            onBlur={blur("role")}
            error={show("role")}
          />

          <label className="block">
            <span className="text-sm text-white/60">Years of experience</span>
            <select
              name="experience"
              value={values.experience}
              onChange={(e) => set("experience", e.target.value)}
              onBlur={blur("experience")}
              aria-invalid={!!show("experience")}
              className={`${inputClass} appearance-none ${show("experience") ? errorBorder : ""}`}
            >
              <option value="" disabled className="text-[#0d2142]">Select</option>
              {experienceOptions.map((opt) => (
                <option key={opt} value={opt} className="text-[#0d2142]">{opt}</option>
              ))}
            </select>
            <FieldError message={show("experience")} />
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
            <TextField
              label="Which location?"
              name="otherLocation"
              placeholder="City or country"
              value={values.otherLocation}
              onChange={(e) => set("otherLocation", cleanWords(e.target.value))}
              onBlur={blur("otherLocation")}
              error={show("otherLocation")}
            />
          )}

          {(status === "error" || status === "unavailable") && (
            <div role="alert" className="rounded-xl bg-white/10 p-4 text-sm text-white/85">
              <p className="font-medium text-white">
                {status === "error" ? "We couldn't submit your details right now." : "Online requests aren't open yet."}
              </p>
              <p className="mt-1">
                Please try again or call{" "}
                <a href={telHref(contact.phones[0])} className="font-medium underline underline-offset-4">{contact.phones[0]}</a>.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="group mt-1 flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-[#0d2142] transition-colors hover:bg-[#e6ecfa] disabled:cursor-wait disabled:opacity-80"
          >
            {status === "sending" ? "Submitting…" : "Submit"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}
