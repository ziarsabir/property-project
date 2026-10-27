import { propertyImagesContainer } from "@/lib/blobStorage";

/**
 * Returns all image URLs belonging to one property.
 *
 * Azure stores the images using blob names such as:
 *
 * 22466427/1.jpeg
 * 22466427/2.jpeg
 * 22466427/3.jpeg
 */
export async function getPropertyImageUrls(
  propertyId: string
): Promise<string[]> {
  // All images belonging to this property begin with this prefix
  // Example: "22466427/"
  const prefix = `${propertyId}/`;

  const imageFileNames: string[] = [];

  /**
   * Ask Azure Blob Storage for every blob whose name
   * begins with the property's prefix.
   */
  for await (const blob of propertyImagesContainer.listBlobsFlat({
    prefix,
  })) {
    // Remove the property prefix from the full blob name.
    //
    // Example:
    // "22466427/3.jpeg"
    // becomes:
    // "3.jpeg"
    const fileName = blob.name.slice(prefix.length);

    if (fileName) {
      imageFileNames.push(fileName);
    }
  }

  /**
   * Sort the files naturally:
   *
   * 1.jpeg
   * 2.jpeg
   * 3.jpeg
   * ...
   * 10.jpeg
   *
   * rather than:
   *
   * 1.jpeg
   * 10.jpeg
   * 2.jpeg
   */
  imageFileNames.sort((a, b) =>
    a.localeCompare(b, undefined, {
      numeric: true,
    })
  );

  // Convert each filename into the URL used by Homefinder
  return imageFileNames.map(
    (fileName) =>
      `/api/property-images/${propertyId}/${fileName}`
  );
}