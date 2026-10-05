// Plays once per page load at normal speed and rests on the final frame.
// (The video itself ends on a held still, so no playback-rate tricks are needed:
// slowing a 24fps clip down made it judder.)
export default function HeroVideo({ poster }: { poster: string }) {
  return (
    <video
      className="motion-safe:animate-hero-reveal absolute inset-0 h-full w-full object-cover object-center will-change-transform"
      poster={poster}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden
    >
      <source src="/videos/hero-v2-1080.mp4" type="video/mp4" />
    </video>
  );
}
