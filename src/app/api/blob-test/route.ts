import { NextResponse } from "next/server";
import { propertyDataContainer } from "@/lib/blobStorage";
import * as XLSX from "xlsx";

// This API route tests whether my Homefinder backend can download
// and read the Nest Excel file stored inside Azure Blob Storage.

export async function GET() {
  try {
    // Point to the specific Nest Excel blob inside the container
    const blobClient =
      propertyDataContainer.getBlobClient("ZIAR - Sample.xlsx");

    // Download the Excel file from Azure into memory
    const buffer = await blobClient.downloadToBuffer();

    // Read the downloaded Excel file
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // Get the first worksheet in the Excel file
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the worksheet rows into JavaScript objects
    const rows = XLSX.utils.sheet_to_json(worksheet);

    return NextResponse.json({
      success: true,
      rowCount: rows.length,
      rows,
    });
  } catch (error) {
    console.error("Blob Storage Excel read failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not read the Nest Excel file",
      },
      { status: 500 }
    );
  }
}