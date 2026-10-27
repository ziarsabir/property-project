import { NextResponse } from "next/server";
import { getPropertyImageUrls } from "@/lib/propertyImages";

/**
 * Returns all image URLs belonging to one property.
 *
 * Example:
 * /api/property-images/22466427
 */
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      propertyId: string;
    }>;
  }
) {
  try {
    // Get the property ID from the dynamic URL
    const { propertyId } = await params;

    // Use the reusable helper to get all image URLs
    const images =
      await getPropertyImageUrls(propertyId);

    return NextResponse.json(images, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "Could not load property image list:",
      error
    );

    return NextResponse.json(
      {
        message: "Could not load property images",
      },
      {
        status: 500,
      }
    );
  }
}