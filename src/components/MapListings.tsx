"use client";

/**
 * MapListings displays the currently filtered properties on an interactive map.
 *
 * The map is created once when the component loads. Whenever the filtered
 * properties change, their markers are updated and the map moves to show them.
 * After that, the user can freely zoom and pan without changing the filters
 * or causing the map to reset itself.
 */

import { useEffect, useRef } from "react";
import maplibregl, { Map, StyleSpecification } from "maplibre-gl";
import type { Property } from "@/models/Property";
import { fmtGBP } from "@/lib/format";
import "maplibre-gl/dist/maplibre-gl.css";

function makePriceBadge(property: Property) {
  const el = document.createElement("div");

  el.style.padding = "4px 8px";
  el.style.borderRadius = "9999px";
  el.style.background = "#111827";
  el.style.color = "white";
  el.style.fontSize = "12px";
  el.style.fontWeight = "700";
  el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  el.style.transform = "translate(-50%, -50%)";
  el.style.whiteSpace = "nowrap";

  el.textContent = `${fmtGBP(property.price)}${
    property.listingType === "RENT" ? " pcm" : ""
  }`;

  return el;
}

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
  initialCenter = [-0.1276, 51.5072],
  initialZoom = 9,
}: {
  listings: Property[];
  initialCenter?: [number, number];
  initialZoom?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Create the map once when the component mounts
  useEffect(() => {
    if (!wrapRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: wrapRef.current,
      style: OSM_RASTER_STYLE,
      center: initialCenter,
      zoom: initialZoom,
      maxZoom: 19,
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [initialCenter, initialZoom]);

  // Update markers and frame the map whenever the filtered properties change
  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    // Remove the old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for the currently visible properties
    for (const property of listings) {
      const marker = new maplibregl.Marker({
        element: makePriceBadge(property),
        anchor: "center",
      })
        .setLngLat([property.lng, property.lat])
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        window.location.href = `/listing/${property.id}`;
      });

      markersRef.current.push(marker);
    }

    // No properties means there is nothing for the map to frame
    if (listings.length === 0) return;

    // If only one property matches, centre the map on that property
    if (listings.length === 1) {
      const property = listings[0];

      map.flyTo({
        center: [property.lng, property.lat],
        zoom: 14,
        duration: 500,
      });

      return;
    }

    // If multiple properties match, calculate bounds that contain all of them
    const bounds = new maplibregl.LngLatBounds();

    for (const property of listings) {
      bounds.extend([property.lng, property.lat]);
    }

    map.fitBounds(bounds, {
      padding: 50,
      duration: 500,
      maxZoom: 14,
    });
  }, [listings]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-[400px] md:h-[calc(100vh-180px)] rounded-md overflow-hidden border"
    />
  );
}