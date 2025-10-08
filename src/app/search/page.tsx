"use client";

import { useMemo, useState } from "react";
import { listings as ALL } from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import MapListings, { type Bbox } from "@/components/MapListings";

function inBbox(lat: number, lng: number, bbox?: Bbox) {
  if (!bbox) return true;
  return lng >= bbox.west && lng <= bbox.east && lat >= bbox.south && lat <= bbox.north;
} 

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [bbox, setBbox] = useState<Bbox | undefined>(undefined);

  const filtered = useMemo(() => {
    return ALL.filter(l => {
      const matchQ = q
        ? (l.city + " " + l.postcode + " " + l.title).toLowerCase().includes(q.toLowerCase())
        : true;
      const matchMap = inBbox(l.lat, l.lng, bbox);
      return matchQ && matchMap;
    });
  }, [q, bbox]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[70vh]">
      <div className="space-y-3">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="City, postcode, keyword"
          value={q} onChange={e => setQ(e.target.value)}
        />
        <div className="text-xs text-slate-500">
          Showing {filtered.length} of {ALL.length}
        </div>
        <div className="grid gap-3">
          {filtered.map(l => <ListingCard key={l.id} l={l} />)}
        </div>
      </div>

      <aside className="border rounded-lg p-3 bg-slate-50">
        <MapListings listings={filtered.length ? filtered : ALL} onMoveBbox={setBbox} />
      </aside>
    </div>
  );
}
