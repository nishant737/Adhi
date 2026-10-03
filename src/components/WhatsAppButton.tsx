import { whatsappHref } from "@/data/contact";

const MESSAGE = "Hello Aadhi Consulting, I'd like to know more about your services.";

// Floating WhatsApp chat button, fixed to the bottom-right corner on every screen size.
// z-40 keeps it above the page sections (z-10) but below the open menu (z-50).
export default function WhatsAppButton() {
  return (
    <a
      href={`${whatsappHref}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-center rounded-full bg-[#25d366] p-3.5 text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(37,211,102,0.45)] sm:bottom-6 sm:right-6 sm:p-4"
    >
      {/* Soft pulse to draw the eye; switched off for reduced motion */}
      <span aria-hidden className="absolute inset-0 -z-10 rounded-full bg-[#25d366] opacity-40 motion-safe:animate-ping [animation-duration:2.5s]" />
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4.1-4.8-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.2.6.4.1.1.1.7-.1 1.3Z" />
      </svg>
      {/* Label slides out on hover (desktop only) */}
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-2 group-hover:mr-1 group-hover:max-w-40 lg:inline">
        Chat with us
      </span>
    </a>
  );
}
