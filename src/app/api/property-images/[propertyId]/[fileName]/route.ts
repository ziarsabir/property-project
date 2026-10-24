import { propertyImagesContainer } from "@/lib/blobStorage";

/**
 * This API route returns a property image from my private Azure Blob Storage container.
 *
 * The property ID and image file name come from the URL, which means
 * the same route can be used to load images belonging to different properties.
 *
 * Example:
 * /api/property-images/22466427/1.jpeg
 */

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      propertyId: string;
      fileName: string;
    }>;
  }
) {
  try {
    // Get the dynamic property ID and image file name from the URL
    const { propertyId, fileName } = await params;

    // Build the full blob name used inside Azure Blob Storage
    // Example: "22466427/1.jpeg"
    const blobName = `${propertyId}/${fileName}`;

    // Create a BlobClient for this specific property image
    const blobClient =
      propertyImagesContainer.getBlobClient(blobName);

    // Ask Azure for information about the image,
    // including its Content-Type
    const properties = await blobClient.getProperties();

    // Download the actual image file into memory
    const imageBuffer = await blobClient.downloadToBuffer();

    // Convert the Node.js Buffer into a Uint8Array,
    // which can safely be passed to the standard Response API
    const imageBytes = new Uint8Array(imageBuffer);

    // Return the image bytes to the browser
    return new Response(imageBytes, {
      headers: {
        "Content-Type":
          properties.contentType || "application/octet-stream",
      },
    });
  } catch (error) {
    // Log the real server-side error for debugging
    console.error("Property image download failed:", error);

    // Return an error response if Azure could not provide the image
    return new Response("Property image could not be loaded", {
      status: 500,
    });
  }
}