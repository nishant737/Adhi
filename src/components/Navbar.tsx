"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappHref } from "@/data/contact";
import { startScroll, stopScroll } from "./SmoothScroll";

// One page per job a visitor comes to do, so nobody has to scroll the whole site to find theirs
export const navLinks = [
  { label: "Home", href: "/", hint: "Start here" },
  { label: "About", href: "/about", hint: "Who we are, our team, reviews" },
  { label: "Services", href: "/services", hint: "Placement, visa, training, payroll" },
  { label: "Jobs", href: "/careers", hint: "Current openings, apply in one tap" },
  { label: "Contact Us", href: "/contact", hint: "Enquiries, FAQs, visit us" },
];

const isCurrent = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The home page header floats over the hero video; every other page gets a solid bar straight away
  const overHero = pathname === "/" && !scrolled;

  // Solid background once the page moves; slides away while reading down, comes back on any scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Moving to a new page always shows the header again
  const [shownFor, setShownFor] = useState(pathname);
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setHidden(false);
  }

  // Lock page scroll while the menu is open, and close it with Escape
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    stopScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      startScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`motion-safe:animate-fade-down fixed inset-x-0 top-0 z-40 transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${overHero ? "bg-transparent" : "bg-white/85 shadow-[0_1px_0_rgba(13,33,66,0.08)] backdrop-blur-xl"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-10 sm:py-4">
          <Link href="/" onClick={() => setOpen(false)} className="shrink-0">
            <Image
              src="/images/logo.png"
              alt="Aadhi Consulting Services"
              width={654}
              height={300}
              priority
              className={`w-auto transition-[height] duration-500 ${overHero ? "h-9 sm:h-11 lg:h-12" : "h-8 sm:h-10"}`}
            />
          </Link>

          {/* Desktop: every page one click away */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-[0_1px_0_rgba(13,33,66,0.06)] ring-1 ring-[#0d2142]/[0.06] backdrop-blur">
              {navLinks.map((link) => {
                const current = isCurrent(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={`block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        current ? "bg-[#0d2142] text-white" : "text-[#0d2142]/75 hover:bg-[#e6ecfa] hover:text-[#0d2142]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/careers"
              className="hidden items-center gap-2 rounded-full bg-[#0d2142] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#0d2142]/15 transition-colors hover:bg-[#16305c] sm:inline-flex"
            >
              Apply for jobs
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <MenuButton open={false} onClick={() => setOpen(true)} className="lg:hidden" />
          </div>
        </div>
      </header>

      {/* Phones/tablets: full-screen menu with a short hint under each page so visitors know where to tap */}
      <div
        id="site-menu"
        data-lenis-prevent
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white/95 backdrop-blur-xl transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-3 sm:px-10 sm:py-4">
          <Link href="/" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            <Image src="/images/logo.png" alt="Aadhi Consulting Services" width={654} height={300} className="h-8 w-auto sm:h-10" />
          </Link>
          <MenuButton open onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} />
        </div>

        <nav aria-label="Main" className="flex-1 px-5 pt-4 sm:px-10">
          <ul className="divide-y divide-[#0d2142]/[0.07] border-y border-[#0d2142]/[0.07]">
            {navLinks.map((link, i) => {
              const current = isCurrent(pathname, link.href);
              return (
                <li
                  key={link.href}
                  style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
                  className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                >
                  <Link
                    href={link.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="group flex items-center justify-between gap-4 py-4 sm:py-5"
                  >
                    <span>
                      <span className={`block text-3xl font-medium tracking-tight sm:text-4xl ${current ? "text-[#3f74b5]" : "text-[#0d2142]"}`}>
                        {link.label}
                      </span>
                      <span className="mt-1 block text-sm text-[#0d2142]/50">{link.hint}</span>
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#0d2142]/10 text-[#0d2142]/50 transition-colors group-hover:border-[#0d2142] group-hover:bg-[#0d2142] group-hover:text-white">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="grid grid-cols-2 gap-2 px-5 pb-8 pt-6 sm:px-10">
          <Link
            href="/careers"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="flex items-center justify-center rounded-full bg-[#0d2142] px-4 py-3.5 text-sm font-medium text-white"
          >
            Apply for jobs
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            tabIndex={open ? 0 : -1}
            className="flex items-center justify-center gap-2 rounded-full border border-[#0d2142]/15 px-4 py-3.5 text-sm font-medium text-[#0d2142]"
          >
            <span className="h-2 w-2 rounded-full bg-[#25d366]" />
            WhatsApp us
          </a>
        </div>
      </div>
    </>
  );
}

function MenuButton({
  open,
  onClick,
  className = "",
  tabIndex,
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
  tabIndex?: number;
}) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="site-menu"
      tabIndex={tabIndex}
      onClick={onClick}
      className={`relative -mr-2.5 flex h-12 w-12 items-center justify-center text-[#0d2142] transition-opacity hover:opacity-70 ${className}`}
    >
      <span className={`absolute h-0.5 w-7 rounded-full bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-2"}`} />
      <span className={`absolute h-0.5 w-7 rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
      <span className={`absolute h-0.5 w-7 rounded-full bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-2"}`} />
    </button>
  );
}
