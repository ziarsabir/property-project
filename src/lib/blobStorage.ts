import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!connectionString) {
  throw new Error("Missing AZURE_STORAGE_CONNECTION_STRING");
}

if (!containerName) {
  throw new Error("Missing AZURE_STORAGE_CONTAINER_NAME");
}

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

export const propertyDataContainer =
  blobServiceClient.getContainerClient(containerName);