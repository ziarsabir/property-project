"use client";

import Image from "next/image";
import { useState } from "react";

type PropertyImageGalleryProps = {
  images: string[];
  title: string;
};

export default function PropertyImageGallery({
  images,
  title,
}: PropertyImageGalleryProps) {
  // Store the position of the currently selected image
  // in the images array.
  //
  // 0 = first image
  // 1 = second image
  // 2 = third image, etc.
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get the actual image URL using the selected array index
  const selectedImage = images[selectedIndex];

  // If this property has no images, show a fallback message
  if (!selectedImage) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-600">
        No images available
      </div>
    );
  }

  // Move to the previous image.
  // If the user is already on the first image,
  // wrap around to the final image.
  function showPreviousImage() {
    setSelectedIndex((currentIndex) =>
      currentIndex === 0
        ? images.length - 1
        : currentIndex - 1
    );
  }

  // Move to the next image.
  // If the user is already on the final image,
  // wrap around to the first image.
  function showNextImage() {
    setSelectedIndex((currentIndex) =>
      currentIndex === images.length - 1
        ? 0
        : currentIndex + 1
    );
  }

  return (
    <div>
      {/* Main selected property image */}
      <div className="relative h-80 w-full overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={selectedImage}
          alt={`${title} image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {/* Previous image arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={showPreviousImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl font-bold shadow hover:bg-white"
            aria-label="View previous property image"
          >
            ←
          </button>
        )}

        {/* Next image arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={showNextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-xl font-bold shadow hover:bg-white"
            aria-label="View next property image"
          >
            →
          </button>
        )}

        {/* Shows where the user currently is in the gallery */}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail images */}
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((imageUrl, index) => (
          <button
            key={imageUrl}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border bg-slate-100 ${
              selectedIndex === index
                ? "ring-2 ring-slate-900"
                : ""
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={imageUrl}
              alt={`${title} image ${index + 1}`}
              fill
              className="object-cover"
              sizes="112px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}