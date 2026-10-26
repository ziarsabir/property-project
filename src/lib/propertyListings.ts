import { propertyDataContainer } from "@/lib/blobStorage";
import type { Listing } from "@/data/listings";
import * as XLSX from "xlsx";

/**
 * Represents one raw property row from the
 * Nest Excel spreadsheet stored in Azure Blob Storage.
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
 * Converts text such as "SUTTON" into "Sutton".
 */
function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/**
 * Converts an Excel serial date into an ISO date string.
 */
function excelSerialToIsoDate(serial: number) {
  const excelEpoch = Date.UTC(1899, 11, 30);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return new Date(
    excelEpoch + serial * millisecondsPerDay
  ).toISOString();
}

/**
 * Loads all Nest property listings from the Excel file
 * stored in Azure Blob Storage.
 */
export async function getPropertyListings(): Promise<Listing[]> {
  // Get the Nest Excel file from Azure
  const blobClient =
    propertyDataContainer.getBlobClient("ZIAR - Sample.xlsx");

  // Download the spreadsheet into memory
  const buffer = await blobClient.downloadToBuffer();

  // Read the Excel workbook
  const workbook = XLSX.read(buffer, {
    type: "buffer",
  });

  // Get the first worksheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert the worksheet into raw Nest property objects
  const nestRows =
    XLSX.utils.sheet_to_json<NestListingRow>(worksheet);

  // Convert each Nest row into the Listing shape used by Homefinder
  return nestRows.map((row) => {
    const town = toTitleCase(row.Town);

    const propertyType =
      row.PropertySubType.toLowerCase();

    return {
      id: String(row.UDPRN),

      title: `${row.Beds}-bed ${propertyType} in ${town}`,

      price: row.ListingPrice,

      listingType:
        row.EventType === "ForRent"
          ? "RENT"
          : "SALE",

      beds: row.Beds,
      baths: row.Bathrooms,

      town,
      postcode: row.PostCode,

      address: toTitleCase(
        row.StreetAddress.trim()
      ),

      lat: row.Latitude,
      lng: row.Longitude,

      // The search card uses the first Azure image
      photo:
        `/api/property-images/${row.UDPRN}/1.jpeg`,

      listedAt: excelSerialToIsoDate(
        row.DateFirstListed
      ),
    };
  });
}

/**
 * Finds one property using its Nest UDPRN.
 */
export async function getPropertyListingById(
  id: string
): Promise<Listing | undefined> {
  const listings = await getPropertyListings();

  return listings.find(
    (listing) => listing.id === id
  );
}