"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { whatsappLink } from "@/data/contact";
import { CV_ACCEPT, CV_MAX_BYTES, CV_TYPES } from "@/data/cv";
import type { Job } from "@/data/jobs";
import { HONEYPOT, fileToBase64, sendToSheet } from "@/data/sheet";
import { startScroll, stopScroll } from "./SmoothScroll";

type Status = "idle" | "uploading" | "done" | "error";

const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

function checkFile(file: File): string | null {
  const okType = CV_TYPES.includes(file.type) || /\.(pdf|docx?)$/i.test(file.name);
  if (!okType) return "Please upload a PDF or Word document.";
  if (file.size > CV_MAX_BYTES) return `This file is ${formatSize(file.size)}. The maximum size is 5 MB.`;
  return null;
}

function openWhatsApp(lines: string[]) {
  window.open(whatsappLink(lines), "_blank", "noopener");
}

export default function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [details, setDetails] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock page scroll, close on Escape, move focus into the dialog
  useEffect(() => {
    document.body.style.overflow = "hidden";
    stopScroll();
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && status !== "uploading" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      startScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, status]);

  const pick = (f: File | undefined) => {
    if (!f) return;
    const err = checkFile(f);
    setFileError(err);
    setFile(err ? null : f);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files[0]);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setFileError("Please attach your CV.");
      return;
    }
    const data = new FormData(e.currentTarget);
    if (data.get(HONEYPOT)) {
      setStatus("done");
      return;
    }
    const name = String(data.get("name"));
    const lines = [
      "Hello Aadhi Consulting, I'd like to apply for this job.",
      `Role: ${job.title} (${job.location})`,
      `Name: ${name}`,
      `Phone: ${data.get("phone")}`,
      data.get("email") ? `Email: ${data.get("email")}` : "",
    ];
    setDetails(lines);
    setStatus("uploading");
    try {
      // Saved as a row in the client's Google Sheet; the CV goes to their Google Drive
      await sendToSheet({
        kind: "application",
        role: job.title,
        location: job.location,
        name,
        phone: String(data.get("phone")),
        email: String(data.get("email") || ""),
        cv: { name: file.name, type: file.type, base64: await fileToBase64(file) },
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const busy = status === "uploading";

  // Rendered into <body> so it sits above every section and the floating WhatsApp button
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="presentation">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={() => !busy && onClose()}
        className="animate-fade-in absolute inset-0 cursor-default bg-[#0b1a33]/60 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-title"
        tabIndex={-1}
        data-lenis-prevent
        className="animate-sheet-up relative max-h-[92svh] w-full overflow-y-auto rounded-t-[1.75rem] bg-white p-6 text-[#0d2142] shadow-2xl outline-none sm:max-w-lg sm:rounded-[1.75rem] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2fa] transition-colors hover:bg-[#e0e7f5] disabled:opacity-40"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {status === "done" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3f4ec] text-[#1f8a5b]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>
            <h2 id="apply-title" className="mt-5 text-2xl font-medium tracking-tight">Application received</h2>
            <p className="mt-2 max-w-xs text-[#0d2142]/60">
              Thanks! Our team has your details and CV for{" "}
              <span className="font-medium text-[#0d2142]">{job.title}</span> and will get in touch soon.
            </p>
            <button
              type="button"
              onClick={() => openWhatsApp(details)}
              className="mt-6 text-sm font-medium text-[#1f8a5b] underline underline-offset-4 hover:text-[#176b46]"
            >
              Message us on WhatsApp too
            </button>
            <button type="button" onClick={onClose} className="mt-4 rounded-full bg-[#0d2142] px-6 py-3 text-sm font-medium text-white hover:bg-[#16305c]">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="pr-10">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#3f74b5]">Apply for</p>
              <h2 id="apply-title" className="mt-1.5 text-2xl font-medium tracking-tight">{job.title}</h2>
              <p className="mt-1 text-sm text-[#0d2142]/55">{[job.location, job.type, job.salary].filter(Boolean).join(" · ")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" placeholder="Your name" autoComplete="name" required disabled={busy} />
              <Field label="Phone number" name="phone" type="tel" placeholder="+91" autoComplete="tel" required disabled={busy} />
            </div>
            {/* Spam trap: hidden from people, bots fill it in */}
            <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            <Field label="Email (optional)" name="email" type="email" placeholder="you@example.com" autoComplete="email" disabled={busy} />

            {/* CV upload */}
            <div>
              <span className="text-sm text-[#0d2142]/60">Your CV</span>
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                  dragging ? "border-[#3f74b5] bg-[#eef2fa]" : fileError ? "border-[#d9534f]/60 bg-[#fdf3f3]" : "border-[#0d2142]/15 bg-[#f6f8fc] hover:border-[#3f74b5]/50"
                } ${busy ? "pointer-events-none opacity-70" : ""}`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  name="cv"
                  accept={CV_ACCEPT}
                  className="sr-only"
                  disabled={busy}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => pick(e.target.files?.[0])}
                />
                {file ? (
                  <span className="flex w-full items-center gap-3 text-left">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#3f74b5] shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                        <path d="M14 3v5h5" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{file.name}</span>
                      <span className="block text-xs text-[#0d2142]/50">{formatSize(file.size)} · tap to change</span>
                    </span>
                  </span>
                ) : (
                  <>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#3f74b5] shadow-sm">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
                      </svg>
                    </span>
                    <span className="mt-3 text-sm font-medium">
                      <span className="text-[#3f74b5]">Choose a file</span> or drag it here
                    </span>
                    <span className="mt-1 text-xs text-[#0d2142]/50">PDF or Word · max 5 MB</span>
                  </>
                )}
              </label>
              {fileError && (
                <p role="alert" className="mt-2 text-sm text-[#c0392b]">{fileError}</p>
              )}
            </div>

            {status === "error" && (
              <div role="alert" className="rounded-2xl bg-[#fdf3f3] p-4 text-sm text-[#0d2142]/80">
                <p className="font-medium text-[#c0392b]">We couldn&apos;t upload your CV right now.</p>
                <p className="mt-1">You can still apply on WhatsApp and send your CV there.</p>
                <button
                  type="button"
                  onClick={() => openWhatsApp([...details, "I'll attach my CV here."])}
                  className="mt-3 rounded-full bg-[#25d366] px-4 py-2 text-sm font-medium text-white hover:bg-[#1fb557]"
                >
                  Apply on WhatsApp instead
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="relative mt-1 flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#0d2142] px-6 py-3.5 font-medium text-white transition-colors hover:bg-[#16305c] disabled:cursor-wait"
            >
              {busy && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin" aria-hidden>
                  <path d="M12 3a9 9 0 1 0 9 9" />
                </svg>
              )}
              <span className="relative">{busy ? "Sending your application…" : "Submit application"}</span>
            </button>
            <p className="text-center text-xs text-[#0d2142]/45">Your CV is kept private and only shared with the Aadhi team.</p>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm text-[#0d2142]/60">{label}</span>
      <input
        {...props}
        className="mt-2 w-full rounded-xl border border-[#0d2142]/12 bg-[#f6f8fc] px-4 py-3 text-[#0d2142] placeholder:text-[#0d2142]/35 outline-none transition-colors focus:border-[#3f74b5] focus:bg-white disabled:opacity-60"
      />
    </label>
  );
}
