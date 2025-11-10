"use client";

import { useState } from "react";

export type FilterState = {
  priceMin?: number;
  priceMax?: number;
  beds?: number;
  baths?: number;
  listingType?: "SALE" | "RENT" | "";
};

type SearchFiltersProps = {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
};

export default function SearchFilters({
  filters,
  onFiltersChange,
}: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Type-safe helper to update a single key in the filter state
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-3">
      {/* Toggle button: opens/closes the filter panel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 border rounded text-left hover:bg-slate-50"
      >
        <span>Filters</span>
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="border rounded-lg p-4 bg-white space-y-4">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Property Type
            </label>
            <select
              value={filters.listingType || ""}
              onChange={(e) =>
                updateFilter(
                  "listingType",
                  e.target.value ? (e.target.value as "SALE" | "RENT" | "") : ""
                )
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All</option>
              <option value="SALE">For Sale</option>
              <option value="RENT">To Rent</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Price Range (£)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min price"
                value={filters.priceMin ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "priceMin",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Max price"
                value={filters.priceMax ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "priceMax",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Bedrooms
            </label>
            <select
              value={filters.beds ?? ""}
              onChange={(e) =>
                updateFilter(
                  "beds",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Bathrooms
            </label>
            <select
              value={filters.baths ?? ""}
              onChange={(e) =>
                updateFilter(
                  "baths",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => onFiltersChange({})}
            className="w-full px-3 py-2 border rounded text-slate-600 hover:bg-slate-50"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}