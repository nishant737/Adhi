"use client";

import { useEffect, useId, useRef, useState } from "react";
import { countryCodes, flagOf, type CountryCode } from "@/data/countryCodes";

// Form fields shared by the Careers and Contact forms (dark card styling, inline errors)

export const inputClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/60 focus:bg-white/10";
export const errorBorder = "border-[#ff9b9b]/80 focus:border-[#ff9b9b]";

export function FieldError({ message, id }: { message: string; id?: string }) {
  if (!message) return null;
  return (
    <span id={id} role="alert" className="mt-1.5 block text-xs text-[#ffb4b4]">
      {message}
    </span>
  );
}

export function TextField({
  label,
  error = "",
  ...props
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const errId = `${props.name}-error`;
  return (
    <label className="block">
      <span className="text-sm text-white/60">{label}</span>
      <input
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={`${inputClass} ${error ? errorBorder : ""}`}
      />
      <FieldError id={errId} message={error} />
    </label>
  );
}

export function PhoneField({
  country,
  onCountry,
  value,
  onChange,
  onBlur,
  error,
}: {
  country: CountryCode;
  onCountry: (c: CountryCode) => void;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error: string;
}) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const listId = `${uid}-list`;
  const errId = `${uid}-error`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase().replace(/^\+/, "");
  const results = q
    ? countryCodes.filter((c) => c.name.toLowerCase().includes(q) || c.dial.slice(1).startsWith(q) || c.iso.toLowerCase() === q)
    : countryCodes;

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const close = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const toggle = () => {
    setQuery("");
    setActive(Math.max(0, countryCodes.indexOf(country)));
    setOpen((o) => !o);
  };

  const choose = (c: CountryCode) => {
    onCountry(c);
    setOpen(false);
    phoneRef.current?.focus();
  };

  const onSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) choose(results[active]);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  };

  const digits = country.min === country.max ? `${country.max}` : `${country.min} to ${country.max}`;

  return (
    <div className="block">
      <span id={labelId} className="text-sm text-white/60">Phone number</span>
      <div ref={wrapRef} className="relative mt-2">
        <div
          className={`flex w-full items-stretch rounded-xl border bg-white/5 transition-colors focus-within:border-white/60 focus-within:bg-white/10 ${
            error ? "border-[#ff9b9b]/80" : "border-white/15"
          }`}
        >
          <button
            type="button"
            onClick={toggle}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Country code: ${country.name} ${country.dial}`}
            className="flex shrink-0 items-center gap-1.5 rounded-l-xl border-r border-white/15 pl-3 pr-2 text-sm text-white outline-none hover:bg-white/5 focus-visible:bg-white/10"
          >
            <span aria-hidden className="text-base leading-none">{flagOf(country.iso)}</span>
            <span className="tabular-nums">{country.dial}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`text-white/60 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <input
            ref={phoneRef}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            aria-labelledby={labelId}
            aria-invalid={!!error}
            aria-describedby={error ? errId : undefined}
            maxLength={country.max}
            placeholder={`${digits} digits`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className="w-full min-w-0 bg-transparent px-3 py-3 text-white tabular-nums outline-none placeholder:text-white/35"
          />
        </div>

        {open && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#0d2142]/10 bg-white text-[#0d2142] shadow-[0_20px_50px_rgba(5,15,35,0.35)]">
            <div className="border-b border-[#0d2142]/10 p-2">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onSearchKey}
                placeholder="Search country or code"
                aria-label="Search country or code"
                aria-controls={listId}
                className="w-full rounded-lg bg-[#eef2fa] px-3 py-2 text-sm outline-none placeholder:text-[#0d2142]/40"
              />
            </div>
            <ul ref={listRef} id={listId} role="listbox" aria-label="Country code" className="max-h-56 overflow-y-auto overscroll-contain py-1">
              {results.length === 0 && <li className="px-3 py-2 text-sm text-[#0d2142]/50">No match</li>}
              {results.map((c, i) => (
                <li
                  key={c.iso}
                  role="option"
                  aria-selected={c.iso === country.iso}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(c)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${i === active ? "bg-[#eef2fa]" : ""} ${
                    c.iso === country.iso ? "font-medium" : ""
                  }`}
                >
                  <span aria-hidden className="text-base leading-none">{flagOf(c.iso)}</span>
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 tabular-nums text-[#0d2142]/55">{c.dial}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <FieldError id={errId} message={error} />
    </div>
  );
}

export function TextArea({
  label,
  error = "",
  ...props
}: { label: string; error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const errId = `${props.name}-error`;
  return (
    <label className="block">
      <span className="text-sm text-white/60">{label}</span>
      <textarea
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={`${inputClass} resize-none ${error ? errorBorder : ""}`}
      />
      <FieldError id={errId} message={error} />
    </label>
  );
}
