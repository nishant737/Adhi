import { jobs as fallbackJobs, type Job } from "./jobs";

// Web app URL of the Google Apps Script attached to the client's sheet (see docs/google-sheet-apps-script.js).
// Empty = not set up yet: openings come from jobs.ts and forms fall back to WhatsApp only.
export const SHEET_URL = process.env.NEXT_PUBLIC_SHEET_URL ?? "";

export type SheetPayload = {
  kind: "application" | "request" | "enquiry";
  name: string;
  phone: string;
  email?: string;
  role?: string;
  location?: string;
  experience?: string;
  preferredLocation?: string;
  company?: string;
  service?: string;
  positions?: string;
  message?: string;
  cv?: { name: string; type: string; base64: string };
};

// Hidden form field that people never see but spam bots fill in. A filled one is silently dropped.
export const HONEYPOT = "website";

// Sends a row to the sheet. Plain-text body keeps it a "simple" request, so the browser
// doesn't need a CORS preflight (Apps Script can't answer one).
export async function sendToSheet(payload: SheetPayload): Promise<void> {
  if (!SHEET_URL) throw new Error("Sheet not set up");
  const res = await fetch(SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60_000), // a 5 MB CV on a slow connection; never hang forever
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !data.ok) throw new Error(data.error || "Could not save");
}

// Server-side: reads the "Openings" tab, refreshed every 5 minutes. Falls back to jobs.ts.
export async function getOpenings(): Promise<Job[]> {
  if (!SHEET_URL) return fallbackJobs;
  try {
    const res = await fetch(SHEET_URL, { next: { revalidate: 300 }, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return fallbackJobs;
    const data = (await res.json()) as { jobs?: Record<string, string>[] };
    if (!Array.isArray(data.jobs)) return fallbackJobs;
    return data.jobs.map((j) => ({
      title: j.title,
      location: j.location || "India",
      region: /abroad/i.test(j.region ?? "") ? "Abroad" : "India",
      type: j.type || "Full-time",
      experience: j.experience || undefined,
      salary: j.salary || undefined,
    }));
  } catch {
    return fallbackJobs;
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
