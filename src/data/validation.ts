import type { CountryCode } from "./countryCodes";

// Shared, strict rules for every form on the site. Each `clean*` runs as people type, so
// disallowed characters never get into the field; each `*Error` runs before submitting.

const LETTER = /[\p{L}\p{M}]/u;
const letterCount = (v: string) => [...v].filter((c) => LETTER.test(c)).length;
// Keyboard mashing like "aaaa", "1111" or "...."
const REPEATS = /(.)\1{3,}/u;

const collapse = (v: string) => v.replace(/ {2,}/g, " ").replace(/^ /, "");

// Names, job titles, places: letters and single spaces only
const WORDS = /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u;
export const cleanWords = (v: string) => collapse(v.replace(/[^\p{L}\p{M} ]/gu, "")).slice(0, 50);

export function wordsError(value: string, label: string) {
  const v = value.trim();
  if (!v) return `${label} is required`;
  if (!WORDS.test(v)) return `${label} can only contain letters and spaces`;
  if (letterCount(v) < 2) return `${label} is too short`;
  if (REPEATS.test(v.toLowerCase())) return `Please enter a real ${label.toLowerCase()}`;
  return "";
}

// Company names: letters, digits, spaces and & . , ' - ( ) — e.g. "L&T", "3M India Pvt. Ltd."
const COMPANY = /^[\p{L}\p{M}\d&.,'()-]+(?: [\p{L}\p{M}\d&.,'()-]+)*$/u;
export const cleanCompany = (v: string) =>
  collapse(v.replace(/[^\p{L}\p{M}\d &.,'()-]/gu, "")).replace(/([&.,'()-])\1+/g, "$1").slice(0, 80);

export function companyError(value: string) {
  const v = value.trim();
  if (!v) return "Company name is required";
  if (!COMPANY.test(v)) return "Company name has characters that aren't allowed";
  if (letterCount(v) < 2) return "Company name must contain letters";
  if (REPEATS.test(v.toLowerCase())) return "Please enter a real company name";
  return "";
}

// Email: no spaces, lower case, one @, a real-looking domain
const EMAIL = /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
export const cleanEmail = (v: string) => v.replace(/[^a-zA-Z0-9._%+@-]/g, "").toLowerCase().slice(0, 100);

export function emailError(value: string) {
  const v = value.trim();
  if (!v) return "Email is required";
  if (!EMAIL.test(v) || v.includes("..")) return "Enter a valid email, like name@company.com";
  return "";
}

// Phone: digits only, exact length for the chosen country
export const cleanPhone = (v: string, country: CountryCode) => v.replace(/\D/g, "").slice(0, country.max);

export function phoneError(digits: string, country: CountryCode) {
  if (!digits) return "Phone number is required";
  const need = country.min === country.max ? `${country.min}` : `${country.min} to ${country.max}`;
  if (digits.length < country.min || digits.length > country.max)
    return `Enter a ${need} digit number for ${country.name}`;
  if (country.iso === "IN" && !/^[6-9]/.test(digits)) return "Indian mobile numbers start with 6, 7, 8 or 9";
  if (/^(\d)\1+$/.test(digits)) return "Please enter a real phone number";
  return "";
}

// Free text (optional): letters, digits, everyday punctuation and line breaks. No emoji, < >, etc.
export const cleanMessage = (v: string) =>
  v
    .replace(/[^\p{L}\p{M}\d \n.,!?'"&()/:;+%@#-]/gu, "")
    .replace(/ {2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/([.,!?'"&()/:;+%@#-])\1{2,}/g, "$1$1")
    .replace(/^\s+/, "")
    .slice(0, 1000);

export function messageError(value: string, label: string) {
  const v = value.trim();
  if (!v) return "";
  if (letterCount(v) < 5) return `Please describe your ${label.toLowerCase()} in a few words`;
  if (REPEATS.test(v.toLowerCase().replace(/\s/g, ""))) return `Please enter real ${label.toLowerCase()}`;
  return "";
}
