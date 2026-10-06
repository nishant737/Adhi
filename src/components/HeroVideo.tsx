const SRC = "/videos/hero-v3-1080.mp4";

// Plays once per page load at normal speed and rests on the final frame.
// Phones/tablets: fills the portrait screen (object-cover). Desktop: the full frame is shown
// (object-contain, nothing cropped) and leftover space is filled by a soft blurred still.
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
        className="absolute inset-0 h-full w-full object-cover object-center lg:object-contain"
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
