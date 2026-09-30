"use client";

import { useEffect, useRef } from "react";

// Plays once per page load, gently slows down over the last seconds, then rests on the final frame.
const EASE_OUT_SECONDS = 1.5;
const MIN_RATE = 0.2;

export default function HeroVideo({ poster }: { poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const tick = () => {
      const remaining = video.duration - video.currentTime;
      if (!reduceMotion && Number.isFinite(remaining) && remaining < EASE_OUT_SECONDS) {
        const t = remaining / EASE_OUT_SECONDS; // 1 → 0 as the clip ends
        video.playbackRate = MIN_RATE + (1 - MIN_RATE) * t * t;
      }
      if (!video.ended) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <video
      ref={videoRef}
      className="motion-safe:animate-hero-reveal absolute inset-0 h-full w-full object-cover object-[38%_50%] will-change-transform lg:object-center"
      poster={poster}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden
    >
      {/* Browser picks the first matching source: sharper file for large screens */}
      <source src="/videos/hero-1440.mp4" type="video/mp4" media="(min-width: 1280px)" />
      <source src="/videos/hero-1080.mp4" type="video/mp4" />
    </video>
  );
}
