"use client";

import { useState } from "react";

type EnquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  honey?: string;
};

export default function EnquiryBox({ subject }: { subject: string }) {
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);
    const entries = Object.fromEntries(data.entries());

    const payload: EnquiryPayload = {
      name: String(entries.name ?? ""),
      email: String(entries.email ?? ""),
      phone: entries.phone ? String(entries.phone) : undefined,
      message: String(entries.message ?? ""),
      subject,
      honey: entries.honey ? String(entries.honey) : undefined,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok || !json.ok)
        throw new Error(json.error || "Something went wrong");

      setStatus("success");
      setError(null);
      form.reset();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to send your message"
      );
      setStatus("error");
    }
  }

  const isLoading = status === "loading";

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">Enquire about this property</h3>
          <p className="mt-1 text-sm text-slate-600">
            Leave your details and we’ll get back to you.
          </p>
        </div>
        <span className="hidden sm:inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Fast response
        </span>
      </div>

      {status === "success" && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Thanks — your enquiry has been sent.
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <input
          type="text"
          name="honey"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <fieldset disabled={isLoading} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Name
              </label>
              <input
                required
                name="name"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Phone (optional)
            </label>
            <input
              name="phone"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="+44..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Message
            </label>
            <textarea
              required
              name="message"
              rows={4}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Hi, I’m interested in viewing this property. When is the next available slot?"
            />
          </div>

          <button
            disabled={isLoading}
            className="mt-1 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            type="submit"
          >
            {isLoading ? "Sending…" : "Send enquiry"}
          </button>

          <p className="text-xs text-slate-500">
            Submitting sends an email to the agent via the site’s contact API.
          </p>
        </fieldset>
      </form>
    </div>
  );
}