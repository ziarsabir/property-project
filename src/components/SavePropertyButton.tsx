"use client";

import { useState } from "react";

export default function SavePropertyButton({
  listingId,
}: {
  listingId: string;
}) {
  // Track whether the save request is currently running.
  // This lets us disable the button and show "Saving...".
  const [loading, setLoading] = useState(false);

  // Track whether the property has been successfully saved.
  // When true, the button text changes to "Saved!".
  const [saved, setSaved] = useState(false);

  // Track any error message returned by the backend.
  // null means there is currently no error to display.
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    // Clear any previous error before starting a new request.
    setError(null);

    // Start the loading state.
    setLoading(true);

    try {
      // Send this property's Nest listing ID to the saved-properties API.
      const res = await fetch("/api/saved-properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
        }),
      });

      // Read the JSON response returned by the backend.
      const data = await res.json();

      console.log("API response:", data);

      if (res.ok) {
        // The property was successfully saved.
        // Updating this state causes the button to re-render as "Saved!".
        setSaved(true);
      } else {
        // If the backend returned an error,
        // show its message underneath the button.
        setError(
          data?.error || "Something went wrong"
        );
      }
    } catch {
      // Handle failures such as network errors.
      setError(
        "Unable to save this property. Please try again."
      );
    } finally {
      // Always stop the loading state,
      // whether the request succeeded or failed.
      setLoading(false);
    }
  }

  // Flow:
  // click
  // → handleSave()
  // → POST /api/saved-properties
  // → backend responds
  // → update saved/error state
  // → React re-renders the UI

  return (
    <div>
      <button
        type="button"
        onClick={handleSave}
        // Prevent another click while saving,
        // or after the property has already been saved.
        disabled={loading || saved}
        className={`
          rounded bg-slate-900 px-4 py-2 text-white
          transition
          ${
            loading || saved
              ? "cursor-not-allowed opacity-70"
              : "hover:bg-slate-800"
          }
        `}
      >
        {loading
          ? "Saving..."
          : saved
            ? "Saved!"
            : "Save Property"}
      </button>

      {/* Only display something underneath if an actual error occurs */}
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}