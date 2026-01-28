"use client";

import { useState } from "react"; 

export default function SavePropertyButton({ listingId }: { listingId: string }) {

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
    setMessage("Saved!"); 
  }

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