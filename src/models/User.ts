/**
 * The User class represents a registered user of the application.
 *
 * It encapsulates the data and behaviour that belong specifically
 * to a user, such as their account information and saved properties.
 *
 * This class is not responsible for authentication, rendering UI,
 * or reading/writing data to storage. Those responsibilities belong
 * to other parts of the application.
 */

// Provides type safety by allowing only two valid authentication providers
export type AuthProvider = "credentials" | "google";

// Describes the information that can be passed in when creating a User
type UserConstructor = {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  passwordHash?: string;
  savedPropertyIds?: string[];
  createdAt?: Date;
};

export class User {
  // These properties represent the state owned by every User object
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  passwordHash?: string;
  savedPropertyIds: string[];
  createdAt: Date;

  // The constructor runs whenever a new User object is created.
  // Destructuring gives direct access to each constructor value.
  constructor({
    id,
    name,
    email,
    authProvider,
    passwordHash,

    // Use sensible defaults when these optional values are not provided
    savedPropertyIds = [],
    createdAt = new Date(),
  }: UserConstructor) {
    // Prevent a credentials user from being created without a password hash
    if (authProvider === "credentials" && !passwordHash) {
      throw new Error("Credentials users must have a password hash.");
    }

    // Store the incoming constructor values on the new User object
    this.id = id;
    this.name = name;
    this.email = email;
    this.authProvider = authProvider;
    this.passwordHash = passwordHash;
    this.savedPropertyIds = savedPropertyIds;
    this.createdAt = createdAt;
  }

  // Checks whether the user has already saved a particular property
  hasSavedProperty(propertyId: string): boolean {
    return this.savedPropertyIds.includes(propertyId);
  }

  // Saves a property unless it has already been saved
  saveProperty(propertyId: string): void {
    if (this.hasSavedProperty(propertyId)) {
      return;
    }

    this.savedPropertyIds.push(propertyId);
  }

  // Removes a property from the user's saved properties
  removeSavedProperty(propertyId: string): void {
    // Create a new saved properties array without the matching property ID
    // filter() doesn't remove an item from the existing array. It returns a brand new array containing only the elements that satisfy the condition. That's why you assign the result back to: this.SavedPropertyIds
    this.savedPropertyIds = this.savedPropertyIds.filter(
      (savedPropertyId) => savedPropertyId !== propertyId
    );
  }

  // Updates the user's name after validating it
  changeName(newName: string): void {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      throw new Error("User name cannot be empty.");
    }

    this.name = trimmedName;
  }
}