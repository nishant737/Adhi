"use client";

import { useState, type FormEvent } from "react";
import { contact, telHref } from "@/data/contact";
import Reveal from "./Reveal";

const interests = ["Job Placement", "Visa & Emigration", "German Training"];

export default function Contact() {
  const [interest, setInterest] = useState(interests[0]);
  const [sent, setSent] = useState(false);

  // No server needed: the enquiry opens in WhatsApp, ready to send
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = [
      "Hello Aadhi Consulting, I'd like to know more.",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Interested in: ${interest}`,
      data.get("message") ? `Message: ${data.get("message")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setSent(true);
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
              Let&apos;s plan your <span className="block text-[#3f74b5]">move together.</span>
            </h2>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-[#0d2142]/60 sm:text-lg">
              Tell us a little about yourself and we&apos;ll get back to you with the next steps.
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
              {sent ? (
                <div className="animate-bubble flex min-h-[26rem] flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#1f8a5b]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <h3 className="mt-6 text-2xl font-medium tracking-tight">Almost there!</h3>
                  <p className="mt-2 max-w-xs text-white/65">Your message is ready in WhatsApp — just press send and we&apos;ll get back to you.</p>
                  <button type="button" onClick={() => setSent(false)} className="mt-8 text-sm font-medium text-white/70 underline underline-offset-4 hover:text-white">
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                  <h3 className="text-2xl font-medium tracking-tight">Send us an enquiry</h3>

                  <Field label="Full name" name="name" placeholder="Your name" autoComplete="name" />
                  <Field label="Phone number" name="phone" type="tel" placeholder="+91" autoComplete="tel" />

                  <fieldset>
                    <legend className="text-sm text-white/60">I&apos;m interested in</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {interests.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          aria-pressed={interest === opt}
                          onClick={() => setInterest(opt)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                            interest === opt ? "border-white bg-white text-[#0d2142]" : "border-white/20 text-white/80 hover:border-white/50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="block">
                    <span className="text-sm text-white/60">Message (optional)</span>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Tell us about your qualification and goals"
                      className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/60 focus:bg-white/10"
                    />
                  </label>

                  <button
                    type="submit"
                    className="group mt-2 flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 font-medium text-[#0d2142] transition-colors hover:bg-[#e6ecfa]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-[#1f8a5b]">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4.1-4.8-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.2.6.4.1.1.1.7-.1 1.3Z" />
                    </svg>
                    Send via WhatsApp
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

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm text-white/60">{label}</span>
      <input
        required
        {...props}
        className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/60 focus:bg-white/10"
      />
    </label>
  );
}
