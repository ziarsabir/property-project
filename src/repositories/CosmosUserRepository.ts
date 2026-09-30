import { User } from "@/models/User";
import { UserRepository } from "@/repositories/UserRepository";
import { usersContainer } from "@/lib/cosmos";

export class CosmosUserRepository implements UserRepository {
  async findUserByEmail(email: string): Promise<User | undefined> {
    // Ask Cosmos DB to return the user whose email matches the supplied email address
    const { resources: users } = await usersContainer.items
      .query({
        query: "SELECT * FROM c WHERE LOWER(c.email) = @email",
        parameters: [
          {
            name: "@email",
            value: email.toLowerCase(),
          },
        ],
      })
      .fetchAll();

    // Take the first matching stored user record
    const storedUser = users[0];

    // Return undefined if no matching user exists
    if (!storedUser) {
      return undefined;
    }

    // Reconstruct the stored data as a real User domain object
    return new User({
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      authProvider: storedUser.authProvider,
      passwordHash: storedUser.passwordHash,
      savedPropertyIds: storedUser.savedPropertyIds,
      createdAt: new Date(storedUser.createdAt),
    });
  }

  async saveUser(user: User): Promise<void> {
    // Convert the User domain object into plain data that Cosmos DB can store
    const storedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      passwordHash: user.passwordHash,
      savedPropertyIds: user.savedPropertyIds,
      createdAt: user.createdAt.toISOString(),
    };

    // Create the user if they do not exist, or replace them if they already exist
    await usersContainer.items.upsert(storedUser);
  }

  async updateUser(user: User): Promise<void> {
    // Convert the updated User domain object into plain data that Cosmos DB can store
    const updatedStoredUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      passwordHash: user.passwordHash,
      savedPropertyIds: user.savedPropertyIds,
      createdAt: user.createdAt.toISOString(),
    };

    // Find the specific user item using its ID and partition key, then replace it
    await usersContainer
      .item(user.id, user.id)
      .replace(updatedStoredUser);
  }
}