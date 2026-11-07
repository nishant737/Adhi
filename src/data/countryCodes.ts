// Country codes for phone fields. `min`/`max` = digits allowed after the code (mobile numbers,
// without the leading 0 used for local dialling).
export type CountryCode = { iso: string; name: string; dial: string; min: number; max: number };

export const countryCodes: CountryCode[] = [
  { iso: "IN", name: "India", dial: "+91", min: 10, max: 10 },
  { iso: "AE", name: "United Arab Emirates", dial: "+971", min: 9, max: 9 },
  { iso: "SA", name: "Saudi Arabia", dial: "+966", min: 9, max: 9 },
  { iso: "QA", name: "Qatar", dial: "+974", min: 8, max: 8 },
  { iso: "KW", name: "Kuwait", dial: "+965", min: 8, max: 8 },
  { iso: "OM", name: "Oman", dial: "+968", min: 8, max: 8 },
  { iso: "BH", name: "Bahrain", dial: "+973", min: 8, max: 8 },
  { iso: "IL", name: "Israel", dial: "+972", min: 9, max: 9 },
  { iso: "GB", name: "United Kingdom", dial: "+44", min: 10, max: 10 },
  { iso: "IE", name: "Ireland", dial: "+353", min: 9, max: 9 },
  { iso: "DE", name: "Germany", dial: "+49", min: 10, max: 11 },
  { iso: "FR", name: "France", dial: "+33", min: 9, max: 9 },
  { iso: "IT", name: "Italy", dial: "+39", min: 9, max: 10 },
  { iso: "ES", name: "Spain", dial: "+34", min: 9, max: 9 },
  { iso: "PT", name: "Portugal", dial: "+351", min: 9, max: 9 },
  { iso: "NL", name: "Netherlands", dial: "+31", min: 9, max: 9 },
  { iso: "PL", name: "Poland", dial: "+48", min: 9, max: 9 },
  { iso: "MT", name: "Malta", dial: "+356", min: 8, max: 8 },
  { iso: "CH", name: "Switzerland", dial: "+41", min: 9, max: 9 },
  { iso: "US", name: "United States", dial: "+1", min: 10, max: 10 },
  { iso: "CA", name: "Canada", dial: "+1", min: 10, max: 10 },
  { iso: "AU", name: "Australia", dial: "+61", min: 9, max: 9 },
  { iso: "NZ", name: "New Zealand", dial: "+64", min: 8, max: 10 },
  { iso: "SG", name: "Singapore", dial: "+65", min: 8, max: 8 },
  { iso: "MY", name: "Malaysia", dial: "+60", min: 9, max: 10 },
  { iso: "JP", name: "Japan", dial: "+81", min: 10, max: 10 },
  { iso: "MV", name: "Maldives", dial: "+960", min: 7, max: 7 },
  { iso: "NP", name: "Nepal", dial: "+977", min: 10, max: 10 },
  { iso: "LK", name: "Sri Lanka", dial: "+94", min: 9, max: 9 },
  { iso: "BD", name: "Bangladesh", dial: "+880", min: 10, max: 10 },
  { iso: "ZA", name: "South Africa", dial: "+27", min: 9, max: 9 },
];

// "IN" -> 🇮🇳
export const flagOf = (iso: string) =>
  String.fromCodePoint(...[...iso.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
