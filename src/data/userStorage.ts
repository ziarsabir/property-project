// Both functions coming from Node's promise-based file-system API 
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { User, type AuthProvider } from "@/models/User";

/**
 * This file is responsible for persisting and retrieving user data.
 *
 * The User class defines what a User is and the behaviour a User has,
 * while this file is responsible for reading and writing that user data
 * to storage.
 *
 * For now, users are stored in a local JSON file.
 * Later, this storage layer can be replaced with a real database.
 */

// Represents the shape of a user as it exists in storage.
// Unlike the User domain object, this contains data only and has no User methods.
// createdAt is stored as a string because JSON cannot preserve a JavaScript Date object.
type StoredUser = {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  passwordHash?: string;
  savedPropertyIds: string[];
  createdAt: string;
};


// Build the absolute path to the users.json file
const usersFilePath = path.join(process.cwd(), "src", "data", "users.json");

// Convert a User domain object into a plain StoredUser record
// that can later be serialized and saved to users.json.
function toStoredUser(user: User): StoredUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    authProvider: user.authProvider,
    passwordHash: user.passwordHash,
    savedPropertyIds: user.savedPropertyIds,

    // Convert the JavaScript Date object into a string that can be stored as JSON
    createdAt: user.createdAt.toISOString(),
  };
}

// Convert a plain StoredUser record back into a real User domain object
// so the application can use the data and behaviour defined by the User class.
function toUser(storedUser: StoredUser): User {
  return new User({
    id: storedUser.id,
    name: storedUser.name,
    email: storedUser.email,
    authProvider: storedUser.authProvider,
    passwordHash: storedUser.passwordHash,
    savedPropertyIds: storedUser.savedPropertyIds,

    // Convert the stored date string back into a JavaScript Date object
    createdAt: new Date(storedUser.createdAt),
  });
}

// Read the persisted users from users.json
// This function is asynchronous because readFile() returns a Promise.
// async allows us to use await to wait for the file-reading operation to complete. In the meantime Node can continue handling other work. 
// Promise<StoredUser[]> means this async function eventually returns an array of stored user records
export async function readUsers(): Promise<StoredUser[]> {
  // Read the contents of users.json as JSON-formatted text 
  const fileContents = await readFile(usersFilePath, "utf-8");

  // Convert the JSON text into JavaScript data - deserialization 
  // Tell TypeScript that the parsed data should have the shape of an array of stored user records
  const users = JSON.parse(fileContents) as StoredUser[]; 

  return users;
}

// Persist an array of user records to users.json
// Promise<void> means this async function eventually finishes without returning a value
export async function writeUsers(users: StoredUser[]): Promise<void> {
  // Convert the JavaScript user data into JSON-formatted text - serialization
  // null, 2 makes the resulting JSON nicely formatted and indented 
  const json = JSON.stringify(users, null, 2);

  // Write the serialized JSON data to users.json
  await writeFile(usersFilePath, json, "utf-8");
}

// Save a User domain object to persistent storage
export async function saveUser(user: User): Promise<void> {
  // Read the users that are already stored in users.json
  const users = await readUsers();

  // Convert the User domain object into a plain record that can be stored
  const storedUser = toStoredUser(user);

  // Add the new stored user record to the existing users array
  users.push(storedUser);

  // Persist the updated users array back to users.json
  await writeUsers(users);
}

// Update an existing User in persistent storage
export async function updateUser(user: User): Promise<void> {
  // Read the user records that are currently stored in users.json
  const users = await readUsers();

  // Find the position of the stored user with the same ID
  const userIndex = users.findIndex(
    (storedUser) => storedUser.id === user.id
  );

  // Prevent an update if the user does not already exist in storage
  if (userIndex === -1) {
    throw new Error(`User with ID ${user.id} was not found.`);
  }

  // Convert the updated User domain object into a plain StoredUser record
  const updatedStoredUser = toStoredUser(user);

  // Replace the old stored user record with the updated version
  users[userIndex] = updatedStoredUser;

  // Persist the updated users array back to users.json
  await writeUsers(users);
}

// Load the persisted user records and reconstruct them as User domain objects
export async function loadUsers(): Promise<User[]> {
  // Read and deserialize the stored user records from users.json
  const storedUsers = await readUsers();

  // Convert every StoredUser record into a real User domain object
  const users = storedUsers.map((storedUser) => toUser(storedUser));

  return users;
}