import { contact, whatsappHref } from "@/data/contact";

const icons = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  WhatsApp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4.1-4.8-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.2.6.4.1.1.1.7-.1 1.3Z"
    />
  ),
  Facebook: <path fill="currentColor" stroke="none" d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5Z" />,
};

const links = [
  { name: "Instagram" as const, href: contact.instagram },
  { name: "WhatsApp" as const, href: whatsappHref },
  { name: "Facebook" as const, href: contact.facebook },
].filter((l) => l.href);

// Round social buttons; `tone` picks colours for light or dark backgrounds
export default function SocialLinks({
  tone = "dark",
  tabIndex,
  className = "",
}: {
  tone?: "light" | "dark";
  tabIndex?: number;
  className?: string;
}) {
  const style =
    tone === "dark"
      ? "border-white/15 text-white hover:bg-white hover:text-[#0d2142]"
      : "border-[#0d2142]/15 text-[#0d2142] hover:bg-[#0d2142] hover:text-white";
  return (
    <ul className={`flex gap-2.5 ${className}`}>
      {links.map((l) => (
        <li key={l.name}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.name}
            tabIndex={tabIndex}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 ${style}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {icons[l.name]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
