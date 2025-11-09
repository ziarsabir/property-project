"use client";

import { useMemo, useState, useEffect } from "react";
import ListingCard from "@/components/ListingCard";
import MapListings, { type Bbox } from "@/components/MapListings";
import SearchFilters, { type FilterState } from "@/components/SearchFilters";
import type { Listing } from "@/types/listing"; // <-- create this shared type

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

  // filters from SearchFilters component
  const [filters, setFilters] = useState<FilterState>({});

  // listings from API
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => setListings(data))
      .finally(() => setLoading(false));
  }, []);

  // apply search text, bbox, and filters
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

      const matchMin = filters.priceMin
        ? l.price >= filters.priceMin
        : true;

      const matchMax = filters.priceMax
        ? l.price <= filters.priceMax
        : true;

      const matchBeds = filters.beds
        ? l.beds >= filters.beds
        : true;

      const matchBaths = filters.baths
        ? l.baths >= filters.baths
        : true;

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[70vh]">
      {/* LEFT SIDE: search + filters + results list */}
      <div className="space-y-3">
        {/* free text search box */}
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="City, postcode, keyword"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        {/* filters drawer */}
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* count */}
        <div className="text-xs text-slate-500">
          {loading
            ? "Loading..."
            : `Showing ${filtered.length} of ${listings.length}`}
        </div>

        {/* cards */}
        <div className="grid gap-3">
          {visibleList.map((l) => (
            <ListingCard key={l.id} l={l} />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: map */}
      <aside className="border rounded-lg p-3 bg-slate-50">
        <MapListings
          listings={visibleList}
          onMoveBbox={setBbox}
        />
      </aside>
    </div>
  );
}
