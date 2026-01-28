"use client";

export default function SavePropertyButton({ listingId }: { listingId: string }) {
  
    async function handleSave() {
    const res = await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });

    const data = await res.json();
    console.log("API response:", data);
  }

  return (
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
  );
}