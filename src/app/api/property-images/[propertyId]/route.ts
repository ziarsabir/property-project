import { NextResponse } from "next/server";
import { propertyImagesContainer } from "@/lib/blobStorage";

/**
 * This API route returns all image URLs belonging to one property.
 *
 * Azure Blob Storage uses blob-name prefixes to group images.
 *
 * Example blobs:
 * 22466427/1.jpeg
 * 22466427/2.jpeg
 * 22466427/3.jpeg
 *
 * Request:
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

    // All images belonging to this property begin with this prefix
    // Example: "22466427/"
    const prefix = `${propertyId}/`;

    const imageFileNames: string[] = [];

    /**
     * Ask Azure Blob Storage for every blob whose name
     * begins with the property's prefix.
     *
     * Example results:
     * 22466427/1.jpeg
     * 22466427/2.jpeg
     * 22466427/3.jpeg
     */
    for await (const blob of propertyImagesContainer.listBlobsFlat({
      prefix,
    })) {
      // Remove "22466427/" from the blob name,
      // leaving just the image file name such as "1.jpeg"
      const fileName = blob.name.slice(prefix.length);

      if (fileName) {
        imageFileNames.push(fileName);
      }
    }

    /**
     * Sort numbered image files naturally.
     *
     * Without numeric sorting:
     * 1.jpeg, 10.jpeg, 2.jpeg
     *
     * With numeric sorting:
     * 1.jpeg, 2.jpeg, 10.jpeg
     */
    imageFileNames.sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
      })
    );

    // Turn each file name into a Homefinder API image URL
    const images = imageFileNames.map(
      (fileName) =>
        `/api/property-images/${propertyId}/${fileName}`
    );

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