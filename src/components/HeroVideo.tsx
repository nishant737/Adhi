// Phones/tablets (below the lg breakpoint) get the portrait cut; desktop gets the landscape one.
// Only the matching file is downloaded: the browser picks one <source> by its `media` query.
export const MOBILE_MEDIA = "(max-width: 1023.98px)";
export const DESKTOP_MEDIA = "(min-width: 1024px)";
export const HERO = {
  mobile: { src: "/videos/hero-mobile.mp4", poster: "/videos/hero-mobile-poster.jpg" },
  desktop: { src: "/videos/hero-v5-1080.mp4", poster: "/videos/hero-v5-poster.jpg" },
};

// Plays once per page load at normal speed and rests on the final frame.
// Phones/tablets: the portrait video fills the screen (object-cover). Desktop: the full frame is shown
// (object-contain, nothing cropped) and leftover space is filled by a soft blurred still.
export default function HeroVideo() {
  return (
    <div className="motion-safe:animate-hero-reveal absolute inset-0 overflow-hidden bg-[#e9edf3]">
      {/* Desktop: blurred still behind the video fills any space around it (cheap: only one video plays) */}
      <div
        aria-hidden
        className="absolute inset-0 hidden scale-110 bg-cover bg-center opacity-70 blur-2xl lg:block"
        style={{ backgroundImage: `url(${HERO.desktop.poster})` }}
      />
      {/* First frame for the screen size, shown until the video starts (a video poster can't switch by screen size) */}
      <picture>
        <source media={MOBILE_MEDIA} srcSet={HERO.mobile.poster} />
        <img
          src={HERO.desktop.poster}
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center lg:object-contain"
        />
      </picture>
      <video
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center lg:object-contain"
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src={HERO.mobile.src} type="video/mp4" media={MOBILE_MEDIA} />
        <source src={HERO.desktop.src} type="video/mp4" />
      </video>
    </div>
  );
}
