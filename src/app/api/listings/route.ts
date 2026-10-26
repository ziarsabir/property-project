import { NextResponse } from "next/server";
import { getPropertyListings } from "@/lib/propertyListings";

export async function GET() {
  try {
    // Load the real Nest property listings from Azure Blob Storage
    const listings = await getPropertyListings();

    // Return the listings to the frontend
    return NextResponse.json(listings, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "Could not load Nest property listings:",
      error
    );

    return NextResponse.json(
      {
        message: "Could not load property listings",
      },
      {
        status: 500,
      }
    );
  }
}