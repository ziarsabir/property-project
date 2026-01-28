"use client";

import { useState } from "react"; 

export default function SavePropertyButton({ listingId }: { listingId: string }) {
    // Track a user-facing message (success or error)
    // message will hold a text like "Saved!"
    // null means "show nothing"
    const [message, setMessage] = useState<string | null>(null); 
    // track whether the API request is currently running (for disabling the button and changing text)
    const [loading, setLoading] = useState(false); 
  
    async function handleSave() {
        // Clear the previous message and start the loading state 
        setMessage(null); 
        setLoading(true); 
        // using TRY/FINALLY so loading always turns off even if something goes wrong
        try {
            const res = await fetch("/api/saved", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listingId }),
            });

            const data = await res.json();
            console.log("API response:", data);
            // If the API responded with a 2xx status, show success 
            // Show success OR error message based on the HTTP response status
            if (res.ok) {
                setMessage("Saved!"); 
            } else {
                // Otherwise show the error returned from the backend 
                setMessage(data?.error || "Something went wrong"); 
            }
            // Request finished (success or error) to stop the loading state
            // Always turn loading off, even if request fails 
        } finally { 
            setLoading(false); 
        }
  }

  ////click → fetch → backend responds → setState → UI updates

  return (
    <div>
        <button
        onClick={handleSave}
        disabled={loading}
        className={
            `rounded bg-slate-900 px-4 py-2 text-white 
            transition
            ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-800"}
            `
        }
        >
            {loading ? "Saving..." : "Save Property"}
        </button>
        {message && (
            <p className="mt-2 text-sm text-slate-700">
                {message}
            </p>
        )}
    </div>
  )
};
