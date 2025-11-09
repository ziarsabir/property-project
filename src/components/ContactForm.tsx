"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [error, setError] = useState<string | null>(null);

 async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);
  setStatus("loading");

  const form = e.currentTarget;              // <-- keep a stable ref
  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());
  console.log("Form payload:", payload);

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");

    setStatus("success");
    form.reset();                            // <-- use the saved ref
  } catch (err: any) {
    setError(err.message || "Failed to send your message");
    setStatus("error");
  }
}


  return (
    <>
      {status === "success" && (
        <div className="mt-4 rounded border border-green-200 bg-green-50 p-3 text-green-800">
          Thanks! Your message has been sent. We’ll reply shortly.
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {/* Honeypot (hidden) */}
        <input type="text" name="honey" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input required id="name" name="name" type="text" className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input required id="email" name="email" type="email" className="w-full rounded border px-3 py-2" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone (optional)</label>
            <input id="phone" name="phone" type="tel" className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="subject">Subject (optional)</label>
            <input id="subject" name="subject" type="text" className="w-full rounded border px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
          <textarea required id="message" name="message" rows={6} className="w-full rounded border px-3 py-2" />
        </div>

        <div className="flex items-center justify-end">
          <button disabled={status === "loading"}  type="submit" className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60">
            {status === "loading" ? "Sending…" : "Send message"}
          </button>
        </div>
      </form>
    </>
  );
}
