import Image from "next/image";
import Link from "next/link";
import { contact, telHref } from "@/data/contact";
import SocialLinks from "./SocialLinks";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Faculty", href: "#faculty" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const services = ["Job Placement", "Visa & Emigration", "German Language Training"];

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-[#0b1a33] text-white">
      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-10 sm:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand — full width and centred on phones */}
          <div className="col-span-2 flex flex-col items-center text-center md:items-start md:text-left lg:col-span-1">
            <Link href="/" className="inline-flex rounded-2xl bg-white px-4 py-3">
              <Image src="/images/logo.png" alt="Aadhi Consulting Services" width={654} height={300} className="h-10 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60 md:mt-6">
              A Mangaluru-based consultancy helping Indian nurses build careers at home and abroad — mainly in Germany.
            </p>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#0d2142] transition-colors hover:bg-[#e6ecfa]"
            >
              <span className="h-2 w-2 rounded-full bg-[#25d366]" />
              Chat on WhatsApp
            </a>
            <SocialLinks tone="dark" className="mt-6" />
          </div>

          <FooterList title="Explore">
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-white/70 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterList>

          <FooterList title="Services">
            {services.map((s) => (
              <li key={s}>
                <Link href="#services" className="text-white/70 transition-colors hover:text-white">
                  {s}
                </Link>
              </li>
            ))}
          </FooterList>

          <FooterList title="Contact" className="col-span-2 border-t border-white/10 pt-8 md:col-span-1 md:border-0 md:pt-0">
            {contact.phones.map((phone) => (
              <ContactItem key={phone} icon={<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />}>
                <a href={telHref(phone)} className="transition-colors hover:text-white">
                  {phone}
                </a>
              </ContactItem>
            ))}
            <ContactItem icon={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>}>
              <a href={`mailto:${contact.email}`} className="break-all transition-colors hover:text-white">
                {contact.email}
              </a>
            </ContactItem>
            <ContactItem icon={<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>}>
              {contact.address}
            </ContactItem>
          </FooterList>
        </div>

        {/* Big wordmark */}
        <p aria-hidden className="mt-12 select-none text-center sm:mt-16 text-[22vw] font-semibold leading-[0.8] tracking-[-0.06em] text-white/[0.05] lg:text-[16rem]">
          AADHI
        </p>

        <div className="flex flex-col items-center gap-2 border-t border-white/10 py-6 text-center text-xs text-white/45 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Aadhi Consulting Services. All rights reserved.</p>
          <a
            href="https://www.yatharthsocial.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Managed by Yatharth — visit yatharthsocial.com"
            className="group flex items-center gap-1.5 transition-colors hover:text-white/80"
          >
            <span>Managed by</span>
            <Image
              src="/images/managed-by-logo.png"
              alt="Yatharth"
              width={1200}
              height={304}
              className="h-3.5 w-auto opacity-50 transition-opacity group-hover:opacity-80"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function ContactItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-white/70">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-[#7ea6ff]" aria-hidden>
        {icon}
      </svg>
      <span className="min-w-0">{children}</span>
    </li>
  );
}
