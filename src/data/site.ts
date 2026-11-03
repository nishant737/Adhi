// Public address of the live site, e.g. https://www.aadhiconsultingservices.com (no trailing slash).
// Used for link previews and search-engine data. Leave unset in development.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
