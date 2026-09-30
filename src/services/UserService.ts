import { User, type AuthProvider } from "@/models/User";
import { UserRepository } from "@/repositories/UserRepository";

type GetOrCreateUserInput = {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;
  passwordHash?: string;
};

export class UserService {
  // The service depends on the UserRepository abstraction rather than directly on Cosmos DB
  constructor(private readonly userRepository: UserRepository) {}

  // Find an existing persisted user or create and save a new one
  async getOrCreateUser({
    id,
    name,
    email,
    authProvider,
    passwordHash,
  }: GetOrCreateUserInput): Promise<User> {
    // Check whether this authenticated user already exists
    const existingUser =
      await this.userRepository.findUserByEmail(email);

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

    // Persist the new user through the repository
    await this.userRepository.saveUser(newUser);

    return newUser;
  }

  // Save a property for an existing user
  async savePropertyForUser(
    email: string,
    listingId: string
  ): Promise<User | undefined> {
    // Find the existing user through the repository
    const user = await this.userRepository.findUserByEmail(email);

    // Return undefined if the user does not exist
    if (!user) {
      return undefined;
    }

    // Add the property ID using the behaviour defined by the User domain object
    user.saveProperty(listingId);

    // Persist the User object's updated state through the repository
    await this.userRepository.updateUser(user);

    return user;
  }

  // Return the saved property IDs that belong to an existing user
  async getSavedPropertyIds(
    email: string
  ): Promise<string[] | undefined> {
    // Find the existing user through the repository
    const user = await this.userRepository.findUserByEmail(email);

    // Return undefined if the user does not exist
    if (!user) {
      return undefined;
    }

    return user.savedPropertyIds;
  }

  // Remove a saved property from an existing user
  async removeSavedPropertyForUser(
    email: string,
    listingId: string
  ): Promise<User | undefined> {
    // Find the existing user through the repository
    const user = await this.userRepository.findUserByEmail(email);

    // Return undefined if the user does not exist
    if (!user) {
      return undefined;
    }

    // Remove the property ID using the behaviour defined by the User domain object
    user.removeSavedProperty(listingId);

    // Persist the User object's updated state through the repository
    await this.userRepository.updateUser(user);

    return user;
  }
}