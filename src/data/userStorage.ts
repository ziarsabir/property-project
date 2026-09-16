import { usersContainer } from "@/lib/cosmos";
import { User, type AuthProvider } from "@/models/User";

/**
 * This file is responsible for persisting and retrieving user data.
 *
 * The User class defines what a User is and the behaviour a User has,
 * while this file is responsible for reading and writing that user data
 * to storage.
 *
 * Users are now stored in the Azure Cosmos DB users container.
 */

// Represents the shape of a user as it exists in storage.
// Unlike the User domain object, this contains data only and has no User methods.
// createdAt is stored as a string because the database stores plain data rather than a JavaScript Date object.
type StoredUser = {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  passwordHash?: string;
  savedPropertyIds: string[];
  createdAt: string;
};

// Describes the information needed to find or create an application user
type GetOrCreateUserInput = {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  passwordHash?: string;
};

// Convert a User domain object into a plain StoredUser record
// that can later be saved to Cosmos DB.
function toStoredUser(user: User): StoredUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    authProvider: user.authProvider,
    passwordHash: user.passwordHash,
    savedPropertyIds: user.savedPropertyIds,

    // Convert the JavaScript Date object into a string that can be stored as plain data
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

// Read the persisted users from the Cosmos DB users container
// This function is asynchronous because querying Cosmos DB returns a Promise.
// async allows me to use await to wait for the database operation to complete. In the meantime Node can continue handling other work.
// Promise<StoredUser[]> means this async function eventually returns an array of stored user records
export async function readUsers(): Promise<StoredUser[]> {
  // Query all user records currently stored in the users container
  const { resources: users } = await usersContainer.items
    .query<StoredUser>({
      query: "SELECT * FROM c",
    })
    .fetchAll();

  return users;
}

// Persist an array of user records to the Cosmos DB users container
// Promise<void> means this async function eventually finishes without returning a value
export async function writeUsers(users: StoredUser[]): Promise<void> {
  // Upsert each user record into Cosmos DB.
  // Upsert creates the record if it does not exist or replaces it if it already exists.
  await Promise.all(
    users.map((user) => usersContainer.items.upsert(user))
  );
}

// Save a User domain object to persistent storage
export async function saveUser(user: User): Promise<void> {
  // Read the users that are already stored in Cosmos DB
  const users = await readUsers();

  // Convert the User domain object into a plain record that can be stored
  const storedUser = toStoredUser(user);

  // Add the new stored user record to the existing users array
  users.push(storedUser);

  // Persist the updated users array back to Cosmos DB
  await writeUsers(users);
}

// Update an existing User in persistent storage
export async function updateUser(user: User): Promise<void> {
  // Read the user records that are currently stored in Cosmos DB
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

  // Persist the updated users array back to Cosmos DB
  await writeUsers(users);
}

// Load the persisted user records and reconstruct them as User domain objects
export async function loadUsers(): Promise<User[]> {
  // Read the stored user records from Cosmos DB
  const storedUsers = await readUsers();

  // Convert every StoredUser record into a real User domain object
  const users = storedUsers.map((storedUser) => toUser(storedUser));

  return users;
}

// Find a persisted user by their email address
export async function findUserByEmail(email: string): Promise<User | undefined> {
  // Load the persisted user records as User domain objects
  const users = await loadUsers();

  // Return the User whose email matches the supplied email address
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

// Find an existing persisted user or create and save a new one
export async function getOrCreateUser({
  id,
  name,
  email,
  authProvider,
  passwordHash,
}: GetOrCreateUserInput): Promise<User> {
  // Check whether this authenticated user already exists in storage
  const existingUser = await findUserByEmail(email);

  // If the user already exists, return their existing User domain object
  if (existingUser) {
    return existingUser;
  }

  // Otherwise create a new User domain object for this authenticated user
  const newUser = new User({
    id,
    name,
    email,
    authProvider,
    passwordHash,
  });

  // Persist the new user's data to Cosmos DB
  await saveUser(newUser);

  return newUser;
}