"use client";

import { useState, type FormEvent } from "react";
import { contact, telHref } from "@/data/contact";
import { countryCodes, type CountryCode } from "@/data/countryCodes";
import { HONEYPOT, SHEET_URL, sendToSheet } from "@/data/sheet";
import {
  cleanCompany,
  cleanEmail,
  cleanMessage,
  cleanPhone,
  cleanWords,
  companyError,
  emailError,
  messageError,
  phoneError,
  wordsError,
} from "@/data/validation";
import { PhoneField, TextArea, TextField, inputClass } from "./FormFields";
import Reveal from "./Reveal";

// What a business can ask about. Job seekers are pointed to the Careers section instead.
const services = ["Hiring / Recruitment", "Overseas Manpower", "Payroll Management", "Other"];
const teamSizes = ["1 – 5", "6 – 20", "21 – 50", "50+"];

type Status = "idle" | "sending" | "sent" | "error" | "unavailable";
type FieldKey = "company" | "name" | "phone" | "email" | "message";
const empty: Record<FieldKey, string> = { company: "", name: "", phone: "", email: "", message: "" };

export default function Contact() {
  const [service, setService] = useState(services[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState(empty);
  const [country, setCountry] = useState<CountryCode>(countryCodes[0]);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors: Record<FieldKey, string> = {
    company: companyError(values.company),
    name: wordsError(values.name, "Name"),
    phone: phoneError(values.phone, country),
    email: emailError(values.email),
    message: messageError(values.message, "Requirements"),
  };
  const show = (key: FieldKey) => ((submitted || touched[key]) && errors[key]) || "";
  const set = (key: FieldKey, value: string) => setValues((v) => ({ ...v, [key]: value }));
  const blur = (key: FieldKey) => () => setTouched((t) => ({ ...t, [key]: true }));

  const reset = () => {
    setValues(empty);
    setTouched({});
    setSubmitted(false);
    setStatus("idle");
  };

  // Business enquiries are saved to the client's Google Sheet ("Enquiries" tab).
  // They are not sent to WhatsApp; the destination can be changed here later.
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
    if (!SHEET_URL) {
      setStatus("unavailable");
      return;
    }
    setStatus("sending");
    try {
      await sendToSheet({
        kind: "enquiry",
        company: values.company.trim(),
        name: values.name.trim(),
        email: values.email.trim(),
        phone: `${country.dial} ${values.phone}`,
        service,
        positions: String(data.get("positions") || ""),
        message: values.message.trim(),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const details = [
    {
      label: "Call us",
      // Each number is its own tap-to-call link, so the card itself isn't a link
      value: (
        <>
          {contact.phones.map((phone) => (
            <a key={phone} href={telHref(phone)} className="block transition-colors hover:text-[#3f74b5]">
              {phone}
            </a>
          ))}
        </>
      ),
      icon: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /> },
    { label: "Hours", value: contact.hours, icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
    { label: "Email", value: contact.email, href: `mailto:${contact.email}`, icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></> },
    { label: "Visit", value: contact.address, icon: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></> },
  ];

  return (
    <section id="contact" className="relative z-10 bg-[#f4f7fc] text-[#0d2142]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: heading + details */}
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium shadow-sm sm:px-5 sm:py-2.5 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3f74b5]" />
              Contact Us
            </span>
            <h2 className="mt-5 text-[2.1rem] font-medium leading-[1.02] tracking-[-0.04em] sm:mt-6 sm:text-6xl lg:text-[4rem]">
              Let&apos;s build <span className="block text-[#3f74b5]">your team together.</span>
            </h2>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-[#0d2142]/60 sm:text-lg">
              Hiring staff in India or abroad? Tell us what you need and our team will get back to you.
              Looking for a job?{" "}
              <a href="#careers" className="font-medium text-[#0d2142] underline decoration-[#3f74b5]/40 underline-offset-4 hover:decoration-[#3f74b5]">
                See open roles
              </a>
              .
            </p>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {details.map((d) => {
                const body = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef2fa] text-[#3f74b5] transition-colors duration-300 group-hover:bg-[#0d2142] group-hover:text-white">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        {d.icon}
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-[#0d2142]/50">{d.label}</span>
                      <span className="block break-words text-sm font-medium">{d.value}</span>
                    </span>
                  </>
                );
                const cls = "group flex h-full items-start gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_0_rgba(13,33,66,0.05)] transition-shadow duration-300";
                return (
                  <li key={d.label} className={d.label === "Visit" || d.label === "Email" ? "sm:col-span-2" : ""}>
                    {d.href ? (
                      <a href={d.href} className={`${cls} hover:shadow-[0_16px_40px_rgba(13,33,66,0.1)]`}>
                        {body}
                      </a>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={150}>
            <div className="rounded-[1.75rem] bg-gradient-to-br from-[#0b1a33] via-[#10275a] to-[#1d4196] p-6 text-white shadow-[0_30px_80px_rgba(13,33,66,0.25)] sm:p-10">
              {status === "sent" ? (
                <div className="animate-bubble flex min-h-[26rem] flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#1f8a5b]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <h3 className="mt-6 text-2xl font-medium tracking-tight">Thank you!</h3>
                  <p className="mt-2 max-w-xs text-white/65">We&apos;ve received your enquiry and our team will contact you shortly.</p>
                  <button type="button" onClick={reset} className="mt-8 text-sm font-medium text-white/70 underline underline-offset-4 hover:text-white">
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
                  <div>
                    <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">For businesses</span>
                    <h3 className="mt-3 text-2xl font-medium tracking-tight">Send us an enquiry</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                      For companies looking to hire. Job seekers, please{" "}
                      <a href="#careers" className="font-medium text-white underline underline-offset-4">apply through Careers</a>.
                    </p>
                  </div>

                  <TextField
                    label="Company name"
                    name="company"
                    placeholder="Your company"
                    autoComplete="organization"
                    value={values.company}
                    onChange={(e) => set("company", cleanCompany(e.target.value))}
                    onBlur={blur("company")}
                    error={show("company")}
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField
                      label="Your name"
                      name="name"
                      placeholder="Contact person"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => set("name", cleanWords(e.target.value))}
                      onBlur={blur("name")}
                      error={show("name")}
                    />
                    <PhoneField
                      country={country}
                      onCountry={(c) => {
                        setCountry(c);
                        set("phone", values.phone.slice(0, c.max));
                      }}
                      value={values.phone}
                      onChange={(v) => set("phone", cleanPhone(v, country))}
                      onBlur={blur("phone")}
                      error={show("phone")}
                    />
                  </div>
                  <TextField
                    label="Work email"
                    name="email"
                    type="email"
                    inputMode="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => set("email", cleanEmail(e.target.value))}
                    onBlur={blur("email")}
                    error={show("email")}
                  />

                  <fieldset>
                    <legend className="text-sm text-white/60">We need help with</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {services.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          aria-pressed={service === opt}
                          onClick={() => setService(opt)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                            service === opt ? "border-white bg-white text-[#0d2142]" : "border-white/20 text-white/80 hover:border-white/50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="block">
                    <span className="text-sm text-white/60">Number of positions (optional)</span>
                    <select name="positions" defaultValue="" className={`${inputClass} appearance-none`}>
                      <option value="" className="text-[#0d2142]">Select</option>
                      {teamSizes.map((t) => (
                        <option key={t} value={t} className="text-[#0d2142]">{t}</option>
                      ))}
                    </select>
                  </label>

                  <TextArea
                    label="Requirements (optional)"
                    name="message"
                    rows={3}
                    maxLength={1000}
                    placeholder="Roles, locations and when you need them"
                    value={values.message}
                    onChange={(e) => set("message", cleanMessage(e.target.value))}
                    onBlur={blur("message")}
                    error={show("message")}
                  />

                  {/* Spam trap: hidden from people, bots fill it in */}
                  <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

                  {(status === "error" || status === "unavailable") && (
                    <div role="alert" className="rounded-xl bg-white/10 p-4 text-sm text-white/85">
                      <p className="font-medium text-white">
                        {status === "error" ? "We couldn't send your enquiry right now." : "Online enquiries aren't open yet."}
                      </p>
                      <p className="mt-1">
                        Please call{" "}
                        <a href={telHref(contact.phones[0])} className="font-medium underline underline-offset-4">{contact.phones[0]}</a>{" "}
                        or email{" "}
                        <a href={`mailto:${contact.email}`} className="break-all font-medium underline underline-offset-4">{contact.email}</a>.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group mt-2 flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 font-medium text-[#0d2142] transition-colors hover:bg-[#e6ecfa] disabled:cursor-wait disabled:opacity-80"
                  >
                    {status === "sending" ? "Sending…" : "Send enquiry"}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
