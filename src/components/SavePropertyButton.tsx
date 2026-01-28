"use client";

import { useState } from "react"; 

export default function SavePropertyButton({ listingId }: { listingId: string }) {
    // Track a user-facing message (success or error)
    // message will hold a text like "Saved!"
    // null means "show nothing"
    const [message, setMessage] = useState<string | null>(null); 
  
    async function handleSave() {
    const res = await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });

    const data = await res.json();
    console.log("API response:", data);
    // If the API responded with a 2xx status, show success 
    if (res.ok) {
        setMessage("Saved!"); 
    } else {
        // Otherwise show the error returned from the backend 
        setMessage(data?.error || "Something went wrong"); 
    }
  }

  ////click → fetch → backend responds → setState → UI updates

  return (
    <div>
        <button
        onClick={handleSave}
        style={{
            padding: "10px 14px",
            background: "black",
            color: "white",
            borderRadius: 8,
        }}
        >
        Save Property
        </button>
        {message && <p>{message}</p>}
    </div>
  );
}