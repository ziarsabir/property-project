import { propertyImagesContainer } from "@/lib/blobStorage";

/**
 * This API route tests whether my Homefinder backend can
 * download and return a property image from Azure Blob Storage.
 */

export async function GET() {
  try {
    // Create a BlobClient for the specific property image
    const blobClient =
      propertyImagesContainer.getBlobClient("22466427/1.jpeg");

    // Download the actual image file from Azure Blob Storage into memory
    const imageBuffer = await blobClient.downloadToBuffer();

    // Return the image bytes to the browser
    // Content-Type tells the browser that this response is a JPEG image
    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (error) {
    // Log the real error on the server for debugging
    console.error("Property image download failed:", error);

    // Return a simple error response if the image could not be loaded
    return new Response("Could not load property image", {
      status: 500,
    });
  }
}