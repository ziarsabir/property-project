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



// Save a User domain object to persistent storage
export async function saveUser(user: User): Promise<void> {
  // Convert the User domain object into a plain record that can be stored
  const storedUser = toStoredUser(user);

  // Create the user if they do not exist, or replace them if they already exist
  await usersContainer.items.upsert(storedUser);
}

// Update an existing User in persistent storage
export async function updateUser(user: User): Promise<void> {
  // Convert the updated User domain object into a plain StoredUser record
  const updatedStoredUser = toStoredUser(user);

  // Find the specific user item using its ID and partition key, then replace it
  await usersContainer
    .item(user.id, user.id)
    .replace(updatedStoredUser);
}

// Find a persisted user by their email address
export async function findUserByEmail(email: string): Promise<User | undefined> {
  // Ask Cosmos DB to return the user whose email matches the supplied email address
  const { resources: users } = await usersContainer.items
    .query<StoredUser>({
      query: "SELECT * FROM c WHERE LOWER(c.email) = @email",
      parameters: [
        {
          name: "@email",
          value: email.toLowerCase(),
        },
      ],
    })
    .fetchAll();

  // If a matching stored user exists, reconstruct it as a User domain object
  const storedUser = users[0];

  return storedUser ? toUser(storedUser) : undefined;
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