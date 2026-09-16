import { CosmosClient } from "@azure/cosmos";

// I read the Cosmos DB connection details from server-side environment variables.
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE_ID;
const containerId = process.env.COSMOS_CONTAINER_ID;

if (!endpoint || !key || !databaseId || !containerId) {
  throw new Error("Missing Azure Cosmos DB environment variables");
}

// I create one Cosmos client that the server-side application can reuse.
const cosmosClient = new CosmosClient({
  endpoint,
  key,
});

// I reference the Homefinder database and users container created in Azure.
const database = cosmosClient.database(databaseId);
const usersContainer = database.container(containerId);

export { cosmosClient, database, usersContainer };