/**
 * This file sets up the connection between my Homefinder backend
 * and Azure Blob Storage, and provides access to the container
 * where the Nest property data files are stored.
 */

import { BlobServiceClient } from "@azure/storage-blob";

// Read my Azure Blob Storage settings from environment variables
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

// Stop the app with a clear error if the Azure connection string is missing
if (!connectionString) {
  throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING");
}

// Stop the app with a clear error if the container name is missing
if (!containerName) {
  throw new Error("Missing AZURE_STORAGE_CONTAINER_NAME");
}

// Create a client that connects my backend to the Azure Storage Account
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

// Create a client for the specific container that stores my Nest property data
export const propertyDataContainer =
  blobServiceClient.getContainerClient(containerName);