// POST /api/saved - practice route (echoes listingId + validates input)

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { listingId } = body || {};

  if (!listingId) {
    return NextResponse.json(
      { ok: false, error: "listingId is required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { ok: true, received: { listingId } },
    { status: 200 }
  );
}