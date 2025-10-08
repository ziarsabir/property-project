"use client";

import { useEffect, useMemo, useRef } from "react";
import maplibregl, { Map, LngLatBoundsLike, StyleSpecification } from "maplibre-gl";
import type { Listing } from "@/data/listings";
import { fmtGBP } from "@/lib/format";
import "maplibre-gl/dist/maplibre-gl.css";

function makePriceBadge(listing: Listing) {
  const el = document.createElement("div");
  el.style.padding = "4px 8px";
  el.style.borderRadius = "9999px";
  el.style.background = "#111827"; // slate-900
  el.style.color = "white";
  el.style.fontSize = "12px";
  el.style.fontWeight = "700";
  el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  el.style.transform = "translate(-50%, -50%)";
  el.style.whiteSpace = "nowrap";
  el.textContent = `${fmtGBP(listing.price)}${listing.listingType === "RENT" ? " pcm" : ""}`;
  return el;
}

export type Bbox = { west: number; south: number; east: number; north: number };

// ✅ Properly typed OpenStreetMap raster style (no “any”)
const OSM_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export default function MapListings({
  listings,
  onMoveBbox,
  initialCenter = [-0.1276, 51.5072], // London
  initialZoom = 9,
}: {
  listings: Listing[];
  onMoveBbox?: (bbox: Bbox) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const programmaticMoveRef = useRef(false);
  const hasEmittedInitialRef = useRef(false);

  const boundsFromListings: LngLatBoundsLike | null = useMemo(() => {
    if (!listings?.length) return null;
    let west = 180,
      south = 90,
      east = -180,
      north = -90;
    for (const l of listings) {
      west = Math.min(west, l.lng);
      south = Math.min(south, l.lat);
      east = Math.max(east, l.lng);
      north = Math.max(north, l.lat);
    }
    if (west === east && south === north) {
      return [west - 0.01, south - 0.01, east + 0.01, north + 0.01];
    }
    return [west, south, east, north];
  }, [listings]);

  useEffect(() => {
    if (!wrapRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: wrapRef.current,
      style: OSM_RASTER_STYLE, // ✅ no “as any”
      center: initialCenter,
      zoom: initialZoom,
      maxZoom: 19,
    });
    mapRef.current = map;

    map.once("load", () => {
      if (!hasEmittedInitialRef.current) {
        const b = map.getBounds();
        onMoveBbox?.({
          west: b.getWest(),
          south: b.getSouth(),
          east: b.getEast(),
          north: b.getNorth(),
        });
        hasEmittedInitialRef.current = true;
      }
    });

    map.on("moveend", () => {
      if (programmaticMoveRef.current) {
        programmaticMoveRef.current = false;
        return;
      }
      const b = map.getBounds();
      onMoveBbox?.({
        west: b.getWest(),
        south: b.getSouth(),
        east: b.getEast(),
        north: b.getNorth(),
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [initialCenter, initialZoom, onMoveBbox]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !boundsFromListings) return;
    programmaticMoveRef.current = true;
    map.fitBounds(boundsFromListings, { padding: 40, duration: 300 });
  }, [boundsFromListings]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    for (const l of listings) {
      const marker = new maplibregl.Marker({ element: makePriceBadge(l), anchor: "center" })
        .setLngLat([l.lng, l.lat])
        .addTo(map);
      marker.getElement().addEventListener("click", () => {
        window.location.href = `/listing/${l.id}`;
      });
      markersRef.current.push(marker);
    }
  }, [listings]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-[400px] md:h-[calc(100vh-180px)] rounded-md overflow-hidden border"
    />
  );
}