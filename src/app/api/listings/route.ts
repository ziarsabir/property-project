import { NextResponse } from "next/server";
import { propertyDataContainer } from "@/lib/blobStorage";
import type { Listing } from "@/data/listings";
import * as XLSX from "xlsx";

/**
 * Represents one raw property row coming directly from
 * the Nest Excel spreadsheet stored in Azure Blob Storage.
 */
type NestListingRow = {
  UDPRN: number;
  UMRRN: number;
  DateFirstListed: number;
  ListingPrice: number;
  EventType: "ForSale" | "ForRent";
  StreetAddress: string;
  Town: string;
  PostCode: string;
  Latitude: number;
  Longitude: number;
  PropertySubType: string;
  Beds: number;
  Bathrooms: number;
  ImageUrl: string;
};

/**
 * Converts text such as "SUTTON" or "HAROLD ROAD"
 * into a nicer format for displaying in the UI.
 */
function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/**
 * Excel stores dates as serial numbers rather than
 * normal JavaScript date strings.
 *
 * This converts an Excel serial number into an ISO date string,
 * which matches the format expected by my Listing type.
 */
function excelSerialToIsoDate(serial: number) {
  const excelEpoch = Date.UTC(1899, 11, 30);

  const millisecondsPerDay =
    24 * 60 * 60 * 1000;

  return new Date(
    excelEpoch + serial * millisecondsPerDay
  ).toISOString();
}

export async function GET() {
  try {
    // Point to the Nest Excel file stored in Azure Blob Storage
    const blobClient =
      propertyDataContainer.getBlobClient("ZIAR - Sample.xlsx");

    // Download the Excel file into memory
    const buffer = await blobClient.downloadToBuffer();

    // Read the downloaded Excel workbook
    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    // Get the first worksheet in the workbook
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the Excel worksheet rows into raw Nest property objects
    const nestRows =
      XLSX.utils.sheet_to_json<NestListingRow>(worksheet);

    /**
     * Convert each raw Nest property row into the Listing shape
     * expected by the rest of my Homefinder application.
     */
    const listings: Listing[] = nestRows.map((row) => {
      // Nest calls this field Town, so Homefinder also stores it as town
      const town = toTitleCase(row.Town);

      // Format the property subtype so it can be used naturally in the title
      const propertyType =
        row.PropertySubType.toLowerCase();

      return {
        // Use the Nest UDPRN as Homefinder's unique property ID
        id: String(row.UDPRN),

        // Nest does not provide a ready-made title,
        // so create one from the property information
        title: `${row.Beds}-bed ${propertyType} in ${town}`,

        price: row.ListingPrice,

        // Convert Nest's terminology into Homefinder's listing type
        listingType:
          row.EventType === "ForRent"
            ? "RENT"
            : "SALE",

        beds: row.Beds,
        baths: row.Bathrooms,

        town,

        postcode: row.PostCode,

        // Format the address so it looks cleaner in the UI
        address: toTitleCase(
          row.StreetAddress.trim()
        ),

        lat: row.Latitude,
        lng: row.Longitude,

        /**
         * Load the property's first image through my own
         * Next.js API route, which securely retrieves the image
         * from my private Azure Blob Storage container.
         */
        photo:
          `/api/property-images/${row.UDPRN}/1.jpeg`,

        // Convert Nest's Excel date into the format Listing expects
        listedAt: excelSerialToIsoDate(
          row.DateFirstListed
        ),
      };
    });

    // Send the converted Nest listings to the frontend as JSON
    return NextResponse.json(listings, {
      status: 200,
    });
  } catch (error) {
    // Log the real server-side error for debugging
    console.error(
      "Could not load Nest property listings:",
      error
    );

    // Return an error response if the Nest data could not be loaded
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