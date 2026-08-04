// src/components/ListingCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/models/Property";
import { fmtGBP } from "@/lib/format";

type ListingCardProps = {
  l: Property;
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

export default function ListingCard({ l }: ListingCardProps) {
  const href = `/listing/${l.id}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300"
      aria-label={`View details for ${l.title}`}
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-200">
        {l.photo ? (
          <Image
            src={l.photo}
            alt={l.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 60vw, 520px"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-600">
            No image available
          </div>
        )}

        {/* PRICE BADGE (always visible) */}
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-slate-900 shadow">
            {fmtGBP(l.price)}
            {l.listingType === "RENT" ? " pcm" : ""}
          </span>
        </div>

        {/* HOVER OVERLAY (desktop) */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-lg bg-white/95 px-3 py-2 text-sm font-semibold text-slate-900 shadow">
              {fmtGBP(l.price)}
              {l.listingType === "RENT" ? " pcm" : ""}
            </span>

            <span className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              View details <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT (tighter mobile spacing) */}
      <div className="p-3 sm:p-4">
        <p className="text-[11px] sm:text-xs text-slate-600">
          {l.city} • {l.postcode}
        </p>

        <h3 className="mt-1 line-clamp-1 text-sm sm:text-base font-semibold text-slate-900">
          {l.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11px] sm:text-xs text-slate-600">
          {l.address}
        </p>

        <p className="mt-2 text-[11px] sm:text-xs text-slate-700">
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