import Link from "next/link";

// Top of every inner page: where you are, what this page covers, and jump links to each part of it
export default function PageHeader({
  eyebrow,
  title,
  accent,
  intro,
  jumps = [],
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro: string;
  jumps?: { label: string; href: string }[];
}) {
  return (
    <section className="relative z-10 overflow-hidden bg-gradient-to-br from-[#0b1a33] via-[#10275a] to-[#1d4196] text-white">
      <div aria-hidden className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#7ea6ff]/20 blur-3xl" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-10 sm:pb-16 sm:pt-36">
        <nav aria-label="Breadcrumb" className="text-xs text-white/55 sm:text-sm">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/85">{eyebrow}</span>
        </nav>

        <h1 className="mt-4 max-w-3xl text-[2.2rem] font-medium leading-[1.02] tracking-[-0.04em] sm:mt-5 sm:text-6xl lg:text-[4rem]">
          {title} {accent && <span className="text-[#9fc0ff]">{accent}</span>}
        </h1>
        <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/70 sm:mt-6 sm:text-lg">{intro}</p>

        {jumps.length > 0 && (
          <nav aria-label="On this page" className="mt-8 sm:mt-10">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-white/45">On this page</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {jumps.map((j) => (
                <li key={j.href}>
                  <a
                    href={j.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:border-white hover:bg-white hover:text-[#0d2142]"
                  >
                    {j.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
