import Link from "next/link";
import { whatsappHref } from "@/data/contact";

// Closing nudge at the bottom of a page, so the next step is always one tap away
export default function CtaBand({
  title = "Ready to take the next step?",
  body = "Apply for a job, or talk to us about hiring. Free counselling, Mon to Sat.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative z-10 bg-white text-[#0d2142]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-10 sm:py-20">
        <div className="flex flex-col items-start gap-6 rounded-[1.75rem] bg-[#f4f7fc] p-7 ring-1 ring-[#0d2142]/[0.06] sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">{title}</h2>
            <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-[#0d2142]/60">{body}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center rounded-full bg-[#0d2142] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#16305c]"
            >
              See open jobs
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[#0d2142]/15 bg-white px-6 py-3.5 text-sm font-medium transition-colors hover:border-[#0d2142]"
            >
              Contact us
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0d2142]/15 bg-white px-6 py-3.5 text-sm font-medium transition-colors hover:border-[#0d2142]"
            >
              <span className="h-2 w-2 rounded-full bg-[#25d366]" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
