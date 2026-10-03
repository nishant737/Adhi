"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { startScroll, stopScroll } from "./SmoothScroll";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
      {/* Stays put over the hero video; sits below the About section (z-10), which slides up over it */}
      <header className="motion-safe:animate-fade-down fixed inset-x-0 top-0 z-[5]">
        <Bar open={false} focusable onToggle={() => setOpen(true)} onLogoClick={() => setOpen(false)} priority />
      </header>

      {/* Full-screen menu — above everything, with its own logo and close button in the same spots */}
      <div
        id="site-menu"
        data-lenis-prevent
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-white/85 backdrop-blur-xl transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Bar open={open} focusable={open} onToggle={() => setOpen(false)} onLogoClick={() => setOpen(false)} />

        <nav className="flex flex-1 items-center px-5 sm:px-10">
          <ul className="space-y-2 sm:space-y-4">
            {links.map((link, i) => (
              <li
                key={link.label}
                style={{ transitionDelay: open ? `${100 + i * 70}ms` : "0ms" }}
                className={`transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Link
                  href={link.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="text-5xl font-medium tracking-tight text-[#0d2142] transition-colors hover:text-[#79a7d8] sm:text-7xl"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

// Logo on the left, menu button on the right — shared by the header and the open menu so they line up exactly
function Bar({
  open,
  focusable,
  onToggle,
  onLogoClick,
  priority = false,
}: {
  open: boolean;
  focusable: boolean;
  onToggle: () => void;
  onLogoClick: () => void;
  priority?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 sm:px-10 sm:py-5">
      <Link href="/" onClick={onLogoClick} tabIndex={focusable ? 0 : -1}>
        <Image
          src="/images/logo.png"
          alt="Aadhi Consulting Services"
          width={654}
          height={300}
          priority={priority}
          className="h-9 w-auto sm:h-11 lg:h-12"
        />
      </Link>

      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        tabIndex={focusable ? 0 : -1}
        onClick={onToggle}
        className="relative -mr-2.5 flex h-12 w-12 items-center justify-center text-[#0d2142] transition-opacity hover:opacity-70"
      >
        <span
          className={`absolute h-0.5 w-7 rounded-full bg-current transition-transform duration-300 ${
            open ? "rotate-45" : "-translate-y-2"
          }`}
        />
        <span
          className={`absolute h-0.5 w-7 rounded-full bg-current transition-opacity duration-200 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute h-0.5 w-7 rounded-full bg-current transition-transform duration-300 ${
            open ? "-rotate-45" : "translate-y-2"
          }`}
        />
      </button>
    </div>
  );
}
