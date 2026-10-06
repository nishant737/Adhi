const SRC = "/videos/hero-v2-1080.mp4";

// Plays once per page load at normal speed and rests on the final frame.
// The full frame is always shown (object-contain, nothing cropped); any space the
// screen shape leaves over is filled by a soft blurred still of the first frame.
export default function HeroVideo({ poster }: { poster: string }) {
  return (
    <div className="motion-safe:animate-hero-reveal absolute inset-0 overflow-hidden bg-[#e9edf3]">
      {/* Blurred still behind the video fills any space around it (cheap: only one video plays) */}
      <div
        aria-hidden
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-70 blur-2xl"
        style={{ backgroundImage: `url(${poster})` }}
      />
      <video
        aria-hidden
        className="absolute inset-0 h-full w-full object-contain object-center"
        poster={poster}
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src={SRC} type="video/mp4" />
      </video>
    </div>
  );
}
