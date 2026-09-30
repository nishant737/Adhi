"use client";

import Lenis from "lenis";
import { useEffect } from "react";

// One smooth-scroll instance for the whole page, so other components (e.g. the menu) can pause it
let lenis: Lenis | null = null;

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
// Glide to a page position (falls back to the browser's smooth scroll)
export const scrollToY = (y: number) => {
  if (lenis) lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: "smooth" });
};

export default function SmoothScroll() {
  useEffect(() => {
    // Visitors who prefer reduced motion keep normal browser scrolling
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1, // lower = smoother / floatier
      anchors: true, // in-page links (#about, …) glide to their section
    });

    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
