"use client";

import { useState } from "react";
import { faqs } from "@/data/faqs";
import Reveal from "./Reveal";


export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 bg-white text-[#0d2142]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-10 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e6ecfa] px-4 py-2 text-xs font-medium sm:px-5 sm:py-2.5 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3f74b5]" />
            FAQ
          </span>
          <h2 className="mt-5 text-[2.1rem] font-medium leading-[1.02] tracking-[-0.04em] sm:mt-6 sm:text-6xl lg:text-[3.75rem]">
            Questions? <span className="block text-[#3f74b5]">We&apos;ve got answers.</span>
          </h2>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-[#0d2142]/60 sm:text-lg">
            Can&apos;t find what you&apos;re looking for?{" "}
            <a href="#contact" className="font-medium text-[#0d2142] underline decoration-[#3f74b5]/40 underline-offset-4 transition-colors hover:decoration-[#3f74b5]">
              Get in touch
            </a>
            .
          </p>
        </Reveal>

        <ul className="border-t border-[#0d2142]/10">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-[#0d2142]/10">
                <Reveal delay={i * 60}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-5 text-left sm:py-7"
                  >
                    <span className={`text-base font-medium tracking-tight transition-colors sm:text-xl ${isOpen ? "text-[#0d2142]" : "text-[#0d2142]/75 group-hover:text-[#0d2142]"}`}>
                      {item.q}
                    </span>
                    <span
                      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-10 sm:w-10 ${
                        isOpen ? "rotate-180 border-[#0d2142] bg-[#0d2142] text-white" : "border-[#0d2142]/15 text-[#0d2142] group-hover:border-[#0d2142]/40"
                      }`}
                    >
                      <span className="absolute h-0.5 w-3.5 rounded bg-current" />
                      <span className={`absolute h-3.5 w-0.5 rounded bg-current transition-transform duration-500 ${isOpen ? "scale-y-0" : "scale-y-100"}`} />
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <p className="min-h-0 overflow-hidden pr-12 text-[0.95rem] leading-relaxed text-[#0d2142]/65 sm:text-lg">
                      <span className="block pb-6 sm:pb-8">{item.a}</span>
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
