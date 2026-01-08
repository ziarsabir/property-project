import { NextResponse } from "next/server";
import { listings } from "@/data/listings";

export async function GET() {
  return NextResponse.json(listings, { status: 200 });
}