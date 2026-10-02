// src/lib/auth/CredentialsAuthProvider.ts

import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { AuthProvider } from "./AuthProvider";
import { UserRepository } from "@/repositories/UserRepository";

/**
 * Encapsulates the email/password authentication logic.
 *
 * This class is responsible for:
 * - configuring the CredentialsProvider
 * - validating the supplied credentials
 * - returning an authenticated user
 *
 * Moving this logic out of route.ts makes the authentication
 * architecture easier to understand and extend.
 */
export class CredentialsAuthProvider extends AuthProvider<
  ReturnType<typeof CredentialsProvider>
> {
  // Depend on the UserRepository abstraction rather than directly on Cosmos DB
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  /**
   * Creates and returns the configured CredentialsProvider.
   */
  createProvider(): ReturnType<typeof CredentialsProvider> {
    return CredentialsProvider({
      name: "Email and password",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      /**
       * Runs whenever a user attempts to sign in with
       * email and password.
       */
      authorize: async (credentials) => {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        // Find the registered user through the repository
        const user = await this.userRepository.findUserByEmail(email);

        // Only credentials users with a stored password hash can sign in this way
        if (
          !user ||
          user.authProvider !== "credentials" ||
          !user.passwordHash
        ) {
          return null;
        }

        /**
         * Compare the entered password against the
         * stored hashed password.
         */
        const passwordMatches = await compare(
          password,
          user.passwordHash
        );

        if (!passwordMatches) {
          return null;
        }

        /**
         * Returning a user tells NextAuth that
         * authentication succeeded.
         */
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    });
  }
}