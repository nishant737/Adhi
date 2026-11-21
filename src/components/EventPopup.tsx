"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { startScroll, stopScroll } from "./SmoothScroll";

// Event poster shown once per visit on desktop (1024px and wider). Phones and tablets never see it.
const POSTER = { src: "/images/event-popup.jpg", width: 2000, height: 1250, alt: "Dubai Property Connect, 18 December 2026, The Avatar, Mangaluru" };
const SHOW_UNTIL = new Date("2026-12-19T00:00:00+05:30"); // stops appearing once the event (18 Dec) is over
const DELAY_MS = 1800; // let the hero play first
const SEEN_KEY = "event-popup-seen";

export default function EventPopup() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (Date.now() >= SHOW_UNTIL.getTime()) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {}
    const timer = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // While open: page doesn't scroll, Escape closes, focus sits on the close button
  useEffect(() => {
    if (!open) return;
    stopScroll();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      startScroll();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Upcoming event"
      data-lenis-prevent
      onClick={() => setOpen(false)}
      className="animate-fade-in fixed inset-0 z-[60] hidden items-center justify-center bg-[#0b1a33]/70 p-10 backdrop-blur-sm lg:flex"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-sheet-up relative w-full max-w-[min(68rem,calc((100svh-5rem)*1.6))]"
      >
        <Image
          src={POSTER.src}
          alt={POSTER.alt}
          width={POSTER.width}
          height={POSTER.height}
          sizes="(min-width: 1024px) 68rem, 100vw"
          priority
          className="h-auto w-full rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
        />
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute -right-4 -top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0d2142] shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
