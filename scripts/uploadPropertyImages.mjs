import { BlobServiceClient } from "@azure/storage-blob";
import * as XLSX from "xlsx";

/**
 * One-off script for importing all Nest property images
 * into my private Azure Blob Storage property-images container.
 *
 * The Nest Excel file contains a comma-separated ImageUrl field.
 *
 * Images are stored in Azure using this structure:
 *
 * 22466427/1.jpeg
 * 22466427/2.jpeg
 * 22466427/3.jpeg
 * etc.
 */

// Read the Azure settings from environment variables
const connectionString =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

const propertyDataContainerName =
  process.env.AZURE_STORAGE_CONTAINER_NAME;

const propertyImagesContainerName =
  process.env.AZURE_STORAGE_IMAGE_CONTAINER_NAME;

// Make sure all required Azure environment variables exist
if (!connectionString) {
  throw new Error(
    "Missing AZURE_STORAGE_CONNECTION_STRING"
  );
}

if (!propertyDataContainerName) {
  throw new Error(
    "Missing AZURE_STORAGE_CONTAINER_NAME"
  );
}

if (!propertyImagesContainerName) {
  throw new Error(
    "Missing AZURE_STORAGE_IMAGE_CONTAINER_NAME"
  );
}

// Connect to the Azure Storage Account
const blobServiceClient =
  BlobServiceClient.fromConnectionString(
    connectionString
  );

// Connect to the container holding the Nest Excel file
const propertyDataContainer =
  blobServiceClient.getContainerClient(
    propertyDataContainerName
  );

// Connect to the container where property images will be stored
const propertyImagesContainer =
  blobServiceClient.getContainerClient(
    propertyImagesContainerName
  );

/**
 * Download the Nest Excel spreadsheet from Azure.
 */
const excelBlobClient =
  propertyDataContainer.getBlobClient(
    "ZIAR - Sample.xlsx"
  );

console.log("Downloading Nest Excel file...");

const excelBuffer =
  await excelBlobClient.downloadToBuffer();

/**
 * Read the spreadsheet.
 */
const workbook = XLSX.read(excelBuffer, {
  type: "buffer",
});

const firstSheetName = workbook.SheetNames[0];
const worksheet =
  workbook.Sheets[firstSheetName];

const rows =
  XLSX.utils.sheet_to_json(worksheet);

console.log(
  `Found ${rows.length} property listings.\n`
);

// Keep track of what happened
let uploaded = 0;
let skipped = 0;
let failed = 0;

/**
 * Process every property in the spreadsheet.
 */
for (const row of rows) {
  const propertyId = String(row.UDPRN);

  /**
   * ImageUrl contains multiple URLs separated by commas.
   *
   * Convert:
   *
   * "url1, url2, url3"
   *
   * into:
   *
   * ["url1", "url2", "url3"]
   */
  const imageUrls = String(
    row.ImageUrl ?? ""
  )
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  console.log(
    `Property ${propertyId}: ${imageUrls.length} images`
  );

  /**
   * Download and upload every image belonging
   * to this property.
   */
  for (
    let index = 0;
    index < imageUrls.length;
    index++
  ) {
    const imageUrl = imageUrls[index];

    // Image numbering starts at 1 rather than 0
    const imageNumber = index + 1;

    const blobName =
      `${propertyId}/${imageNumber}.jpeg`;

    const blockBlobClient =
      propertyImagesContainer.getBlockBlobClient(
        blobName
      );

    try {
      /**
       * Don't upload an image again if it already
       * exists in Azure.
       *
       * This means the manually uploaded
       * 22466427/1.jpeg will simply be skipped.
       */
      const alreadyExists =
        await blockBlobClient.exists();

      if (alreadyExists) {
        console.log(
          `  SKIP ${blobName} - already exists`
        );

        skipped++;
        continue;
      }

      console.log(
        `  Downloading image ${imageNumber}...`
      );

      // Download the original Nest property image
      const response = await fetch(imageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "image/*,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Image download failed: ${response.status} ${response.statusText}`
        );
      }

      // Convert the downloaded image into a Node Buffer
      const arrayBuffer =
        await response.arrayBuffer();

      const imageBuffer =
        Buffer.from(arrayBuffer);

      // Preserve the image Content-Type where possible
      const contentType =
        response.headers.get("content-type") ||
        "image/jpeg";

      console.log(
        `  Uploading ${blobName}...`
      );

      // Upload the image into the private Azure container
      await blockBlobClient.uploadData(
        imageBuffer,
        {
          blobHTTPHeaders: {
            blobContentType: contentType,
          },
        }
      );

      console.log(
        `  ✓ Uploaded ${blobName}`
      );

      uploaded++;
    } catch (error) {
      console.error(
        `  ✗ Failed ${blobName}:`,
        error instanceof Error
          ? error.message
          : error
      );

      failed++;
    }
  }

  console.log("");
}

/**
 * Print a summary when the import has finished.
 */
console.log("Property image import complete.");
console.log(`Uploaded: ${uploaded}`);
console.log(`Skipped:  ${skipped}`);
console.log(`Failed:   ${failed}`);