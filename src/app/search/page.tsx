"use client";

import { useMemo, useState, useEffect } from "react";
import ListingCard, { ListingCardSkeleton } from "@/components/ListingCard";
import MapListings, { type Bbox } from "@/components/MapListings";
import SearchFilters, { type FilterState } from "@/components/SearchFilters";
import type { Listing } from "@/data/listings";

function inBbox(lat: number, lng: number, bbox?: Bbox) {
  if (!bbox) return true;
  return (
    lng >= bbox.west &&
    lng <= bbox.east &&
    lat >= bbox.south &&
    lat <= bbox.north
  );
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [bbox, setBbox] = useState<Bbox | undefined>(undefined);
  const [filters, setFilters] = useState<FilterState>({});

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/listings", {
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        // If auth/middleware redirects this request, res.ok may still be true
        // but content-type will be HTML. Guard against that.
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok || !contentType.includes("application/json")) {
          setListings([]);
          return;
        }

        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        // Ignore abort errors on unmount
        if ((err as any)?.name === "AbortError") return;
        setListings([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchQ = q
        ? (l.city + " " + l.postcode + " " + l.title)
            .toLowerCase()
            .includes(q.toLowerCase())
        : true;

      const matchMap = inBbox(l.lat, l.lng, bbox);

      const matchType = filters.listingType
        ? l.listingType === filters.listingType
        : true;

      const matchMin = filters.priceMin ? l.price >= filters.priceMin : true;
      const matchMax = filters.priceMax ? l.price <= filters.priceMax : true;
      const matchBeds = filters.beds ? l.beds >= filters.beds : true;
      const matchBaths = filters.baths ? l.baths >= filters.baths : true;

      return (
        matchQ &&
        matchMap &&
        matchType &&
        matchMin &&
        matchMax &&
        matchBeds &&
        matchBaths
      );
    });
  }, [listings, q, bbox, filters]);

  const visibleList = filtered.length ? filtered : listings;

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_520px]">
      {/* LEFT */}
      <section className="space-y-3">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="City, postcode, keyword"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <SearchFilters filters={filters} onFiltersChange={setFilters} />

        <div className="text-xs text-slate-500">
          {loading
            ? "Loading..."
            : `Showing ${filtered.length} of ${listings.length}`}
        </div>

        <div className="grid gap-3">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))
          ) : visibleList.length ? (
            visibleList.map((l) => <ListingCard key={l.id} l={l} />)
          ) : (
            <div className="rounded-lg border bg-white p-6 text-sm text-slate-600">
              No results found. Try adjusting your filters.
            </div>
          )}
        </div>
      </section>

      {/* RIGHT */}
      <aside className="lg:sticky lg:top-6 h-fit">
        <div className="border rounded-lg bg-slate-50 overflow-hidden h-[520px] lg:h-[calc(100vh-140px)]">
          <MapListings listings={visibleList} onMoveBbox={setBbox} />
        </div>
      </aside>
    </div>
  );
}