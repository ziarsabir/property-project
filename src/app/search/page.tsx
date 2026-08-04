"use client";

import { useMemo, useState, useEffect } from "react";
import ListingCard, { ListingCardSkeleton } from "@/components/ListingCard";
import SearchFilters, { type FilterState } from "@/components/SearchFilters";
import type { Listing } from "@/data/listings";
import { Property } from "@/models/Property";


function isAbortError(err: unknown) {
  if (err instanceof DOMException && err.name === "AbortError") return true;

  if (typeof err === "object" && err !== null && "name" in err) {
    return (err as { name?: unknown }).name === "AbortError";
  }

  return false;
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<FilterState>({});

  // Store Property objects rather than raw Listing objects
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the latest listings from the backend when the page first loads
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/listings", {
          cache: "no-store",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        const contentType = res.headers.get("content-type") ?? "";

        if (!res.ok || !contentType.includes("application/json")) {
          setProperties([]);
          return;
        }

        const data: unknown = await res.json();

        // Defensive programming - ensure the API returned an array
        if (!Array.isArray(data)) {
          setProperties([]);
          return;
        }

        const rawListings = data as Listing[];

        // Convert raw Listing objects into richer Property objects
        const propertyObjects = rawListings.map((listing) =>
          Property.fromListing(listing)
        );

        setProperties(propertyObjects);

        // Temporary check that the Property methods are available
        console.log(
          "First property is for sale:",
          propertyObjects[0]?.isForSale()
        );
      } catch (err: unknown) {
        if (isAbortError(err)) return;

        setProperties([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      const matchQ = q
        ? (
            property.city +
            " " +
            property.postcode +
            " " +
            property.title
          )
            .toLowerCase()
            .includes(q.toLowerCase())
      : true;

      const matchType = filters.listingType
        ? property.listingType === filters.listingType
        : true;

      const matchMin = filters.priceMin
        ? property.price >= filters.priceMin
        : true;

      const matchMax = filters.priceMax
        ? property.price <= filters.priceMax
        : true;

      const matchBeds = filters.beds
        ? property.beds >= filters.beds
        : true;

      const matchBaths = filters.baths
        ? property.baths >= filters.baths
        : true;

      return (
        matchQ &&
        matchType &&
        matchMin &&
        matchMax &&
        matchBeds &&
        matchBaths
      );
    });
  }, [properties, q, filters]);

 const visibleProperties = filtered;

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_520px]">
      <section className="space-y-3">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="City, postcode, keyword"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="text-xs text-slate-500">
          {loading
            ? "Loading..."
            : `Showing ${filtered.length} of ${properties.length}`}
        </div>

        <div className="grid gap-3">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))
          ) : visibleProperties.length ? (
            visibleProperties.map((property) => (
              <ListingCard
                key={property.id}
                l={property}
              />
            ))
          ) : (
            <div className="rounded-lg border bg-white p-6 text-sm text-slate-600">
              No results found. Try adjusting your filters.
            </div>
          )}
        </div>
      </section>

      <aside className="lg:sticky lg:top-6 h-fit">
        <div className="border rounded-lg bg-slate-50 overflow-hidden h-[520px] lg:h-[calc(100vh-140px)]">
         
        </div>
      </aside>
    </div>
  );
}