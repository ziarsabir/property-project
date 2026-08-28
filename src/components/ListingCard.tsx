// src/components/ListingCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/models/Property";
import { fmtGBP } from "@/lib/format";

type ListingCardProps = {
  l: Property;

  // Allow the same ListingCard component to have a normal or compact layout
  variant?: "default" | "compact";
};

export function ListingCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative w-full aspect-[4/3] bg-slate-200 animate-pulse" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-3 w-28 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
        <div className="pt-2">
          <div className="h-9 w-28 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </article>
  );
}

export default function ListingCard({
  l,
  variant = "default",
}: ListingCardProps) {
  const href = `/listing/${l.id}`;

  // The compact variant is used on pages where smaller property cards are more suitable
  const isCompact = variant === "compact";

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300"
      aria-label={`View details for ${l.title}`}
    >
      {/* IMAGE */}
      <div
        className={`relative w-full overflow-hidden bg-slate-200 ${
          isCompact ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        {l.photo ? (
          <Image
            src={l.photo}
            alt={l.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={
              isCompact
                ? "(max-width: 640px) 100vw, 300px"
                : "(max-width: 640px) 100vw, (max-width: 1200px) 60vw, 520px"
            }
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-600">
            No image available
          </div>
        )}

        {/* PRICE BADGE (always visible) */}
        <div
          className={
            isCompact
              ? "absolute left-2 top-2 z-10"
              : "absolute left-3 top-3 z-10"
          }
        >
          <span
            className={`inline-flex items-center rounded-full bg-white/95 font-semibold text-slate-900 shadow ${
              isCompact
                ? "px-2.5 py-1 text-xs"
                : "px-3 py-1 text-sm"
            }`}
          >
            {fmtGBP(l.price)}
            {l.listingType === "RENT" ? " pcm" : ""}
          </span>
        </div>

        {/* HOVER OVERLAY (desktop) */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="absolute inset-0 bg-black/35" />

          <div
            className={`absolute flex items-center justify-between gap-2 ${
              isCompact
                ? "inset-x-2 bottom-2"
                : "inset-x-3 bottom-3"
            }`}
          >
            <span
              className={`inline-flex items-center rounded-lg bg-white/95 font-semibold text-slate-900 shadow ${
                isCompact
                  ? "px-2 py-1.5 text-xs"
                  : "px-3 py-2 text-sm"
              }`}
            >
              {fmtGBP(l.price)}
              {l.listingType === "RENT" ? " pcm" : ""}
            </span>

            <span
              className={`inline-flex items-center gap-2 rounded-lg bg-slate-900 font-semibold text-white shadow-sm ${
                isCompact
                  ? "px-3 py-1.5 text-xs"
                  : "px-4 py-2 text-sm"
              }`}
            >
              View details <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT (tighter mobile spacing) */}
      <div className={isCompact ? "p-3" : "p-3 sm:p-4"}>
        <p
          className={
            isCompact
              ? "text-[11px] text-slate-600"
              : "text-[11px] sm:text-xs text-slate-600"
          }
        >
          {l.city} • {l.postcode}
        </p>

        <h3
          className={
            isCompact
              ? "mt-1 line-clamp-1 text-sm font-semibold text-slate-900"
              : "mt-1 line-clamp-1 text-sm sm:text-base font-semibold text-slate-900"
          }
        >
          {l.title}
        </h3>

        <p
          className={
            isCompact
              ? "mt-1 line-clamp-1 text-[11px] text-slate-600"
              : "mt-1 line-clamp-1 text-[11px] sm:text-xs text-slate-600"
          }
        >
          {l.address}
        </p>

        <p
          className={
            isCompact
              ? "mt-2 text-[11px] text-slate-700"
              : "mt-2 text-[11px] sm:text-xs text-slate-700"
          }
        >
          {l.beds} bed • {l.baths} bath •{" "}
          <span className="font-medium">{l.listingType}</span>
        </p>

        {/* MOBILE CTA (since hover doesn’t exist) */}
        <div className="mt-3 sm:hidden">
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
            View details <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}