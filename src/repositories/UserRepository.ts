import { User } from "@/models/User";

/**
 * Defines the operations that the application needs
 * in order to persist and retrieve users.
 *
 * This interface does not know which database is being used.
 */
export interface UserRepository {
  findUserByEmail(email: string): Promise<User | undefined>;
  saveUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
}